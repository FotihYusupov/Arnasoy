const Products = require("../models/Products");
const SaledProducts = require("../models/saledProducts")
const Party = require("../models/Party");
const Client = require("../models/Client")
const generateId = require("../utils/generateId");
const Users = require("../models/User");
const Dept = require("../models/Debt")
const bot = require("../bot")

exports.getAll = async (req, res) => {
  try {
    const { includes, search } = req.query;
    const { id } = req.params
    let products = await Products.find().populate("parties");
    products = products.filter((e) => e.parties.warehouse == id);
    if (search) {
      const regex = new RegExp(search, "i");
      products = products.filter((product) => {
        return regex.test(product.name);
      });
    }
    if (includes) {
      const fields = includes.split(",");
      products = products.map((product) => {
        const filteredProduct = {};
        fields.forEach((field) => {
          if (!product.hasOwnProperty(field)) {
            filteredProduct[field] = product[field];
          }
        });
        return filteredProduct;
      });
    }
    products.sort((a, b) => a.createdAt - b.createdAt);
    products = [...new Set(products.map((p) => p.name))].map((name) =>
      products.find((p) => p.name === name)
    );
    res.json({
      data: products,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await Products.findById(id).populate("parties");
    if (findProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.json({
      data: findProduct,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.getPrice = async (req, res) => {
  try {
    const { products } = req.body;
    const errors = [];
    const updatedProducts = [];
    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      if (!findProduct) {
        errors.push(`Product with ID ${product.id} not found`);
        continue;
      }
      if (findProduct.amount > product.amount) {
        findProduct.saledAmount = product.amount
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.saledAmount = product.amount
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount < product.amount) {
        findProduct.saledAmount = findProduct.amount
        const ids = [];
        let amount = product.amount - findProduct.amount;
        findProduct.amount = 0;
        findProduct.saled = true;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
        ids.push(findProduct._id);
        for(let i = 0; i < ids.length; i++) {
          let newProducts = await Products.find({ _id: { $nin: ids } });
          newProducts = [...new Set(newProducts.map((p) => p.name))].map(
            (name) => newProducts.find((p) => p.name === name)
          );
          const newFindProduct = newProducts.find(
            (e) => e.name === findProduct.name
          );
          if(newFindProduct) {
            if (newFindProduct.amount > amount) {
              newFindProduct.saledAmount = amount
              newFindProduct.amount = newFindProduct.amount - amount;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount == amount) {
              newFindProduct.saledAmount = amount
              newFindProduct.amount = 0;
              findProduct.saled = true;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount < amount) {
              newFindProduct.saledAmount = newFindProduct.amount
              amount = amount - newFindProduct.amount
              newFindProduct.amount = 0;
              newFindProduct.saled = true;
              amount = amount - newFindProduct.amount;
              ids.push(newFindProduct._id);
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            }
          } else {
            break
          }
        }
      } else {
        errors.push(`Insufficient amount for product with ID ${product.id}`);
      }
    }

    if (errors.length > 0) {
      return res.status(500).json({
        message: "Error occurred while processing the request",
        errors: errors,
      });
    }

    let sum = 0
    for (product of updatedProducts) {
      sum += product.saledAmount * product.price
    }
    res.json({
      data: sum
    })
  } catch (err) {
    return res.json(err)
  }
}

exports.SaleProduct = async (req, res) => {
  try {
    const { products } = req.body;
    const errors = [];
    const updatedProducts = [];
    const findClient = await Client.findById(req.body.client)
    if(findClient.balance >= req.body.totalSum) {
      return res.json({
        message: "There are insufficient funds in the customer's balance."
      })
    } else {
      findClient.balance = findClient.balance - req.body.totalSum
      await findClient.save();
    }
    for (let product of products) {
      const findProduct = await Products.findById(product.id);
      if (!findProduct) {
        errors.push(`Product with ID ${product.id} not found`);
        continue;
      }
      if (findProduct.amount > product.amount) {
        findProduct.saledAmount = product.amount
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.saledAmount = product.amount
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount < product.amount) {
        findProduct.saledAmount = product.amount
        const ids = [];
        let amount = product.amount - findProduct.amount;
        findProduct.amount = 0;
        findProduct.saled = true;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
        ids.push(findProduct._id);
        for(let i = 0; i < ids.length; i++) {
          let newProducts = await Products.find({ _id: { $nin: ids } });
          newProducts = [...new Set(newProducts.map((p) => p.name))].map(
            (name) => newProducts.find((p) => p.name === name)
          );
          const newFindProduct = newProducts.find(
            (e) => e.name === findProduct.name
          );
          if(newFindProduct) {
            if (newFindProduct.amount > amount) {
              newFindProduct.saledAmount = amount
              newFindProduct.amount = newFindProduct.amount - amount;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount == amount) {
              newFindProduct.saledAmount = amount
              newFindProduct.amount = 0;
              findProduct.saled = true;
              amount = 0;
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            } else if (newFindProduct.amount < amount) {
              newFindProduct.saledAmount = amount
              amount = amount - newFindProduct.amount
              newFindProduct.amount = 0;
              newFindProduct.saled = true;
              amount = amount - newFindProduct.amount;
              ids.push(newFindProduct._id);
              newFindProduct.saledPrice = product.saledPrice;
              updatedProducts.push(newFindProduct);
            }
          } else {
            break
          }
        }
      } else {
        errors.push(`Insufficient amount for product with ID ${product.id}`);
      }
    }

    if (errors.length > 0) {
      return res.status(500).json({
        message: "Error occurred while processing the request",
        errors: errors,
      });
    }

    for (updated of updatedProducts) {
      await updated.save();
    }

    const saledProducts = await SaledProducts.find();

    const saledProduct = await SaledProducts.create({
      id: req.body.id ? req.body.id : generateId(saledProducts),
      client: req.body.client,
      warehouse: req.body.warehouse,
      invoiceDate: req.body.invoiceDate,
      comment: req.body.comment,
      user: req.headers.userId,
      products: updatedProducts
    })

    const parties = await Party.find({ deleted: false, saled: false }).populate(
      {
        path: "products",
        match: { saled: false },
      }
    );

    for (let party of parties) {
      if (party.products.length === 0) {
        party.saled = true;
        await party.save();
      }
    }

    const findUser = await Users.findById(req.headers.userId);
    const users = await Users.find({ bot: true, deleted: false, active: true });

    users.forEach((user) => {
      const messageText = `Chiqim.\n id: ${saledProduct.id}\n user: ${findUser.name} ${findUser.lastName}`;
      if (user.chatId) {
        bot.sendMessage(parseInt(user.chatId), messageText).catch(err => {
          console.log(err)
        });
      }
    });

    await Dept.create({
      sum: req.body.totalSum,
      saleds: saledProduct._id,
      clients: req.body.client,
      paid: req.body.paid ? true : false
    })

    return res.status(200).json({
      message: "Products sold successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
