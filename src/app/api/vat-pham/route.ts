import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Find the merchandise category
    const { data: categoryData, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', 'merchandise')
      .single()

    if (catError || !categoryData) {
      console.warn("Merchandise category not found in Supabase")
      return NextResponse.json([])
    }

    // 2. Fetch products under merchandise category
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*, product_images(url)')
      .eq('category_id', categoryData.id)
      .eq('status', 'active')

    if (prodError) {
      throw prodError
    }

    return NextResponse.json(products || [])
  } catch (err: any) {
    console.error("Error in /api/vat-pham endpoint:", err)
    return NextResponse.json({ error: 'Lỗi hệ thống khi tải sản phẩm' }, { status: 500 })
  }
}
