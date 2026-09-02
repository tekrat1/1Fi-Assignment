import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { computeEmiPlans } from "@/lib/emi";
import EmiPlanTemplate, { type IEmiPlanTemplate } from "@/models/EmiPlanTemplate";
import Product, { type IProduct, type IVariant } from "@/models/Product";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductRouteVariant = Pick<
  IVariant,
  "variantLabel" | "storage" | "color" | "mrp" | "price" | "image" | "images"
> & { _id: Types.ObjectId };

type ProductRouteData = Pick<
  IProduct,
  "name" | "slug" | "brand" | "category" | "description" | "heroImage" | "finishes"
> & { variants: ProductRouteVariant[] };

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const product = await Product.findOne({ slug: params.slug })
      .lean<ProductRouteData | null>();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const planTemplates = await EmiPlanTemplate.find({})
      .sort({ order: 1 })
      .select("tenureMonths interestRate cashback")
      .lean<IEmiPlanTemplate[]>();

    const variants = product.variants.map((variant: ProductRouteVariant) => {
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

    return NextResponse.json({
      product: {
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        category: product.category,
        description: product.description,
        heroImage: product.heroImage,
        finishes: product.finishes,
        variants,
      },
    });
  } catch (error) {
    console.error(`GET /api/products/${params.slug} failed:`, error);
    return NextResponse.json(
      { error: "Unable to load product" },
      { status: 500 }
    );
  }
}
