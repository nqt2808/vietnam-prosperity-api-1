import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const all = new URL(req.url).searchParams.get("all") === "1";
  const supabase = createAdminClient();
  let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (!all) query = query.eq("hien_thi", true).limit(6);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const orderCode = String(body.order_code || body.ma_don_hang || "").trim();
  if (!orderCode) return NextResponse.json({ error: "Chỉ khách đã đặt hàng mới được đánh giá." }, { status: 400 });
  const supabase = createAdminClient();
  const { data: order } = await supabase.from("don_hang").select("ma_don_hang, so_dien_thoai, ho_ten, trang_thai").eq("ma_don_hang", orderCode).maybeSingle();
  if (!order) return NextResponse.json({ error: "Không tìm thấy đơn hàng hợp lệ." }, { status: 404 });
  const payload = {
    order_code: orderCode,
    phone: body.phone || order.so_dien_thoai || null,
    customer_name: body.customer_name || order.ho_ten || "Khách hàng VPC",
    rating: Math.max(1, Math.min(5, Number(body.rating || 5))),
    comment: String(body.comment || body.noi_dung || "").trim(),
    hien_thi: body.hien_thi !== false
  };
  if (!payload.comment) return NextResponse.json({ error: "Vui lòng nhập nội dung đánh giá." }, { status: 400 });
  const { data, error } = await supabase.from("reviews").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
