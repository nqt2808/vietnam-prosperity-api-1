import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Endpoint: POST /api/payment-webhook
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("📥 Received Webhook Payload:", JSON.stringify(body, null, 2))

    let transactionContent = ""
    let amount = 0

    // 1. Phân tích SePay Webhook
    if (body.transactionContent || body.code) {
      transactionContent = body.transactionContent || body.code || ""
      amount = Number(body.amountIn || 0)
    } 
    // 2. Phân tích PayOS Webhook
    else if (body.data && (body.data.description || body.data.amount)) {
      transactionContent = body.data.description || ""
      amount = Number(body.data.amount || 0)
    }
    // 3. Phân tích Casso Webhook
    else if (body.data && Array.isArray(body.data) && body.data[0]) {
      const tx = body.data[0]
      transactionContent = tx.description || ""
      amount = Number(tx.amount || 0)
    }

    console.log(`🔍 Extracted transaction - Content: "${transactionContent}", Amount: ${amount}đ`)

    // 4. Tìm mã đơn hàng VPC-DH-... trong nội dung chuyển khoản
    // Format: VPC-DH-YYYYMMDD-HHMMSS (ví dụ: VPC-DH-20260528-182421)
    const orderCodeMatch = transactionContent.match(/VPC-DH-\d{8}-\d{6}/i)
    if (!orderCodeMatch) {
      console.warn("⚠️ Transaction content does not contain a valid order code:", transactionContent)
      return NextResponse.json({ success: false, message: "Nội dung chuyển khoản không chứa mã đơn hàng VPC" })
    }

    const orderCode = orderCodeMatch[0].toUpperCase()
    console.log(`🎯 Found matching Order Code: ${orderCode}`)

    // 5. Kết nối Supabase bằng Admin Client để ghi đè các hạn chế RLS
    const supabase = createAdminClient()

    // 6. Truy vấn đơn hàng trong bảng don_hang
    const { data: order, error: queryError } = await supabase
      .from('don_hang')
      .select('*')
      .eq('ma_don_hang', orderCode)
      .single()

    if (queryError || !order) {
      console.error(`❌ Order ${orderCode} not found in Supabase:`, queryError?.message)
      return NextResponse.json({ success: false, message: `Không tìm thấy đơn hàng ${orderCode} trên hệ thống` })
    }

    console.log(`📦 Found order: ${order.ma_don_hang} | Amount needed: ${order.tong_tien}đ | Current Status: ${order.trang_thai}`)

    // 7. Kiểm tra số tiền chuyển khoản có khớp (hoặc lớn hơn/bằng) số tiền đơn hàng không
    const amountNeeded = Number(order.tong_tien || 0)
    if (amount < amountNeeded) {
      console.warn(`⚠️ Payment amount insufficient for ${orderCode}. Received: ${amount}đ, Needed: ${amountNeeded}đ`)
      return NextResponse.json({ success: false, message: `Số tiền thanh toán chưa đủ. Nhận được: ${amount}đ, Cần: ${amountNeeded}đ` })
    }

    // 8. Cập nhật trạng thái đơn hàng thành "da_thanh_toan" (Thanh toán tự động thành công)
    const { error: updateError } = await supabase
      .from('don_hang')
      .update({ 
        trang_thai: 'da_thanh_toan',
        ghi_chu: (order.ghi_chu ? order.ghi_chu + "\n" : "") + `[Hệ thống] Tự động xác nhận dòng tiền VietQR thành công lúc ${new Date().toLocaleString('vi-VN')}.`
      })
      .eq('ma_don_hang', orderCode)
 
    if (updateError) {
      console.error(`❌ Failed to update status for order ${orderCode}:`, updateError.message)
      return NextResponse.json({ success: false, message: "Lỗi cập nhật trạng thái đơn hàng" })
    }
 
    console.log(`✅ Successfully updated order ${orderCode} to "da_thanh_toan"!`)
    return NextResponse.json({ success: true, message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán tự động` })

  } catch (err: any) {
    console.error("❌ Webhook processing failed:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
