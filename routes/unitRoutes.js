const { Router } = require("express");
const unitController = require("../controllers/unitController");
const authMiddleware = require("../middlewares/auth.middleware");

const unitRoutes = Router();

unitRoutes.get("/", authMiddleware, unitController.getAll);

unitRoutes.post("/", authMiddleware, unitController.createUnit);

unitRoutes.put("/:id", authMiddleware, unitController.updateUnit);

unitRoutes.delete("/:id", authMiddleware, unitController.deleteUnit);

module.exports = unitRoutes;
