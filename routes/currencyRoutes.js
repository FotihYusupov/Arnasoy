const { Router } = require("express");
const currencyController = require("../controllers/currencyController");
const authMiddleware = require("../middlewares/auth.middleware");

const currencyRoutes = Router();

currencyRoutes.get("/currency", authMiddleware, currencyController.getAll);
currencyRoutes.get("/currency-today", authMiddleware, currencyController.getByDate);
currencyRoutes.put("/update-currency", authMiddleware, currencyController.updateCurrency);

module.exports = currencyRoutes;
