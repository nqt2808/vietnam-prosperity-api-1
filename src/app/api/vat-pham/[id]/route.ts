import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function isUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  // Để bao quát hơn cho uuid v4 thông thường:
  const uuidRegexNormal = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegexNormal.test(str) || uuidRegex.test(str);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { gia, ton_kho, con_ban, hien_thi } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc Slug sản phẩm' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const identifier = id.trim()
    const field = isUUID(identifier) ? 'id' : 'slug'

    // 1. Cập nhật bảng san_pham_merchandise (Storefront chính)
    const updatePayload: any = {}
    if (gia !== undefined) updatePayload.gia = Number(gia || 0)
    if (hien_thi !== undefined) updatePayload.hien_thi = hien_thi === true
    
    let targetStock = 10
    if (ton_kho !== undefined) {
      targetStock = Number(ton_kho || 0)
      updatePayload.ton_kho = targetStock
    } else if (con_ban === false) {
      targetStock = 0
      updatePayload.ton_kho = 0
    }

    const { data: updatedMerch, error: updateMerchErr } = await supabase
      .from('san_pham_merchandise')
      .update(updatePayload)
      .eq(field, identifier)
      .select()

    if (updateMerchErr) {
      console.warn("⚠️ Warning updating san_pham_merchandise in PATCH:", updateMerchErr.message)
    }

    // 2. Cập nhật bảng products (Next.js/React side)
    const productPayload: any = {}
    if (gia !== undefined) productPayload.price = Number(gia || 0)
    if (hien_thi !== undefined) productPayload.status = hien_thi ? 'active' : 'inactive'
    if (ton_kho !== undefined || con_ban === false) {
      productPayload.ton_kho = targetStock
    }

    const { data: updatedProduct, error: updateErr } = await supabase
      .from('products')
      .update(productPayload)
      .eq(field, identifier)
      .select()

    if (updateErr) {
      console.warn("⚠️ Warning updating products table in PATCH:", updateErr.message)
    }

    return NextResponse.json({
      success: true,
      data: updatedMerch?.[0] || updatedProduct?.[0] || null
    })
  } catch (err: any) {
    console.error("❌ Error patching /api/vat-pham:", err)
    return NextResponse.json({ success: false, error: err.message || 'Lỗi hệ thống' }, { status: 500 })
  }
}
