import { Router } from 'express';
import { getOverview } from '../controllers/overviewController';

const router = Router();

router.get('/', getOverview);

export default router;
