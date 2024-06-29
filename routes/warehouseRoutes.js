const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const warehouseController = require("../controllers/warehouseController");

const warehouseRoutes = Router();

warehouseRoutes.get("/", authMiddleware, warehouseController.getAll);

warehouseRoutes.post("/", authMiddleware, warehouseController.addWarehouse);

warehouseRoutes.put("/:id", authMiddleware, warehouseController.updateWarehouse);

warehouseRoutes.delete("/:id", authMiddleware, warehouseController.deleteWarehouse);

module.exports = warehouseRoutes;
