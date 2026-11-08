import { Schema, model } from 'mongoose';
import { Order } from '../types';

const OrderLineSchema = new Schema(
  {
    slug: { type: String, required: true },
    name: { type: String },
    size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderNoteSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    at: { type: String, required: true },
    by: { type: String, default: 'System' },
  },
  { _id: false }
);

const OrderSchema = new Schema<Order>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    placedAt: { type: String, required: true },
    customerId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, index: true },
    customerPhone: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String },
    lines: [OrderLineSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 80 },
    total: { type: Number, required: true },
    payment: { type: String, enum: ['cod', 'bkash', 'nagad', 'card'], required: true },
    promo: { type: String },
    status: {
      type: String,
      enum: ['new', 'packing', 'shipped', 'delivered', 'returned'],
      default: 'new',
      index: true,
    },
    notes: [OrderNoteSchema],
    fromShop: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const OrderModel = model<Order>('Order', OrderSchema);
