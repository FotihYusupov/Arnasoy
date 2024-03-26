const Role = require("../models/Role");
const generateId = require("../utils/generateId");

exports.getAll = async (req, res) => {
  try {
    const includes = req.query.includes;
    let roles = await Role.find();  
    console.log(roles)
    if (includes) {
      const fields = includes.split(",");
      roles = roles.map((role) => {
        const filteredRole = {};
        fields.forEach((field) => {
          if (!role.hasOwnProperty(field)) {
            filteredRole[field] = role[field];
          }
        });
        return filteredRole;
      });
    }
    return res.json({
      data: roles,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addRole = async (req, res) => {
  try {
    const roles = await Role.find();
    const newRole = new Role({
      id: generateId(roles),
      ...req.body,
    });
    await newRole.save();
    return res.json({
      data: newRole,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const { _id, ...updateData } = req.body;

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    return res.json({
      status: "success",
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndUpdate(id, { deleted: true });
    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    return res.json({ message: "Role successfully deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
