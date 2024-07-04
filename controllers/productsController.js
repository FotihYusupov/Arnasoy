const Products = require("../models/Products");
const SaledProducts = require("../models/saledProducts");
const Party = require("../models/Party");
const Client = require("../models/Client");
const Dept = require("../models/Debt");
const TransferHistory = require("../models/TransferHistory");
const { pagination, generateId, sendMessage, sendMessageToClient } = require("../utils")

exports.getAll = async (req, res) => {
  try {
    req.query.filter = { saled: false, ...req.query.filter };
    const data = await pagination(Products, req.query, "products", "parties");
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
};

exports.getUniqueProducts = async (req, res) => {
  try {
    if (!req.query.filter) req.query.filter = {};
    req.query.filter.saled = false;
    req.query.deleted = false;
    const data = await pagination(Products, req.query, "products", "parties");
    data.data = data.data.sort((a, b) => a.createdAt - b.createdAt);
    data.data = [...new Set(data.data.map((p) => p.name))].map((name) =>
      data.data.find((p) => p.name === name)
    );
    res.json(data);
  } catch (err) {
    return res.json(err);
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Products.findById(id).populate("parties");
    if (!findProduct) {
      return res.status(404).json({
        message: "Mahsulot topilmadi",
      });
    }
    return res.json({
      data: findProduct,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.editPrice = async (req, res) => {
  try {
    const { products } = req.body;
    const updatedProducts = [];
    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      if (!findProduct) {
        return res.status(404).json({
          message: "Mahsulot topilmadi",
        });
      }
      findProduct.saledPrice = product.price;
      if (product.marja) findProduct.marja = parseInt(product.marja);
      updatedProducts.push(findProduct);
    }

    for (let product of updatedProducts) {
      await product.save();
    }

    return res.status(200).json({
      message: "Narhlar saqlandi",
      data: updatedProducts,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const saleds = await SaledProducts.find();
    const last = saleds[saleds.length - 1];
    const invoice = last
      ? `inv-${parseInt(last.invoice ? last.invoice.split("-")[1] : 0) + 1}`
      : "inv-1";
    return res.json({
      data: invoice,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.getPrice = async (req, res) => {
  try {
    const { products } = req.body;

    const updatedProducts = [];
    const errors = [];

    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      if (!findProduct) {
        errors.push(`ID si ${product.id} bo'lgan mahsulot topilmadi`);
        continue;
      }
      if (findProduct.amount > product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice || findProduct.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount < product.amount) {
        findProduct.saledAmount = product.amount;
        let amount = product.amount - findProduct.amount;
        findProduct.amount = 0;
        findProduct.saled = true;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
        for (let i = 0; i < products.length; i++) {
          let newProducts = await Products.find({ _id: { $nin: ids } });
          newProducts = [...new Set(newProducts.map((p) => p.name))].map(
            (name) => newProducts.find((p) => p.name === name)
          );
          const newFindProduct = newProducts.find(
            (e) => e.name === findProduct.name
          );
          if (newFindProduct) {
            if (newFindProduct.amount > amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = newFindProduct.amount - amount;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount == amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = 0;
              findProduct.saled = true;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount < amount) {
              newFindProduct.saledAmount = newFindProduct.amount;
              amount = amount - newFindProduct.amount;
              newFindProduct.amount = 0;
              newFindProduct.saled = true;
              amount = amount - newFindProduct.amount;
              ids.push(newFindProduct._id);
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            }
          } else {
            break;
          }
        }
      } else {
        errors.push(`Mahsulot ID si ${product.id} uchun yetarli miqdor yo'q`);
      }
    }

    let total = 0;
    for (product of updatedProducts) {
      console.log(product.saledPrice * product.saledAmount);
      total += product.saledPrice * product.saledAmount;
    }
    return res.json({
      total: total,
    });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.SaleProduct = async (req, res) => {
  try {
    const { products } = req.body;
    const { client, warehouse, invoice, invoiceDate, comment, totalSum } = req.body;
    const { userId } = req.headers
    const errors = [];
    const updatedProducts = [];
    const findClient = await Client.findById(req.body.client);

    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      if (!findProduct) {
        errors.push(`ID si ${product.id} bo'lgan mahsulot topilmadi`);
        continue;
      } else if (findProduct.status === 5) {
        return res.json({
          message: "Mahsulot omborga yetib kelmagan!"
        })
      }
      if (findProduct.amount > product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.saledAmount = product.amount;
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount < product.amount) {
        findProduct.saledAmount = product.amount;
        let amount = product.amount - findProduct.amount;
        findProduct.amount = 0;
        findProduct.saled = true;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
        for (let i = 0; i < products.length; i++) {
          let newProducts = await Products.find({ _id: { $nin: ids }, status: { $ne: 5 } });
          newProducts = [...new Set(newProducts.map((p) => p.name))].map(
            (name) => newProducts.find((p) => p.name === name)
          );
          const newFindProduct = newProducts.find(
            (e) => e.name === findProduct.name
          );
          if (newFindProduct) {
            if (newFindProduct.amount > amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = newFindProduct.amount - amount;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount == amount) {
              newFindProduct.saledAmount = amount;
              newFindProduct.amount = 0;
              findProduct.saled = true;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount < amount) {
              newFindProduct.saledAmount = newFindProduct.amount;
              amount = amount - newFindProduct.amount;
              newFindProduct.amount = 0;
              newFindProduct.saled = true;
              amount = amount - newFindProduct.amount;
              ids.push(newFindProduct._id);
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            }
          } else {
            break;
          }
        }
      } else {
        errors.push(`Mahsulot ID si ${product.id} uchun yetarli miqdor yo'q`);
      }
    }

    if (errors.length > 0) {
      return res.status(500).json({
        message: "So'rovni bajarishda xatolik yuz berdi",
        errors: errors,
      });
    }

    const saledProducts = await SaledProducts.find();
    const saledProduct = await SaledProducts.create({
      id: req.body.id ? req.body.id : generateId(saledProducts),
      client: client,
      warehouse: warehouse,
      invoice: invoice,
      invoiceDate: invoiceDate,
      comment: comment,
      user: userId,
      products: updatedProducts,
      sum: totalSum,
    });

    req.body.dept = true;
    if (req.body.dept) {
      if (findClient.balance >= req.body.totalSum) {
        findClient.balance = (findClient.balance - req.body.totalSum);
        await findClient.save();
      } else if (findClient.balance < req.body.totalSum) {
        findClient.balance = 0;
        req.body.totalSum = req.body.totalSum - findClient.balance;
        await findClient.save();
        req.body.totalSum = req.body.paid
          ? req.body.totalSum - req.body.paid
          : req.body.totalSum;
        await Dept.create({
          sum: req.body.totalSum,
          saleds: saledProduct._id,
          clients: req.body.client,
        });
      }
    } else {
      if (findClient.balance < req.body.totalSum) {
        return res.json({
          message: "Mijoz balansida yetarli mablag' yo'q",
        });
      }
      findClient.balance = findClient.balance - req.body.totalSum;
      await findClient.save();
    }

    for (let updated of updatedProducts) {
      await updated.save();
    }

    const parties = await Party.find({ deleted: false, saled: false }).populate(
      {
        path: "products",
        match: { saled: false, deleted: false },
      }
    );

    for (let party of parties) {
      if (party.products.length === 0) {
        party.saled = true;
        await party.save();
      }
    }

    await sendMessage("Tavar chiqimi", userId)

    await sendMessageToClient(client, "Tovar sotib olindi")

    return res.status(200).json({
      message: "Mahsulotlar muvaffaqiyatli sotildi",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Ichki server xatosi",
      error: err.message,
    });
  }
};

exports.transfer = async (req, res) => {
  try {
    let { amount, warehouse, transportNumber } = req.body;
    amount = parseInt(amount);
    const findProduct = await Products.findById(req.params.id);
    if (amount > findProduct.amount) {
      return res.status(400).json({
        message: "t(Ko'chirish miqdori mahsuloq miqdoridan ko'p)",
      });
    }

    const newHistory = new TransferHistory({
      oldWarehouse: findProduct.warehouse,
      newWarehouse: warehouse,
      user: req.headers.userId,
      transportNumber: transportNumber || "",
      amount: amount,
      oldParty: findProduct.parties,
    });

    if (findProduct.amount == amount) {
      findProduct.history.push({
        warehouse: findProduct.warehouse,
        createdAt: new Date(),
      });
      findProduct.warehouse = warehouse;
      await findProduct.save();
    } else if (findProduct.amount > amount) {
      findProduct.amount -= amount;
      await findProduct.save();

      const findParty = await Party.findById(findProduct.parties);
      delete findParty._doc._id;
      delete findParty._doc.products;
      findParty.warehouse = warehouse;

      findProduct.saledAmount = 0;
      const products = await Products.find();
      findProduct.id = generateId(products);
      findProduct.warehouse = warehouse;

      const findCopied = await Products.findOne({ copy: findProduct._id });
      if (findCopied) {
        findCopied.amount += amount;
        await findCopied.save();

        newHistory.newParty = findCopied.parties;
        await newHistory.save();
      } else {
        const newParty = await Party.create({
          ...findParty._doc,
        });
        findProduct.parties = newParty._id;
        findProduct.amount = amount;
        const findProductId = findProduct._id;
        delete findProduct._doc._id;
        const newProduct = new Products({
          ...findProduct._doc,
          copy: findProductId,
        });

        newParty.products.push(newProduct._id);
        await newParty.save();
        await newProduct.save();

        newHistory.newParty = newParty._id;
        await newHistory.save();
      }
    }

    return res.json({
      message: "Success",
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.destruction = async (req, res) => {
  try {
    const findProduct = await Products.findById(req.body.id);
    if (findProduct.amount == req.body.amount) {
      findProduct.deleted = true;
      findProduct.deletedAt = new Date();
      await findProduct.save();
    } else if (findProduct.amount > req.body.amount) {
      findProduct.amount -= req.body.amount;
      await findProduct.save();
    } else {
      return res.status(500).json({
        message: "Ko'chirish miqdori mahsulot miqdoridan ko'p",
      });
    }
    return res.json({
      message: "Mahsulotlar muvaffaqiyatli o'chirildi",
    });
  } catch (err) {
    return res.json(err);
  }
};
