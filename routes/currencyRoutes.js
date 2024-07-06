const { Router } = require("express");
const currencyController = require("../controllers/currencyController");
const authMiddleware = require("../middlewares/auth.middleware");

const currencyRoutes = Router();

currencyRoutes.get("/", authMiddleware, currencyController.getAll);
currencyRoutes.get("/today",  currencyController.getByDate);

currencyRoutes.put("/", authMiddleware, currencyController.updateCurrency);

module.exports = currencyRoutes;
