import { Schema, model } from 'mongoose';
import { Promo } from '../types';

const PromoSchema = new Schema<Promo>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    kind: { type: String, enum: ['pct', 'ship'], required: true },
    value: { type: Number, required: true },
    label: { type: String, required: true },
    active: { type: Boolean, default: true },
    uses: { type: Number, default: 0 },
    custom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PromoModel = model<Promo>('Promo', PromoSchema);
