'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/features/cart/cart-store'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on ESC keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black"
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full max-w-md h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-semibold">Giỏ hàng của bạn</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-primary/10 text-brand-primary">
                  {getTotalItems()}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900">
                    <ShoppingBag className="w-12 h-12 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Giỏ hàng trống</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Hãy khám phá các sản phẩm công nghệ đỉnh cao và thêm chúng vào giỏ hàng của bạn.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md hover:shadow-lg"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-900 last:border-b-0 last:pb-0">
                    {/* Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Meta */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={onClose}
                          className="font-medium text-sm text-zinc-950 dark:text-zinc-50 hover:text-brand-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold mt-0.5 text-zinc-800 dark:text-zinc-200">
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controller & Delete */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-white"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {items.length > 0 && (
              <div className="p-6 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50">
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-zinc-500">
                    <span>Vận chuyển</span>
                    <span className="text-emerald-500 font-medium">Miễn phí</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-1.5 border-t border-zinc-200/50 dark:border-zinc-800/50">
                    <span>Tổng cộng</span>
                    <span className="text-brand-primary">{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition-all shadow-md hover:shadow-lg text-center"
                  >
                    Tiến hành thanh toán
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="py-3 w-full rounded-xl font-semibold border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-center text-sm"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
