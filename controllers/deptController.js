const Dept = require("../models/Debt");
const Client = require("../models/Client");
const Users = require("../models/User");

exports.getById = async (req, res) => {
  try {
    const dept = await Dept.find({ clients: req.params.id }).populate('saleds');
    return res.json({
      data: dept,
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.checkDept = async (req, res) => {
  try {
    const updated = [];
    let sum = req.body.sum;
    let dept = await Dept.find();
    dept = dept.reverse();
    const findDept = dept.find((e) => e.clients == req.params.id);

    const findUser = await Users.findById(req.headers.userId);
    const paymentType = req.body.paymentType;

    if (paymentType == 2) {
      findUser.cardBalance += sum;
      await findUser.save();
    } else if (paymentType == 3) {
      findUser.cashBalance += sum;
      await findUser.save();
    } else if (paymentType == 4) {
      findUser.balance += sum;
      await findUser.save();
    }

    if (findDept.sum < sum) {
      sum = sum - findDept.sum;
      findDept.sum = 0;
      updated.push(findDept);
      const ids = [findDept._id];
      for (let i = 0; i < ids.length; i++) {
        const dept = await Dept.find({ _id: { $nin: ids } });
        const findDept = dept.find((e) => e.clients == req.params.id);
        if (findDept) {
          if (findDept.sum < sum) {
            sum = sum - findDept.sum;
            findDept.sum = 0;
            ids.push(findDept._id);
            updated.push(findDept);
          } else if (findDept.sum > sum) {
            findDept.sum = findDept.sum - sum;
            updated.push(findDept);
          } else if (findDept.sum == sum) {
            findDept.sum = 0;
            updated.push(findDept);
          }
        } else {
          const findClient = await Client.findById(req.params.id);
          findClient.balance = findClient.balance + sum;
          await findClient.save();
          break;
        }
      }
    } else if (findDept.sum > sum) {
      findDept.sum = findDept.sum - sum;
      updated.push(findDept);
    } else if (findDept.sum == sum) {
      findDept.sum = 0;
      updated.push(findDept);
    }

    for (dept of updated) {
      if (dept.sum > 0) {
        dept.paid = true;
      }
      await dept.save();
    }

    res.json("Success");
  } catch (err) {
    return res.json(err);
  }
};
