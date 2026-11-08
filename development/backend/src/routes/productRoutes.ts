import { Router } from 'express';
import {
  getProductBySlug,
  getProducts,
  updateProductPrice,
  updateProductStock,
} from '../controllers/productController';
import { validate } from '../middleware/validate';
import { updatePriceSchema, updateStockSchema } from '../validators';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.patch('/:slug/stock', validate(updateStockSchema), updateProductStock);
router.patch('/:slug/price', validate(updatePriceSchema), updateProductPrice);

export default router;
