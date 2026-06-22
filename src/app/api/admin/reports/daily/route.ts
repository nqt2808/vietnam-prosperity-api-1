import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const supabase = createAdminClient();
  let query = supabase.from("don_hang").select("*").order("created_at", { ascending: true });
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const map = new Map<string, any>();
  for (const order of data || []) {
    const date = new Date(order.created_at || order.ngay_tao || Date.now()).toISOString().slice(0, 10);
    if (!map.has(date)) map.set(date, { date, total_orders: 0, completed_orders: 0, canceled_orders: 0, processing_orders: 0, revenue: 0 });
    const row = map.get(date);
    const st = String(order.trang_thai || order.status || "");
    row.total_orders += 1;
    if (["hoan_tat", "da_tt", "da_thanh_toan", "dang_lam", "dang_giao"].includes(st)) row.revenue += Number(order.tong_tien || order.total || 0);
    if (["hoan_tat", "hoan_thanh"].includes(st)) row.completed_orders += 1;
    else if (["da_huy", "tu_choi"].includes(st)) row.canceled_orders += 1;
    else row.processing_orders += 1;
  }
  return NextResponse.json({ data: [...map.values()] });
}
