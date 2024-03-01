const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const warehouseController = require("../controllers/warehouseController");

const warehouseRoutes = Router();

warehouseRoutes.get("/warehouses", authMiddleware, warehouseController.getAll);
warehouseRoutes.post("/add-warehouse", authMiddleware, warehouseController.addWarehouse);
warehouseRoutes.put("/update-warehouse/:id", authMiddleware, warehouseController.updateWarehouse);
warehouseRoutes.delete("/delete-warehouse/:id", authMiddleware, warehouseController.deleteWarehouse);

module.exports = warehouseRoutes;
