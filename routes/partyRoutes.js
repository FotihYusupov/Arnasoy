const Router = require("express");
const partyController = require("../controllers/partyController");
const authMiddleware = require("../middlewares/auth.middleware");

const partyRoutes = Router();

partyRoutes.get('/', authMiddleware, partyController.get)
partyRoutes.get("/generate-id", authMiddleware, partyController.generatePartyId);
partyRoutes.post("/", authMiddleware, partyController.addParty);
partyRoutes.put("/:id", authMiddleware, partyController.updateParty);
partyRoutes.put("/update-status/:id", authMiddleware, partyController.updateStatus);
partyRoutes.put("/update-warehouse/:id", authMiddleware, partyController.updateWarehouse);
partyRoutes.delete("/:id", authMiddleware, partyController.deleteParty);

module.exports = partyRoutes;
