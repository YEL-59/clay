import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const resetSeed = (_req: Request, res: Response): void => {
  inMemoryStore.resetToSeed();
  res.status(200).json({
    success: true,
    message: 'Baseline seed restored',
  });
};
