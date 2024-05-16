const { Router } = require("express");
const clientController = require("../controllers/clientController");
const authMIddleware = require("../middlewares/auth.middleware");

const clientRoutes = Router();

clientRoutes.get("/", authMIddleware, clientController.getAll);
clientRoutes.post("/", authMIddleware, clientController.addClient);
clientRoutes.put("/:id", authMIddleware, clientController.updateClient);
clientRoutes.put("/balance/:id", authMIddleware, clientController.updateClientBalance);
clientRoutes.delete("/:id", authMIddleware, clientController.deleteClient);

module.exports = clientRoutes;
