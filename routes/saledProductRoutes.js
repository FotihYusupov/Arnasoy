const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware")
const saledProductController = require("../controllers/saledsController");

const saledProductsRoutes = Router();

saledProductsRoutes.get("/", authMiddleware, saledProductController.getAll);

module.exports = saledProductsRoutes;
