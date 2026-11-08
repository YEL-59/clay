import { Schema, model } from 'mongoose';
import { Settings } from '../types';

const SettingsSchema = new Schema<Settings>(
  {
    storeId: { type: String, required: true, unique: true },
    storeName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    lowStock: { type: Number, default: 3 },
    deliveryDhaka: { type: Number, default: 80 },
    deliveryOutside: { type: Number, default: 150 },
    freeDeliveryThreshold: { type: Number, default: 3000 },
    paymentToggles: {
      cod: { type: Boolean, default: true },
      bkash: { type: Boolean, default: true },
      nagad: { type: Boolean, default: true },
      card: { type: Boolean, default: true },
    },
    notificationToggles: {
      order: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      returns: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const SettingsModel = model<Settings>('Settings', SettingsSchema);
