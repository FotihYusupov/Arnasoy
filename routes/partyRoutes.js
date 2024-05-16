const Router = require("express");
const partyController = require("../controllers/partyController");
const authMiddleware = require("../middlewares/auth.middleware");

const partyRoutes = Router();

partyRoutes.get("/", authMiddleware, partyController.getAll);
partyRoutes.get("/generate-id", authMiddleware, partyController.generatePartyId);
partyRoutes.post("/", authMiddleware, partyController.addParty);
partyRoutes.put("/update-status/:id", authMiddleware, partyController.updateStatus);

module.exports = partyRoutes;
