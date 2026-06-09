export async function chatWithGemini(
  userMessage: string,
  knowledgeText: string
) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!geminiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = `
Bạn là trợ lý tư vấn món của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.

QUY TẮC BẮT BUỘC:
1. Phải đọc KHO KIẾN THỨC bên dưới trước.
2. Chỉ trả lời theo thông tin có trong KHO KIẾN THỨC.
3. Nếu không tìm thấy thông tin trong KHO KIẾN THỨC, trả đúng câu:
"Thông tin này chưa có trong dữ liệu website/quán".
4. Không bịa.
5. Không tự tra internet.
6. Trả lời tiếng Việt, ngắn gọn, lịch sự.

KHO KIẾN THỨC:
${knowledgeText}

CÂU HỎI KHÁCH:
${userMessage}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1200
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini API Error:", response.status, errText);
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const data = await response.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    data.contents?.[0]?.parts?.[0]?.text ||
    ""
  );
}