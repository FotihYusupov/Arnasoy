const { Router } = require("express");
const productController = require("../controllers/productsController");
const authMiddleware = require("../middlewares/auth.middleware");

const productRoutes = Router();

productRoutes.get("/", authMiddleware, productController.getAll);
productRoutes.get("/unique/", authMiddleware, productController.getUniqueProducts);
productRoutes.get("/product/:id", authMiddleware, productController.findById);
productRoutes.get("/invoice", authMiddleware, productController.generateInvoice);
productRoutes.post("/sale", authMiddleware, productController.SaleProduct);
productRoutes.put("/transfer/:id", authMiddleware, productController.transfer);

module.exports = productRoutes;
