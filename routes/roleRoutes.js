const { Router } = require("express");
const roleController = require("../controllers/roleController");
const authMiddleware = require("../middlewares/auth.middleware")

const roleRoutes = Router();

roleRoutes.get("/", authMiddleware, roleController.getAll);

roleRoutes.post("/", authMiddleware, roleController.addRole);

roleRoutes.put("/:id", authMiddleware, roleController.updateRole);

roleRoutes.delete("/:id", authMiddleware, roleController.deleteRole);

module.exports = roleRoutes;
