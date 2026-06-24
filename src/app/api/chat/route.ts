import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";

function htmlToKnowledgeText(html: string): string {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<\/(h1|h2|h3|h4|p|li|section|article|div|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractWebsiteKnowledge(raw: string, filePath: string): string {
  const textOnly = htmlToKnowledgeText(raw);

  const productMatches = Array.from(
    raw.matchAll(/(?:ten_san_pham|ten|name|title)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,500}?(?:mo_ta|description|desc|short_description)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,300}?(?:gia|gia_den|price|priceNum)\s*:\s*([0-9]+)/gi)
  ).map((match: any) => {
    return `Sản phẩm: ${match[1]}\nMô tả: ${match[2]}\nGiá: ${Number(match[3]).toLocaleString("vi-VN")}đ`;
  });

  const articleMatches = Array.from(
    raw.matchAll(/(?:title|tieu_de)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,700}?(?:desc|tom_tat|summary|content)\s*:\s*["'`]([^"'`]+)["'`]/gi)
  ).map((match: any) => {
    return `Bài viết: ${match[1]}\nNội dung: ${match[2]}`;
  });

  const aboutMatches = Array.from(
    raw.matchAll(/(?:Về chúng tôi|Giới thiệu|about|founder|sáng lập|Vietnam Prosperity Coffee|Trung Nguyên Legend Âu Lạc)[\s\S]{0,2000}/gi)
  ).map((match: any) => htmlToKnowledgeText(match[0]));

  const footerMatches = Array.from(
    raw.matchAll(/(?:footer|Hotline|0389726999|038 972 6999|Facebook|TikTok|Google Map|Địa chỉ|Aeon Mall)[\s\S]{0,2000}/gi)
  ).map((match: any) => htmlToKnowledgeText(match[0]));

  let indexBlogItems = "";
  if (filePath.endsWith("index.html")) {
    try {
      const blogSection = raw.match(/const\s+blogItems\s*=\s*(\[[\s\S]*?\])\s*;/);
      if (blogSection) {
        const itemsText = blogSection[1];
        const itemBlocks = itemsText.split(/\}\s*,\s*\{/);
        const parsedBlogs: string[] = [];
        itemBlocks.forEach((block, index) => {
          const titleMatch = block.match(/title\s*:\s*["']([\s\S]*?)["']/);
          const descMatch = block.match(/desc\s*:\s*["']([\s\S]*?)["']/);
          const contentMatch = block.match(/content\s*:\s*`([\s\S]*?)`/);
          
          const title = titleMatch ? titleMatch[1].trim() : "";
          const desc = descMatch ? descMatch[1].trim() : "";
          let content = contentMatch ? contentMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
          if (content.length > 500) content = content.slice(0, 500) + "...";
          
          if (title) {
            parsedBlogs.push(`BÀI VIẾT TĨNH ${index + 1}: ${title}\n- Tóm tắt: ${desc}\n- Nội dung chi tiết: ${content}`);
          }
        });
        if (parsedBlogs.length > 0) {
          indexBlogItems = parsedBlogs.join("\n\n");
        }
      }
    } catch (e) {
      console.error("Lỗi parse blogItems từ index.html:", e);
    }
  }

  let indexChatbotIntents = "";
  if (filePath.endsWith("index.html")) {
    try {
      const intentsSection = raw.match(/const\s+chatbotIntents\s*=\s*(\[[\s\S]*?\])\s*;/);
      if (intentsSection) {
        const intentsText = intentsSection[1];
        const intentBlocks = intentsText.split(/\}\s*,\s*\{/);
        const parsedIntents: string[] = [];
        intentBlocks.forEach((block) => {
          const nameMatch = block.match(/["']name["']\s*:\s*["']([^"']+)["']/);
          const replyMatch = block.match(/["']reply["']\s*:\s*["'`]([\s\S]*?)["'`]/);
          
          const name = nameMatch ? nameMatch[1].trim() : "";
          const reply = replyMatch ? replyMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
          
          if (name && reply) {
            parsedIntents.push(`TÀI LIỆU HƯỚNG DẪN VỀ [${name.toUpperCase()}]:\n${reply}`);
          }
        });
        if (parsedIntents.length > 0) {
          indexChatbotIntents = parsedIntents.join("\n\n");
        }
      }
    } catch (e) {
      console.error("Lỗi parse chatbotIntents từ index.html:", e);
    }
  }

  return [
    "=== TEXT HIỂN THỊ TRONG WEBSITE ===",
    textOnly.slice(0, 50000),

    "=== SẢN PHẨM BÓC TÁCH TỪ INDEX ===",
    productMatches.length ? productMatches.join("\n\n") : "Không bóc tách được sản phẩm từ index.",

    "=== BÀI VIẾT BÓC TÁCH TỪ INDEX ===",
    articleMatches.length ? articleMatches.join("\n\n") : "Không bóc tách được bài viết từ index.",

    "=== CÁC BÀI VIẾT BLOG CHI TIẾT CỦA INDEX.HTML ===",
    indexBlogItems || "Không tìm thấy bài viết blogItems trong index.html.",

    "=== TÀI LIỆU HƯỚNG DẪN PHẢN HỒI (CHATBOT INTENTS) TỪ INDEX.HTML ===",
    indexChatbotIntents || "Không tìm thấy chatbotIntents trong index.html.",

    "=== GIỚI THIỆU / VỀ CHÚNG TÔI ===",
    aboutMatches.length ? aboutMatches.join("\n\n") : "Không tìm thấy phần giới thiệu.",

    "=== FOOTER / LIÊN HỆ ===",
    footerMatches.length ? footerMatches.join("\n\n") : "Không tìm thấy footer/liên hệ."
  ].join("\n\n");
}

let cachedHtmlKnowledge = {
  loadedAt: 0,
  text: ""
};

async function loadHtmlKnowledge(): Promise<string> {
  const now = Date.now();
  if (cachedHtmlKnowledge.text && now - cachedHtmlKnowledge.loadedAt < 30_000) {
    return cachedHtmlKnowledge.text;
  }

  const indexCandidates = [
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "public", "index.html"),
  ];
  const adminCandidates = [
    path.join(process.cwd(), "admin.html"),
    path.join(process.cwd(), "public", "admin.html"),
  ];

  let indexRaw = "";
  let indexPath = "";
  for (const p of indexCandidates) {
    if (fs.existsSync(p)) {
      indexRaw = fs.readFileSync(p, "utf8");
      indexPath = p;
      break;
    }
  }

  let adminRaw = "";
  let adminPath = "";
  for (const p of adminCandidates) {
    if (fs.existsSync(p)) {
      adminRaw = fs.readFileSync(p, "utf8");
      adminPath = p;
      break;
    }
  }

  const texts: string[] = [];
  if (indexRaw) {
    const cleanIndex = extractWebsiteKnowledge(indexRaw, indexPath);
    texts.push(`=== DỮ LIỆU TỪ TRANG CHỦ BÁN HÀNG (INDEX.HTML) (Nguồn: ${indexPath}) ===\n${cleanIndex}`);
  }
  if (adminRaw) {
    const cleanAdmin = htmlToKnowledgeText(adminRaw);
    texts.push(`=== DỮ LIỆU TỪ TRANG QUẢN TRỊ ADMIN (ADMIN.HTML) (Nguồn: ${adminPath}) ===\n${cleanAdmin}`);
  }

  cachedHtmlKnowledge = {
    loadedAt: now,
    text: texts.join("\n\n---\n\n").slice(0, 120000)
  };

  return cachedHtmlKnowledge.text;
}

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
Bạn là Trang - trợ lý ảo AI vô cùng dễ thương, lịch sự và chu đáo của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc (VPC).
QUY TẮC BẮT BUỘC VỀ SỬ DỤNG DỮ LIỆU:
1. Bạn phải luôn ưu tiên tìm kiếm câu trả lời từ dữ liệu thực đơn sản phẩm, thông tin đơn hàng và ngữ cảnh website được cung cấp ở dưới trước.
2. Đối với giá cả sản phẩm không có trong menu hoặc thông tin đơn hàng cụ thể không tồn tại, bạn không được tự ý bịa giá hay bịa mã đơn khác, mà hướng dẫn khách liên hệ hotline 038 972 6999 hoặc kiểm tra menu.
3. Nếu thông tin không có trong dữ liệu nội bộ cung cấp, bạn được phép tự sử dụng tri thức AI bên ngoài của ChatGPT để trả lời khách một cách thông minh, tự nhiên và hữu ích (ghi rõ là thông tin tham khảo bên ngoài nếu cần).
4. Xưng hô: Xưng "VPC" hoặc "Trang", gọi khách là "Quý khách", "anh/chị" hoặc "bạn", giữ văn phong lễ phép ấm áp.
`;

  const userPrompt = opts.adminMode ? `
--- ADMIN CONTEXT ---
${JSON.stringify(opts.adminContext || {}, null, 2)}

--- CÂU HỎI ADMIN ---
${message}
` : `
--- DỮ LIỆU THỜI GIAN THỰC (DATABASE & WEBSITE HTML) ---
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
    
    const sessionId = String(body.session_id || body.sessionId || "sess_anonymous").trim();
    const clientName = String(body.client_name || body.clientName || "Khách ẩn danh").trim();

    if (!message) return NextResponse.json({ reply: adminMode ? "Dạ, Admin cần phân tích số liệu gì ạ?" : "Dạ, Quý khách cần VPC hỗ trợ gì ạ?", provider: "empty-message" });

    const adminSupabase = createAdminClient();

    // 1. Lưu tin nhắn của khách hàng vào database
    if (!adminMode) {
      try {
        await adminSupabase.from("chat_messages").insert({
          session_id: sessionId,
          sender: "client",
          message: message,
          client_name: clientName,
          is_read: false
        });
      } catch (dbErr) {
        console.warn("⚠️ Không lưu được tin nhắn client vào DB trong Next.js route:", dbErr);
      }
    }

    openaiTried = true;
    let replyText = "";
    let supabaseContext = "";
    let internetContext = "";

    if (adminMode) {
      replyText = await chatWithOpenAI(message, { adminMode: true, adminContext: adminContextData || {} });
    } else {
      // Tải realtime database từ Supabase
      supabaseContext = await getRealtimeSupabaseContext();

      // Tải thêm thông tin từ html index và admin
      try {
        const htmlContext = await loadHtmlKnowledge();
        supabaseContext += `\n\n${htmlContext}`;
      } catch (htmlErr: any) {
        console.warn("⚠️ Không load được html context trong route.ts:", htmlErr.message);
      }

      // Tự động nhận diện tra cứu đơn hàng realtime dựa trên sđt hoặc mã đơn trong câu hỏi
      let orderInfoContext = "";
      const codeMatch = message.match(/(?:VPC-)?DH-?\d+/i);
      const phoneMatch = message.match(/0\d{8,10}/);

      if (codeMatch || phoneMatch) {
        try {
          let query = adminSupabase.from("don_hang").select(`
            *,
            thong_tin_khach_hang (
              ho_ten,
              so_dien_thoai,
              email,
              dia_chi
            )
          `);

          if (codeMatch) {
            const rawCode = codeMatch[0];
            const cleanCode = rawCode.toUpperCase().replace("-", "");
            query = query.or(`ma_don_hang.ilike.%${cleanCode}%,ma_don_hang.ilike.%${rawCode}%`);
          } else if (phoneMatch) {
            const matchedPhone = phoneMatch[0];
            query = query.or(`so_dien_thoai.eq.${matchedPhone},phone.eq.${matchedPhone},customer_phone.eq.${matchedPhone}`);
          }

          const { data: matchedOrders, error: orderErr } = await query.limit(5);

          if (!orderErr && matchedOrders && matchedOrders.length > 0) {
            orderInfoContext = `\n--- THÔNG TIN ĐƠN HÀNG TRA CỨU REALTIME TỪ DATABASE ---\n`;
            matchedOrders.forEach((ord: any, index: number) => {
              const khInfo = ord.thong_tin_khach_hang || {};
              const hoten = khInfo.ho_ten || ord.ho_ten || "Khách hàng";
              const sdt = khInfo.so_dien_thoai || ord.so_dien_thoai || "";
              
              // Map trạng thái
              const statusMap: any = {
                da_dat_don: "moi", don_moi: "moi", cho_chuyen_khoan: "cho_tt", cho_xac_nhan_chuyen_khoan: "cho_tt",
                khach_bao_da_chuyen_khoan: "cho_tt", da_chuyen_khoan: "da_tt", da_thanh_toan: "da_tt",
                da_nhan_don: "dang_lam", dang_lam_don: "dang_lam", da_giao_shipper: "dang_giao",
                dang_giao: "dang_giao", da_giao: "hoan_tat", hoan_thanh: "hoan_tat",
                tu_choi_don: "tu_choi", tu_choi: "tu_choi", da_huy: "da_huy"
              };
              const statusLabels: any = {
                moi: "Mới (đã đặt)", cho_tt: "Chờ thanh toán", da_tt: "Đã thanh toán",
                dang_lam: "Đang làm", dang_giao: "Đang giao hàng", hoan_tat: "Hoàn tất/Thành công",
                tu_choi: "Đã từ chối", da_huy: "Đã hủy"
              };
              const status = statusLabels[statusMap[ord.trang_thai] || ord.trang_thai] || ord.trang_thai;
              
              let itemsText = "";
              try {
                const items = typeof ord.danh_sach_san_pham === "string" ? JSON.parse(ord.danh_sach_san_pham) : ord.danh_sach_san_pham;
                if (Array.isArray(items)) {
                  itemsText = items.map(it => `${it.name || it.ten_san_pham || "Sản phẩm"} x${it.qty || it.so_luong || 1}`).join(", ");
                }
              } catch (e) {
                itemsText = "Không parse được danh sách món";
              }

              orderInfoContext += `Đơn hàng ${index + 1}:
- Mã đơn hàng: ${ord.ma_don_hang}
- Ngày đặt: ${ord.created_at || "Vừa xong"}
- Khách hàng: ${hoten}
- SĐT: ${sdt}
- Địa chỉ nhận: ${ord.dia_chi_giao_hang || ord.dia_chi || "Nhận tại quán"}
- Trạng thái: ${status}
- Món đã đặt: ${itemsText}
- Tổng tiền: ${Number(ord.tong_tien || 0).toLocaleString("vi-VN")}đ
- Thanh toán: ${ord.phuong_thuc_thanh_toan || "Tiền mặt"}\n\n`;
            });
          }
        } catch (err: any) {
          console.error("Lỗi tra cứu đơn hàng cho chatbot trong Next.js route:", err.message);
        }
      }

      if (orderInfoContext) {
        supabaseContext += `\n${orderInfoContext}`;
      }

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

    const cleanReply = replyText.trim() || "Dạ, Trang chưa tìm thấy thông tin phù hợp ạ.";

    // 2. Lưu câu trả lời của AI vào database
    if (!adminMode) {
      try {
        await adminSupabase.from("chat_messages").insert({
          session_id: sessionId,
          sender: "bot",
          message: cleanReply,
          client_name: clientName,
          is_read: true
        });
      } catch (dbErr) {
        console.warn("⚠️ Không lưu được tin nhắn bot vào DB trong Next.js route:", dbErr);
      }
    }

    return NextResponse.json({
      reply: cleanReply,
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
