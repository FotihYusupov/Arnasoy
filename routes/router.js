const { Router } = require("express");
const roleRoutes = require("./roleRoutes");
const userRoutes = require("./userRoutes");
const currencyRoutes = require("./currencyRoutes");
const clientRoutes = require("./clientRoutes");
const warehouseRoutes = require("./warehouseRoutes");
const partyRoutes = require("./partyRoutes");
const productRoutes = require("./productRoutes");
const satisfactionRoutes = require("./satisfactionRoutes");
const deptRoutes = require("./deptRoutes");
const groupRoutes = require("./groupRoutes");

const router = Router();

router.use(roleRoutes);
router.use(userRoutes);
router.use(currencyRoutes);
router.use(clientRoutes);
router.use(warehouseRoutes);
router.use(partyRoutes);
router.use(productRoutes);
router.use(satisfactionRoutes);
router.use(deptRoutes);
router.use(groupRoutes);

module.exports = router;
