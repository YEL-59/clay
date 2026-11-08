import { Router } from 'express';
import { getFitSessions, recordFitSession } from '../controllers/fitSessionController';
import { validate } from '../middleware/validate';
import { recordFitSessionSchema } from '../validators';

const router = Router();

router.post('/', validate(recordFitSessionSchema), recordFitSession);
router.get('/', getFitSessions);

export default router;
