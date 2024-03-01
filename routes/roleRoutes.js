const { Router } = require("express");
const roleController = require("../controllers/roleController");

const roleRoutes = Router();

roleRoutes.get("/roles", roleController.getAll);
roleRoutes.post("/add-role", roleController.addRole);
roleRoutes.put("/update-role/:id", roleController.updateRole);
roleRoutes.delete("/delete-role/:id", roleController.deleteRole);

module.exports = roleRoutes;
