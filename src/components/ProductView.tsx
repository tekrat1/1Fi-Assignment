"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface EmiPlan {
  tenureMonths: number;
  interestRate: number;
  cashback: number;
  monthlyAmount: number;
  totalPayable: number;
}

interface Variant {
  id: string;
  variantLabel: string;
  storage?: string;
  color?: string;
  mrp: number;
  price: number;
  image: string;
  images: string[];
  emiPlans: EmiPlan[];
}

interface Product {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  heroImage: string;
  finishes: string[];
  variants: Variant[];
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function swatchColor(name: string): string {
  const known: Record<string, string> = {
    silver: "#E4E4E4",
    "titanium silver": "#E4E4E4",
    black: "#1C1C1E",
    "titanium black": "#3A3A3C",
    gray: "#8E8E93",
    grey: "#8E8E93",
    "titanium gray": "#7A7A7E",
    "titanium grey": "#7A7A7E",
    orange: "#D9722B",
    "cosmic orange": "#F47B31",
    blue: "#3E4C63",
    "deep blue": "#2D3B52",
    violet: "#8A7CA8",
    "titanium violet": "#8A7CA8",
    white: "#F5F5F0",
    gold: "#D9C08A",
    green: "#4A5C4A",
    "midnight ocean": "#1F3B4D",
    "arctic dawn": "#D8DCE0",
  };
  const key = name.trim().toLowerCase();
  if (known[key]) return known[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = key.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 25%, 55%)`;
}

function getGalleryImages(variant: Variant): string[] {
  const images = Array.isArray(variant.images) && variant.images.length > 0
    ? variant.images
    : [variant.image];
  return Array.from(new Set(images.filter(Boolean)));
}

export default function ProductView({ product }: { product: Product }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [planIndex, setPlanIndex] = useState(0);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const variant = product.variants[variantIndex];
  const plan = variant.emiPlans[planIndex];
  const galleryImages = useMemo(() => getGalleryImages(variant), [variant]);
  const activeImage = galleryImages[Math.min(selectedImage, galleryImages.length - 1)];
  const discountPct = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

  function handleVariantChange(i: number) {
    setVariantIndex(i);
    setPlanIndex(0);
    setSelectedImage(0);
    setConfirmed(null);
  }

  function handleProceed() {
    setConfirmed(
      `${variant.variantLabel} · ${plan.tenureMonths} months · ${formatINR(
        plan.monthlyAmount
      )}/mo selected. This is a demo — no real checkout happens.`
    );
  }

  const selectedColor = variant.color || product.finishes[0] || "Silver";
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <p className="text-sm text-ink/50 mb-6">
        <a href="/" className="hover:text-ink">All products</a>{" "}/ {product.name}
      </p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Left: exact product gallery treatment from the reference */}
        <div>
          <div className="flex gap-4">
            <div className="w-[82px] shrink-0 space-y-4">
              {galleryImages.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  aria-label={`View product image ${i + 1}`}
                  className={`relative h-[82px] w-[82px] rounded-xl bg-white overflow-hidden transition-all ${
                    i === selectedImage
                      ? "border-2 border-[#ff5a00]"
                      : "border border-[#cfd8e3] hover:border-[#9aa7b8]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${selectedColor} image ${i + 1}`}
                    fill
                    className="object-contain p-2"
                    sizes="82px"
                    unoptimized
                  />
                </button>
              ))}
            </div>

            <div className="relative flex-1 h-[570px] bg-white rounded-xl overflow-hidden">
              <Image
                src={activeImage}
                alt={`${product.name} ${selectedColor}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 80vw, 40vw"
                priority
                unoptimized
              />
              <span className="absolute right-2 bottom-2 rounded bg-white/90 px-2 py-1 text-xs font-semibold text-ink shadow-sm">
                4.2 ⭐
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-color" className="block text-sm font-semibold text-ink mb-2">
                Color
              </label>
              <select
                id="product-color"
                value={selectedColor}
                onChange={(e) => {
                  const idx = product.variants.findIndex((v) => v.color === e.target.value);
                  if (idx !== -1) handleVariantChange(idx);
                }}
                className="w-full h-14 rounded-lg border border-[#d4dbe5] bg-white px-4 text-base text-ink outline-none focus:border-[#ff5a00]"
              >
                {product.finishes.map((finish) => (
                  <option key={finish} value={finish}>{finish}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="product-variant" className="block text-sm font-semibold text-ink mb-2">
                Variant
              </label>
              <select
                id="product-variant"
                value={variant.id}
                onChange={(e) => {
                  const idx = product.variants.findIndex((v) => v.id === e.target.value);
                  if (idx !== -1) handleVariantChange(idx);
                }}
                className="w-full h-14 rounded-lg border border-[#d4dbe5] bg-white px-4 text-base text-ink outline-none focus:border-[#ff5a00]"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.variantLabel}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: existing details kept intact */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-clay font-semibold bg-clay/10 px-2 py-0.5 rounded">New</span>
            <p className="text-xs uppercase tracking-wide text-ink/50 font-medium">{product.brand}</p>
          </div>
          <h1 className="font-display text-3xl mt-2 text-ink">{product.name}</h1>
          {variant.storage && <p className="text-sm text-ink/50 mt-0.5">{variant.storage}</p>}

          <div className="mt-6">
            <p className="text-sm text-ink/60 mb-2">Choose {variant.storage ? "storage" : "variant"}</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => handleVariantChange(i)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    i === variantIndex ? "border-ink bg-ink text-paper" : "border-line text-ink/70 hover:border-ink/40"
                  }`}
                >
                  {v.variantLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl text-ink">{formatINR(variant.price)}</span>
            {variant.mrp > variant.price && (
              <>
                <span className="text-ink/40 line-through text-lg">{formatINR(variant.mrp)}</span>
                <span className="text-moss text-sm font-medium">{discountPct}% off</span>
              </>
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium text-ink mb-3">EMI plans backed by mutual funds</p>
            <div className="space-y-2">
              {variant.emiPlans.map((p, i) => (
                <label
                  key={p.tenureMonths}
                  className={`flex items-center justify-between gap-4 border rounded-md px-4 py-3 cursor-pointer transition-colors ${
                    i === planIndex ? "border-ink bg-ink/[0.03]" : "border-line hover:border-ink/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="emi-plan"
                      checked={i === planIndex}
                      onChange={() => { setPlanIndex(i); setConfirmed(null); }}
                      className="accent-ink"
                    />
                    <div>
                      <p className="text-sm text-ink">{formatINR(p.monthlyAmount)} x {p.tenureMonths} months</p>
                      {p.cashback > 0 && <p className="text-xs text-moss mt-0.5">Additional cashback of {formatINR(p.cashback)}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-ink/50 whitespace-nowrap">
                    {p.interestRate > 0 ? `${p.interestRate}% interest` : "0% interest"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleProceed} className="mt-8 w-full sm:w-auto px-8 py-3 bg-clay text-paper rounded-md font-medium hover:bg-clay/90 transition-colors">
            Buy on {plan.tenureMonths} months EMI
          </button>

          {confirmed && <p className="mt-3 text-sm text-moss">{confirmed}</p>}
          {product.description && <p className="mt-8 text-sm text-ink/60 leading-relaxed">{product.description}</p>}
        </div>
      </div>
    </div>
  );
}
