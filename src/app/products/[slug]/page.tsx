import { notFound } from "next/navigation";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import Product, { type IVariant } from "@/models/Product";
import EmiPlanTemplate, {
  type IEmiPlanTemplate,
} from "@/models/EmiPlanTemplate";
import { computeEmiPlans } from "@/lib/emi";
import ProductView from "@/components/ProductView";
import type { ProductDetail } from "@/types/product";

export const dynamic = "force-dynamic";

interface ProductRouteVariant extends Omit<IVariant, "id"> {
  _id: Types.ObjectId;
}

interface ProductRouteData {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  heroImage: string;
  finishes: string[];
  variants: ProductRouteVariant[];
}

async function getProduct(slug: string): Promise<ProductDetail | null> {
  await connectDB();

  const product = await Product.findOne({ slug }).lean<ProductRouteData | null>();
  if (!product) return null;

  const templates = await EmiPlanTemplate.find({})
    .sort({ order: 1 })
    .lean<IEmiPlanTemplate[]>();

  const variants = product.variants.map((variant) => ({
    id: variant._id.toString(),
    variantLabel: variant.variantLabel,
    storage: variant.storage,
    color: variant.color,
    mrp: variant.mrp,
    price: variant.price,
    image: variant.image,
    images: variant.images.length > 0 ? variant.images : [variant.image],
    emiPlans: computeEmiPlans(variant.price, templates),
  }));

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

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductView product={product} />;
}
