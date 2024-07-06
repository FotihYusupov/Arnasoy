const { Router } = require("express");
const settingsController = require("../controllers/settingsController");
const authMiddleware = require("../middlewares/auth.middleware");

const settingsRoutes = Router();

settingsRoutes.get("/", authMiddleware, settingsController.getAll);

settingsRoutes.post("/",  settingsController.addSettings);

settingsRoutes.put("/:id",  settingsController.updateSettings);

module.exports = settingsRoutes;
