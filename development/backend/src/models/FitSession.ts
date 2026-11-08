import { Schema, model } from 'mongoose';
import { FitSession } from '../types';

const FitSessionSchema = new Schema<FitSession>(
  {
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    recommendedSize: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], required: true },
    addedToBag: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const FitSessionModel = model<FitSession>('FitSession', FitSessionSchema);
