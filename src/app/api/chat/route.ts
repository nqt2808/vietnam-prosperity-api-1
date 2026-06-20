import { NextResponse } from "next/server";
import { VPC_KNOWLEDGE } from "./knowledge";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Hàm helper để đọc dữ liệu realtime từ Supabase và tạo context cho Chatbot
async function getRealtimeSupabaseContext() {
  try {
    const adminSupabase = createAdminClient();
    
    // Truy vấn danh mục
    const { data: categories } = await adminSupabase
      .from('danh_muc_san_pham')
      .select('ten_danh_muc, slug');

    // Truy vấn thực đơn nước
    const { data: drinks } = await adminSupabase
      .from('san_pham_do_uong')
      .select('ten_san_pham, slug, gia_den, gia_sua, hien_thi');

    // Truy vấn vật phẩm & tồn kho
    const { data: merchandise } = await adminSupabase
      .from('san_pham_merchandise')
      .select('ten_san_pham, slug, gia, ton_kho, hien_thi');

    let ctx = "\n--- REALTIME DATABASE FROM SUPABASE (VPC) ---\n";
    ctx += "1. DANH MỤC SẢN PHẨM HIỆN CÓ:\n";
    (categories || []).forEach(c => {
      ctx += `- ${c.ten_danh_muc} (slug: ${c.slug})\n`;
    });

    ctx += "\n2. THỰC ĐƠN ĐỒ UỐNG LIVE:\n";
    (drinks || []).forEach(d => {
      if (d.hien_thi) {
        ctx += `- Món: ${d.ten_san_pham} (slug: ${d.slug}) | Giá Đen: ${d.gia_den ? d.gia_den + 'đ' : 'Không bán'} | Giá Sữa: ${d.gia_sua ? d.gia_sua + 'đ' : 'Không bán'}\n`;
      }
    });

    ctx += "\n3. DANH SÁCH VẬT PHẨM & TỒN KHO LIVE:\n";
    (merchandise || []).forEach(m => {
      if (m.hien_thi) {
        const stock = m.ton_kho !== undefined && m.ton_kho !== null ? Number(m.ton_kho) : 0;
        ctx += `- Vật phẩm: ${m.ten_san_pham} (slug: ${m.slug}) | Giá: ${m.gia}đ | Tồn kho: ${stock} | Tình trạng: ${stock <= 0 ? 'HẾT HÀNG' : 'CÒN HÀNG'}\n`;
      }
    });

    return ctx;
  } catch (err) {
    console.error("⚠️ Error building Supabase context for chatbot:", err);
    return "\n--- REALTIME DATABASE: Lỗi kết nối dữ liệu Supabase ---\n";
  }
}

// Các hàm helper phục vụ việc tìm kiếm internet khi không có dữ liệu trong knowledge & supabase
async function searchDuckDuckGo(query: string): Promise<string> {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "Accept-Language": "vi,en-US;q=0.9,en;q=0.8"
      }
    });

    if (!response.ok) {
      return `Không thể kết nối DuckDuckGo (HTTP ${response.status}).`;
    }

    const html = await response.text();
    const results: Array<{ title: string; snippet: string; link: string }> = [];
    const parts = html.split('<div class="result__body">');
    
    for (let i = 1; i < parts.length && results.length < 5; i++) {
      const block = parts[i].split('</div>')[0];
      const titleMatch = block.match(/<a[^>]+class="result__a"[^>]*>([\s\S]*?)<\/a>/);
      const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
      const linkMatch = block.match(/<a[^>]+class="result__url"[^>]*>([\s\S]*?)<\/a>/);
      
      if (titleMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        const link = linkMatch ? linkMatch[1].replace(/<[^>]+>/g, "").trim() : "";
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
      .map((r, index) => `${index + 1}. ${r.title}\n${r.snippet}\nNguồn: ${r.link}`)
      .join("\n\n");
  } catch (error: any) {
    console.error("DuckDuckGo search error:", error);
    return `Lỗi tìm kiếm DuckDuckGo: ${error.message || String(error)}`;
  }
}

async function searchInternet(query: string): Promise<{ available: boolean; text: string }> {
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

      if (response.ok) {
        const data = await response.json();
        const organic = Array.isArray(data?.organic) ? data.organic : [];
        if (organic.length > 0) {
          const text = organic
            .slice(0, 5)
            .map((item: any, index: number) => {
              return `${index + 1}. ${item.title || "Không có tiêu đề"}\n${item.snippet || ""}\nNguồn: ${item.link || ""}`;
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

  // Fallback to DuckDuckGo
  const ddgText = await searchDuckDuckGo(query);
  const ok = !ddgText.startsWith("Lỗi") && !ddgText.startsWith("Không thể");
  return {
    available: ok,
    text: ddgText
  };
}

function shouldTryInternetSearch(reply: string): boolean {
  const text = String(reply || "").toLowerCase();

  return (
    text.includes("thông tin này chưa có trong dữ liệu website/quán") ||
    text.includes("chưa có trong dữ liệu") ||
    text.includes("không có trong dữ liệu nội bộ") ||
    text.includes("không đủ dữ liệu") ||
    text.includes("chưa tìm thấy trong dữ liệu của quán") ||
    text.includes("[not_found_in_internal_data]")
  );
}

function shouldForceInternetSearch(message: string): boolean {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("thời tiết") ||
    text.includes("hôm nay") ||
    text.includes("tin tức") ||
    text.includes("giá vàng") ||
    text.includes("thế giới") ||
    text.includes("bên ngoài")
  );
}

async function chatWithOpenAI(message: string, isAdmin: boolean = false, adminContextData: any = null, supabaseContext: string = "") {
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!openaiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  let systemPrompt = "";
  let userPrompt = "";

  if (isAdmin && adminContextData) {
    // Prompt dành cho Trợ lý AI Admin (phân tích số liệu kinh doanh)
    systemPrompt = `
Bạn là Trợ lý AI Quản trị (Admin AI Assistant) vô cùng thông minh của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.

QUY TẮC BẮT BUỘC:
1. Bạn phải đọc kỹ dữ liệu kinh doanh realtime được cung cấp trong phần ADMIN CONTEXT bao gồm các đơn hàng, thực đơn, vật phẩm và khách hàng.
2. Phân tích cụ thể các số liệu này để trả lời câu hỏi của admin (Ví dụ: tính tổng doanh thu, tính trung bình đơn, lọc ra top món bán chạy/chậm, đếm số khách quay lại, tỷ lệ quay lại).
3. Đưa ra các dự báo, nhận định và giải pháp tối ưu vận hành kinh doanh thực tế dựa trên dữ liệu.
4. Trả lời bằng tiếng Việt, chuyên nghiệp, rõ ràng, phân tích sâu và khoa học dưới dạng markdown đẹp đẽ. Không trả lời chung chung hoặc tự bịa ra số liệu không có trong context.
`;
    userPrompt = `
--- ADMIN CONTEXT DATA ---
${JSON.stringify(adminContextData, null, 2)}

--- CÂU HỎI CỦA ADMIN ---
${message}
`;
  } else {
    // Prompt dành cho Trang - Trợ lý ảo Storefront của khách hàng
    systemPrompt = `
Bạn là Trang - trợ lý ảo AI vô cùng dễ thương, lịch sự và chu đáo của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc (VPC).

QUY TẮC BẮT BUỘC VỀ SỬ DỤNG DỮ LIỆU:
1. Bạn phải luôn ưu tiên tìm kiếm câu trả lời từ dữ liệu [KNOWLEDGE BASE] và [REALTIME DATABASE] (Supabase) của quán được cung cấp ở dưới trước.
2. Nếu câu hỏi của khách hàng liên quan đến quán VPC (như sản phẩm, thực đơn, giá bán, tồn kho, khuyến mãi, chính sách hội viên, địa chỉ, hotline, giờ mở cửa, quy trình đặt hàng, thanh toán...):
   - Bạn BẮT BUỘC phải trả lời chính xác theo dữ liệu này. Tuyệt đối không tự ý bịa ra thông tin hoặc giá cả khác với dữ liệu.
   - Nếu trong dữ liệu [KNOWLEDGE BASE] và [REALTIME DATABASE] không có thông tin chi tiết về câu hỏi đó, hoặc câu hỏi là về thông tin thời tiết, tin tức bên ngoài, giá vàng, địa điểm bên ngoài quán...: Bạn BẮT BUỘC phải bắt đầu câu trả lời bằng mã token chính xác là: [NOT_FOUND_IN_INTERNAL_DATA]
3. Đối với các câu hỏi khác ngoài thông tin của quán (kiến thức chung, tư vấn chung, v.v.) hoặc khi đã có dữ liệu từ internet trong context, bạn được phép sử dụng tri thức AI bên ngoài hoặc kết quả tìm kiếm internet được cung cấp để trả lời khách hàng một cách tự nhiên, bổ ích và thông minh.
4. Tuyệt đối không nhắc đến các chi tiết kỹ thuật như file code (index.html, route.ts, v.v.) hay cấu trúc lập trình của trang web.
5. Xưng hô: Xưng "VPC" hoặc "Trang" và gọi khách hàng là "Quý khách", "anh/chị", hoặc "bạn". Giữ văn phong lễ phép, ấm áp, kết thúc câu bằng các từ "ạ", "nhé ạ" (Ví dụ: "Dạ, Trang chào anh chị ạ").
`;
    userPrompt = `
--- KNOWLEDGE BASE ---
${VPC_KNOWLEDGE}
${supabaseContext}

--- CÂU HỎI CỦA KHÁCH HÀNG ---
${message}
`;
  }

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
      ]
    })
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
  let adminContextData = null;
  let openaiTried = false;
  let openaiAvailable = false;
  let openaiErrorMessage = "";

  try {
    const body = await req.json();
    message = String(body.message || body.question || body.prompt || "").trim();
    adminMode = body.adminMode === true;
    adminContextData = body.adminContext || null;
    const clientContext = body.context || "";

    if (!message) {
      return NextResponse.json({
        reply: adminMode ? "Dạ, tôi có thể giúp gì cho việc phân tích số liệu hôm nay ạ?" : "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?",
        provider: "empty-message"
      });
    }

    let replyText = "";
    openaiTried = true;

    if (adminMode && adminContextData) {
      replyText = await chatWithOpenAI(message, true, adminContextData, "");
    } else {
      const supabaseContext = await getRealtimeSupabaseContext();
      
      let combinedContext = supabaseContext;
      if (clientContext) {
        if (typeof clientContext === "string") {
          combinedContext += `\n\n--- CLIENT CONTEXT FROM WEBSITE ---\n${clientContext}`;
        } else {
          combinedContext += `\n\n--- CLIENT CONTEXT FROM WEBSITE ---\n${JSON.stringify(clientContext, null, 2)}`;
        }
      }

      replyText = await chatWithOpenAI(message, false, null, combinedContext);

      // Nếu trong dữ liệu nội bộ không có thông tin hoặc câu hỏi có từ khóa cần search internet
      if (shouldTryInternetSearch(replyText) || shouldForceInternetSearch(message)) {
        const internetResult = await searchInternet(message);
        if (internetResult.available) {
          const extraContext = `\n\n--- KẾT QUẢ TÌM KIẾM INTERNET THAM KHẢO ---\n${internetResult.text}\n\nLưu ý: Dữ liệu nội bộ của quán không có thông tin này, đây là thông tin tham khảo bên ngoài được tìm thấy từ internet. Hãy trả lời khách hàng dựa trên kết quả tìm kiếm này và ghi rõ là thông tin tham khảo nhé ạ.`;
          replyText = await chatWithOpenAI(message, false, null, combinedContext + extraContext);
        }
      }
    }
    
    // Lọc sạch token khỏi câu trả lời của khách hàng nếu có
    let cleanReply = replyText ? replyText.replace(/\[NOT_FOUND_IN_INTERNAL_DATA\]/gi, "").trim() : "";
    if (cleanReply.startsWith(":") || cleanReply.startsWith(",")) {
      cleanReply = cleanReply.substring(1).trim();
    }
    
    openaiAvailable = Boolean(cleanReply);

    return NextResponse.json({
      reply: cleanReply
        ? cleanReply
        : "Dạ, Trang chưa tìm thấy thông tin phù hợp, Quý khách cần hỗ trợ thêm thông tin gì khác không ạ?",
      provider: "openai-knowledge",
      debug: debug ? {
        adminMode,
        openaiTried,
        openaiAvailable,
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY)
      } : undefined
    });
  } catch (error) {
    openaiErrorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Chat AI route error:", error);

    return NextResponse.json({
      reply: adminMode
        ? "Dạ, hệ thống phân tích AI đang gặp gián đoạn kết nối. Quý khách vui lòng thử lại sau ít phút hoặc xem trực tiếp số liệu thống kê trên các bảng biểu nhé ạ."
        : "Dạ, hệ thống AI của Trang đang gián đoạn nên chưa đọc được dữ liệu để trả lời chính xác ạ. Quý khách vui lòng hỏi lại sau ít phút hoặc gọi Hotline 0389726999 nhé ạ.",
      provider: "openai-error",
      debug: debug ? {
        openaiTried,
        openaiAvailable,
        openaiErrorMessage,
        openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini"
      } : undefined
    });
  }
}