import { NextResponse } from "next/server";
import { VPC_KNOWLEDGE } from "./knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function shouldUseFallback(reply: string) {
  const text = String(reply || "").toLowerCase();

  return (
    !text.trim() ||
    text.includes("thông tin này chưa có trong dữ liệu website/quán") ||
    text.includes("chưa có trong dữ liệu") ||
    text.includes("không tìm thấy")
  );
}

async function chatWithOpenAI(message: string) {
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5";

  if (!openaiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const systemPrompt = `
Bạn là trợ lý AI của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.

QUY TẮC BẮT BUỘC:
1. Luôn đọc knowledge.ts trước.
2. Chỉ trả lời theo dữ liệu trong knowledge.ts.
3. Không đọc index.html.
4. Không đọc admin.html.
5. Không tự bịa thông tin.
6. Nếu không có thông tin trong knowledge.ts, trả lời đúng:
"Thông tin này chưa có trong dữ liệu website/quán".
7. Trả lời tiếng Việt, ngắn gọn, lịch sự.
`;

  const userPrompt = `
--- KNOWLEDGE.TS ---
${VPC_KNOWLEDGE}

--- CÂU HỎI ---
${message}
`;

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
  let openaiTried = false;
  let openaiAvailable = false;
  let openaiErrorMessage = "";

  try {
    const body = await req.json();
    message = String(body.message || body.question || body.prompt || "").trim();

    if (!message) {
      return NextResponse.json({
        reply: "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?",
        provider: "empty-message"
      });
    }

    openaiTried = true;
    const replyText = await chatWithOpenAI(message);
    openaiAvailable = Boolean(replyText && replyText.trim());

    return NextResponse.json({
      reply:
        replyText && replyText.trim()
          ? replyText.trim()
          : "Thông tin này chưa có trong dữ liệu website/quán.",
      provider: "openai-knowledge",
      debug: debug
        ? {
            sourceOrder: ["openai", "knowledge.ts"],
            openaiTried,
            openaiAvailable,
            openaiModel: process.env.OPENAI_MODEL || "gpt-5.5",
            hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
            shouldUseFallback: shouldUseFallback(replyText)
          }
        : undefined
    });
  } catch (error) {
    openaiErrorMessage =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      reply:
        "Dạ, hệ thống AI đang gián đoạn nên VPC chưa đọc được dữ liệu để trả lời chính xác ạ. Quý khách vui lòng hỏi lại sau ít phút hoặc gọi Hotline 0389726999 nhé ạ.",
      provider: "openai-error",
      debug: debug
        ? {
            sourceOrder: ["openai", "knowledge.ts"],
            openaiTried,
            openaiAvailable,
            openaiErrorMessage,
            hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
            openaiModel: process.env.OPENAI_MODEL || "gpt-5.5",
            message
          }
        : undefined
    });
  }
}