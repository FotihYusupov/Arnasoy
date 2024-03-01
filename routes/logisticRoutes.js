const { Router } = require("express");
const logisticController = require("../controllers/logisticController");
const authMiddleware = require("../middlewares/auth.middleware");

const logisticRoutes = Router();

logisticRoutes.get("/logistics", authMiddleware, logisticController.getAll);
logisticRoutes.post("/add-logistic", authMiddleware, logisticController.addLogistic);
logisticRoutes.put("/update-logistic/:id", authMiddleware, logisticController.updateLogistic);
logisticRoutes.delete("/delete-logistic/:id", authMiddleware, logisticController.deleteLogistic);

module.exports = logisticRoutes;
