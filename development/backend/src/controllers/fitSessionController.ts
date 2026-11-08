import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const recordFitSession = (req: Request, res: Response): void => {
  const { heightCm, weightKg, recommendedSize, addedToBag } = req.body;

  const session = inMemoryStore.recordFitSession({
    heightCm,
    weightKg,
    recommendedSize,
    addedToBag: Boolean(addedToBag),
  });

  res.status(201).json({
    success: true,
    data: session,
  });
};

export const getFitSessions = (_req: Request, res: Response): void => {
  const sessions = inMemoryStore.getFitSessions();
  res.status(200).json({
    success: true,
    data: sessions,
    count: sessions.length,
  });
};
