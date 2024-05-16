const { Router } = require("express");
const deptController = require("../controllers/deptController");
const authMiddleware = require("../middlewares/auth.middleware");

const deptRoutes = Router();

deptRoutes.get("/:id", authMiddleware, deptController.getById);
deptRoutes.post("/:id", authMiddleware, deptController.checkDept);

module.exports = deptRoutes;
