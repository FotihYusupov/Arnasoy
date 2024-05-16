const { Router } = require("express");
const groupController = require("../controllers/groupController");
const authMiddleware = require("../middlewares/auth.middleware");

const groupRoutes = Router();

groupRoutes.get("/", authMiddleware, groupController.read);
groupRoutes.post("/", authMiddleware, groupController.create);
groupRoutes.put("/:id", authMiddleware, groupController.update);
groupRoutes.delete("/:id", authMiddleware, groupController.delete);

module.exports = groupRoutes;
