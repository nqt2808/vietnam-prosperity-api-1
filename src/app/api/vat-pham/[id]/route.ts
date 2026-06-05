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
    const { gia, con_ban, hien_thi } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc Slug sản phẩm' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const identifier = id.trim()
    const field = isUUID(identifier) ? 'id' : 'slug'

    // 1. Lấy sản phẩm hiện tại để xem số lượng tồn kho cũ
    const { data: product, error: fetchErr } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq(field, identifier)
      .single()

    if (fetchErr || !product) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy vật phẩm' }, { status: 404 })
    }

    // 2. Tính toán số lượng tồn kho mới
    let newStock = product.stock_quantity || 0
    if (con_ban === false) {
      newStock = 0
    } else if (newStock <= 0) {
      newStock = 99 // Nếu trước đó hết hàng mà giờ đánh dấu còn bán thì mặc định set 99
    }

    // 3. Cập nhật vật phẩm
    const { data: updatedProduct, error: updateErr } = await supabase
      .from('products')
      .update({
        price: Number(gia || 0),
        status: hien_thi ? 'active' : 'inactive',
        stock_quantity: newStock
      })
      .eq(field, identifier)
      .select()
      .single()

    if (updateErr) {
      throw updateErr
    }

    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (err: any) {
    console.error("Error patching /api/vat-pham:", err)
    return NextResponse.json({ success: false, error: err.message || 'Lỗi hệ thống' }, { status: 500 })
  }
}
