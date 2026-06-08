import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { VPC_KNOWLEDGE } from "./knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnyRecord = Record<string, any>;

function formatMoney(value: any) {
  return Number(value || 0).toLocaleString("vi-VN") + "đ";
}

function compactJson(data: any, max = 60_000) {
  try {
    return JSON.stringify(data ?? null, null, 2).slice(0, max);
  } catch {
    return "Không chuyển dữ liệu thành JSON được.";
  }
}

function normalizeSearchText(text: string) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitCustomerQuestions(message: string) {
  return String(message || "")
    .split(/[\n?]+|(?:\s+và\s+)|(?:\s*,\s*)/i)
    .map((x) => x.trim())
    .filter((x) => x.length > 2)
    .slice(0, 8);
}

function normalizeArray(input: any) {
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.data)) return input.data;
  if (Array.isArray(input?.items)) return input.items;
  return [];
}

async function safeSelect(
  supabase: any,
  table: string,
  columns = "*",
  limit = 120
) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .limit(limit);

    if (error) {
      return {
        table,
        ok: false,
        error: error.message,
        data: []
      };
    }

    return {
      table,
      ok: true,
      data: data || []
    };
  } catch (error: any) {
    return {
      table,
      ok: false,
      error: error?.message || String(error),
      data: []
    };
  }
}

async function loadSupabaseKnowledge() {
  const supabase = createAdminClient();

  const [
    drinks,
    sanPhamDoUong,
    merchandise,
    vatPham,
    articles,
    posts,
    customers,
    orders,
    sepayTransactions
  ] = await Promise.all([
    safeSelect(supabase, "do_uong", "*", 120),
    safeSelect(supabase, "san_pham_do_uong", "*", 300),
    safeSelect(supabase, "merchandise", "*", 120),
    safeSelect(supabase, "vat_pham", "*", 120),
    safeSelect(supabase, "bai_viet", "*", 80),
    safeSelect(supabase, "articles", "*", 80),
    safeSelect(
      supabase,
      "khach_hang",
      "id, ho_ten, so_dien_thoai, email, dia_chi, created_at",
      120
    ),
    safeSelect(supabase, "don_hang", "*", 200),
    safeSelect(supabase, "sepay_transactions", "*", 50)
  ]);

  return {
    drinks,
    sanPhamDoUong,
    merchandise,
    vatPham,
    articles,
    posts,
    customers,
    orders,
    sepayTransactions
  };
}

async function findOrderDetails(message: string) {
  const orderMatch = String(message || "").match(
    /(VPC-DH-[A-Z0-9-]+|DH-[A-Z0-9-]+|VPC[A-Z0-9-]+)/i
  );

  if (!orderMatch) return null;

  const code = orderMatch[0].toUpperCase();

  try {
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
      .eq("ma_don_hang", code)
      .maybeSingle();

    if (data && !error) return data;

    const fallback = await supabase
      .from("don_hang")
      .select("*")
      .or(`ma_don_hang.eq.${code},order_code.eq.${code},code.eq.${code}`)
      .maybeSingle();

    return fallback.data || null;
  } catch (error) {
    console.error("Lỗi khi truy vấn đơn hàng:", error);
    return null;
  }
}

function buildOrderContext(orderDetails: AnyRecord | null) {
  if (!orderDetails) {
    return "Không có yêu cầu tra cứu mã đơn hàng cụ thể, hoặc mã đơn hàng chưa chính xác.";
  }

  const kh = orderDetails.thong_tin_khach_hang || {};

  return `
DỮ LIỆU ĐƠN HÀNG THỰC TẾ:
- Mã đơn hàng: ${orderDetails.ma_don_hang || orderDetails.order_code || orderDetails.code || "Không rõ"}
- Khách hàng nhận: ${kh.ho_ten || orderDetails.ho_ten || orderDetails.ten_khach_hang || "Ẩn danh"}
- SĐT: ${kh.so_dien_thoai || orderDetails.so_dien_thoai || orderDetails.phone || "Ẩn"}
- Địa chỉ nhận: ${orderDetails.dia_chi_giao_hang || kh.dia_chi || orderDetails.address || "Nhận tại quầy"}
- Món đã đặt: ${compactJson(orderDetails.danh_sach_san_pham || orderDetails.items || "Ẩn", 5000)}
- Tổng thanh toán: ${formatMoney(orderDetails.tong_tien || orderDetails.total || orderDetails.amount || 0)}
- Phí giao hàng: ${formatMoney(orderDetails.phi_ship || orderDetails.shipping_fee || 0)}
- Phương thức thanh toán: ${
    orderDetails.phuong_thuc_thanh_toan === "chuyen_khoan" ||
    orderDetails.payment_method === "bank_transfer"
      ? "Chuyển khoản VietQR"
      : "Tiền mặt/COD hoặc phương thức khác"
  }
- Trạng thái xử lý: ${orderDetails.trang_thai || orderDetails.status || "Không rõ"}
- Thời gian đặt đơn: ${
    orderDetails.created_at
      ? new Date(orderDetails.created_at).toLocaleString("vi-VN")
      : "Không rõ"
  }
`.trim();
}

function buildFrontendContext(context: any) {
  const frontendProducts = normalizeArray(context?.products);
  const frontendArticles = normalizeArray(context?.articles);
  const frontendCart = normalizeArray(context?.cart);

  const productsContext = frontendProducts.length
    ? frontendProducts
        .map((p: AnyRecord) => {
          const name =
            p.ten || p.ten_san_pham || p.name || p.product_name || "Sản phẩm";
          const price = p.gia || p.gia_den || p.price || p.priceNum || 0;
          const desc =
            p.mo_ta ||
            p.short_description ||
            p.description ||
            "Không có mô tả";
          return `- ${name}: Giá ${formatMoney(price)}. Mô tả: ${desc}`;
        })
        .join("\n")
    : "Frontend không gửi dữ liệu sản phẩm online.";

  const articlesContext = frontendArticles.length
    ? frontendArticles
        .map((a: AnyRecord) => {
          const title = a.title || a.tieu_de || a.name || "Bài viết";
          const desc =
            a.desc || a.tom_tat || a.summary || a.content || "Không có tóm tắt";
          return `- Bài viết: "${title}". Nội dung/tóm tắt: ${desc}`;
        })
        .join("\n")
    : "Frontend không gửi dữ liệu bài viết/sự kiện.";

  const cartContext = frontendCart.length
    ? frontendCart
        .map((item: AnyRecord) => {
          const name = item.name || item.ten || item.ten_san_pham || "Sản phẩm";
          const qty = item.quantity || item.qty || item.so_luong || 1;
          const price = item.price || item.priceNum || item.gia || 0;
          return `- ${name} x${qty} (Giá đơn vị: ${formatMoney(price)})`;
        })
        .join("\n")
    : "Giỏ hàng hiện tại của khách đang trống.";

  return {
    productsContext,
    articlesContext,
    cartContext
  };
}

function pickRelevantKnowledge(message: string, corpus: string, maxChars = 70_000) {
  const questions = splitCustomerQuestions(message);
  const queryText = normalizeSearchText(questions.join(" "));
  const keywords = Array.from(
    new Set(queryText.split(" ").filter((w) => w.length >= 3))
  );

  const blocks = String(corpus || "")
    .split(/\n{2,}|---|===/g)
    .map((x) => x.trim())
    .filter((x) => x.length > 20);

  const scored = blocks.map((block) => {
    const n = normalizeSearchText(block);
    let score = 0;

    for (const kw of keywords) {
      if (n.includes(kw)) score += 3;
    }

    if (n.includes("vietnam prosperity coffee")) score += 2;
    if (n.includes("trung nguyen legend au lac")) score += 2;

    return { block, score };
  });

  const selected = scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.block);

  const output = selected.length
    ? selected.join("\n\n---\n\n")
    : String(corpus || "").slice(0, maxChars);

  return output.slice(0, maxChars);
}

function shouldTryInternetSearch(reply: string) {
  const text = String(reply || "").toLowerCase();

  return (
    text.includes("thông tin này chưa có trong dữ liệu website/quán") ||
    text.includes("chưa có trong dữ liệu") ||
    text.includes("không có trong dữ liệu nội bộ") ||
    text.includes("không đủ dữ liệu")
  );
}

const SYSTEM_PROMPT = `
Bạn là trợ lý tư vấn món tên Trang của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc tại Huế.

QUY TRÌNH ĐỌC DỮ LIỆU BẮT BUỘC:
1. Ưu tiên cao nhất: KHO KIẾN THỨC CHÍNH THỨC VPC từ file knowledge.ts.
2. Nếu knowledge.ts không đủ: dùng dữ liệu Supabase.
3. Nếu có mã đơn hàng: dùng dữ liệu đơn hàng từ database.
4. Nếu vẫn không đủ: nói rõ "Thông tin này chưa có trong dữ liệu website/quán".
5. Chỉ dùng internet khi backend cung cấp phần KẾT QUẢ TÌM KIẾM INTERNET.

TUYỆT ĐỐI KHÔNG:
- Không đọc index.html.
- Không đọc admin.html.
- Không bịa giá, chính sách, trạng thái đơn hàng, ưu đãi, địa chỉ, hotline.
- Không nói là dữ liệu của VPC nếu chỉ là kiến thức ngoài.

PHONG CÁCH:
- Trả lời tiếng Việt.
- Xưng "VPC", gọi khách là "Quý khách" hoặc "bạn".
- Lịch sự, ngắn gọn, rõ ý.
- Câu đơn giản tối đa 120 từ.
`;

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  openaiKey: string
) {
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.25,
      max_tokens: 3000
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenAI API Error details:", errText);
    throw new Error(`OpenAI API returned status ${response.status}`);
  }

  const resData = await response.json();
  return resData.choices?.[0]?.message?.content || "";
}

async function callGemini(
  systemPrompt: string,
  userPrompt: string,
  geminiKey: string
) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 1800
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API Error details:", errText);
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const resData = await response.json();

  return (
    resData.contents?.[0]?.parts?.[0]?.text ||
    resData.candidates?.[0]?.content?.parts?.[0]?.text ||
    ""
  );
}

async function searchDuckDuckGo(query: string) {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116 Safari/537.36",
        "Accept-Language": "vi,en-US;q=0.9,en;q=0.8"
      }
    });

    if (!response.ok) {
      return `Không thể kết nối DuckDuckGo (HTTP ${response.status}).`;
    }

    const html = await response.text();
    const results: { title: string; snippet: string; link: string }[] = [];
    const parts = html.split('<div class="result__body">');

    for (let i = 1; i < parts.length && results.length < 5; i++) {
      const block = parts[i].split("</div>")[0];
      const titleMatch = block.match(
        /<a[^>]+class="result__a"[^>]*>([\s\S]*?)<\/a>/
      );
      const snippetMatch = block.match(
        /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/
      );
      const linkMatch = block.match(
        /<a[^>]+class="result__url"[^>]*>([\s\S]*?)<\/a>/
      );

      if (titleMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        const snippet = snippetMatch
          ? snippetMatch[1].replace(/<[^>]+>/g, "").trim()
          : "";
        const link = linkMatch
          ? linkMatch[1].replace(/<[^>]+>/g, "").trim()
          : "";

        results.push({
          title,
          snippet,
          link: link.startsWith("http") ? link : `https://${link}`
        });
      }
    }

    if (results.length === 0) {
      return "Không tìm thấy kết quả internet nào phù hợp.";
    }

    return results
      .map(
        (r, index) =>
          `${index + 1}. ${r.title}\n${r.snippet}\nNguồn: ${r.link}`
      )
      .join("\n\n");
  } catch (error: any) {
    console.error("DuckDuckGo search error:", error);
    return `Lỗi tìm kiếm DuckDuckGo: ${error?.message || String(error)}`;
  }
}

async function searchInternet(query: string) {
  const serperKey = process.env.SERPER_API_KEY;

  if (serperKey) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": serperKey
        },
        body: JSON.stringify({
          q: query,
          gl: "vn",
          hl: "vi",
          num: 5
        })
      });

      console.log("SERPER STATUS:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        console.error("SERPER ERROR:", response.status, errText);
      } else {
        const data = await response.json();
        const organic = Array.isArray(data?.organic) ? data.organic : [];

        if (organic.length > 0) {
          const text = organic
            .slice(0, 5)
            .map((item: AnyRecord, index: number) => {
              return `${index + 1}. ${
                item.title || "Không có tiêu đề"
              }\n${item.snippet || ""}\nNguồn: ${item.link || ""}`;
            })
            .join("\n\n");

          return {
            available: true,
            text
          };
        }
      }
    } catch (error) {
      console.warn("Serper API error, falling back to DuckDuckGo:", error);
    }
  }

  const ddgText = await searchDuckDuckGo(query);
  const ok =
    !ddgText.startsWith("Lỗi") &&
    !ddgText.startsWith("Không thể") &&
    !ddgText.startsWith("Không tìm thấy");

  return {
    available: ok,
    text: ddgText
  };
}

export async function POST(req: Request) {
  let fallbackMessageForSearch = "";

  try {
    const body = await req.json();

    const message = String(
      body.message || body.question || body.prompt || ""
    ).trim();

    fallbackMessageForSearch = message;

    const context = body.context || {};
    const debug = new URL(req.url).searchParams.get("debug") === "1";

    if (!message) {
      return NextResponse.json({
        reply: "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?",
        provider: "empty-message"
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();

    const supabaseKnowledge = await loadSupabaseKnowledge();
    const orderDetails = await findOrderDetails(message);
    const orderContext = buildOrderContext(orderDetails);
    const { productsContext, articlesContext, cartContext } =
      buildFrontendContext(context);

    const fullInternalKnowledge = `
--- KHO KIẾN THỨC CHÍNH THỨC VPC / knowledge.ts ---
${VPC_KNOWLEDGE}

--- DỮ LIỆU SUPABASE ---
${compactJson(supabaseKnowledge, 60_000)}

--- DỮ LIỆU ĐƠN HÀNG ---
${orderContext}

--- GIỎ HÀNG FRONTEND ---
${cartContext}

--- SẢN PHẨM FRONTEND ---
${productsContext}

--- BÀI VIẾT FRONTEND ---
${articlesContext}
`;

    const relevantKnowledge = pickRelevantKnowledge(
      message,
      fullInternalKnowledge,
      60_000
    );

    const customerQuestions = splitCustomerQuestions(message);

    const promptWithContext = `
DỮ LIỆU ĐÃ ĐƯỢC LỌC THEO THỨ TỰ:
1. knowledge.ts
2. Supabase
3. Đơn hàng database
4. Frontend context

--- CÂU HỎI ĐÃ TÁCH ---
${customerQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

--- DỮ LIỆU LIÊN QUAN NHẤT ---
${relevantKnowledge}

--- TOÀN BỘ KNOWLEDGE CHÍNH THỨC VPC ---
${VPC_KNOWLEDGE.slice(0, 30_000)}

--- DỮ LIỆU SUPABASE MỚI NHẤT ---
${compactJson(supabaseKnowledge, 30_000)}

--- TRA CỨU ĐƠN HÀNG ---
${orderContext}

--- GIỎ HÀNG ---
${cartContext}

--- SẢN PHẨM FRONTEND ---
${productsContext}

--- BÀI VIẾT FRONTEND ---
${articlesContext}

CÂU HỎI CỦA KHÁCH:
"${message}"

YÊU CẦU TRẢ LỜI:
- Nếu knowledge.ts có thông tin, ưu tiên knowledge.ts.
- Nếu knowledge.ts không có, dùng Supabase.
- Nếu có mã đơn, dùng dữ liệu đơn hàng.
- Nếu dữ liệu nội bộ không đủ, trả lời đúng câu:
"Thông tin này chưa có trong dữ liệu website/quán".
- Không đọc index.html.
- Không đọc admin.html.
- Không bịa.
- Trả lời ngắn gọn, lịch sự.
`;

    let replyText = "";

    if (!geminiKey && !openaiKey) {
      replyText =
        "Dạ, trợ lý AI của VPC hiện đang được bảo trì kết nối hệ thống ạ. Quý khách có thể liên hệ Hotline 0389726999 để được hỗ trợ nhanh nhé ạ.";
    } else if (provider === "openai" && openaiKey) {
      try {
        replyText = await callOpenAI(SYSTEM_PROMPT, promptWithContext, openaiKey);
      } catch (openaiError) {
        console.error("OpenAI lỗi, chuyển sang Gemini:", openaiError);

        if (geminiKey) {
          replyText = await callGemini(
            SYSTEM_PROMPT,
            promptWithContext,
            geminiKey
          );
        } else {
          throw openaiError;
        }
      }
    } else if (geminiKey) {
      replyText = await callGemini(SYSTEM_PROMPT, promptWithContext, geminiKey);
    }

    let serperTried = false;
    let serperAvailable = false;

    if (shouldTryInternetSearch(replyText)) {
      const internetResult = await searchInternet(message);
      serperTried = true;
      serperAvailable = Boolean(internetResult.available);

      if (internetResult.available && internetResult.text) {
        const promptWithInternet = `
DỮ LIỆU NỘI BỘ KHÔNG ĐỦ ĐỂ TRẢ LỜI.
Dưới đây là kết quả internet tham khảo.

--- CÂU HỎI ---
${message}

--- DỮ LIỆU NỘI BỘ ĐÃ KIỂM TRA ---
${promptWithContext.slice(0, 60_000)}

--- KẾT QUẢ TÌM KIẾM INTERNET ---
${internetResult.text}

YÊU CẦU:
- Nói rõ đây là thông tin tham khảo bên ngoài.
- Không nói đây là chính sách VPC nếu knowledge.ts/Supabase không có.
`;

        if (provider === "openai" && openaiKey) {
          try {
            replyText = await callOpenAI(
              SYSTEM_PROMPT,
              promptWithInternet,
              openaiKey
            );
          } catch (openaiError) {
            console.error("OpenAI internet lỗi, chuyển sang Gemini:", openaiError);

            if (geminiKey) {
              replyText = await callGemini(
                SYSTEM_PROMPT,
                promptWithInternet,
                geminiKey
              );
            } else {
              throw openaiError;
            }
          }
        } else if (geminiKey) {
          replyText = await callGemini(
            SYSTEM_PROMPT,
            promptWithInternet,
            geminiKey
          );
        } else {
          replyText = `Dạ, thông tin này chưa có trong dữ liệu website/quán nên VPC tra cứu nhanh từ nguồn tham khảo bên ngoài cho Quý khách ạ.\n\n${internetResult.text}`;
        }
      }
    }

    if (!replyText || !replyText.trim()) {
      replyText =
        "Dạ, VPC chưa nghe rõ ý Quý khách lắm ạ. Quý khách có thể hỏi cụ thể hơn hoặc bấm các gợi ý bên dưới nhé ạ!";
    }

    return NextResponse.json({
      reply: replyText.trim(),
      provider: "knowledge-supabase-ai-serper",
      debug: debug
        ? {
            aiProvider: provider,
            geminiModel: process.env.GEMINI_MODEL || "",
            openaiModel: process.env.OPENAI_MODEL || "",
            hasSerperKey: Boolean(process.env.SERPER_API_KEY),
            serperTried,
            serperAvailable,
            sourceOrder: ["knowledge.ts", "supabase", "order", "frontend", "serper"]
          }
        : undefined
    });
  } catch (error) {
    console.error("🔴 Error in VPC Chat Route:", error);

    const debug = new URL(req.url).searchParams.get("debug") === "1";

    let fallbackReply =
      "Dạ, hệ thống AI đang hơi gián đoạn nên VPC chưa trả lời đầy đủ được ạ. Quý khách có thể hỏi lại hoặc gọi Hotline 0389726999 để được hỗ trợ nhanh nhé ạ.";

    let serperTried = false;
    let serperAvailable = false;

    try {
      const fallbackMessage = String(fallbackMessageForSearch || "").trim();

      if (fallbackMessage && process.env.SERPER_API_KEY) {
        serperTried = true;

        const internetResult = await searchInternet(fallbackMessage);
        serperAvailable = Boolean(internetResult.available);

        if (internetResult.available && internetResult.text) {
          fallbackReply =
            `Dạ, hiện AI chính đang gián đoạn nên VPC tra cứu nhanh từ nguồn tham khảo bên ngoài cho Quý khách ạ.\n\n${internetResult.text}`;
        }
      }
    } catch (searchError) {
      console.error("Lỗi Serper fallback sau khi AI lỗi:", searchError);
    }

    return NextResponse.json({
      reply: fallbackReply,
      provider: "serper-or-safe-fallback-after-ai-error",
      debug: debug
        ? {
            errorName: error instanceof Error ? error.name : "Unknown",
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : "",
            hasSerperKey: Boolean(process.env.SERPER_API_KEY),
            aiProvider: process.env.AI_PROVIDER || "",
            geminiModel: process.env.GEMINI_MODEL || "",
            serperTried,
            serperAvailable,
            fallbackMessageForSearch
          }
        : undefined
    });
  }
}