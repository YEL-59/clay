import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const getPromos = (_req: Request, res: Response): void => {
  const promos = inMemoryStore.getPromos();
  res.status(200).json({
    success: true,
    data: promos,
    count: promos.length,
  });
};

export const validatePromo = (req: Request, res: Response): void => {
  const { code, subtotal } = req.body;
  const result = inMemoryStore.validatePromo(code, subtotal || 0);

  res.status(200).json(result);
};

export const createPromo = (req: Request, res: Response): void => {
  const { code, kind, value, label, active } = req.body;

  const promo = inMemoryStore.createPromo({
    code,
    kind,
    value,
    label,
    active: active !== undefined ? Boolean(active) : true,
  });

  res.status(201).json({
    success: true,
    data: promo,
    message: 'Promotional drop code generated',
  });
};

export const deletePromo = (req: Request, res: Response): void => {
  const { code } = req.params;
  const deleted = inMemoryStore.deletePromo(code);

  if (!deleted) {
    res.status(404).json({
      success: false,
      error: `Promo code '${code}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: `Promo code '${code}' was removed`,
  });
};
