import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function extractOrderCode(text: string): string {
  if (!text) return "";
  const normalized = text.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const match = normalized.match(/VPCDH[0-9]{14}/);
  if (match) {
    const code = match[0];
    return `VPC-DH-${code.slice(5, 13)}-${code.slice(13)}`;
  }
  const matchDH = normalized.match(/DH[0-9]+/);
  if (matchDH) {
    return matchDH[0];
  }
  const matchOriginal = text.match(/VPC-DH-[0-9]{8}-[0-9]{6}/i);
  if (matchOriginal) return matchOriginal[0].toUpperCase();
  return "";
}

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.SEPAY_API_KEY || process.env.SEPAY_WEBHOOK_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json({ ok: false, message: "Chưa cấu hình API Key của SePay trên máy chủ." }, { status: 400 });
    }

    const response = await fetch("https://userapi.sepay.vn/v2/transactions?limit=50", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`SePay API trả về mã lỗi: ${response.status}`);
    }

    const result = await response.json();
    const transactions = result.data || [];
    const supabase = createAdminClient();
    const updatedOrders = [];

    for (const tx of transactions) {
      const isIncoming = tx.transfer_type === "in" || Number(tx.amount_in || 0) > 0;
      if (!isIncoming) continue;

      const content = tx.description || tx.transaction_content || "";
      const amount = Number(tx.amount_in || 0);
      const orderCode = extractOrderCode(content);

      // Save/Upsert transaction to sepay_transactions
      const sepayTxId = Number(tx.id || 0);
      if (sepayTxId > 0) {
        const { error: insertTxError } = await supabase
          .from("sepay_transactions")
          .upsert({
            sepay_id: sepayTxId,
            gateway: tx.gateway || tx.bank || "",
            transaction_date: tx.transaction_date || tx.transactionDate || new Date().toISOString(),
            amount_in: amount,
            amount_out: Number(tx.amount_out || tx.amountOut || 0),
            transaction_content: content,
            reference_number: tx.reference_number || tx.referenceNumber || tx.code || "",
            accumulated_balance: Number(tx.accumulated_balance || tx.accumulatedBalance || tx.balance || 0),
            order_code: orderCode || null
          }, { onConflict: 'sepay_id' });

        if (insertTxError) {
          console.error(`❌ Failed to save synced SePay transaction ${sepayTxId} in Next.js:`, insertTxError.message);
        }
      }

      if (!orderCode) continue;

      // Find order in database
      const { data: order, error: findError } = await supabase
        .from("don_hang")
        .select("id, ma_don_hang, tong_tien, trang_thai, ghi_chu")
        .eq("ma_don_hang", orderCode)
        .single();

      if (findError || !order) continue;

      const skipStatuses = [
        "da_tt", "dang_lam", "dang_giao", "hoan_tat",
        "da_thanh_toan", "da_chuyen_khoan", "dang_lam_don", "da_giao_shipper", "dang_giao", "da_giao", "hoan_thanh"
      ];
      if (skipStatuses.includes(order.trang_thai)) continue;

      const expectedAmount = Number(order.tong_tien || 0);
      if (expectedAmount > 0 && amount < expectedAmount) continue;

      const sepayNote = `[SePay đồng bộ ${new Date().toLocaleString("vi-VN")}] ${content || "Đã nhận giao dịch"}`;
      const currentNote = order.ghi_chu || "";
      const nextNote = currentNote.includes("[SePay")
        ? currentNote
        : `${currentNote}${currentNote ? "\n" : ""}${sepayNote}`;

      const { data: updated, error: updateError } = await supabase
        .from("don_hang")
        .update({
          trang_thai: "da_tt",
          ghi_chu: nextNote
        })
        .eq("id", order.id)
        .select()
        .single();

      if (!updateError && updated) {
        updatedOrders.push({
          ma_don_hang: orderCode,
          so_tien: amount,
          ngay_gd: tx.transaction_date || ""
        });
      }
    }

    return NextResponse.json({
      success: true,
      ok: true,
      message: `Đồng bộ hoàn tất. Đã cập nhật tự động ${updatedOrders.length} đơn hàng.`,
      updated: updatedOrders
    });
  } catch (err: any) {
    console.error("❌ Failed to sync SePay:", err);
    return NextResponse.json({ ok: false, error: err.message || "Lỗi hệ thống khi đồng bộ SePay" }, { status: 500 });
  }
}
