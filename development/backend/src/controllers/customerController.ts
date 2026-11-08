import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';

export const getCustomers = (req: Request, res: Response): void => {
  const { search } = req.query;
  const customers = inMemoryStore.getCustomers(typeof search === 'string' ? search : undefined);

  res.status(200).json({
    success: true,
    data: customers,
    count: customers.length,
  });
};

export const getCustomerById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const result = inMemoryStore.getCustomerById(id);

  if (!result) {
    res.status(404).json({
      success: false,
      error: `Customer with ID '${id}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const addCustomerNote = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { text } = req.body;

  const updated = inMemoryStore.addCustomerNote(id, text);

  if (!updated) {
    res.status(404).json({
      success: false,
      error: `Customer with ID '${id}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Customer note saved',
  });
};
