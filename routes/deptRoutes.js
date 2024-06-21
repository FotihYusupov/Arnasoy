const { Router } = require("express");
const deptController = require("../controllers/deptController");
const authMiddleware = require("../middlewares/auth.middleware");

const deptRoutes = Router();

deptRoutes.get("/history", authMiddleware, deptController.getHistory);
deptRoutes.get("/:id", authMiddleware, deptController.getById);

module.exports = deptRoutes;
