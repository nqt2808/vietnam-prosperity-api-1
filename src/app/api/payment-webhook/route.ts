import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function extractOrderCode(text: string): string {
  if (!text) return "";
  
  // 1. Chuẩn hóa: xóa dấu cách, dấu gạch ngang, chuyển thành chữ hoa
  const normalized = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  
  // 2. Nhận diện dạng VPCDH + 14 số ngày giờ (ví dụ VPCDH20260606162012)
  const match = normalized.match(/VPCDH[0-9]{14}/);
  if (match) {
    const code = match[0];
    return `VPC-DH-${code.slice(5, 13)}-${code.slice(13)}`;
  }

  // 3. Fallback nhận diện dạng DH + số
  const matchDH = normalized.match(/DH[0-9]+/);
  if (matchDH) {
    return matchDH[0];
  }

  // 4. Fallback nhận diện nguyên bản có gạch ngang
  const matchOriginal = text.match(/VPC-DH-[0-9]{8}-[0-9]{6}/i);
  if (matchOriginal) return matchOriginal[0].toUpperCase();

  return "";
}

// Endpoint: POST /api/payment-webhook
export async function POST(req: NextRequest) {
  try {
    // 1. Xác thực bảo mật API Key từ SePay (Hình 3 của bạn cấu hình là 28082005)
    const authHeader = req.headers.get("authorization") || "";
    const isAuthorized = authHeader.includes("28082005") || authHeader.includes(process.env.SEPAY_WEBHOOK_API_KEY || "");
    
    if (!isAuthorized) {
      console.warn("🔒 Unauthorized webhook request received.");
      return NextResponse.json({ success: false, message: "Không có quyền truy cập." }, { status: 401 });
    }

    const body = await req.json();
    console.log("📥 Received Webhook Payload:", JSON.stringify(body, null, 2));

    // 2. Đọc đúng tất cả các trường dữ liệu có thể có của SePay (hỗ trợ cả snake_case và camelCase)
    const transactionContent = String(
      body.content || 
      body.description || 
      body.transactionContent || 
      body.transaction_content || 
      body.transfer_content || 
      ""
    ).trim();

    const amount = Number(
      body.amount_in || 
      body.amountIn || 
      body.amount || 
      body.transfer_amount || 
      body.transferAmount || 
      0
    );

    console.log(`🔍 Extracted transaction - Content: "${transactionContent}", Amount: ${amount}đ`);

    // 3. Tìm mã đơn hàng VPC-DH-... trong nội dung chuyển khoản
    const orderCode = extractOrderCode(transactionContent);

    // 4. Kết nối Supabase bằng Admin Client
    const supabase = createAdminClient();

    // 4b. Lưu lịch sử giao dịch vào bảng sepay_transactions
    const sepayTxId = Number(body.id || body.transactionId || body.transaction_id || 0);
    if (sepayTxId > 0) {
      const { error: insertTxError } = await supabase
        .from('sepay_transactions')
        .upsert({
          sepay_id: sepayTxId,
          gateway: body.gateway || body.bank || '',
          transaction_date: body.transactionDate || body.transaction_date || new Date().toISOString(),
          amount_in: amount,
          amount_out: Number(body.amountOut || body.amount_out || 0),
          transaction_content: transactionContent,
          reference_number: body.referenceNumber || body.reference_number || body.code || '',
          accumulated_balance: Number(body.accumulatedBalance || body.accumulated_balance || body.balance || 0),
          order_code: orderCode || null
        }, { onConflict: 'sepay_id' });
        
      if (insertTxError) {
        console.error("❌ Failed to save SePay transaction log in Next.js webhook:", insertTxError.message);
      } else {
        console.log("💾 Saved SePay transaction log in Next.js webhook successfully!");
      }
    }

    if (!orderCode) {
      console.warn("⚠️ Transaction content does not contain a valid order code:", transactionContent);
      return NextResponse.json({ success: false, message: "Nội dung chuyển khoản không chứa mã đơn hàng VPC" });
    }

    console.log(`🎯 Found matching Order Code: ${orderCode}`);

    // 5. Truy vấn đơn hàng trong bảng don_hang
    const { data: order, error: queryError } = await supabase
      .from('don_hang')
      .select('*')
      .eq('ma_don_hang', orderCode)
      .single();

    if (queryError || !order) {
      console.error(`❌ Order ${orderCode} not found in Supabase:`, queryError?.message);
      return NextResponse.json({ success: false, message: `Không tìm thấy đơn hàng ${orderCode} trên hệ thống` });
    }

    console.log(`📦 Found order: ${order.ma_don_hang} | Amount needed: ${order.tong_tien}đ | Current Status: ${order.trang_thai}`);

    // 6. Bỏ qua nếu đơn hàng đã ở các trạng thái đã thanh toán/giao hàng
    const skipStatuses = ["da_thanh_toan", "da_chuyen_khoan", "dang_lam_don", "da_giao_shipper", "dang_giao", "da_giao", "hoan_thanh"];
    if (skipStatuses.includes(order.trang_thai)) {
      console.log(`ℹ️ Order ${orderCode} is already paid or completed (Status: ${order.trang_thai}). Skipping update.`);
      return NextResponse.json({ success: true, message: "Đơn hàng đã được xử lý thanh toán trước đó" });
    }

    // 7. Kiểm tra số tiền chuyển khoản có khớp (hoặc lớn hơn/bằng) số tiền đơn hàng không
    const amountNeeded = Number(order.tong_tien || 0);
    if (amount < amountNeeded) {
      console.warn(`⚠️ Payment amount insufficient for ${orderCode}. Received: ${amount}đ, Needed: ${amountNeeded}đ`);
      return NextResponse.json({ success: false, message: `Số tiền thanh toán chưa đủ. Nhận được: ${amount}đ, Cần: ${amountNeeded}đ` });
    }

    // 8. Cập nhật trạng thái đơn hàng thành "da_thanh_toan" (Đã TT)
    const { error: updateError } = await supabase
      .from('don_hang')
      .update({ 
        trang_thai: 'da_thanh_toan',
        ghi_chu: (order.ghi_chu ? order.ghi_chu + "\n" : "") + `[SePay tự động] Xác nhận thanh toán thành công qua ngân hàng lúc ${new Date().toLocaleString('vi-VN')}.`
      })
      .eq('ma_don_hang', orderCode);
 
    if (updateError) {
      console.error(`❌ Failed to update status for order ${orderCode}:`, updateError.message);
      return NextResponse.json({ success: false, message: "Lỗi cập nhật trạng thái đơn hàng" });
    }
 
    console.log(`✅ Successfully updated order ${orderCode} to "da_thanh_toan"!`);
    return NextResponse.json({ success: true, message: `Đơn hàng ${orderCode} đã được xác nhận thanh toán tự động` });

  } catch (err: any) {
    console.error("❌ Webhook processing failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
