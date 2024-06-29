const { Router } = require("express");
const translationRoutes = require("./translationRoutes")
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
const productCategory = require("./productCategoryRoutes");
const balanceHistory = require("./balanceHistoryRoutes");
const categoryRoutes = require("./categoryRoutes");
const unitRoutes = require("./unitRoutes");
const satisfactionTypeRoutes = require("./satisfactionTypeRoutes");
const transferHistoryRoutes = require("./transferHisrtoryRoues");
const saledProductRoutes = require("./saledProductRoutes");
const salaryRoutes = require("./salaryRoutes");

const router = Router();

router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/currency', currencyRoutes);
router.use('/clients', clientRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/parties', partyRoutes);
router.use('/products', productRoutes);
router.use('/satisfactions', satisfactionRoutes);
router.use('/depts', deptRoutes);
router.use('/groups', groupRoutes);
router.use('/product-categories', productCategory);
router.use('/balance', balanceHistory);
router.use('/categories', categoryRoutes);
router.use('/units', unitRoutes);
router.use('/satisfaction-type', satisfactionTypeRoutes);
router.use('/transfer-history', transferHistoryRoutes);
router.use('/saled-products', saledProductRoutes);
router.use('/salary', salaryRoutes);
router.use('/trnaslations', translationRoutes)

module.exports = router;
