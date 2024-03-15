const { Router } = require("express");
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middlewares/auth.middleware");

const groupRoutes = Router();

groupRoutes.get("/groups", authMiddleware, groupController.read);
groupRoutes.post("/add-group", authMiddleware, groupController.create);
groupRoutes.put("/update-group/:id", authMiddleware, groupController.update);
groupRoutes.delete("/delete-group/:id", authMiddleware, groupController.delete);

module.exports = groupRoutes;
