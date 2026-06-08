import { NextResponse } from "next/server";
import { VPC_KNOWLEDGE } from "./knowledge";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const SYSTEM_PROMPT = `
Bạn là trợ lý ảo của Vietnam Prosperity Coffee.
Phải trả lời dựa trên knowledge + dữ liệu Supabase trước.
Chỉ tra cứu internet nếu không tìm thấy câu trả lời.
`;

async function callGemini(systemPrompt: string, userPrompt: string, geminiKey: string) {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: { text: `${systemPrompt}\n\nUser: ${userPrompt}` },
      maxOutputTokens: 1200,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API Error details:", errText);
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content || "";
}

async function searchInternet(query: string) {
  const serperKey = process.env.SERPER_API_KEY;
  if (!serperKey) return { available: false, text: "" };

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": serperKey,
      },
      body: JSON.stringify({ q: query, gl: "vn", hl: "vi", num: 5 }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("SERPER ERROR:", res.status, errText);
      return { available: false, text: "" };
    }

    const data = await res.json();
    const organic = Array.isArray(data?.organic) ? data.organic : [];
    if (organic.length === 0) return { available: false, text: "" };

    const text = organic
      .slice(0, 5)
      .map((item: any, idx: number) => `${idx + 1}. ${item.title || ""}\n${item.snippet || ""}\nNguồn: ${item.link || ""}`)
      .join("\n\n");

    return { available: true, text };
  } catch (err) {
    console.error("Serper internet fallback error:", err);
    return { available: false, text: "" };
  }
}

async function buildPrompt(userMessage: string, context: any) {
  // Lấy knowledge
  let prompt = `--- Knowledge ---\n${VPC_KNOWLEDGE}\n\n`;

  // Lấy dữ liệu Supabase
  const { data: products } = await supabase.from("do_uong").select("*");
  const { data: merch } = await supabase.from("vat_pham").select("*");
  const { data: orders } = await supabase.from("don_hang").select("*");
  const { data: customers } = await supabase.from("khach_hang").select("*");

  prompt += `--- Products ---\n${JSON.stringify(products)}\n\n`;
  prompt += `--- Merch ---\n${JSON.stringify(merch)}\n\n`;
  prompt += `--- Orders ---\n${JSON.stringify(orders)}\n\n`;
  prompt += `--- Customers ---\n${JSON.stringify(customers)}\n\n`;

  // Frontend context
  if (context) {
    prompt += `--- Frontend Context ---\n${JSON.stringify(context)}\n\n`;
  }

  // User message
  prompt += `User: ${userMessage}`;

  return prompt;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message || body.prompt || body.question || "";
    const context = body.context || {};

    const geminiKey = process.env.GEMINI_API_KEY;
    const serperKey = process.env.SERPER_API_KEY;

    let replyText = "";

    if (geminiKey) {
      try {
        const prompt = await buildPrompt(message, context);
        replyText = await callGemini(SYSTEM_PROMPT, prompt, geminiKey);
      } catch (geminiError) {
        console.error("Gemini error, fallback to Serper:", geminiError);
      }
    }

    let serperTried = false;
    let serperAvailable = false;

    if ((!replyText || !replyText.trim()) && serperKey) {
      serperTried = true;
      const result = await searchInternet(message);
      serperAvailable = Boolean(result.available);
      if (result.available) {
        replyText = `Dạ, hiện AI chính đang gián đoạn nên VPC tra cứu nhanh từ nguồn tham khảo bên ngoài cho Quý khách ạ.\n\n${result.text}`;
      } else {
        replyText = `Dạ, hiện hệ thống AI đang quá tải và VPC chưa tìm được kết quả internet phù hợp cho câu hỏi này ạ. Quý khách có thể hỏi lại sau ít phút hoặc gọi Hotline 0389726999 để được hỗ trợ nhanh nhé ạ.`;
      }
    }

    if (!replyText || !replyText.trim()) {
      replyText = "Dạ, VPC chưa nghe rõ ý Quý khách lắm ạ. Quý khách có thể chia sẻ cụ thể hơn hoặc bấm xem các câu hỏi gợi ý bên dưới nhé ạ!";
    }

    return NextResponse.json({
      reply: replyText.trim(),
      provider: replyText ? "gemini" : "serper-or-safe-fallback-after-ai-error",
      debug: {
        hasSerperKey: Boolean(serperKey),
        serperTried,
        serperAvailable,
        geminiModel: process.env.GEMINI_MODEL || "",
        aiProvider: process.env.AI_PROVIDER || "",
      },
    });
  } catch (error) {
    console.error("Error in AI chat route:", error);
    return NextResponse.json({
      reply: "Dạ, hệ thống AI đang gián đoạn. Quý khách có thể thử lại sau.",
      provider: "error",
      debug: {
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : "",
      },
    });
  }
}