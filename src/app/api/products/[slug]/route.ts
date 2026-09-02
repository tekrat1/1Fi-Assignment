import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import Product, { type IVariant } from "@/models/Product";
import EmiPlanTemplate, {
  type IEmiPlanTemplate,
} from "@/models/EmiPlanTemplate";
import { computeEmiPlans } from "@/lib/emi";

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

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug }).lean<ProductRouteData | null>();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const templates = await EmiPlanTemplate.find({})
      .sort({ order: 1 })
      .lean<IEmiPlanTemplate[]>();

    const variantsWithPlans = product.variants.map((variant) => ({
      id: variant._id.toString(),
      variantLabel: variant.variantLabel,
      storage: variant.storage,
      color: variant.color,
      mrp: variant.mrp,
      price: variant.price,
      image: variant.image,
      images:
        variant.images.length > 0 ? variant.images : [variant.image],
      emiPlans: computeEmiPlans(variant.price, templates),
    }));

    return NextResponse.json({
      product: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        description: product.description,
        heroImage: product.heroImage,
        finishes: product.finishes,
        variants: variantsWithPlans,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
