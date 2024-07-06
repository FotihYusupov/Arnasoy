const Client = require("../models/Client");
const User = require("../models/User");
const Dept = require("../models/Debt");
const DeptHistory = require("../models/DeptHistory");
const BalanceHistory = require("../models/BalanceHistory");
const SaledProducts = require("../models/saledProducts");
const { generateId, pagination, sendMessage, sendMessageToClient } = require("../utils");
const { addBalance, updateBalance } = require("../utils/updateBalance");

const URL = process.env.SERVER_URL;

const paginateItems = (items, query, route) => {
  try {
    const { page = 1, perPage = 10, includes, filter, sort } = query;
    if (includes) {
      const fields = includes.split(",");
      items = items.map((user) => {
        const filteredUser = {};
        fields.forEach((field) => {
          if (!user.hasOwnProperty(field)) {
            filteredUser[field] = user[field];
          }
        });
        return filteredUser;
      });
    }

    if (filter) {
      const filteredItems = [];
      const filterKeys = Object.keys(filter);
      const filterValues = Object.values(filter);
      for (const item of items) {
        if (filterKeys.every((key, index) => item[key] == filterValues[index])) {
          filteredItems.push(item);
        }
      }
      items = filteredItems;
    }

    if (sort) {
      let sortField = sort;
      let sortDirection = "asc";

      if (sort.startsWith("-")) {
        sortField = sort.substring(1);
        sortDirection = "desc";
      }

      items.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === "desc" ? 1 : -1;
        if (a[sortField] > b[sortField]) return sortDirection === "desc" ? -1 : 1;
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
    const clients = await Client.find({ deleted: false }).populate("category", "group");
    for(client of clients) {
      const clientDept = await Dept.find({ paid: false, deleted: false, clients: client._id })
      client._doc.balance = (client._doc.balance - clientDept.reduce((sum, dept) => sum + dept.sum, 0));
      client._doc.bot == true ? client._doc.bot = 1 : client._doc.bot = 2
    }
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
    if(!req.query.filter) req.query.filter = {}
    req.query.filter.deleted = false
    const data = await pagination(Client, req.query, "clients", "category", "group");
    for(client of data.data) {
      const clientDept = await Dept.find({ paid: false, deleted: false, clients: client._id })
      client._doc.balance = (client._doc.balance - clientDept.reduce((sum, dept) => sum + dept.sum, 0));
      client._doc.bot == true ? client._doc.bot = 1 : client._doc.bot = 2
    }
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

exports.byId = async (req, res) => {
  try {
    const clientId = req.params.id
    const findClient = await Client.findById(clientId);
    if(!findClient) {
      return res.status(404).json({
        message: "Client Not Found!"
      })
    }

    const balanceHistory =  await BalanceHistory.find({ $or: [{ from: clientId }, { to: { $eq: clientId } }] })

    const income = await BalanceHistory.find({ from: clientId });
    const outcome = await BalanceHistory.find({ to: clientId });

    const saledProducts = await SaledProducts.find({ client: clientId, deleted: false });

    return res.json({
      data: {
        data: findClient,
        totalIncome: income.reduce((sum, history) => sum + history.amount, 0),
        totalOutcome: outcome.reduce((sum, history) => sum + history.amount, 0),
        saledProducts: saledProducts,
        balanceHistory: balanceHistory
      }
    });
  } catch (err) {
    return res.status(400).json(err)
  }
}

exports.addClient = async (req, res) => {
  try {
    const clients = await Client.find();
    if(req.body.bot == 2) req.body.bot = false
    if(req.body.bot == 1) req.body.bot = true
    const newClient = new Client({
      id: generateId(clients),
      ...req.body,
    });
    await newClient.save();
    return res.status(201).json({ data: newClient });
  } catch (err) {
    console.log(err);
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

    await addBalance(userId, balanceType, sum, "Client qarzini berganda.", clientId, 'clients');

    const findClient = await Client.findById(clientId);
    if (!findClient) {
      return res.status(404).json({ message: "Client Not Found!" });
    }

    let remainingSum = parseInt(sum);

    let debts = await Dept.find({ clients: clientId }).sort({ _id: 1 });
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

    const totalDept = (await Dept.find({ deleted: false, paid: false, clients: client._doc._id })).reduce((sum, dept) => sum + dept.sum, 0);

    await sendMessage(`Pul qabul qilindi.\n\nMijoz: ${findClient.name, findClient.lastName}\n Qabul qilingan summa: ${sum},\nQolgan qarzdorlik: ${totalDept}`)

    return res.json({
      message: "Client balance and debts updated successfully!",
      data: findClient,
    });
  } catch (err) {
    console.log(err);
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
      "Clientga qarzimizni berdik.",
      req.params.id,
      'clients'
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
