const cron = require("node-cron");
const Salary = require("../models/Salary");
const User = require("../models/User");
const paginate = require("../utils/pagination");
const { addBalance, updateBalance } = require("../utils/updateBalance");

function isLastDayOfMonth() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return tomorrow.getDate() === 1;
}

cron.schedule(
  "01 01 12 * * *",
  async () => {
    if (isLastDayOfMonth()) {
      try {
        const users = await User.find({ active: true, deleted: false });
        // const totalSalary = users.reduce((total, user) => {
        //   return total + (user.salary || 0);
        // }, 0);
        // console.log(`Total Salary: ${totalSalary}`);
        for (user of users) {
          const salary = new Salary({
            user: user._id,
            salary: user.salary,
            mouth: new Date().toLocaleString("default", { month: "long" }),
          });
          await salary.save();
        }
      } catch (error) {
        console.error(
          "Error fetching users or calculating total salary:",
          error
        );
      }
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Tashkent",
  }
);

exports.getAll = async (req, res) => {
  try {
    if (!req.query.filter) {
      req.query.filter = {};
    }
    req.query.filter.deleted = false;
    const data = await paginate(Salary, req.query, "user");
    return res.json(data);
  } catch (err) {
    return res.json(err);
  }
};

exports.paySalary = async (req, res) => {
  try {
    const findUser = await User.findById(req.params.id);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    let sum = req.body.sum;
    const updates = [];
    const salary = await Salary.find({ user: req.params.id, paid: false });
    for (mouth of salary) {
      if (sum > 0) {
        if ((mouth.salary = sum)) {
          sum = 0;
          mouth.paid = true;
          mouth.paidDate = new Date();
          updates.push(mouth);
        } else if (mouth.salary < sum) {
          sum = sum - mouth.salary;
          mouth.paid = true;
          mouth.paidDate = new Date();
          updates.push(mouth);
        } else if (mouth.salary > sum) {
          mouth.salary = mouth.salary - sum;
          sum = 0;
          mouth.paid = true;
          mouth.paidDate = new Date();
          updates.push(mouth);
        }
      } else {
        break;
      }
    }

    await updateBalance(
      req.headers.userId,
      req.body.balanceType,
      req.body.sum,
      "Ishchilarga oylik berildi"
    );

    for (updated of updates) {
      await updated.save();
    }

    return res.json({ message: "Salary paid successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.advanceSalary = async (req, res) => {
  try {
    const { sum, balanceType } = req.body;
    const newSalary = new Salary({
      salary: sum,
      user: req.params.id,
      mouth: new Date().toLocaleString("default", { month: "long" }),
      paid: true,
      paidDate: new Date(),
    });
    await updateBalance(
      req.headers.userId,
      balanceType,
      sum,
      "Ishchilarga avans berildi"
    );
    await newSalary.save();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
