const { Router } = require("express");
const clientController = require("../controllers/clientController");
const authMIddleware = require("../middlewares/auth.middleware");

const clientRoutes = Router();

clientRoutes.get("/clients", authMIddleware, clientController.getAll);
clientRoutes.post("/add-client", authMIddleware, clientController.addClient);
clientRoutes.put("/update-client/:id", authMIddleware, clientController.updateClient);
clientRoutes.put("/balance/:id", authMIddleware, clientController.updateClientBalance);
clientRoutes.delete("/delete-client/:id", authMIddleware, clientController.deleteClient);

module.exports = clientRoutes;
