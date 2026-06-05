import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Lấy tất cả danh mục
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug, name')

    if (catError) {
      throw catError
    }

    const MERCH_SLUGS = [
      'merchandise', 
      'vat-pham', 
      'ca-phe-hat', 
      'ca-phe-drip', 
      'ca-phe-phin', 
      'ca-phe-bot-sang-tao', 
      'ca-phe-bot-phin', 
      'ca-phe-hoa-tan', 
      'ca-phe-hoa-tan-g7', 
      'ca-phe-legend', 
      'dung-cu-pha-che', 
      'ly-tach-binh-giu-nhiet', 
      'phu-kien-thuong-hieu', 
      'bo-qua-tang', 
      'vat-pham-thuong-hieu'
    ];

    // Lọc ra danh sách ID của các danh mục vật phẩm
    const merchCatIds = categories
      ?.filter(c => MERCH_SLUGS.includes(c.slug))
      .map(c => c.id) || [];

    if (merchCatIds.length === 0) {
      return NextResponse.json([])
    }

    // 2. Lấy tất cả sản phẩm thuộc danh mục vật phẩm
    const { data: rawProducts, error: prodError } = await supabase
      .from('products')
      .select('*, categories (slug, name)')
      .in('category_id', merchCatIds)
      .eq('status', 'active')

    if (prodError) {
      throw prodError
    }

    // 3. Map dữ liệu để tương thích với cấu trúc của frontend
    const items = (rawProducts || []).map(p => ({
      id: p.id,
      ten_san_pham: p.name,
      slug: p.slug,
      mo_ta: p.short_description || p.description || "",
      gia: p.price || 0,
      slug_danh_muc: p.categories?.slug || "",
      ten_danh_muc: p.categories?.name || "",
      hinh_anh: p.metadata?.hinh_anh || p.image_url || "",
      hien_thi: p.status === 'active',
      stock_quantity: p.stock_quantity !== undefined ? p.stock_quantity : 99,
      con_ban: p.stock_quantity > 0
    }))

    return NextResponse.json(items)
  } catch (err: any) {
    console.error("Error in /api/vat-pham endpoint:", err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải sản phẩm vật phẩm' }, { status: 500 })
  }
}
