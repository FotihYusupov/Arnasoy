const { Router } = require("express");
const userController = require("../controllers/userController");
const uploadMiddleware = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const userRoutes = Router();

userRoutes.get("/users", authMiddleware, userController.getAllUsers);
userRoutes.get("/get-me", authMiddleware, userController.getMe);
userRoutes.post("/add-user", authMiddleware, uploadMiddleware, userController.addUser);
userRoutes.post("/login", userController.login);
userRoutes.put("/update-user/:id", authMiddleware, uploadMiddleware, userController.updateUser);
userRoutes.delete("/delete-user/:id", authMiddleware, userController.deleteUser);

module.exports = userRoutes;
