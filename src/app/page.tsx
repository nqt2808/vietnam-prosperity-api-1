import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { StorefrontClient } from '@/components/shared/storefront-client'

export const revalidate = 0 // Keep it fully dynamic for checkout/payment SPA views

export default async function Home() {
  let categories: any[] = []
  let products: any[] = []

  try {
    const supabase = await createClient()

    // 1. Truy vấn danh mục từ bảng danh_muc_san_pham
    const { data: catData, error: catError } = await supabase
      .from('danh_muc_san_pham')
      .select('*')
      .eq('hien_thi', true)
      .order('thu_tu_hien_thi', { ascending: true })

    if (!catError && catData) {
      // Ánh xạ các trường dữ liệu tương thích hoàn toàn với storefront-client
      categories = catData.map(c => ({
        id: c.id,
        name: c.ten_danh_muc,
        ten_danh_muc: c.ten_danh_muc,
        slug: c.slug,
        is_active: c.hien_thi,
        sort_order: c.thu_tu_hien_thi
      }))
    } else if (catError) {
      console.error("Error loading categories from danh_muc_san_pham:", catError.message)
    }

    // 2. Truy vấn song song đồ uống (san_pham_do_uong) và vật phẩm (san_pham_merchandise)
    const [drinksResult, merchResult] = await Promise.all([
      supabase
        .from('san_pham_do_uong')
        .select('*')
        .eq('hien_thi', true),
      supabase
        .from('san_pham_merchandise')
        .select('*')
        .eq('hien_thi', true)
    ])

    let productsList: any[] = []

    // 2a. Ánh xạ đồ uống
    if (!drinksResult.error && drinksResult.data) {
      const mappedDrinks = drinksResult.data.map(item => ({
        id: `drink-${item.id}`,
        name: item.ten_san_pham,          // Để tương thích với logic Frontend cũ
        ten_san_pham: item.ten_san_pham,  // Đúng theo cột database mới
        slug: item.slug,
        description: item.mo_ta,
        short_description: item.mo_ta,
        price: item.gia_den || item.gia_sua || 0, // Giá mặc định để tính toán giỏ hàng
        gia_den: item.gia_den,            // Giữ nguyên cột gia_den của quán
        gia_sua: item.gia_sua,            // Giữ nguyên cột gia_sua của quán
        category_id: item.danh_muc_id,
        danh_muc_id: item.danh_muc_id,
        status: 'active',
        hien_thi: item.hien_thi,
        product_images: []
      }))
      productsList = [...productsList, ...mappedDrinks]
    } else if (drinksResult.error) {
      console.error("Error loading drinks from san_pham_do_uong:", drinksResult.error.message)
    }

    // 2b. Ánh xạ vật phẩm/merchandise
    if (!merchResult.error && merchResult.data) {
      const mappedMerch = merchResult.data.map(item => ({
        id: `merch-${item.id}`,
        name: item.ten_san_pham,          // Để tương thích với logic Frontend cũ
        ten_san_pham: item.ten_san_pham,  // Đúng theo cột database mới
        slug: item.slug,
        description: item.mo_ta,
        short_description: item.mo_ta,
        price: item.gia || 0,             // Giá mặc định để tính toán giỏ hàng
        gia: item.gia,                    // Giữ nguyên cột gia của quán
        category_id: item.danh_muc_id,
        danh_muc_id: item.danh_muc_id,
        status: 'active',
        hien_thi: item.hien_thi,
        product_images: []
      }))
      productsList = [...productsList, ...mappedMerch]
    } else if (merchResult.error) {
      console.error("Error loading merchandise from san_pham_merchandise:", merchResult.error.message)
    }

    products = productsList

  } catch (err) {
    console.error("Error loading server-side storefront data:", err)
  }

  return (
    <StorefrontClient categories={categories} products={products} />
  )
}
