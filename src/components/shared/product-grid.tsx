import React from 'react'
import { ProductCard } from './product-card'

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  avg_rating?: number | null;
  review_count?: number | null;
  stock_quantity?: number | null;
  product_images?: { url: string; is_primary: boolean }[] | null;
}

interface ProductGridProps {
  products: ProductData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-500 dark:text-zinc-400">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((prod) => {
        // Find primary image or fallback to first image or placeholders
        const primaryImage = prod.product_images?.find((img) => img.is_primary)?.url
          || prod.product_images?.[0]?.url
          || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';

        return (
          <ProductCard
            key={prod.id}
            id={prod.id}
            name={prod.name}
            slug={prod.slug}
            price={Number(prod.price)}
            compareAtPrice={prod.compare_at_price ? Number(prod.compare_at_price) : null}
            imageUrl={primaryImage}
            avgRating={Number(prod.avg_rating || 0)}
            reviewCount={Number(prod.review_count || 0)}
            stockQuantity={Number(prod.stock_quantity || 0)}
          />
        );
      })}
    </div>
  );
}
