const { Router } = require("express");
const productController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/auth.middleware");

const productRoutes = Router();

productRoutes.get("/products/:id", productController.getAll);
productRoutes.get("/product/:id", authMiddleware, productController.findById);
productRoutes.post("/sale", productController.SaleProduct)

module.exports = productRoutes;
