import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product, { type IProduct, type IVariant } from "@/models/Product";
import type { ProductSummary } from "@/types/product";

type ProductSummaryDocument = Pick<
  IProduct,
  "slug" | "name" | "brand" | "category" | "heroImage" | "variants"
>;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: 1 })
      .select("slug name brand category heroImage variants.price")
      .lean<ProductSummaryDocument[]>();

    const summaries: ProductSummary[] = products.map(
      (product: ProductSummaryDocument) => {
        const prices = product.variants.map(
          (variant: Pick<IVariant, "price">) => variant.price
        );

        return {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          category: product.category,
          heroImage: product.heroImage,
          variantCount: product.variants.length,
          startingPrice: Math.min(...prices),
        };
      }
    );

    return NextResponse.json({ products: summaries });
  } catch (error) {
    console.error("GET /api/products failed:", error);
    return NextResponse.json(
      { error: "Unable to load products" },
      { status: 500 }
    );
  }
}
