const { Router } = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth.middleware");

const userRoutes = Router();

userRoutes.get("/", authMiddleware, userController.getAllUsers);
userRoutes.get("/get-me", authMiddleware, userController.getMe);

userRoutes.post("/", authMiddleware,  userController.addUser);
userRoutes.post("/login", userController.login);

userRoutes.put("/balance", authMiddleware, userController.updateUserBalance);
userRoutes.put("/:id", authMiddleware,  userController.updateUser);

userRoutes.delete("/:id", authMiddleware, userController.deleteUser);

module.exports = userRoutes;
