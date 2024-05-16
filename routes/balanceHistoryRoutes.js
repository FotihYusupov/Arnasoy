const { Router } = require("express");
const balanceHistoryController = require("../controllers/balanceHistoryController");
const authMiddleware = require("../middlewares/auth.middleware");

const balanceHistoryRoutes = Router();

balanceHistoryRoutes.get("/history/:id", authMiddleware, balanceHistoryController.getById);

module.exports = balanceHistoryRoutes;
