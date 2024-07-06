const User = require("../models/User");
const paginate = require("../utils/pagination");
const generateId = require("../utils/generateId");
const { sign } = require("../utils/jwt");
const { addBalance, updateBalance } = require("../utils/updateBalance");

exports.getAllUsers = async (req, res) => {
  try {
    if(!req.query.filter) req.query.filter = {}
    req.query.filter.deleted = false
    const data = await paginate(User, req.query, 'users', 'role')
    data.data.forEach(e => {
      e._doc.active == true ? e._doc.active = 1 : e._doc.active = 2
      e._doc.bot == true ? e._doc.bot = 1 : e._doc.bot = 2
    })
    return res.json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getMe = async (req, res) => {
  try {
    const { userId } = req.headers;
    const { includes } = req.query;

    const findUser = await User.findById(userId).populate('role');
    if (!findUser || findUser.active === false) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    let users = [findUser];
    if (includes) {
      const fields = includes.split(",");
      users = users.map((user) => {
        const filteredUser = {};
        fields.forEach((field) => {
          if (!user.hasOwnProperty(field)) {
            filteredUser[field] = user[field];
          }
        });
        return filteredUser;
      });
    }
    return res.json({
      data: users[0],
    });
  } catch (err) {
    return res.json(err);
  }
};

exports.addUser = async (req, res) => {
  try {
    const users = await User.find();
    if(req.body.bot == 2) req.body.bot = false
    if(req.body.bot == 1) req.body.bot = true
    if(req.body.active == 2) req.body.bot = false
    if(req.body.active == 1) req.body.bot = true
    const newUser = new User({
      id: generateId(users),
      ...req.body,
    })
    await newUser.save();
    return res.status(201).json({ data: newUser });
  } catch (err) {
    return res.status(400).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login, password }).populate("role");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    user.password = null;
    const token = sign(user._id.toString());
    return res.json({ data: { token, user } });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    delete req.body.password
    let updatedUser = await User.findByIdAndUpdate(id, { ...req.body }, {
      new: true
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ data: updatedUser });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.updateUserBalance = async (req, res) => {
  try {
    const { senderType, recipientType, sum, sender, recipient } = req.body;
    await updateBalance(sender, senderType, sum, "Balansdan balancga pul otkazdik", recipient, 'users');
    await addBalance(recipient, recipientType, sum, "Balansdan balancga pul otkazdik", sender, 'users');
    return res.json({
      message: "Success"
    })
  } catch (err) {
    console.log(err);
    return res.json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const now = new Date();
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { deleted: true, deletedAt: now },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User marked as deleted", data: updatedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
