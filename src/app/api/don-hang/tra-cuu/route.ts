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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = normalizePhone(searchParams.get("phone"));

    if (!phone || phone.length < 8) {
      return NextResponse.json({ message: "Số điện thoại không hợp lệ", data: [] }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("don_hang")
      .select(`
        *,
        thong_tin_khach_hang (
          ho_ten,
          so_dien_thoai,
          dia_chi
        )
      `)
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) throw error;

    const matched = (data || []).filter((order: any) => {
      const kh = order.thong_tin_khach_hang || {};
      return [
        order.so_dien_thoai,
        order.phone,
        order.customer_phone,
        kh.so_dien_thoai
      ].some(v => normalizePhone(v) === phone);
    }).slice(0, 20).map((order: any) => {
      const kh = order.thong_tin_khach_hang || {};
      const rawPhone = order.so_dien_thoai || order.phone || kh.so_dien_thoai || "";

      return {
        ...order,
        ho_ten: order.ho_ten || kh.ho_ten || "",
        so_dien_thoai: maskPhone(rawPhone),
        dia_chi: order.dia_chi_giao_hang || order.dia_chi || kh.dia_chi || "",
        ma_don_hang: order.ma_don_hang || order.order_code || order.code || ""
      };
    });

    if (!matched.length) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng với số điện thoại này", data: [] }, { status: 404 });
    }

    return NextResponse.json({ message: "Tìm thấy đơn hàng", data: matched });
  } catch (error: any) {
    return NextResponse.json({
      message: "Lỗi tra cứu đơn hàng bằng số điện thoại",
      error: error?.message || String(error),
      data: []
    }, { status: 500 });
  }
}
