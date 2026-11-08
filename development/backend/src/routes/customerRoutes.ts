import { Router } from 'express';
import {
  addCustomerNote,
  getCustomerById,
  getCustomers,
} from '../controllers/customerController';

const router = Router();

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.post('/:id/notes', addCustomerNote);

export default router;
