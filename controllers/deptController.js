const Dept = require("../models/Debt");
const Client = require("../models/Client");

exports.getById = async (req, res) => {
  try {
    const dept = await Dept.find({ clients: req.params.id });
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
          findClient.sum = findClient.sum + sum;
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
    res.json("hello");
  } catch (err) {
    return res.json(err);
  }
};
