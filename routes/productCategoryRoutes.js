const { Router } = require('express')
const productCategoryController = require('../controllers/productCategoryController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/product-categories', authMiddleware, productCategoryController.read);
router.post('/add-product-category', authMiddleware, productCategoryController.create);
router.get('/product-categories/:id', authMiddleware, productCategoryController.getById);
router.put('/update-product-category/:id', authMiddleware, productCategoryController.update);
router.delete('/delete-product-category/:id', authMiddleware, productCategoryController.delete);

module.exports = router;
