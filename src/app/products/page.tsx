import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGrid } from '@/components/shared/product-grid'
import { SlidersHorizontal, Search, RotateCcw, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const activeCategory = params.category || ''
  const searchQuery = params.search || ''
  const activeSort = params.sort || 'newest'

  let products = []
  let categories = []
  let loadError = false

  try {
    const supabase = await createClient()

    // 1. Fetch all categories for sidebar filter
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (catError) throw catError
    categories = catData || []

    // 2. Build products query
    let query = supabase
      .from('products')
      .select('*, product_images(url, is_primary)')
      .eq('status', 'active')

    // Filter by Category
    if (activeCategory) {
      // Find category ID by slug first
      const categoryObj = categories.find(c => c.slug === activeCategory)
      if (categoryObj) {
        query = query.eq('category_id', categoryObj.id)
      }
    }

    // Filter by Search Query
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    // Apply Sorting
    if (activeSort === 'price_asc') {
      query = query.order('price', { ascending: true })
    } else if (activeSort === 'price_desc') {
      query = query.order('price', { ascending: false })
    } else if (activeSort === 'rating_desc') {
      query = query.order('avg_rating', { ascending: false })
    } else {
      // default newest
      query = query.order('created_at', { ascending: false })
    }

    const { data: prodData, error: prodError } = await query

    if (prodError) throw prodError
    products = prodData || []
  } catch (err) {
    console.error("Error loading products list page:", err)
    loadError = true
  }

  // Create helper URLs to manage search params in server rendering without complex client routing
  const getFilterUrl = (filters: Partial<SearchParams>) => {
    const nextParams = new URLSearchParams()
    
    // Maintain category
    const cat = filters.category !== undefined ? filters.category : activeCategory
    if (cat) nextParams.set('category', cat)
    
    // Maintain search
    const search = filters.search !== undefined ? filters.search : searchQuery
    if (search) nextParams.set('search', search)
    
    // Maintain sort
    const sort = filters.sort !== undefined ? filters.sort : activeSort
    if (sort) nextParams.set('sort', sort)

    return `/products?${nextParams.toString()}`
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-8 flex-1 flex flex-col">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Cửa Hàng VPC</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Khám phá bộ sưu tập thiết bị phong cách sống và không gian làm việc công nghệ cao cấp nhất.
        </p>
      </div>

      {/* Filter and Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        {/* Sidebar Filters (Desktop) */}
        <aside className="lg:col-span-3 space-y-6 hidden lg:block">
          <div className="p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
              <h3 className="font-bold text-sm uppercase tracking-wider">Bộ lọc tìm kiếm</h3>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Danh mục sản phẩm</span>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={getFilterUrl({ category: '' })}
                  className={cn(
                    "text-sm px-3 py-2 rounded-xl transition-all font-medium flex justify-between items-center",
                    !activeCategory
                      ? "bg-brand-primary/10 text-brand-primary font-bold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                  )}
                >
                  Tất cả sản phẩm
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={getFilterUrl({ category: cat.slug })}
                    className={cn(
                      "text-sm px-3 py-2 rounded-xl transition-all font-medium flex justify-between items-center",
                      activeCategory === cat.slug
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort Filter */}
            <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block">Sắp xếp theo</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: 'newest', label: 'Mới nhất' },
                  { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
                  { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
                  { value: 'rating_desc', label: 'Đánh giá cao nhất' }
                ].map((sortOption) => (
                  <Link
                    key={sortOption.value}
                    href={getFilterUrl({ sort: sortOption.value })}
                    className={cn(
                      "text-sm px-3 py-2 rounded-xl transition-all font-medium",
                      activeSort === sortOption.value
                        ? "bg-brand-primary/10 text-brand-primary font-bold"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white"
                    )}
                  >
                    {sortOption.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {(activeCategory || searchQuery || activeSort !== 'newest') && (
              <Link
                href="/products"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Xóa tất cả bộ lọc
              </Link>
            )}
          </div>
        </aside>

        {/* Products Column */}
        <div className="lg:col-span-9 space-y-6 flex-1 flex flex-col">
          {/* Top Control Bar (Search & Mobile Filter Buttons) */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
            {/* Search Input Form */}
            <form action="/products" method="GET" className="relative w-full sm:max-w-xs">
              {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
              {activeSort !== 'newest' && <input type="hidden" name="sort" value={activeSort} />}
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Tìm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 focus:outline-hidden focus:border-brand-primary bg-zinc-50 dark:bg-zinc-900/50"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Mobile Category Tabs (Horizontal Scrollable) */}
            <div className="flex lg:hidden gap-1.5 w-full overflow-x-auto pb-1 max-w-full">
              <Link
                href={getFilterUrl({ category: '' })}
                className={cn(
                  "text-xs px-3.5 py-2 rounded-full font-semibold shrink-0 transition-colors border",
                  !activeCategory
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                )}
              >
                Tất cả
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={getFilterUrl({ category: cat.slug })}
                  className={cn(
                    "text-xs px-3.5 py-2 rounded-full font-semibold shrink-0 transition-colors border",
                    activeCategory === cat.slug
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Product count indicator */}
            <span className="text-xs text-zinc-500 font-semibold shrink-0">
              Hiển thị {products.length} sản phẩm
            </span>
          </div>

          {/* Grid Render */}
          {loadError ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-900">
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Không thể tải sản phẩm từ máy chủ. Vui lòng tải lại trang sau ít phút.
              </p>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  )
}
