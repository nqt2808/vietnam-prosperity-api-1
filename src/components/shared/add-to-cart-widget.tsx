'use client'

import React, { useState } from 'react'
import { Plus, Minus, ShoppingCart, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/features/cart/cart-store'

interface AddToCartWidgetProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    stockQuantity: number;
  };
}

export function AddToCartWidget({ product }: AddToCartWidgetProps) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity((q) => q + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1)
    }
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
      stockQuantity: product.stockQuantity
    }, quantity)
  }

  const isOutOfStock = product.stockQuantity === 0

  return (
    <div className="space-y-6">
      {/* Stock quantity indicators */}
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : 'bg-emerald-500'}`} />
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          {isOutOfStock ? 'Hết hàng' : `Còn hàng (còn ${product.stockQuantity} sản phẩm)`}
        </span>
      </div>

      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          {/* Quantity Controls */}
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1 self-start sm:self-auto">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stockQuantity}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            Thêm vào giỏ hàng
          </button>
        </div>
      )}

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex gap-2 items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          <span>Bảo hành chính hãng 12 tháng</span>
        </div>
        <div className="flex gap-2 items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
          <span>Giao hàng miễn phí toàn quốc</span>
        </div>
      </div>
    </div>
  )
}
