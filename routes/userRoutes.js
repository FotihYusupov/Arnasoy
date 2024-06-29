const { Router } = require("express");
const userController = require("../controllers/userController");
const uploadMiddleware = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const userRoutes = Router();

userRoutes.get("/", authMiddleware, userController.getAllUsers);
userRoutes.get("/get-me", authMiddleware, userController.getMe);

userRoutes.post("/", authMiddleware, uploadMiddleware, userController.addUser);
userRoutes.post("/login", userController.login);

userRoutes.put("/balance", authMiddleware, userController.updateUserBalance);
userRoutes.put("/:id", authMiddleware, uploadMiddleware, userController.updateUser);

userRoutes.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = userRoutes;
