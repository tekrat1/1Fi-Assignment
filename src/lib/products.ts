import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { computeEmiPlans } from "@/lib/emi";
import EmiPlanTemplate, { type IEmiPlanTemplate } from "@/models/EmiPlanTemplate";
import Product, { type IProduct, type IVariant } from "@/models/Product";
import type { ProductDetails, ProductSummary } from "@/types/product";

type ProductSummaryDocument = Pick<
  IProduct,
  "slug" | "name" | "brand" | "category" | "heroImage" | "variants"
>;

type ProductRouteVariant = Pick<
  IVariant,
  "variantLabel" | "storage" | "color" | "mrp" | "price" | "image" | "images"
> & { _id: Types.ObjectId };

type ProductRouteData = Pick<
  IProduct,
  "name" | "slug" | "brand" | "category" | "description" | "heroImage" | "finishes"
> & { variants: ProductRouteVariant[] };

export async function getProductSummaries(): Promise<ProductSummary[]> {
  await connectDB();

  const products = await Product.find({})
    .sort({ createdAt: 1 })
    .select("slug name brand category heroImage variants.price")
    .lean<ProductSummaryDocument[]>();

  return products.map((product) => {
    const prices = product.variants.map((variant) => variant.price);

    return {
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      category: product.category,
      heroImage: product.heroImage,
      variantCount: product.variants.length,
      startingPrice: prices.length ? Math.min(...prices) : 0,
    };
  });
}

export async function getProductDetails(slug: string): Promise<ProductDetails | null> {
  await connectDB();

  const product = await Product.findOne({ slug }).lean<ProductRouteData | null>();
  if (!product) return null;

  const planTemplates = await EmiPlanTemplate.find({})
    .sort({ order: 1 })
    .select("tenureMonths interestRate cashback")
    .lean<IEmiPlanTemplate[]>();

  const variants = product.variants.map((variant) => {
    const gallery = Array.from(
      new Set([variant.image, ...variant.images].filter(Boolean))
    );

    return {
      id: variant._id.toString(),
      variantLabel: variant.variantLabel,
      storage: variant.storage,
      color: variant.color,
      mrp: variant.mrp,
      price: variant.price,
      image: variant.image,
      images: gallery,
      emiPlans: computeEmiPlans(variant.price, planTemplates),
    };
  });

  return {
    name: product.name,
    slug: product.slug,
    brand: product.brand,
    category: product.category,
    description: product.description,
    heroImage: product.heroImage,
    finishes: product.finishes,
    variants,
  };
}
