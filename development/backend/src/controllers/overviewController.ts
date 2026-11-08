import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const getOverview = (_req: Request, res: Response): void => {
  const telemetry = inMemoryStore.getOverviewTelemetry();
  res.status(200).json({
    success: true,
    ...telemetry,
  });
};
