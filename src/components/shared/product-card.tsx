'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { RatingStars } from './rating-stars'
import { useCartStore } from '@/features/cart/cart-store'

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl: string;
  avgRating: number;
  reviewCount: number;
  stockQuantity: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  imageUrl,
  avgRating,
  reviewCount,
  stockQuantity
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  // Calculate discount percentage
  const discountPercent = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id,
      name,
      slug,
      price,
      imageUrl,
      stockQuantity
    }, 1)
  }

  return (
    <div className="group flex flex-col bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-900 shadow-sm hover:shadow-md transition-all duration-300 relative h-full">
      {/* Product Image */}
      <Link href={`/products/${slug}`} className="relative w-full aspect-square block bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-w-7xl) 25vw, (max-w-md) 50vw, 100vw"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500 text-white shadow-sm">
            Giảm {discountPercent}%
          </span>
        )}

        {/* Stock Status Badge */}
        {stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-xs">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900/90 text-xs font-bold text-white uppercase tracking-wider">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <RatingStars rating={avgRating} reviewCount={reviewCount} />

          {/* Title */}
          <Link
            href={`/products/${slug}`}
            className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 hover:text-brand-primary transition-colors line-clamp-2 leading-snug block min-h-[40px]"
          >
            {name}
          </Link>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col">
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through">
                {formatCurrency(compareAtPrice)}
              </span>
            )}
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(price)}
            </span>
          </div>

          {stockQuantity > 0 ? (
            <button
              onClick={handleAddToCart}
              className="p-2.5 rounded-xl bg-zinc-100 hover:bg-brand-primary hover:text-white text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-brand-primary dark:hover:text-white transition-all shadow-xs hover:shadow-md cursor-pointer"
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase">
              Hết hàng
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
