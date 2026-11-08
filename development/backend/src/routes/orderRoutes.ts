import { Router } from 'express';
import {
  addOrderNote,
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { validate } from '../middleware/validate';
import {
  addOrderNoteSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from '../validators';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validate(createOrderSchema), createOrder);
router.patch('/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);
router.post('/:id/notes', validate(addOrderNoteSchema), addOrderNote);

export default router;
