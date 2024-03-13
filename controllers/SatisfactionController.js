const Satisfaction = require("../models/Satisfaction");
const Party = require("../models/Party");
const generateId = require("../utils/generateId");

exports.getAll = async (req, res) => {
  try {
    const satisfactions = await Satisfaction.find({ deleted: false });
    res.json({
      data: satisfactions,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.addSatisfaction = async (req, res) => {
  try {
    const findParty = await Party.findById(req.body.partyId).populate(
      "products"
    );
    const sum = req.body.sum / findParty.products.length;
    for (product of findParty.products) {
      product.price += sum;
      await product.save();
    }
    const satisfactions = await Satisfaction.find();
    await Satisfaction.create({
      id: generateId(satisfactions),
      name: req.body.name,
      comment: req.body.comment,
      price: req.body.price,
      parties: req.body.partyId,
    });
    res.json({
      data: findParty,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.cancelSatisfaction = async (req, res) => {
  try {
    const updatedSatisfaction = await Satisfaction.findByIdAndUpdate(req.params.id, { deleted: true, deletedAt: new Date() }, { new: true });
    const findParty = await Party.findById(updatedSatisfaction.parties).populate(
      "products"
    );
    const sum = updatedSatisfaction.price / findParty.products.length;
    for (product of findParty.products) {
      product.price -= sum;
      await product.save();
    }
    return res.json({
      message: "Satisfaction successfully deleted."
    })
  } catch (err) {
    return res.json(err);
  }
};
