import mongoose, { Schema, models, model } from "mongoose";

export interface IVariant {
  variantLabel: string; // e.g. "256GB Silver"
  storage?: string;
  color?: string;
  mrp: number;
  price: number;
  image: string;
  images: string[];
}

export interface IProduct {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  heroImage: string;
  finishes: string[]; // e.g. color swatch names shown under product image
  variants: IVariant[];
}

const VariantSchema = new Schema<IVariant>(
  {
    variantLabel: { type: String, required: true },
    storage: { type: String },
    color: { type: String },
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    heroImage: { type: String, required: true },
    finishes: { type: [String], default: [] },
    variants: { type: [VariantSchema], required: true },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
