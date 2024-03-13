const { Router } = require("express");
const deptController = require("../controllers/deptController");
const authMiddleware = require("../middlewares/auth.middleware");

const deptRoutes = Router();

deptRoutes.get("/depts/:id", authMiddleware, deptController.getById);
deptRoutes.post("/add-dept/:id", deptController.checkDept);

module.exports = deptRoutes;
