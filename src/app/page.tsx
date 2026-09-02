import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Product, { type IProduct, type IVariant } from "@/models/Product";
import type { ProductSummary } from "@/types/product";

type ProductSummaryDocument = Pick<
  IProduct,
  "slug" | "name" | "brand" | "category" | "heroImage" | "variants"
>;

async function getProducts(): Promise<ProductSummary[]> {
  try {
    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: 1 })
      .select("slug name brand category heroImage variants.price")
      .lean<ProductSummaryDocument[]>();

    return products.map((product) => {
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
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    return [];
  }
}

export const dynamic = "force-dynamic";

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <div className="max-w-xl mb-14">
        <h1 className="font-display text-4xl leading-tight text-ink">
          Own it today. Pay it off in pieces.
        </h1>
        <p className="mt-4 text-ink/70 leading-relaxed">
          Every phone here comes with EMI plans funded through mutual fund
          investments — pick a tenure, see your monthly number upfront, no
          surprises.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="border border-line rounded-lg p-8 text-center text-ink/60">
          No products yet. Run <code className="text-clay">npm run seed</code> to
          populate the database.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group border border-line rounded-lg overflow-hidden bg-white hover:border-ink/30 transition-colors"
            >
              <div className="aspect-square bg-[#F1EFE8] relative">
                <Image
                  src={p.heroImage}
                  alt={p.name}
                  fill
                  className="object-contain p-5"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-ink/40">
                  {p.brand}
                </p>
                <h2 className="font-display text-lg mt-1 text-ink">{p.name}</h2>
                <p className="text-sm text-ink/60 mt-1">
                  {p.variantCount} variant{p.variantCount > 1 ? "s" : ""} · from{" "}
                  {formatINR(p.startingPrice)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
