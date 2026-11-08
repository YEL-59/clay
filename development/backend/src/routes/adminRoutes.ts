import { Router } from 'express';
import { resetSeed } from '../controllers/adminController';

const router = Router();

router.post('/reset-seed', resetSeed);

export default router;
