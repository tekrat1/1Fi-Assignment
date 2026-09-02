import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { getProductSummaries } from "@/lib/products";
import type { ProductSummary } from "@/types/product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: ProductSummary[] = [];

  try {
    products = await getProductSummaries();
  } catch (error) {
    console.error("Failed to load products:", error);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <header className="max-w-xl mb-14">
        <h1 className="font-display text-4xl leading-tight text-ink">
          Own it today. Pay it off in pieces.
        </h1>
        <p className="mt-4 text-ink/70 leading-relaxed">
          Every phone here comes with EMI plans funded through mutual fund
          investments — pick a tenure, see your monthly number upfront, no
          surprises.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="border border-line rounded-lg p-8 text-center text-ink/60">
          No products available right now. Please check the database connection.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group border border-line rounded-lg overflow-hidden bg-white hover:border-ink/30 transition-colors"
            >
              <div className="aspect-square bg-[#F1EFE8] relative">
                <Image
                  src={product.heroImage}
                  alt={`${product.name} product image`}
                  fill
                  unoptimized
                  className="object-contain p-5"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-ink/40">
                  {product.brand}
                </p>
                <h2 className="font-display text-lg mt-1 text-ink">
                  {product.name}
                </h2>
                <p className="text-sm text-ink/60 mt-1">
                  {product.variantCount} variant
                  {product.variantCount > 1 ? "s" : ""} · from {formatINR(product.startingPrice)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
