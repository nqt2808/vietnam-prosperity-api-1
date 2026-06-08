from pathlib import Path
import re

path = Path("server.js")
text = path.read_text(encoding="utf-8", errors="replace")

helper = r'''
function getLocalVPCChatAnswer(question) {
  const q = removeVietnameseTones(String(question || ""));

  if (
    q.includes("gio") ||
    q.includes("mo cua") ||
    q.includes("dong cua") ||
    q.includes("may gio")
  ) {
    return "Dạ, VPC mở cửa từ 06:30 đến 21:30 hằng ngày ạ.";
  }

  if (
    q.includes("dia chi") ||
    q.includes("o dau") ||
    q.includes("duong nao") ||
    q.includes("aeon")
  ) {
    return "Dạ, VPC ở Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế ạ. Hotline hỗ trợ: 038 972 6999.";
  }

  if (
    q.includes("hotline") ||
    q.includes("so dien thoai") ||
    q.includes("lien he") ||
    q.includes("goi")
  ) {
    return "Dạ, hotline của VPC là 038 972 6999 ạ.";
  }

  if (
    q.includes("chuyen khoan") ||
    q.includes("thanh toan") ||
    q.includes("vietinbank") ||
    q.includes("qr") ||
    q.includes("sepay")
  ) {
    return "Dạ, Quý khách có thể chuyển khoản VietinBank - chủ tài khoản NGO QUYNH TRANG - số tài khoản 101882692631. Nội dung chuyển khoản vui lòng ghi đúng mã đơn VPC-DH-... để hệ thống SePay tự ghi nhận nhé ạ.";
  }

  if (
    q.includes("thanh vien") ||
    q.includes("tich diem") ||
    q.includes("hang bac") ||
    q.includes("hang vang") ||
    q.includes("bach kim") ||
    q.includes("platinum")
  ) {
    return "Dạ, Quý khách có thể đăng ký thành viên miễn phí trên app Trung Nguyên Legend. Khi thanh toán, Quý khách xuất trình mã QR hoặc thẻ thành viên trên app để tích điểm và áp dụng ưu đãi. Mỗi 30.000đ mua hàng = 1 điểm, 1 điểm = 1.000đ khi quy đổi, mỗi lần đổi cần tối thiểu 30 điểm. Hạng Vàng từ 100 điểm được quà sinh nhật và giảm 10%; hạng Bạch Kim từ 300 điểm được quà sinh nhật và giảm 15% ạ.";
  }

  if (
    q.includes("ship") ||
    q.includes("giao hang") ||
    q.includes("phi giao") ||
    q.includes("van chuyen")
  ) {
    return "Dạ, để báo phí giao chính xác, VPC cần địa chỉ nhận hàng của Quý khách ạ. Sau khi có địa chỉ, cửa hàng sẽ kiểm tra phạm vi giao và xác nhận phí ship cụ thể nhé ạ.";
  }

  if (
    q.includes("dat hang") ||
    q.includes("mua") ||
    q.includes("gio hang") ||
    q.includes("order")
  ) {
    return "Dạ, Quý khách vào Menu đồ uống hoặc Vật phẩm, chọn sản phẩm rồi bấm Đặt món/Đặt mua. Sau đó vào Giỏ hàng, nhập họ tên, số điện thoại, hình thức nhận hàng và phương thức thanh toán để gửi đơn ạ.";
  }

  if (
    q.includes("ca phe") ||
    q.includes("coffee") ||
    q.includes("bac xiu") ||
    q.includes("latte") ||
    q.includes("espresso")
  ) {
    return "Dạ, nếu Quý khách thích vị đậm và tỉnh táo, VPC gợi ý nhóm cà phê phin/cà phê năng lượng. Nếu thích vị béo dễ uống, Quý khách có thể thử Bạc Xỉu, Latte hoặc các món cà phê pha chế ạ.";
  }

  if (
    q.includes("tra") ||
    q.includes("sinh to") ||
    q.includes("nuoc ep") ||
    q.includes("giai nhiet") ||
    q.includes("mat")
  ) {
    return "Dạ, nếu Quý khách muốn món thanh mát, VPC gợi ý nhóm trà, nước ép, sinh tố hoặc nước thanh nhiệt ạ. Quý khách có thể xem Menu đồ uống để chọn món phù hợp nhé ạ.";
  }

  if (
    q.includes("ai la chu") ||
    q.includes("chu so huu") ||
    q.includes("sang lap") ||
    q.includes("minh duc") ||
    q.includes("tuyet mai") ||
    q.includes("ve vpc")
  ) {
    return "Dạ, Vietnam Prosperity Coffee được thành lập năm 2025 tại Huế, đồng sáng lập bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. VPC vận hành website và kết nối khách hàng với cửa hàng Trung Nguyên Legend Âu Lạc ạ.";
  }

  return "Dạ, VPC đã nhận câu hỏi của Quý khách ạ. Hiện AI đang hơi gián đoạn, nhưng VPC có thể hỗ trợ nhanh về menu đồ uống, vật phẩm, đặt hàng, thanh toán, thành viên, địa chỉ, giờ mở cửa hoặc tra cứu đơn. Quý khách cũng có thể gọi hotline 038 972 6999 để được hỗ trợ ngay ạ.";
}
'''

if "function getLocalVPCChatAnswer(question)" not in text:
    insert_at = text.find("// Code này tạo alias để frontend cũ gọi /api/chat vẫn chạy như /api/chat-ai")
    if insert_at == -1:
        raise SystemExit("Không tìm thấy vị trí chèn helper local chat.")
    text = text[:insert_at] + helper + "\n\n" + text[insert_at:]

# Đổi catch của /api/chat-ai để không trả 500 nữa
old = r'''  } catch (error) {
    console.error("Lỗi /api/chat-ai:", error);
    return res.status(500).json({
      provider: "error",
      reply: "Trang chưa kết nối được AI lúc này. Bạn thử lại sau hoặc gọi 038 972 6999 nhé.",
      error: error.message
    });
  }
});'''

new = r'''  } catch (error) {
    console.error("Lỗi /api/chat-ai:", error);
    const fallbackQuestion = String(req.body?.question || req.body?.message || "").trim();

    return res.json({
      provider: "local-fallback-after-error",
      reply: getLocalVPCChatAnswer(fallbackQuestion),
      answer: getLocalVPCChatAnswer(fallbackQuestion),
      error: error.message
    });
  }
});'''

if old not in text:
    raise SystemExit("Không tìm thấy block catch /api/chat-ai cũ để thay. Gửi mình đoạn cuối route /api/chat-ai nếu lỗi này xuất hiện.")

text = text.replace(old, new)

path.write_text(text, encoding="utf-8")
print("Đã vá server.js: /api/chat-ai sẽ fallback local thay vì trả 500.")
