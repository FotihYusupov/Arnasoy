const { Router } = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middlewares/auth.middleware")

const roleRoutes = Router();

roleRoutes.get("/roles", authMiddleware, roleController.getAll);
roleRoutes.post("/add-role", authMiddleware, roleController.addRole);
roleRoutes.put("/update-role/:id", authMiddleware, roleController.updateRole);
roleRoutes.delete("/delete-role/:id", authMiddleware, roleController.deleteRole);

module.exports = roleRoutes;
