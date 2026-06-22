import { NextResponse } from "next/server";
import { VPC_KNOWLEDGE } from "./knowledge";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getRealtimeSupabaseContext() {
  try {
    const adminSupabase = createAdminClient();
    const [categoriesRes, drinksRes, merchandiseRes, reviewsRes] = await Promise.allSettled([
      adminSupabase.from("danh_muc_san_pham").select("ten_danh_muc, slug"),
      adminSupabase.from("san_pham_do_uong").select("ten_san_pham, slug, gia_den, gia_sua, ton_kho, hien_thi"),
      adminSupabase.from("san_pham_merchandise").select("ten_san_pham, slug, gia, ton_kho, hien_thi, con_ban"),
      adminSupabase.from("reviews").select("customer_name, rating, comment, hien_thi").eq("hien_thi", true).order("created_at", { ascending: false }).limit(10)
    ]);

    const categories = categoriesRes.status === "fulfilled" ? categoriesRes.value.data || [] : [];
    const drinks = drinksRes.status === "fulfilled" ? drinksRes.value.data || [] : [];
    const merchandise = merchandiseRes.status === "fulfilled" ? merchandiseRes.value.data || [] : [];
    const reviews = reviewsRes.status === "fulfilled" ? reviewsRes.value.data || [] : [];

    let ctx = "\n--- REALTIME DATABASE FROM SUPABASE (VPC) ---\n";
    ctx += "DANH MỤC:\n";
    categories.forEach((c: any) => ctx += `- ${c.ten_danh_muc} (${c.slug})\n`);
    ctx += "\nMENU ĐỒ UỐNG LIVE:\n";
    drinks.forEach((d: any) => {
      if (d.hien_thi !== false) {
        const stock = d.ton_kho === null || d.ton_kho === undefined ? "không quản lý" : Number(d.ton_kho);
        ctx += `- ${d.ten_san_pham} (${d.slug}) | Đen: ${d.gia_den || 0}đ | Sữa: ${d.gia_sua || 0}đ | Tồn kho: ${stock}\n`;
      }
    });
    ctx += "\nVẬT PHẨM LIVE:\n";
    merchandise.forEach((m: any) => {
      if (m.hien_thi !== false) {
        const stock = Number(m.ton_kho ?? 0);
        ctx += `- ${m.ten_san_pham} (${m.slug}) | Giá: ${m.gia || 0}đ | Tồn kho: ${stock} | Tình trạng: ${stock <= 0 || m.con_ban === false ? "HẾT HÀNG" : "CÒN HÀNG"}\n`;
      }
    });
    ctx += "\nĐÁNH GIÁ KHÁCH HÀNG HIỂN THỊ:\n";
    reviews.forEach((rv: any) => ctx += `- ${rv.customer_name || "Khách"}: ${rv.rating || 5} sao - ${rv.comment || ""}\n`);
    return ctx;
  } catch (err) {
    console.error("Supabase context error:", err);
    return "\n--- REALTIME DATABASE: không đọc được Supabase ---\n";
  }
}

function needsInternet(reply: string) {
  const t = String(reply || "").toLowerCase();
  return !t.trim() || t.includes("__need_internet_search__") || t.includes("chưa tìm thấy trong dữ liệu của quán") || t.includes("thông tin này hiện trang chưa tìm thấy");
}

async function searchInternet(query: string) {
  const key = process.env.SERPER_API_KEY;
  if (!key) return "";
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": key },
    body: JSON.stringify({ q: query, gl: "vn", hl: "vi", num: 5 })
  });
  if (!res.ok) throw new Error(`Serper API returned status ${res.status}`);
  const data = await res.json();
  const organic = Array.isArray(data.organic) ? data.organic : [];
  return organic.slice(0, 5).map((x: any, i: number) => `${i + 1}. ${x.title}\n${x.snippet}\nNguồn: ${x.link}`).join("\n\n");
}

async function chatWithOpenAI(message: string, opts: { adminMode?: boolean; adminContext?: any; supabaseContext?: string; internetContext?: string } = {}) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

  const systemPrompt = opts.adminMode ? `
Bạn là AI Admin của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.
Nhiệm vụ: phân tích số liệu thật từ ADMIN CONTEXT: đơn hàng, khách hàng, sản phẩm, tồn kho, reviews, doanh thu.
Quy tắc: không bịa số liệu; nếu thiếu dữ liệu thì nói rõ thiếu dữ liệu; trả lời tiếng Việt có số liệu, nhận xét và đề xuất hành động.
` : `
Bạn là Trang - trợ lý tư vấn của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.
THỨ TỰ BẮT BUỘC:
1. Đọc KNOWLEDGE BASE.
2. Đọc REALTIME SUPABASE DATABASE.
3. Nếu trong 2 nguồn trên không có dữ liệu và câu hỏi cần kiến thức bên ngoài, chỉ trả đúng chuỗi: __NEED_INTERNET_SEARCH__
Không được tự bịa giá, tồn kho, trạng thái đơn, chính sách, khuyến mãi, nhân sự, địa chỉ, hotline.
Trả lời tiếng Việt, lịch sự, ngắn gọn.
`;

  const userPrompt = opts.adminMode ? `
--- ADMIN CONTEXT ---
${JSON.stringify(opts.adminContext || {}, null, 2)}

--- CÂU HỎI ADMIN ---
${message}
` : `
--- KNOWLEDGE BASE ---
${VPC_KNOWLEDGE}

${opts.supabaseContext || ""}

${opts.internetContext ? `--- INTERNET SEARCH RESULTS (chỉ dùng khi dữ liệu nội bộ thiếu) ---\n${opts.internetContext}` : ""}

--- CÂU HỎI KHÁCH HÀNG ---
${message}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({ model, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }], temperature: 0.2 })
  });
  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenAI API Error:", response.status, errText);
    throw new Error(`OpenAI API returned status ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === "1";
  let message = "";
  let adminMode = false;
  let adminContextData: any = null;
  let openaiTried = false;
  let openaiAvailable = false;
  let serperTried = false;
  let serperAvailable = false;
  let openaiErrorMessage = "";

  try {
    const body = await req.json();
    message = String(body.message || body.question || body.prompt || "").trim();
    adminMode = body.adminMode === true;
    adminContextData = body.adminContext || null;
    if (!message) return NextResponse.json({ reply: adminMode ? "Dạ, Admin cần phân tích số liệu gì ạ?" : "Dạ, Quý khách cần VPC hỗ trợ gì ạ?", provider: "empty-message" });

    openaiTried = true;
    let replyText = "";
    let supabaseContext = "";
    let internetContext = "";

    if (adminMode) {
      replyText = await chatWithOpenAI(message, { adminMode: true, adminContext: adminContextData || {} });
    } else {
      supabaseContext = await getRealtimeSupabaseContext();
      replyText = await chatWithOpenAI(message, { supabaseContext });
      if (needsInternet(replyText)) {
        serperTried = true;
        internetContext = await searchInternet(message);
        serperAvailable = Boolean(internetContext.trim());
        if (internetContext) replyText = await chatWithOpenAI(message, { supabaseContext, internetContext });
      }
    }
    openaiAvailable = Boolean(replyText && replyText.trim());
    if (replyText.includes("__NEED_INTERNET_SEARCH__")) replyText = "Dạ, Trang chưa tìm thấy thông tin này trong dữ liệu của quán ạ.";

    return NextResponse.json({
      reply: replyText.trim() || "Dạ, Trang chưa tìm thấy thông tin phù hợp ạ.",
      provider: adminMode ? "openai-admin" : (serperTried ? "openai-knowledge-supabase-serper" : "openai-knowledge-supabase"),
      debug: debug ? { sourceOrder: adminMode ? ["adminContext", "openai"] : ["knowledge.ts", "supabase", "openai", "serper-if-needed"], adminMode, openaiTried, openaiAvailable, serperTried, serperAvailable, hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY), hasSerperKey: Boolean(process.env.SERPER_API_KEY), openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini" } : undefined
    });
  } catch (error) {
    openaiErrorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      reply: adminMode ? "Dạ, AI Admin đang gián đoạn. Vui lòng xem số liệu trực tiếp trên dashboard hoặc thử lại sau ạ." : "Dạ, hệ thống AI đang gián đoạn nên Trang chưa trả lời chính xác được ạ. Quý khách vui lòng hỏi lại sau hoặc gọi Hotline 0389726999 nhé ạ.",
      provider: "openai-error",
      debug: debug ? { openaiTried, openaiAvailable, serperTried, serperAvailable, openaiErrorMessage, openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini" } : undefined
    }, { status: 200 });
  }
}
