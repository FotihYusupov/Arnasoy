const { Router } = require("express");
const deptController = require("../controllers/deptController");
const authMiddleware = require("../middlewares/auth.middleware");

const deptRoutes = Router();

deptRoutes.get("/:id", authMiddleware, deptController.getById);
deptRoutes.get("/history/:id", authMiddleware, deptController.getHistory);

module.exports = deptRoutes;
