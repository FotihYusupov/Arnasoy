const { Router } = require("express");
const satisfactionController = require("../controllers/SatisfactionController");
const authMiddleware = require("../middlewares/auth.middleware");

const satisfactionRoutes = Router();

satisfactionRoutes.get("/", authMiddleware, satisfactionController.getAll);
satisfactionRoutes.post("/", authMiddleware, satisfactionController.addSatisfaction);
satisfactionRoutes.delete("/:id", authMiddleware, satisfactionController.cancelSatisfaction);

module.exports = satisfactionRoutes;
