const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const authMiddleware = require("../middlewares/auth.middleware");

const categoryRoutes = Router();

categoryRoutes.get("/categories", authMiddleware, categoryController.read);
categoryRoutes.post("/add-category", authMiddleware, categoryController.create);
categoryRoutes.put("/update-category/:id", authMiddleware, categoryController.update);
categoryRoutes.delete("/delete-category/:id", authMiddleware, categoryController.delete);

module.exports = categoryRoutes;
