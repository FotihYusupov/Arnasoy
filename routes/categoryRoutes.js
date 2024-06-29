const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/auth.middleware");

const categoryRoutes = Router();

categoryRoutes.get("/", authMiddleware, categoryController.read);

categoryRoutes.post("/", authMiddleware, categoryController.create);

categoryRoutes.put("/:id", authMiddleware, categoryController.update);

categoryRoutes.delete("/:id", authMiddleware, categoryController.delete);

module.exports = categoryRoutes;
