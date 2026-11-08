import { Schema, model } from 'mongoose';
import { Product } from '../types';

const ProductSchema = new Schema<Product>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    cat: { type: String, enum: ['short', 'long', 'oversized'], required: true, index: true },
    price: { type: Number, required: true },
    was: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviews: { type: Number, default: 0 },
    tag: { type: String },
    family: { type: String, required: true, index: true },
    added: { type: Number, default: 1 },
    colours: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    stock: {
      XS: { type: Number, default: 0 },
      S: { type: Number, default: 0 },
      M: { type: Number, default: 0 },
      L: { type: Number, default: 0 },
      XL: { type: Number, default: 0 },
      XXL: { type: Number, default: 0 },
    },
    img: { type: String, required: true },
    model: { type: String, required: true },
    blurb: { type: String, required: true },
    details: [{ type: String }],
    fabric: { type: String, required: true },
  },
  { timestamps: true }
);

export const ProductModel = model<Product>('Product', ProductSchema);
