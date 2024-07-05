const { Router } = require("express");
const clientController = require("../controllers/clientController");
const authMiddleware = require("../middlewares/auth.middleware");

const clientRoutes = Router();

clientRoutes.get("/all", authMiddleware, clientController.getAll);
clientRoutes.get("/", authMiddleware, clientController.getClients);
clientRoutes.get("/invoice", clientController.generateInv);
clientRoutes.get("/:id", authMiddleware, clientController.byId);

clientRoutes.post("/", authMiddleware, clientController.addClient);

clientRoutes.put("/:id", authMiddleware, clientController.updateClient);
clientRoutes.put("/balance/:id", authMiddleware, clientController.updateClientBalanceAndPayDebt);
clientRoutes.put("/money-expense/:id", authMiddleware, clientController.moneyOut);

clientRoutes.delete("/:id", authMiddleware, clientController.deleteClient);

module.exports = clientRoutes;
