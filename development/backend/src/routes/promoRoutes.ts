import { Router } from 'express';
import {
  createPromo,
  deletePromo,
  getPromos,
  validatePromo,
} from '../controllers/promoController';
import { validate } from '../middleware/validate';
import { createPromoSchema, validatePromoSchema } from '../validators';

const router = Router();

router.get('/', getPromos);
router.post('/validate', validate(validatePromoSchema), validatePromo);
router.post('/', validate(createPromoSchema), createPromo);
router.delete('/:code', deletePromo);

export default router;
