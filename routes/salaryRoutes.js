const { Router } = require("express");
const salaryController = require("../controllers/salaryController");
const authMiddleware = require("../middlewares/auth.middleware");

const salaryRoutes = Router();

salaryRoutes.get("/", authMiddleware, salaryController.getAll);
salaryRoutes.post("/:id", authMiddleware, salaryController.paySalary);
salaryRoutes.post("/advance/:id", authMiddleware, salaryController.advanceSalary);

module.exports = salaryRoutes;
