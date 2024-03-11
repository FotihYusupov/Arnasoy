const Satisfaction = require("../models/Satisfaction");
const Party = require("../models/Party");

exports.getAll = async (req, res) => {
  try {
    const satisfactions = await Satisfaction.find();
    res.json(satisfactions)
  } catch (err) {
    return res.json(err);
  }
};

exports.addSatisfaction = async (req, res) => {
  try {
    const findParty = await Party.findById(req.body.partyId).populate('products')
    const sum = req.body.sum / findParty.products.length;
    for ( product of findParty.products) {
      product.price += sum
      await product.save()
    }
    res.json(findParty)
  } catch (err) {
    return res.json(err);
  }
};
