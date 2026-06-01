'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
  images: { url: string; is_primary: boolean }[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return 0;
  });

  const [activeIndex, setActiveIndex] = useState(0)

  if (sortedImages.length === 0) {
    return (
      <div className="relative w-full aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
        <span className="text-sm text-zinc-400">Không có hình ảnh</span>
      </div>
    );
  }

  const currentImage = sortedImages[activeIndex]?.url

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative w-full aspect-square bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-900 rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={currentImage}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-w-7xl) 50vw, 90vw"
          priority
        />
      </div>

      {/* Thumbnails list */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {sortedImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border transition-all cursor-pointer",
                activeIndex === idx
                  ? "border-brand-primary ring-2 ring-brand-primary/20 scale-95"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
