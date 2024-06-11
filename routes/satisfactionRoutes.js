const { Router } = require("express");
const satisfactionController = require("../controllers/SatisfactionController");
const authMiddleware = require("../middlewares/auth.middleware");

const satisfactionRoutes = Router();

satisfactionRoutes.get("/expenses", authMiddleware, satisfactionController.getExpenses);
satisfactionRoutes.get("/", authMiddleware, satisfactionController.getAll);
satisfactionRoutes.post("/party/:id", authMiddleware, satisfactionController.addSatisfaction);
satisfactionRoutes.post("/product/:id", authMiddleware, satisfactionController.addSatisfactionProduct);
satisfactionRoutes.post("/", authMiddleware, satisfactionController.expenses);
satisfactionRoutes.put("/expenses/:id", authMiddleware, satisfactionController.updateExpenses);
satisfactionRoutes.put("/:id", authMiddleware, satisfactionController.updateSatisfaction);

module.exports = satisfactionRoutes;
