import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // SỬ DỤNG AWAITED PARAMS THEO QUY TẮC NEXT.JS 16
    const { code } = await params
    const orderCode = code?.trim()

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: 'Thiếu mã đơn hàng' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // 1. Tìm đơn hàng theo mã đơn
    const { data: order, error } = await supabase
      .from('don_hang')
      .select('*')
      .eq('ma_don_hang', orderCode)
      .single()

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy đơn hàng: ${orderCode}` },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (err: any) {
    console.error(`❌ API Lookup order error:`, err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
