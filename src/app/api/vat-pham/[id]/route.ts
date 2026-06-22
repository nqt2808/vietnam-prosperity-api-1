import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const allowed = ["gia", "gia_den", "gia_sua", "ton_kho", "stock_quantity", "con_ban", "hien_thi", "la_mon_noi_bat"];
  const payload: Record<string, any> = {};
  for (const key of allowed) if (key in body) payload[key === "stock_quantity" ? "ton_kho" : key] = body[key];
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("san_pham_merchandise").update(payload).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
