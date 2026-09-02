"use client";

import type { ProductVariant } from "@/types/product";

interface VariantSelectorsProps {
  variants: ProductVariant[];
  finishes: string[];
  selectedVariantId: string;
  selectedColor: string;
  onVariantChange: (index: number) => void;
}

export default function VariantSelectors({
  variants,
  finishes,
  selectedVariantId,
  selectedColor,
  onVariantChange,
}: VariantSelectorsProps) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-4">
      <div>
        <label htmlFor="product-color" className="block text-sm font-semibold text-ink mb-2">
          Color
        </label>
        <select
          id="product-color"
          value={selectedColor}
          onChange={(event) => {
            const index = variants.findIndex(
              (variant) => variant.color === event.target.value
            );
            if (index >= 0) onVariantChange(index);
          }}
          className="w-full h-14 rounded-lg border border-[#d4dbe5] bg-white px-4 text-base text-ink outline-none focus:border-[#ff5a00]"
        >
          {finishes.map((finish) => (
            <option key={finish} value={finish}>
              {finish}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="product-variant" className="block text-sm font-semibold text-ink mb-2">
          Variant
        </label>
        <select
          id="product-variant"
          value={selectedVariantId}
          onChange={(event) => {
            const index = variants.findIndex(
              (variant) => variant.id === event.target.value
            );
            if (index >= 0) onVariantChange(index);
          }}
          className="w-full h-14 rounded-lg border border-[#d4dbe5] bg-white px-4 text-base text-ink outline-none focus:border-[#ff5a00]"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.variantLabel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
