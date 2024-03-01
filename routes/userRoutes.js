const { Router } = require("express");
const userController = require("../controllers/userController");
const uploadMiddleware = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const userRoutes = Router();

userRoutes.get("/users", authMiddleware, userController.getAllUsers);
userRoutes.post("/add-user", authMiddleware, uploadMiddleware, userController.addUser);
userRoutes.post("/login", userController.login);
userRoutes.put("/update-user", authMiddleware, uploadMiddleware, userController.updateUser);
userRoutes.delete("/delete-user/:id", authMiddleware, userController.deleteUser);

module.exports = userRoutes;
