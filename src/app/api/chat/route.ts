import { NextResponse } from "next/server";
import { VPC_KNOWLEDGE } from "./knowledge";
import { chatWithGemini } from "./gemini";
import { searchInternet } from "./serper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function shouldUseSerper(reply: string) {
  const text = String(reply || "").toLowerCase();

  return (
    !text.trim() ||
    text.includes("thông tin này chưa có trong dữ liệu website/quán") ||
    text.includes("chưa có trong dữ liệu") ||
    text.includes("không tìm thấy")
  );
}

export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === "1";

  let message = "";
  let geminiTried = false;
  let geminiAvailable = false;
  let geminiErrorMessage = "";
  let serperTried = false;
  let serperAvailable = false;

  try {
    const body = await req.json();
    message = String(body.message || body.question || body.prompt || "").trim();

    if (!message) {
      return NextResponse.json({
        reply: "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?",
        provider: "empty-message"
      });
    }

    let replyText = "";

    try {
      geminiTried = true;
      replyText = await chatWithGemini(message, VPC_KNOWLEDGE);
      geminiAvailable = Boolean(replyText && replyText.trim());
    } catch (error) {
      geminiErrorMessage =
        error instanceof Error ? error.message : String(error);

      console.error("Gemini failed:", error);
    }

    if (shouldUseSerper(replyText)) {
      serperTried = true;

      const internetResult = await searchInternet(message);
      serperAvailable = Boolean(internetResult.available);

      if (internetResult.available && internetResult.text) {
        replyText =
          `Dạ, thông tin này chưa có trong dữ liệu website/quán nên VPC tra cứu nhanh từ nguồn tham khảo bên ngoài cho Quý khách ạ.\n\n${internetResult.text}`;
      } else if (!replyText || !replyText.trim()) {
        replyText =
          "Dạ, hiện VPC chưa tìm thấy thông tin phù hợp trong dữ liệu nội bộ và cũng chưa tra cứu được nguồn ngoài cho câu hỏi này ạ. Quý khách có thể hỏi lại rõ hơn hoặc gọi Hotline 0389726999 nhé ạ.";
      }
    }

    return NextResponse.json({
      reply: replyText.trim(),
      provider: serperTried
        ? "gemini-knowledge-then-serper"
        : "gemini-knowledge",
      debug: debug
        ? {
            sourceOrder: ["gemini", "knowledge.ts", "serper"],
            geminiTried,
            geminiAvailable,
            geminiErrorMessage,
            geminiIsOverloaded: geminiErrorMessage.includes("429"),
            hasSerperKey: Boolean(process.env.SERPER_API_KEY),
            serperTried,
            serperAvailable,
            aiProvider: "gemini",
            geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash"
          }
        : undefined
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json({
      reply:
        "Dạ, hệ thống AI đang hơi gián đoạn nên VPC chưa trả lời đầy đủ được ạ. Quý khách có thể hỏi lại hoặc gọi Hotline 0389726999 để được hỗ trợ nhanh nhé ạ.",
      provider: "safe-fallback",
      debug: debug
        ? {
            errorMessage,
            sourceOrder: ["gemini", "knowledge.ts", "serper"],
            geminiTried,
            geminiAvailable,
            geminiErrorMessage,
            geminiIsOverloaded: geminiErrorMessage.includes("429"),
            hasSerperKey: Boolean(process.env.SERPER_API_KEY),
            serperTried,
            serperAvailable,
            message
          }
        : undefined
    });
  }
}