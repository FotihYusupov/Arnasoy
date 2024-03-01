const User = require("../models/User");
const generateId = require("../utils/generateId");
const { sign } = require("../utils/jwt");

exports.getAllUsers = async (req, res) => {
  try {
    const { includes } = req.query;
    let users = await User.find({ deleted: false }).populate("role");
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
    return res.json({ data: users });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const users = await User.find();
    const newUser = new User({
      id: generateId(users),
      ...req.body,
    });
    newUser.image = req.images[0];
    await newUser.save();
    return res.status(201).json({ data: newUser });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
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
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.headers;
    let updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    Object.assign(updatedUser, req.body);
    if (req.image) {
      updatedUser.image = req.image;
    }
    await updatedUser.save();
    return res.json({ data: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
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
