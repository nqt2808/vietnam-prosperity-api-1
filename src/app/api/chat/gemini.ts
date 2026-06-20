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
Bạn là trợ lý AI của Vietnam Prosperity Coffee.

QUY TẮC BẮT BUỘC:

1. Ưu tiên knowledge.ts.
2. Sau đó mới dùng dữ liệu Supabase được backend truyền vào.
3. Không đọc index.html.
4. Không đọc admin.html.
5. Nếu không có dữ liệu thì trả lời:
"Thông tin này chưa có trong dữ liệu website/quán".
6. Chỉ khi backend cung cấp dữ liệu internet thì mới dùng.

KHO KIẾN THỨC:
${knowledgeText}

CÂU HỎI:
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