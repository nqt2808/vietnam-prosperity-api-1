import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { gia_den, gia_sua, la_mon_noi_bat, hien_thi } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc Slug sản phẩm' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const identifier = id.trim()
    const field = isUUID(identifier) ? 'id' : 'slug'

    // 1. Tìm sản phẩm hiện tại để lấy metadata cũ
    const { data: product, error: fetchErr } = await supabase
      .from('products')
      .select('metadata')
      .eq(field, identifier)
      .single()

    if (fetchErr || !product) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy sản phẩm' }, { status: 404 })
    }

    // 2. Gộp metadata mới
    const updatedMetadata = {
      ...(product.metadata || {}),
      gia_den: Number(gia_den || 0),
      gia_sua: Number(gia_sua || 0),
      la_mon_noi_bat: Boolean(la_mon_noi_bat)
    }

    // 3. Cập nhật sản phẩm
    const { data: updatedProduct, error: updateErr } = await supabase
      .from('products')
      .update({
        metadata: updatedMetadata,
        price: Number(gia_den || 0), // Đồng bộ price chính bằng gia_den
        status: hien_thi ? 'active' : 'inactive'
      })
      .eq(field, identifier)
      .select()
      .single()

    if (updateErr) {
      throw updateErr
    }

    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (err: any) {
    console.error("Error patching /api/do-uong:", err)
    return NextResponse.json({ success: false, error: err.message || 'Lỗi hệ thống' }, { status: 500 })
  }
}
