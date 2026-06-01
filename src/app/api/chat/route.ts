import { NextResponse } from 'next/server'

// Hệ thống Prompt định hình phong cách chăm sóc khách hàng của VPC
const SYSTEM_PROMPT = `
Bạn là trợ lý ảo AI thông minh, cực kỳ ấm áp và vô cùng hiếu khách của thương hiệu "Vietnam Prosperity Coffee" (VPC) - kết nối trực tiếp với cửa hàng Trung Nguyên Legend Âu Lạc tại Huế.

Quy tắc ứng xử và phong cách trả lời:
1. Thân thiện & Lịch sự: Luôn xưng hô "VPC" và gọi khách hàng là "Quý khách" hoặc "bạn". Thường xuyên sử dụng kính ngữ lịch thiệp ở cuối câu ("ạ", "dạ", "nhé ạ").
2. Chuyên môn về Cà phê: Bạn có kiến thức sâu rộng về 3 nền văn minh cà phê thế giới của Trung Nguyên Legend (Ottoman, Roman, Thiền). Hãy tư vấn nhiệt tình và tự hào.
3. Không gian quán: VPC mang đến không gian cà phê năng lượng yên tĩnh, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân khởi nghiệp tại địa chỉ khu vực Âu Lạc, Cố đô Huế.
4. BÁM SÁT DỮ LIỆU ĐƯỢC CUNG CẤP: Khi trả lời về giá cả món nước, thông tin khuyến mãi, mô tả sản phẩm hay thông tin các bài viết sự kiện của quán, bạn BẮT BUỘC phải dựa trên DỮ LIỆU THỰC TẾ được gửi kèm trong tin nhắn của người dùng bên dưới.
   - Tuyệt đối không bịa đặt sản phẩm, giá tiền hoặc sự kiện không có trong dữ liệu tham chiếu.
   - Nếu khách hỏi về món nước hoặc vật phẩm không có trong dữ liệu: Hãy trả lời lịch thiệp rằng "Dạ, hiện tại món này/vật phẩm này chưa có trên hệ thống online của VPC ạ. Quý khách có thể xem các món đặc trưng khác trong thực đơn hoặc liên hệ Hotline: 0935.20.1993 để VPC hỗ trợ ngay nhé!"
5. Ngắn gọn & Cuốn hút: Trả lời ngắn gọn, có cấu trúc tốt, xuống dòng rõ ràng, sử dụng biểu tượng cảm xúc (emoji) ấm áp. Tránh các đoạn văn quá dài dòng.
`

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not configured in environment variables!")
      return NextResponse.json({ 
        reply: "Dạ, trợ lý ảo VPC hiện đang được bảo trì nâng cấp hệ thống AI một chút ạ. Quý khách có thể xem nhanh thông tin bằng các nút gợi ý bên dưới hoặc liên hệ Hotline: 0935.20.1993 để VPC hỗ trợ ngay lập tức nhé!" 
      })
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?" })
    }

    // Đóng gói Ngữ cảnh động từ Frontend gửi lên làm tài liệu tham khảo cho AI
    const productsContext = context?.products && context.products.length > 0
      ? context.products.map((p: any) => `- ${p.ten}: Giá ${p.gia.toLocaleString('vi-VN')}đ. Mô tả: ${p.mo_ta || 'Không có mô tả'}`).join('\n')
      : "Không có dữ liệu thực đơn sản phẩm online."

    const articlesContext = context?.articles && context.articles.length > 0
      ? context.articles.map((a: any) => `- Bài viết: "${a.tieu_de}". Nội dung tóm tắt: ${a.tom_tat}`).join('\n')
      : "Không có dữ liệu bài viết sự kiện."

    // Bơm ngữ cảnh động trực tiếp vào nội dung gửi cho Gemini AI
    const promptWithContext = `
DƯỚI ĐÂY LÀ DỮ LIỆU THỰC TẾ ĐANG CÓ TẠI VPC (DÙNG LÀM TÀI LIỆU THAM CHIẾU DUY NHẤT):

--- THÔNG TIN GIỚI THIỆU CHUNG ---
- Tên công ty: Vietnam Prosperity Coffee Company Limited (VPC), hay còn gọi là Vietnam Prosperity Coffee.
- Năm thành lập: 2025 tại Huế.
- Nhà sáng lập: Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. Họ xuất phát từ niềm yêu thích cà phê và thương hiệu Trung Nguyên Legend.
- Vai trò: Sở hữu, vận hành website và cửa hàng để kết nối khách hàng với không gian năng lượng Trung Nguyên Legend Âu Lạc (Khu TĐC Đông Nam Thủy An - Phường An Cựu, TP. Huế).

--- THỰC ĐƠN ĐỒ UỐNG & VẬT PHẨM SẴN CÓ ---
${productsContext}

--- CÁC BÀI VIẾT & SỰ KIỆN NỔI BẬT ---
${articlesContext}

--------------------------------------
CÂU HỎI CỦA KHÁCH HÀNG CẦN TRẢ LỜI:
"${message}"
`

    // Gọi trực tiếp Google Gemini API qua HTTP fetch
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: promptWithContext }]
          }
        ],
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("Gemini API Error details:", errText)
      throw new Error(`Gemini API returned status ${response.status}`)
    }

    const resData = await response.json()
    
    // Trích xuất câu trả lời từ cấu trúc response của Gemini API
    const replyText = resData.contents?.[0]?.parts?.[0]?.text || 
                      resData.candidates?.[0]?.content?.parts?.[0]?.text ||
                      "Dạ, VPC chưa nghe rõ ý Quý khách lắm ạ. Quý khách có thể chia sẻ cụ thể hơn hoặc bấm xem các câu hỏi gợi ý bên dưới nhé!"

    return NextResponse.json({ reply: replyText.trim() })

  } catch (error) {
    console.error("❌ Error in VPC RAG AI Chat Route:", error)
    return NextResponse.json({ 
      reply: "Dạ, kết nối mạng của trợ lý ảo VPC đang hơi gián đoạn một chút. Quý khách có thể thử hỏi lại hoặc gọi Hotline: 0935.20.1993 để VPC phục vụ ngay ạ!" 
    })
  }
}
