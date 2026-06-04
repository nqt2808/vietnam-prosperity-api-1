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
4. BÁM SÁT DỮ LIỆU ĐƯỢC CUNG CẤP: Khi trả lời về giá cả món nước, thông tin khuyến mãi, mô tả sản phẩm hay thông tin các bài viết sự kiện của quán, bạn BẮT BUỘC phải dựa trên DỮ LIỆU THỰC TẾ được gửi kèm trong tin nhắn của người dùng bên dưới.
   - Tuyệt đối không bịa đặt sản phẩm, giá tiền hoặc sự kiện không có trong dữ liệu tham chiếu.
   - Nếu khách hỏi về món nước hoặc vật phẩm không có trong dữ liệu: Hãy trả lời lịch thiệp rằng "Dạ, hiện tại món này/vật phẩm này chưa có trên hệ thống online của VPC ạ. Quý khách có thể xem các món đặc trưng khác trong thực đơn hoặc liên hệ Hotline: 0935.20.1993 để VPC hỗ trợ ngay nhé!"
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
- Giờ mở cửa: 06:30 AM - 09:30 PM hàng ngày (hoặc 06:00 AM - 10:30 PM tùy theo ngày lễ và cuối tuần).
- Hotline đặt hàng / Hỗ trợ: 0935.20.1993 hoặc 0905.772.338.

💳 3. QUY TRÌNH THANH TOÁN VIETQR TỰ ĐỘNG:
- Quét mã VietQR động: Khi đặt đơn và chọn Chuyển khoản, màn hình hiển thị mã VietQR chứa chính xác số tiền đơn hàng và nội dung chuyển khoản là mã đơn hàng động (dạng VPC-DH-YYYYMMDD-HHMMSS).
- Xác thực Realtime 100%: Hệ thống sử dụng Realtime Payment Listener kết nối với database Supabase tự động phát hiện giao dịch thành công lập tức (chỉ sau 2-5 giây) và chuyển đến quầy Barista. Khách hàng KHÔNG CẦN phải chụp ảnh màn hình chuyển khoản gửi cho quán nữa.
- COD: Khách cũng có thể chọn trả tiền mặt trực tiếp cho Shipper khi nhận nước.
- Tài khoản đại diện giao dịch: Ngô Quỳnh Trang (Vietinbank: 101882692631).

🔥 4. CHƯƠNG TRÌNH KHUYẾN MÃI SIÊU HOT (19/05 - 30/06/2026):
- HAPPY LUNCH – GIẢM NGAY 15% TỔNG HÓA ĐƠN ĐỒ UỐNG: Áp dụng khung giờ vàng 12:00 – 14:00 hàng ngày (kể cả Thứ Bảy và Chủ Nhật). Giảm giá trực tiếp 15% cho tất cả các món nước trong thực đơn.
- HAPPY HOURS – MUA 1 TẶNG 1 (MUA 1 ĐƯỢC 2): Áp dụng khung giờ vàng 14:00 – 22:00 hàng ngày (cuối tuần mở rộng đến 22:30). Mua 1 ly nước tặng ngay 1 ly cùng loại hoặc tùy chọn trong danh mục: Trà Vải Hoa Hồng, Trà Đào Cam Sả, Trà Lá Nếp Sen Vàng, Trà Xanh Thạch Cà Phê, Cà phê Năng Lượng Tư Duy. Áp dụng cho cả uống tại quán, mua mang đi và giao hàng tận nơi.

💳 5. CHƯƠNG TRÌNH THẺ THÀNH VIÊN TRUNG NGUYÊN LEGEND:
- Tỷ lệ tích điểm: Chi tiêu 30.000đ = 1 điểm (áp dụng cho cả tại quán và online).
- Hạng SILVER: Có hóa đơn từ 70.000đ trở lên là tự động kích hoạt.
- Hạng GOLD (Tích lũy đủ 100 điểm ~ 3.000.000đ): Giảm ngay 10% toàn bộ thức ăn & đồ uống, có quà tặng sinh nhật và được thanh toán bằng điểm.
- Hạng PLATINUM (Tích lũy đủ 300 điểm ~ 9.000.000đ): Giảm ngay 15% toàn bộ thức ăn & đồ uống, quà tặng sinh nhật, thanh toán bằng điểm và ưu tiên phục vụ, vé workshop tri thức miễn phí.

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
`;

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not configured in environment variables!")
      return NextResponse.json({ 
        reply: "Dạ, trợ lý ảo VPC hiện đang được bảo trì nâng cấp hệ thống AI một chút ạ. Quý khách có thể xem nhanh thông tin bằng các nút gợi ý bên dưới hoặc liên hệ Hotline: 0935.20.1993 để VPC hỗ trợ ngay lập tức nhé ạ!" 
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

    // Bơm ngữ cảnh động trực tiếp vào nội dung gửi cho Gemini AI
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
                      "Dạ, VPC chưa nghe rõ ý Quý khách lắm ạ. Quý khách có thể chia sẻ cụ thể hơn hoặc bấm xem các câu hỏi gợi ý bên dưới nhé ạ!"

    return NextResponse.json({ reply: replyText.trim() })

  } catch (error) {
    console.error("🔴 Error in VPC RAG AI Chat Route:", error)
    return NextResponse.json({ 
      reply: "Dạ, kết nối mạng của trợ lý ảo VPC đang hơi gián đoạn một chút. Quý khách có thể thử hỏi lại hoặc gọi Hotline: 0935.20.1993 để VPC phục vụ ngay ạ!" 
    })
  }
}
