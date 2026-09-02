"use client";

import { useState } from "react";
import EmiPlanList from "@/components/EmiPlanList";
import ProductGallery from "@/components/ProductGallery";
import VariantSelectors from "@/components/VariantSelectors";
import { formatINR } from "@/lib/format";
import type { ProductDetails } from "@/types/product";

function getDiscountPercentage(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export default function ProductView({ product }: { product: ProductDetails }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [planIndex, setPlanIndex] = useState(0);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const variant = product.variants[variantIndex];
  const plan = variant.emiPlans[planIndex];
  const selectedColor = variant.color || product.finishes[0] || "";
  const discountPercentage = getDiscountPercentage(variant.mrp, variant.price);

  function selectVariant(index: number) {
    setVariantIndex(index);
    setPlanIndex(0);
    setConfirmation(null);
  }

  function selectPlan(index: number) {
    setPlanIndex(index);
    setConfirmation(null);
  }

  function handleProceed() {
    setConfirmation(
      `${variant.variantLabel} · ${plan.tenureMonths} months · ${formatINR(
        plan.monthlyAmount
      )}/mo selected. This is a demo — no real checkout happens.`
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="text-sm text-ink/50 mb-6">
        <a href="/" className="hover:text-ink">
          All products
        </a>{" "}/ {product.name}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <ProductGallery
            productName={product.name}
            color={selectedColor}
            variant={variant}
          />
          <VariantSelectors
            variants={product.variants}
            finishes={product.finishes}
            selectedVariantId={variant.id}
            selectedColor={selectedColor}
            onVariantChange={selectVariant}
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-clay font-semibold bg-clay/10 px-2 py-0.5 rounded">
              New
            </span>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">
              {product.brand}
            </p>
          </div>

          <h1 className="font-display text-3xl mt-2 text-ink">{product.name}</h1>
          {variant.storage && (
            <p className="text-sm text-ink/50 mt-0.5">{variant.storage}</p>
          )}

          <div className="mt-6">
            <p className="text-sm text-ink/60 mb-3">
              Choose {variant.storage ? "storage" : "variant"}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectVariant(index)}
                  aria-pressed={index === variantIndex}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    index === variantIndex
                      ? "border-ink bg-ink text-paper"
                      : "border-line text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {item.variantLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">
              {formatINR(variant.price)}
            </span>
            {variant.mrp > variant.price && (
              <>
                <span className="text-ink/40 line-through text-lg">
                  {formatINR(variant.mrp)}
                </span>
                <span className="text-moss text-sm font-medium">
                  {discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-ink mb-3">
              EMI plans backed by mutual funds
            </p>
            <EmiPlanList
              plans={variant.emiPlans}
              selectedIndex={planIndex}
              onSelect={selectPlan}
            />
          </div>

          <button
            type="button"
            onClick={handleProceed}
            className="mt-8 w-full sm:w-auto px-8 py-3 bg-clay text-paper rounded-md font-medium hover:bg-clay/90 transition-colors"
          >
            Buy on {plan.tenureMonths} months EMI
          </button>

          {confirmation && (
            <p className="mt-3 text-sm text-moss" role="status">
              {confirmation}
            </p>
          )}

          {product.description && (
            <p className="mt-8 text-sm text-ink/60 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
