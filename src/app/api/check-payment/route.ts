import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET /api/check-payment?order=VPC-DH-20260601-123456
 * 
 * Kiểm tra trạng thái thanh toán của đơn hàng.
 * Được gọi bởi trang payment để polling tự động.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderCode = searchParams.get('order')?.trim()

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: 'Thiếu mã đơn hàng' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // 1. Tìm đơn hàng theo mã
    const { data: order, error } = await supabase
      .from('don_hang')
      .select('ma_don_hang, trang_thai, tong_tien, phuong_thuc_thanh_toan, ghi_chu')
      .eq('ma_don_hang', orderCode)
      .single()

    if (error || !order) {
      // Thử tìm trong bảng orders cũ (fallback)
      const { data: legacyOrder } = await supabase
        .from('orders')
        .select('order_number, status, total, payment_method')
        .eq('order_number', orderCode)
        .single()

      if (legacyOrder) {
        const successStatuses = ['paid', 'processing', 'shipped', 'completed', 'da_thanh_toan']
        const paid = successStatuses.includes(legacyOrder.status || '')
        return NextResponse.json({
          success: true,
          paid,
          status: legacyOrder.status,
          order_number: legacyOrder.order_number,
          total: legacyOrder.total,
        })
      }

      return NextResponse.json(
        { success: false, error: `Không tìm thấy đơn hàng: ${orderCode}`, paid: false },
        { status: 404 }
      )
    }

    // 2. Kiểm tra các trạng thái đã thanh toán
    const successStatuses = [
      'da_chuyen_khoan',
      'da_thanh_toan',
      'da_nhan_don',
      'dang_lam_don',
      'da_giao_shipper',
      'hoan_thanh',
    ]

    const paid = successStatuses.includes(order.trang_thai || '')

    return NextResponse.json({
      success: true,
      paid,
      status: order.trang_thai,
      order_number: order.ma_don_hang,
      total: order.tong_tien,
    })

  } catch (err: any) {
    console.error('❌ Check payment error:', err)
    return NextResponse.json(
      { success: false, error: err.message, paid: false },
      { status: 500 }
    )
  }
}
