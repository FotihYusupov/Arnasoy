const { Router } = require("express");
const unitController = require("../controllers/unitController");
const authMiddleware = require("../middlewares/auth.middleware");

const unitRoutes = Router();

unitRoutes.get("/units", authMiddleware, unitController.getAll);
unitRoutes.post("/units", authMiddleware, unitController.createUnit);
unitRoutes.put("/units/:id", authMiddleware, unitController.updateUnit);
unitRoutes.delete("/units/:id", authMiddleware, unitController.deleteUnit);

module.exports = unitRoutes;
