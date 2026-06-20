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
    const { gia_den, gia_sua, la_mon_noi_bat, hien_thi, ton_kho } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Thiếu ID hoặc Slug sản phẩm' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const identifier = id.trim()
    const field = isUUID(identifier) ? 'id' : 'slug'

    // 1. Cập nhật bảng san_pham_do_uong
    const updatePayload: any = {}
    if (gia_den !== undefined) updatePayload.gia_den = Number(gia_den || 0)
    if (gia_sua !== undefined) updatePayload.gia_sua = Number(gia_sua || 0)
    if (la_mon_noi_bat !== undefined) updatePayload.la_noi_bat = la_mon_noi_bat === true
    if (hien_thi !== undefined) updatePayload.hien_thi = hien_thi === true
    if (ton_kho !== undefined) updatePayload.ton_kho = Number(ton_kho || 0)

    const { data: updatedDrink, error: updateDrinkErr } = await supabase
      .from('san_pham_do_uong')
      .update(updatePayload)
      .eq(field, identifier)
      .select()

    if (updateDrinkErr) {
      console.warn("⚠️ Warning updating san_pham_do_uong in PATCH:", updateDrinkErr.message)
    }

    // 2. Lấy metadata cũ để đồng bộ bảng products
    const { data: product } = await supabase
      .from('products')
      .select('metadata')
      .eq(field, identifier)
      .maybeSingle()

    const updatedMetadata = {
      ...(product?.metadata || {}),
      gia_den: Number(gia_den !== undefined ? gia_den : (product?.metadata?.gia_den || 0)),
      gia_sua: Number(gia_sua !== undefined ? gia_sua : (product?.metadata?.gia_sua || 0)),
      la_mon_noi_bat: la_mon_noi_bat !== undefined ? Boolean(la_mon_noi_bat) : Boolean(product?.metadata?.la_mon_noi_bat)
    }

    // 3. Cập nhật bảng products để đồng bộ
    const productPayload: any = {
      metadata: updatedMetadata
    }
    if (gia_den !== undefined) productPayload.price = Number(gia_den || 0)
    if (hien_thi !== undefined) productPayload.status = hien_thi ? 'active' : 'inactive'
    if (ton_kho !== undefined) productPayload.ton_kho = Number(ton_kho || 0)

    const { data: updatedProduct, error: updateErr } = await supabase
      .from('products')
      .update(productPayload)
      .eq(field, identifier)
      .select()
      .single()

    if (updateErr) {
      console.warn("⚠️ Warning updating products table in PATCH:", updateErr.message)
    }

    return NextResponse.json({
      success: true,
      data: updatedDrink?.[0] || updatedProduct || null
    })
  } catch (err: any) {
    console.error("Error patching /api/do-uong:", err)
    return NextResponse.json({ success: false, error: err.message || 'Lỗi hệ thống' }, { status: 500 })
  }
}
