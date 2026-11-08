import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { validate } from '../middleware/validate';
import { updateSettingsSchema } from '../validators';

const router = Router();

router.get('/', getSettings);
router.patch('/', validate(updateSettingsSchema), updateSettings);

export default router;
