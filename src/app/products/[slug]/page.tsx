import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ImageGallery } from '@/components/shared/image-gallery'
import { AddToCartWidget } from '@/components/shared/add-to-cart-widget'
import { RatingStars } from '@/components/shared/rating-stars'
import { ProductGrid } from '@/components/shared/product-grid'
import { formatCurrency } from '@/lib/utils'
import { ArrowLeft, ChevronRight, Cpu } from 'lucide-react'

export const revalidate = 60 // Revalidate cache every 60 seconds

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  let product = null
  let relatedProducts = []

  try {
    const supabase = await createClient()

    // 1. Fetch exact product details
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .select('*, categories(*), product_images(*)')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (prodError) throw prodError
    if (!prodData) notFound()

    product = prodData

    // 2. Fetch related products in the same category
    if (product.category_id) {
      const { data: relData, error: relError } = await supabase
        .from('products')
        .select('*, product_images(url, is_primary)')
        .eq('category_id', product.category_id)
        .eq('status', 'active')
        .neq('id', product.id)
        .limit(4)

      if (!relError) {
        relatedProducts = relData || []
      }
    }
  } catch (err) {
    console.error("Error loading product detail page:", err)
    notFound()
  }

  // Find primary image or fallback for the AddToCart widget metadata
  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url
    || product.product_images?.[0]?.url
    || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';

  // Extract specs from JSONB metadata
  const specs = product.metadata?.spec ? String(product.metadata.spec).split(',') : []

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
      {/* 1. BREADCRUMBS & BACK LINK */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-brand-primary transition-colors">Cửa hàng</Link>
          {product.categories && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/products?category=${product.categories.slug}`}
                className="hover:text-brand-primary transition-colors"
              >
                {product.categories.name}
              </Link>
            </>
          )}
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-brand-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại cửa hàng
        </Link>
      </div>

      {/* 2. PRODUCT DETAILS SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left column: Image Gallery */}
        <div className="lg:col-span-6 w-full">
          <ImageGallery images={product.product_images || []} productName={product.name} />
        </div>

        {/* Right column: Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            {/* Category tag */}
            {product.categories && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                {product.categories.name}
              </span>
            )}
            
            {/* Title */}
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings & reviews count */}
            <RatingStars rating={product.avg_rating || 0} reviewCount={product.review_count || 0} className="text-sm" />
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex items-baseline gap-4 shadow-xs">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {formatCurrency(product.price)}
            </span>
            {product.compare_at_price && Number(product.compare_at_price) > Number(product.price) && (
              <span className="text-sm text-zinc-400 line-through">
                {formatCurrency(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Short description */}
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            {product.short_description}
          </p>

          {/* Specifications list (from metadata) */}
          {specs.length > 0 && (
            <div className="space-y-2 p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Thông số kỹ thuật:</span>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                {specs.map((specItem, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                    <span className="text-brand-primary font-bold shrink-0 mt-0.5">•</span>
                    <span>{specItem.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart Widget */}
          <AddToCartWidget
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              imageUrl: primaryImage,
              stockQuantity: Number(product.ton_kho || 0)
            }}
          />
        </div>
      </section>

      {/* 3. PRODUCT DESCRIPTION */}
      <section className="space-y-6 pt-12 border-t border-zinc-200/60 dark:border-zinc-900">
        <h2 className="text-xl font-bold tracking-tight">Chi tiết sản phẩm</h2>
        <div className="p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950/30">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      </section>

      {/* 4. RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-zinc-200/60 dark:border-zinc-900">
          <h2 className="text-xl font-bold tracking-tight">Sản phẩm liên quan</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const supabase = await createClient()
    const { data: product } = await supabase
      .from('products')
      .select('name, short_description')
      .eq('slug', slug)
      .maybeSingle()

    if (!product) return {}

    return {
      title: `${product.name} - VPC Store`,
      description: product.short_description,
    }
  } catch {
    return {}
  }
}
