const { Router } = require("express");
const satisfactionController = require("../controllers/SatisfactionController");
const authMiddleware = require("../middlewares/auth.middleware");

const satisfactionRoutes = Router();

satisfactionRoutes.get("/satisfactions", authMiddleware, satisfactionController.getAll);
satisfactionRoutes.post("/add-satisfaction", authMiddleware, satisfactionController.addSatisfaction);

module.exports = satisfactionRoutes;
