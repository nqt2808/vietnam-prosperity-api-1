import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizePhone(value: any) {
  return String(value || "").replace(/\D/g, "");
}

function maskPhone(value: any) {
  const digits = normalizePhone(value);
  if (digits.length < 7) return digits;
  return digits.replace(/(\d{3})\d+(\d{3})$/, "$1***$2");
}

function normalizeOrder(order: any) {
  const kh = order?.thong_tin_khach_hang || {};
  const phone = order?.so_dien_thoai || order?.phone || order?.customer_phone || kh?.so_dien_thoai || "";

  return {
    ...order,
    ho_ten: order?.ho_ten || order?.ten_khach_hang || kh?.ho_ten || "",
    so_dien_thoai: maskPhone(phone),
    dia_chi: order?.dia_chi_giao_hang || order?.dia_chi || kh?.dia_chi || "",
    ma_don_hang: order?.ma_don_hang || order?.order_code || order?.order_number || order?.code || ""
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneRaw = String(searchParams.get("phone") || "").trim();
    const phoneDigits = normalizePhone(phoneRaw);

    if (!phoneDigits || phoneDigits.length < 8) {
      return NextResponse.json({ message: "Vui lòng nhập số điện thoại hợp lệ", data: [] }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("don_hang")
      .select(`
        *,
        thong_tin_khach_hang (
          ho_ten,
          so_dien_thoai,
          email,
          dia_chi
        )
      `)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) throw error;

    const matched = (data || [])
      .filter((order: any) => {
        const kh = order?.thong_tin_khach_hang || {};
        const candidates = [
          order?.so_dien_thoai,
          order?.phone,
          order?.customer_phone,
          kh?.so_dien_thoai
        ];

        return candidates.some((value) => normalizePhone(value) === phoneDigits);
      })
      .slice(0, 20)
      .map(normalizeOrder);

    if (!matched.length) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng với số điện thoại này", data: [] }, { status: 404 });
    }

    return NextResponse.json({ message: "Tìm thấy đơn hàng", data: matched });
  } catch (error: any) {
    console.error("Lỗi tra cứu đơn hàng bằng số điện thoại:", error);
    return NextResponse.json(
      {
        message: "Lỗi tra cứu đơn hàng bằng số điện thoại",
        error: error?.message || String(error),
        data: []
      },
      { status: 500 }
    );
  }
}
