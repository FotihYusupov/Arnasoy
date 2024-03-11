const { Router } = require("express");
const roleRoutes = require("./roleRoutes");
const userRoutes = require("./userRoutes");
const currencyRoutes = require("./currencyRoutes");
const clientRoutes = require("./clientRoutes");
const warehouseRoutes = require("./warehouseRoutes");
const logisticRoutes = require("./logisticRoutes");
const partyRoutes = require("./partyRoutes");
const productRoutes = require("./productRoutes");
const satisfactionRoutes = require("./satisfactionRoutes");

const router = Router();

router.use(roleRoutes);
router.use(userRoutes);
router.use(currencyRoutes);
router.use(clientRoutes);
router.use(warehouseRoutes);
router.use(logisticRoutes);
router.use(partyRoutes);
router.use(productRoutes);
router.use(satisfactionRoutes);

module.exports = router;
