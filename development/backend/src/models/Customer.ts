import { Schema, model } from 'mongoose';
import { Customer } from '../types';

const CustomerNoteSchema = new Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    at: { type: String, required: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema<Customer>(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    district: { type: String, required: true },
    since: { type: String, required: true },
    tier: { type: String, enum: ['VIP', 'Regular', 'New'], default: 'New' },
    spent: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    notes: [CustomerNoteSchema],
  },
  { timestamps: true }
);

export const CustomerModel = model<Customer>('Customer', CustomerSchema);
