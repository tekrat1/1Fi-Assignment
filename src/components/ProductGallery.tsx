"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductVariant } from "@/types/product";

interface ProductGalleryProps {
  productName: string;
  color: string;
  variant: ProductVariant;
}

export default function ProductGallery({
  productName,
  color,
  variant,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = Array.from(new Set([variant.image, ...variant.images].filter(Boolean)));

  useEffect(() => {
    setSelectedImage(0);
  }, [variant.id]);

  const activeImage = images[selectedImage] ?? variant.image;

  return (
    <div>
      <div className="flex gap-4">
        <div className="w-[82px] shrink-0 space-y-4">
          {images.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setSelectedImage(index)}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={index === selectedImage}
              className={`relative h-[82px] w-[82px] rounded-xl bg-white overflow-hidden transition-all ${
                index === selectedImage
                  ? "border-2 border-[#ff5a00]"
                  : "border border-[#cfd8e3] hover:border-[#9aa7b8]"
              }`}
            >
              <Image
                src={src}
                alt={`${productName} ${color} view ${index + 1}`}
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
            alt={`${productName} ${color}`}
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
    </div>
  );
}
