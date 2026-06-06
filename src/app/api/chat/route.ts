import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Hệ thống Prompt định hình phong cách chăm sóc khách hàng của VPC
const SYSTEM_PROMPT = `
Bạn là trợ lý ảo AI thông minh, cực kỳ ấm áp và vô cùng hiếu khách của thương hiệu "Vietnam Prosperity Coffee" (VPC) - kết nối trực tiếp với cửa hàng Trung Nguyên Legend Âu Lạc tại Huế.

Quy tắc ứng xử và phong cách trả lời:
1. Thân thiện & Lịch sự: Luôn xưng hô "VPC" và gọi khách hàng là "Quý khách" hoặc "bạn". Thường xuyên sử dụng kính ngữ lịch thiệp ở cuối câu ("ạ", "dạ", "nhé ạ").
2. Chuyên môn về Cà phê: Bạn có kiến thức sâu rộng về 3 nền văn minh cà phê thế giới của Trung Nguyên Legend (Ottoman, Roman, Thiền). Hãy tư vấn nhiệt tình và tự hào.
3. Không gian quán: VPC mang đến không gian cà phê năng lượng yên tĩnh, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân khởi nghiệp tại địa chỉ Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP. Huế (đối diện Aeon Mall Huế).
4. ƯU TIÊN DỮ LIỆU WEBSITE VÀ HỖ TRỢ KIẾN THỨC NGOÀI LINH HOẠT:
   - Khi trả lời về giá cả, thực đơn, mô tả món nước/vật phẩm, thông tin khuyến mãi, bài viết sự kiện hoặc thông tin giới thiệu của quán, bạn BẮT BUỘC phải ưu tiên hàng đầu dữ liệu thực tế của website được gửi kèm trong ngữ cảnh bên dưới. Tuyệt đối không bịa đặt thông tin sản phẩm hoặc giá tiền giả của VPC.
   - Nếu khách hàng hỏi những thông tin, kiến thức chung, hoặc sản phẩm KHÔNG CÓ trên website/ngữ cảnh được cung cấp (ví dụ: công thức pha chế chung, kiến thức về các hạt Robusta/Arabica, hoặc các câu hỏi tri thức bên ngoài khác): Bạn ĐƯỢC PHÉP sử dụng kiến thức bên ngoài của mình để trả lời một cách thông minh, lịch sự và thân thiện.
   - Khi trả lời bằng kiến thức ngoài, hãy khéo léo nhắc nhở Quý khách rằng đây là thông tin tham khảo chung, đồng thời gợi ý khách hàng có thể liên hệ Hotline: 0389726999 hoặc ghé trực tiếp cửa hàng để được VPC phục vụ chu đáo nhất.
5. Hướng dẫn các Trạng thái Đơn hàng:
   - da_dat_don / cho_chuyen_khoan: Mới đặt đơn / Chờ xử lý / Chờ chuyển khoản.
   - cho_xac_nhan_chuyen_khoan / khach_bao_da_chuyen_khoan: Đang kiểm tra giao dịch chuyển khoản VietQR.
   - da_thanh_toan / da_chuyen_khoan: Thanh toán thành công!
   - da_nhan_don: Barista đã nhận đơn.
   - dang_lam_don: Barista đang pha chế món nước.
   - da_giao_shipper / dang_giao: Shipper đã lấy nước và đang giao hàng.
   - hoan_thanh: Đã giao thành công!
   - tu_choi_don / da_huy: Đơn bị từ chối hoặc hủy.
6. Tư vấn Upsell: Nhìn vào Giỏ hàng của khách để đưa ra lời gợi ý tinh tế (ví dụ: khuyến khích khách nên gọi thêm bánh ngọt Mousse Chanh Dây hoặc Panna Cotta ăn kèm nếu họ chỉ mua cà phê phin).
7. Ngắn gọn & Cuốn hút: Trả lời ngắn gọn, có cấu trúc tốt, xuống dòng rõ ràng, sử dụng biểu tượng cảm xúc (emoji) ấm áp. Tránh các đoạn văn quá dài dòng.

--- HỆ THỐNG TRI THỨC VÀ CÂU HỎI THƯỜNG GẶP (FAQs) CỦA VPC ---

🚚 1. CHÍNH SÁCH GIAO HÀNG & SHIP HÀNG:
- Miễn phí ship (Free ship): Cho mọi đơn hàng nước trong bán kính dưới 2km.
- Bán kính từ 3km trở lên: Phí ship chỉ 5.000đ/km.
- Phạm vi giao hàng tối đa: Chỉ nhận giao hàng dưới 10km để đảm bảo thức uống luôn mát lạnh và giữ trọn hương vị tuyệt hảo nhất.

📍 2. ĐỊA CHỈ & GIỜ HOẠT ĐỘNG:
- Địa chỉ: Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế (nằm ngay đối diện siêu thị Aeon Mall Huế 🏢).
- Giờ mở cửa: 06:30 - 21:30 hàng ngày.
- Hotline đặt hàng / Hỗ trợ: 0389726999 (hoặc hiển thị dạng 038 972 6999).

💳 3. QUY TRÌNH THANH TOÁN VIETQR TỰ ĐỘNG:
- Quét mã VietQR động: Khi đặt đơn và chọn Chuyển khoản, màn hình hiển thị mã VietQR chứa chính xác số tiền đơn hàng và nội dung chuyển khoản là mã đơn hàng động (dạng VPC-DH-YYYYMMDD-HHMMSS).
- Xác thực Realtime 100%: Hệ thống sử dụng Realtime Payment Listener kết nối với database Supabase tự động phát hiện giao dịch thành công lập tức (chỉ sau 2-5 giây) và chuyển đến quầy Barista. Khách hàng KHÔNG CẦN phải chụp ảnh màn hình chuyển khoản gửi cho quán nữa.
- COD: Khách cũng có thể chọn trả tiền mặt trực tiếp cho Shipper khi nhận nước.
- Tài khoản đại diện giao dịch: Ngô Quỳnh Trang (Vietinbank: 101882692631).

🔥 4. CHƯƠNG TRÌNH KHUYẾN MÃI SIÊU HOT (19/05 - 30/06/2026):
- HAPPY LUNCH – GIẢM NGAY 15% TỔNG HÓA ĐƠN ĐỒ UỐNG: Áp dụng khung giờ vàng 12:00 – 14:00 hàng ngày (kể cả Thứ Bảy và Chủ Nhật). Giảm giá trực tiếp 15% cho tất cả các món nước trong thực đơn.
- HAPPY HOURS – MUA 1 TẶNG 1 (MUA 1 ĐƯỢC 2): Áp dụng khung giờ vàng 14:00 – 22:00 hàng ngày (cuối tuần mở rộng đến 22:30). Mua 1 ly nước tặng ngay 1 ly cùng loại hoặc tùy chọn trong danh mục: Trà Vải Hoa Hồng, Trà Đào Cam Sả, Trà Lá Nếp Sen Vàng, Trà Xanh Thạch Cà Phê, Cà phê Năng Lượng Tư Duy. Áp dụng cho cả uống tại quán, mua mang đi và giao hàng tận nơi.

💳 5. CHƯƠNG TRÌNH THÀNH VIÊN TRUNG NGUYÊN LEGEND:
- Cách đăng ký: Miễn phí trên ứng dụng Trung Nguyên Legend. Sử dụng thẻ thành viên hoặc mã QR trên app khi thanh toán để tích điểm và nhận ưu đãi.
- Cách tích điểm:
  + Mỗi 30.000đ mua hàng = 1 điểm tích lũy.
  + Quy đổi điểm: 1 điểm = 1.000đ khi thanh toán (tối thiểu 30 điểm cho mỗi lần đổi).
- Các hạng thành viên và duy trì hạng:
  + Hạng Bạc: Tích điểm 30.000đ = 1 điểm, đổi điểm tỷ lệ 1 điểm = 1.000đ.
  + Hạng Vàng (đạt từ 100 điểm): Giảm 10% trên hóa đơn thức ăn & đồ uống, tặng quà sinh nhật. Duy trì hạng cần tích lũy tối thiểu 70 điểm trong 12 tháng.
  + Hạng Bạch Kim (đạt từ 300 điểm): Giảm 15% trên hóa đơn thức ăn & đồ uống, tặng quà sinh nhật. Duy trì hạng cần tích lũy tối thiểu 200 điểm trong 12 tháng.
- Lưu ý: Xuất trình mã QR hoặc thẻ thành viên trên app trước khi thanh toán để tích điểm và áp dụng ưu đãi hạng.

🏛️ 6. VỀ VIETNAM PROSPERITY COFFEE & NHÀ SÁNG LẬP:
- VPC được thành lập vào năm 2025 tại Huế.
- Người sáng lập: Đồng sáng lập bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. Hướng đến việc xây dựng một điểm đến cà phê chuyên nghiệp, tiện lợi số một tại Huế.
- Vai trò: Sở hữu, vận hành website và cửa hàng nhượng quyền chính thức Trung Nguyên Legend Âu Lạc Huế.

🏛️ 7. KHÔNG GIAN HỌC TẬP & LÀM VIỆC LÝ TƯỞNG:
- Điều hòa 24/7 mát mẻ, yên tĩnh, ánh sáng dịu nhẹ, thích hợp học tập, ôn thi, họp nhóm và làm việc.
- WiFi miễn phí tốc độ cao ổn định không giới hạn thời gian.
- Nhiều ổ cắm điện được bố trí tại các vị trí bàn thuận tiện sạc laptop, điện thoại.

🚗 8. CÁC BÀI VIẾT & SỰ KIỆN NỔI BẬT:
- Sự kiện lái thử VinFast thế hệ mới (VF3, VF5, VF6, VF7, VF8) tại quán vào thứ 7 cuối tuần, có quà tặng và uống cafe miễn phí.
- Nghệ sĩ hài nổi tiếng Nhật Cường ghé thăm quán, thưởng thức cà phê và giao lưu cùng khán giả Huế.
- Mega Livestream Deal hot mùa hè: Giới thiệu ly sứ Legend VIP đen, bình giữ nhiệt Trung Nguyên Legend và tặng voucher đồ uống.

📚 9. TOÀN BỘ THỰC ĐƠN ĐỒ UỐNG & VẬT PHẨM BÁN HÀNG CỦA VPC:
A. THỰC ĐƠN ĐỒ UỐNG & BÁNH NGỌT:
1. Cà phê phin truyền thống:
   - Legend Đen Đá / Legend Sữa Đá: 50.000đ (đen) / 55.000đ (sữa)
   - Coffee Legend (Cà phê phin đặc biệt, đậm đà nguyên bản): 165.000đ
   - Năng Lượng Tư Duy: 36.000đ (đen) / 41.000đ (sữa)
   - Năng Lượng Sáng Tạo: 32.000đ (đen) / 37.000đ (sữa)
2. Cà phê máy Ý hiện đại:
   - Double Espresso / Americano: 48.000đ
   - Latte / Cappuccino: 73.000đ (latte) / 68.000đ (cappuccino)
   - Latte Yến Mạch / Cappuccino Yến Mạch: 79.000đ (latte) / 73.000đ (cappuccino)
   - Success Đen Đá / Success Sữa Đá: 45.000đ (đen) / 50.000đ (sữa)
3. Cà phê pha chế đặc biệt (Signature):
   - Cà phê muối Legend / Cold Brew Phương Đông: 63.000đ
   - Cà phê trứng / Cà phê cốt dừa (Cà phê dừa): 79.000đ
   - Cà phê hạnh nhân / Cà phê Mother Land: 68.000đ
   - Cà phê Cold Brew / Bạc xỉu: 48.000đ
4. Trà & Trà sữa:
   - Trà đào cam sả / Trà vải hoa hồng / Trà cam quế đá: 68.000đ
   - Trà sen vàng (Lá nếp sen vàng): 68.000đ
   - Trà sữa Legend / Trà sữa ô long: 58.000đ
5. Sinh tố & Đá xay:
   - Sinh tố theo mùa (Xoài, Bơ, Chanh Dây, Dâu): 68.000đ
   - Kim quất đá xay / Trà xanh đá xay: 58.000đ
   - Đá xay Cacao hạt dẻ: 68.000đ
6. Nước ép trái cây tươi & Nước giải nhiệt:
   - Nước ép (Cam vắt, Nước ép chanh dây, Thơm, Dưa hấu): 58.000đ
   - Nước chanh dây thơm sả / Chanh sả gừng hạt chia: 58.000đ
   - Nước chanh muối mật ong: 45.000đ
   - Trà Hibiscus thanh nhiệt: 63.000đ
   - Nước suối đóng chai: 19.000đ
7. Matcha & Cacao:
   - Matcha sữa đá / Sữa tươi trân châu đường đen: 68.000đ
   - Cacao sữa: 53.000đ
   - Sữa tươi: 38.000đ
8. Bánh ngọt ăn kèm:
   - Bánh Mousse (Chanh dây / Dâu), Bánh Tiramisu, Croissant thực dưỡng: 39.000đ
   - Panna Cotta (Xoài / Chanh dây): 29.000đ

B. VẬT PHẨM & CÀ PHÊ GÓI (MERCHANDISE):
1. Bộ quà tặng cao cấp:
   - Hộp quà giàu có Legend (hộp set quà giàu có 225g): 850.000đ
2. Cà phê hạt & Cà phê bột phin:
   - Cà phê hạt mộc Espresso (Robusta/Arabica - gói 1kg): 750.000đ
   - Cà phê Drip phin giấy (Sáng tạo 1/2/3/4/5 - hộp 10 sticks): 120.000đ
3. Ly sứ, phin pha chế:
   - Phin nhôm Trung Nguyên Legend: 130.000đ
   - Phin sứ cao cấp: 290.000đ
   - Ly sứ Legend VIP (Đen/Trắng): 350.000đ
   - Bình giữ nhiệt Trung Nguyên Legend (Trắng/Đen): 380.000đ
4. Vật phẩm phong cách sống VPC:
   - Sổ tay VPC: 95.000đ
   - Túi vải canvas VPC: 120.000đ
   - Khăn rằn Nam Bộ: 60.000đ
`;

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()
    
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY
    
    // Ưu tiên OpenAI nếu AI_PROVIDER=openai hoặc nếu có cấu hình OPENAI_API_KEY
    const provider = process.env.AI_PROVIDER || (openaiKey ? 'openai' : 'gemini')

    if (!geminiKey && !openaiKey) {
      console.warn("⚠️ Warning: Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured!")
      return NextResponse.json({ 
        reply: "Dạ, trợ lý ảo VPC hiện đang được bảo trì nâng cấp hệ thống AI một chút ạ. Quý khách có thể xem nhanh thông tin bằng các nút gợi ý bên dưới hoặc liên hệ Hotline: 0389726999 để VPC hỗ trợ ngay lập tức nhé ạ!" 
      })
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ reply: "Dạ, Quý khách cần VPC hỗ trợ thông tin gì thêm không ạ?" })
    }

    // Tra cứu đơn hàng tự động từ cơ sở dữ liệu Supabase Realtime
    let orderDetails = null
    const orderMatch = message.match(/(VPC-DH-\w+|DH-\w+)/i)
    if (orderMatch) {
      const code = orderMatch[0].toUpperCase()
      try {
        const supabase = createAdminClient()
        const { data, error } = await supabase
          .from('don_hang')
          .select(`
            *,
            thong_tin_khach_hang (
              ho_ten,
              so_dien_thoai,
              dia_chi
            )
          `)
          .eq('ma_don_hang', code)
          .maybeSingle()

        if (data && !error) {
          orderDetails = data
        }
      } catch (dbErr) {
        console.error("Lỗi khi truy vấn thông tin đơn hàng trong chatbot:", dbErr)
      }
    }

    // Đóng gói Ngữ cảnh động từ Frontend gửi lên làm tài liệu tham khảo cho AI
    const productsContext = context?.products && context.products.length > 0
      ? context.products.map((p: any) => `- ${p.ten || p.ten_san_pham}: Giá ${(p.gia || p.gia_den || p.price || 0).toLocaleString('vi-VN')}đ. Mô tả: ${p.mo_ta || p.short_description || 'Không có mô tả'}`).join('\n')
      : "Không có dữ liệu thực đơn sản phẩm online."

    const articlesContext = context?.articles && context.articles.length > 0
      ? context.articles.map((a: any) => `- Bài viết: "${a.title || a.tieu_de}". Nội dung tóm tắt: ${a.desc || a.tom_tat}`).join('\n')
      : "Không có dữ liệu bài viết sự kiện."

    const cartContext = context?.cart && context.cart.length > 0
      ? context.cart.map((item: any) => `- ${item.name || item.ten} x${item.quantity || item.qty} (Giá đơn vị: ${(item.price || item.priceNum || 0).toLocaleString('vi-VN')}đ)`).join('\n')
      : "Giỏ hàng hiện tại của khách đang trống."

    let orderContext = "Không có yêu cầu tra cứu mã đơn hàng cụ thể, hoặc mã đơn hàng chưa chính xác."
    if (orderDetails) {
      const kh = orderDetails.thong_tin_khach_hang || {}
      orderContext = `DỮ LIỆU ĐƠN HÀNG THỰC TẾ TÌM THẤY TRONG DATABASE:
- Mã đơn hàng: ${orderDetails.ma_don_hang}
- Khách hàng nhận: ${kh.ho_ten || 'Ẩn danh'} (SĐT: ${kh.so_dien_thoai || 'Ẩn'})
- Địa chỉ nhận: ${orderDetails.dia_chi_giao_hang || kh.dia_chi || 'Nhận tại quầy'}
- Món đã đặt: ${orderDetails.danh_sach_san_pham || 'Ẩn'}
- Tổng thanh toán: ${Number(orderDetails.tong_tien || 0).toLocaleString('vi-VN')}đ (Phí giao hàng: ${Number(orderDetails.phi_ship || 0).toLocaleString('vi-VN')}đ)
- Phương thức thanh toán: ${orderDetails.phuong_thuc_thanh_toan === 'chuyen_khoan' ? 'Chuyển khoản VietQR' : 'Tiền mặt (COD)'}
- Trạng thái xử lý: ${orderDetails.trang_thai} (Hãy dịch trạng thái này sang tiếng Việt thân thiện dựa trên mục 5 của System Prompt để báo cho khách)
- Thời gian đặt đơn: ${new Date(orderDetails.created_at).toLocaleString('vi-VN')}`
    }

    // Bơm ngữ cảnh động trực tiếp vào nội dung gửi cho AI
    const promptWithContext = `
DƯỚI ĐÂY LÀ DỮ LIỆU THỰC TẾ ĐANG CÓ TẠI VPC (ĐÂY LÀ TÀI LIỆU THAM CHIẾU DUY NHẤT):

--- GIỎ HÀNG HIỆN TẠI CỦA KHÁCH HÀNG ---
${cartContext}

--- KẾT QUẢ TRA CỨU ĐƠN HÀNG (DATABASE) ---
${orderContext}

--- THỰC ĐƠN ĐỒ UỐNG & VẬT PHẨM SẴN CÓ ---
${productsContext}

--- CÁC BÀI VIẾT & SỰ KIỆN NỔI BẬT ---
${articlesContext}

--------------------------------------
CÂU HỎI HOẶC YÊU CẦU CỦA KHÁCH HÀNG:
"${message}"
`

    let replyText = ""

    if (provider === 'openai' && openaiKey) {
      // ─── OpenAI ChatGPT ──────────────────────────────────────────
      const model = process.env.OPENAI_MODEL || "gpt-4o"
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: promptWithContext }
          ],
          temperature: 0.4,
          max_tokens: 800
        })
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error("OpenAI API Error details:", errText)
        throw new Error(`OpenAI API returned status ${response.status}`)
      }

      const resData = await response.json()
      replyText = resData.choices?.[0]?.message?.content || ""
    } else if (geminiKey) {
      // ─── Google Gemini ────────────────────────────────────────────
      const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`
      
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
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 800
          }
        })
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error("Gemini API Error details:", errText)
        throw new Error(`Gemini API returned status ${response.status}`)
      }

      const resData = await response.json()
      replyText = resData.contents?.[0]?.parts?.[0]?.text || 
                  resData.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }

    if (!replyText || !replyText.trim()) {
      replyText = "Dạ, VPC chưa nghe rõ ý Quý khách lắm ạ. Quý khách có thể chia sẻ cụ thể hơn hoặc bấm xem các câu hỏi gợi ý bên dưới nhé ạ!"
    }

    return NextResponse.json({ reply: replyText.trim() })

  } catch (error) {
    console.error("🔴 Error in VPC RAG AI Chat Route:", error)
    return NextResponse.json({ 
      reply: "Dạ, kết nối mạng của trợ lý ảo VPC đang hơi gián đoạn một chút. Quý khách có thể thử hỏi lại hoặc gọi Hotline: 0389726999 để VPC phục vụ ngay ạ!" 
    })
  }
}
