const Client = require("../models/Client");
const User = require("../models/User");
const Dept = require("../models/Debt");
const DeptHistory = require("../models/DeptHistory");
const generateId = require("../utils/generateId");
const paginate = require("../utils/pagination");
const { addBalance, updateBalance } = require("../utils/updateBalance");

const URL = process.env.SERVER_URL;

const sortFn = (sort) => {
  let sortOption = [];
  if (sort) {
    const sortFields = sort.split(",");
    sortFields.forEach((field) => {
      const sortOrder = field.startsWith("-") ? -1 : 1;
      const fieldName = field.replace(/^-/, "");
      sortOption.push({ fieldName, sortOrder });
    });
  }
  return sortOption;
};

const paginateItems = (items, query, route) => {
  try {
    const { page = 1, perPage = 10, includes, sort, filterKey, filterValue } = query;

    // Filter items based on query
    if (filterKey && filterValue !== undefined) {
      items = items.filter(item => item[filterKey] === filterValue);
    }

    // Check if items include a specific value
    if (query.includesKey && query.includesValue !== undefined) {
      items = items.filter(item => item[query.includesKey].includes(query.includesValue));
    }

    // Sort items based on query
    const sortOption = sortFn(sort);
    if (sortOption.length > 0) {
      items.sort((a, b) => {
        for (let option of sortOption) {
          if (a[option.fieldName] < b[option.fieldName]) return -1 * option.sortOrder;
          if (a[option.fieldName] > b[option.fieldName]) return 1 * option.sortOrder;
        }
        return 0;
      });
    }

    const totalCount = items.length;
    const totalPages = Math.ceil(totalCount / perPage);

    // Paginate items
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      _meta: {
        currentPage: +page,
        perPage: +perPage,
        totalCount,
        totalPages,
      },
      _links: {
        self: `${URL}${route}?page=${page}&perPage=${perPage}`,
        first: `${URL}${route}?page=1&perPage=${perPage}`,
        prev: page > 1 ? `${URL}${route}?page=${+page - 1}&perPage=${perPage}` : null,
        next: page < totalPages ? `${URL}${route}?page=${+page + 1}&perPage=${perPage}` : null,
        last: `${URL}${route}?page=${totalPages}&perPage=${perPage}`,
      },
    };
  } catch (error) {
    return {
      message: "Error occurred while paginating results",
      error: error.message,
    };
  }
};

exports.getAll = async (req, res) => {
  try {
    const clients = await Client.find({deleted: false}).populate("category", "group");
    const users = await User.find({deleted: false});
    const data = [...clients, ...users];
    const paginatedData = paginateItems(data, req.query, "clients")
    return res.json(paginatedData);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getClients = async (req, res) => {
  try {
    const data = await paginate(Client, req.query, "clients", "category", "group");
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.byId = async (req, res) => {
  try {
    const findClient = await Client.findById(req.params.id);
    if(!findClient) {
      return res.status(404).json({
        message: "Client Not Found!"
      })
    }
    return res.json({
      data: findClient,
    });
  } catch (err) {
    return res.status(400).json(err)
  }
}

exports.addClient = async (req, res) => {
  try {
    const clients = await Client.find();
    const newClient = new Client({
      id: generateId(clients),
      ...req.body,
    });
    await newClient.save();
    return res.status(201).json({ data: newClient });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!updatedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json({ data: updatedClient });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateClientBalanceAndPayDebt = async (req, res) => {
  try {
    const { balanceType, sum, invoice, invoiceDate, createdDate, comment } = req.body;
    const userId = req.headers.userId;
    const clientId = req.params.id;

    await addBalance(userId, balanceType, sum, "Client qarzini berganda.");

    const findClient = await Client.findById(clientId);
    if (!findClient) {
      return res.status(404).json({ message: "Client Not Found!" });
    }

    let remainingSum = parseInt(sum);

    let debts = await Dept.find({ clients: clientId }).sort({ _id: 1 }); // Sort by _id to ensure paying off from oldest to newest
    const updatedDebts = [];

    for (let debt of debts) {
      if (remainingSum <= 0) break;
      if (debt.sum <= remainingSum) {
        remainingSum -= debt.sum;
        debt.sum = 0;
        debt.paid = true;
      } else {
        debt.sum -= remainingSum;
        remainingSum = 0;
      }
      updatedDebts.push(debt);
    }

    findClient.balance += remainingSum;
    await findClient.save();

    for (let debt of updatedDebts) {
      await debt.save();
    }

    await DeptHistory.create({
      client: clientId,
      user: userId,
      type: 1,
      amount: sum,
      paymentType: balanceType,
      invoice: invoice,
      invoiceDate: invoiceDate,
      createdDate: createdDate,
      comment: comment
    });

    return res.json({
      message: "Client balance and debts updated successfully!",
      data: findClient,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.generateInv = async (req, res) => {
  try {
    const history = await DeptHistory.find();
    return res.json({ data: history[history.length - 1].invNum + 1 || 1 });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.moneyOut = async (req, res) => {
  try {
    const { balanceType, sum, invoice, invoiceDate, createdDate, comment } = req.body;
    const findClient = await Client.findById(req.params.id);
    if (!findClient) {
      return res.status(404).json({
        message: "Client Not Found!",
      });
    }
    await updateBalance(
      req.headers.userId,
      balanceType,
      sum,
      "Clientga qarzimizni berdik."
    );
    findClient.indebtedness -= sum;
    await findClient.save();

    await DeptHistory.create({
      client: findClient._id,
      user: req.headers.userId,
      type: 2,
      amount: sum,
      paymentType: balanceType,
      invoice: invoice,
      invoiceDate: invoiceDate,
      createdDate: createdDate,
      comment: comment
    });

    return res.json({
      message: findClient,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const now = new Date();
    const deletedClient = await Client.findByIdAndUpdate(req.params.id, {
      deleted: true,
      deletedAt: now,
    });
    if (!deletedClient) {
      return res.status(404).json({ error: "Client not found" });
    }
    return res.json({ message: "Client deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
