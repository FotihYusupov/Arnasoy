const { Router } = require('express')
const productCategoryController = require('../controllers/productCategoryController');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, productCategoryController.read);
router.post('/',  productCategoryController.create);
router.get('/:id', authMiddleware, productCategoryController.getById);
router.put('/:id', authMiddleware, productCategoryController.update);
router.delete('/:id', authMiddleware, productCategoryController.delete);

module.exports = router;
