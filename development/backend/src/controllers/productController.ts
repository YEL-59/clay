import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';
import { SizeCode } from '../types';

export const getProducts = (req: Request, res: Response): void => {
  const { cat, family, search } = req.query;
  const products = inMemoryStore.getProducts({
    cat: typeof cat === 'string' ? cat : undefined,
    family: typeof family === 'string' ? family : undefined,
    search: typeof search === 'string' ? search : undefined,
  });

  res.status(200).json({
    success: true,
    data: products,
    count: products.length,
  });
};

export const getProductBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const product = inMemoryStore.getProductBySlug(slug);

  if (!product) {
    res.status(404).json({
      success: false,
      error: `Product with slug '${slug}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProductStock = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const { size, delta, bulk } = req.body;

  const updated = inMemoryStore.updateProductStock(slug, {
    size: size as SizeCode | undefined,
    delta: typeof delta === 'number' ? delta : undefined,
    bulk: typeof bulk === 'number' ? bulk : undefined,
  });

  if (!updated) {
    res.status(404).json({
      success: false,
      error: `Product with slug '${slug}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Stock updated successfully',
  });
};

export const updateProductPrice = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const { price } = req.body;

  const updated = inMemoryStore.updateProductPrice(slug, price);

  if (!updated) {
    res.status(404).json({
      success: false,
      error: `Product with slug '${slug}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Price updated successfully',
  });
};
