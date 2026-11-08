import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const getSettings = (_req: Request, res: Response): void => {
  const settings = inMemoryStore.getSettings();
  res.status(200).json({
    success: true,
    data: settings,
  });
};

export const updateSettings = (req: Request, res: Response): void => {
  const updated = inMemoryStore.updateSettings(req.body);
  res.status(200).json({
    success: true,
    data: updated,
    message: 'Store settings updated successfully',
  });
};
