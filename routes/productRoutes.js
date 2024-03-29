const { Router } = require("express");
const productController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/auth.middleware");

const productRoutes = Router();

productRoutes.get("/products/:id", authMiddleware, productController.getAll);
productRoutes.get("/unique/:id", authMiddleware, productController.getUniqueProducts);
productRoutes.get("/product/:id", authMiddleware, productController.findById);
productRoutes.post("/sale", authMiddleware, productController.SaleProduct);
productRoutes.patch("/get-price", authMiddleware, productController.getPrice);
productRoutes.put("/transfer", authMiddleware, productController.transfer);

module.exports = productRoutes;
