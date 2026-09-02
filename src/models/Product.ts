import mongoose, { Schema, model, models } from "mongoose";

export interface IVariant {
  variantLabel: string;
  storage: string;
  color: string;
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
  finishes: string[];
  variants: IVariant[];
}

const VariantSchema = new Schema<IVariant>(
  {
    variantLabel: { type: String, required: true, trim: true },
    storage: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    mrp: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    images: { type: [String], required: true, default: [] },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    heroImage: { type: String, required: true, trim: true },
    finishes: { type: [String], required: true, default: [] },
    variants: { type: [VariantSchema], required: true, validate: [(value: IVariant[]) => value.length > 0, "At least one variant is required"] },
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
