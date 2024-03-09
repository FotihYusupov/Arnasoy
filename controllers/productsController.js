const Products = require("../models/Products");
const Party = require("../models/Party");

exports.getAll = async (req, res) => {
  try {
    const { includes, search } = req.query;
    let products = await Products.find().populate("parties");
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
    products = [...new Set(products.map((p) => p.name))].map(
      (name) => products.find((p) => p.name === name)
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

exports.SaleProduct = async (req, res) => {
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
        findProduct.amount = findProduct.amount - product.amount;
        findProduct.saledPrice = product.saledPrice;
        updatedProducts.push(findProduct);
      } else if (findProduct.amount == product.amount) {
        findProduct.amount = 0;
        findProduct.saledPrice = product.saledPrice;
        findProduct.saled = true;
        updatedProducts.push(findProduct);
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
    const parties = await Party.find({ deleted: false, saled: false }).populate(
      {
        path: "products",
        match: { saled: false },
      }
    );
    for (let party of parties) {
      if (party.products.length === 0) {
        party.saled = true
        await party.save();
      }
    }
    return res.status(200).json({
      message: "Products sold successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
