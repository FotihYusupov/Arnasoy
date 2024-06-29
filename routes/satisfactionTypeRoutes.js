const { Router } = require("express");
const satisfactionTypeController = require("../controllers/satisfactionTypeController");
const authMiddleware = require("../middlewares/auth.middleware");

const satisfactionTypeRoutes = Router();

satisfactionTypeRoutes.get("/", authMiddleware, satisfactionTypeController.getAll);

satisfactionTypeRoutes.post("/", authMiddleware, satisfactionTypeController.add);

satisfactionTypeRoutes.put("/:id", authMiddleware, satisfactionTypeController.update);

satisfactionTypeRoutes.delete("/:id", authMiddleware, satisfactionTypeController.delete);

module.exports = satisfactionTypeRoutes;
