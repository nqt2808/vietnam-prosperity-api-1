import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "1" || url.searchParams.get("admin") === "1";
    const supabase = createAdminClient();
    
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (!all) {
      query = query.eq("hien_thi", true).limit(6);
    }
    
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ánh xạ các trường từ database sang các khóa mong đợi ở frontend (storefront & admin)
    const mapped = (data || []).map((r: any) => ({
      id: r.id,
      ma_don_hang: r.order_code,
      so_dien_thoai: r.phone,
      ho_ten: r.customer_name,
      so_sao: r.rating,
      noi_dung: r.comment,
      hien_thi: r.hien_thi,
      created_at: r.created_at
    }));

    // Trả về mảng phẳng trực tiếp để storefront có thể gọi .map() không bị lỗi
    return NextResponse.json(mapped);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderCode = String(body.order_code || body.ma_don_hang || "").trim();
    if (!orderCode) {
      return NextResponse.json({ error: "Chỉ khách đã đặt hàng mới được đánh giá." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: order } = await supabase
      .from("don_hang")
      .select("ma_don_hang, so_dien_thoai, ho_ten")
      .eq("ma_don_hang", orderCode)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng hợp lệ trên hệ thống." }, { status: 404 });
    }

    // Ánh xạ các khóa gửi lên thành payload của database
    const payload = {
      order_code: orderCode,
      phone: body.phone || body.so_dien_thoai || order.so_dien_thoai || null,
      customer_name: body.customer_name || body.ho_ten || order.ho_ten || "Khách hàng Trung Nguyên Legend",
      rating: Math.max(1, Math.min(5, Number(body.rating || body.so_sao || 5))),
      comment: String(body.comment || body.noi_dung || "").trim(),
      hien_thi: body.hien_thi !== false
    };

    if (!payload.comment) {
      return NextResponse.json({ error: "Vui lòng nhập nội dung đánh giá." }, { status: 400 });
    }

    const { data, error } = await supabase.from("reviews").insert(payload).select("*").single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trả về thông báo thành công và dữ liệu mới
    return NextResponse.json({ message: "Gửi phản hồi thành công. Cảm ơn ý kiến của bạn!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const url = new URL(req.url);
    const id = body.id || url.searchParams.get("id");
    const hien_thi = body.hien_thi;

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID đánh giá." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .update({ hien_thi: hien_thi !== false })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Cập nhật trạng thái hiển thị thành công!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let id = url.searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body.id || null;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: "Thiếu ID đánh giá." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Xóa đánh giá thành công!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
