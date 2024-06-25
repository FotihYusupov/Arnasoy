const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transferHistoryController = require("../controllers/transferHistoryController");

const transferHistoryRoutes = Router();

transferHistoryRoutes.get("/", authMiddleware, transferHistoryController.getTransferHistory);

module.exports = transferHistoryRoutes;