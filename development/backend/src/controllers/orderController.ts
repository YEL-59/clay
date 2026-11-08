import { Request, Response } from 'express';
import { inMemoryStore } from '../data/inMemoryStore';
import { OrderStatus } from '../types';

export const getOrders = (req: Request, res: Response): void => {
  const { status, search, payment } = req.query;
  const orders = inMemoryStore.getOrders({
    status: status as OrderStatus | undefined,
    search: typeof search === 'string' ? search : undefined,
    payment: typeof payment === 'string' ? payment : undefined,
  });

  res.status(200).json({
    success: true,
    data: orders,
    count: orders.length,
  });
};

export const getOrderById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const order = inMemoryStore.getOrderById(id);

  if (!order) {
    res.status(404).json({
      success: false,
      error: `Order with ID '${id}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};

export const createOrder = (req: Request, res: Response): void => {
  const { customer, lines, promoCode, deliveryFee, paymentMethod } = req.body;

  const order = inMemoryStore.createOrder({
    customer,
    lines,
    promoCode,
    deliveryFee,
    paymentMethod,
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.orderId,
      placedAt: order.placedAt,
      total: order.total,
      status: order.status,
      paymentMethod: order.payment,
      customerId: order.customerId,
      lines: order.lines,
    },
  });
};

export const updateOrderStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = inMemoryStore.updateOrderStatus(id, status as OrderStatus);

  if (!updated) {
    res.status(404).json({
      success: false,
      error: `Order with ID '${id}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: updated,
    message: `Order status changed to '${status}' successfully`,
  });
};

export const addOrderNote = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { text, by } = req.body;

  const updated = inMemoryStore.addOrderNote(id, text, by);

  if (!updated) {
    res.status(404).json({
      success: false,
      error: `Order with ID '${id}' was not found`,
      statusCode: 404,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: updated,
    message: 'Note appended to order history',
  });
};
