from pathlib import Path
import re
from datetime import datetime

path = Path("src/app/api/chat/route.ts")
text = path.read_text(encoding="utf-8", errors="replace")

backup = path.with_name(f"route.backup-chatbox-fallback-{datetime.now().strftime('%Y%m%d-%H%M%S')}.ts")
backup.write_text(text, encoding="utf-8")

helper = r'''
function normalizeLocalChatText(input: string) {
  return String(input || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function getVPCLocalFallback(message: string) {
  const q = normalizeLocalChatText(message);

  if (q.includes("chu dau tu") || q.includes("chu so huu") || q.includes("sang lap") || q.includes("ai la chu")) {
    return "Dạ, Vietnam Prosperity Coffee được đồng sáng lập bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai ạ.";
  }

  if (q.includes("gio") || q.includes("mo cua") || q.includes("dong cua") || q.includes("may gio")) {
    return "Dạ, VPC mở cửa từ 06:30 đến 21:30 hằng ngày ạ.";
  }

  if (q.includes("dia chi") || q.includes("o dau") || q.includes("aeon")) {
    return "Dạ, VPC ở Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế ạ. Hotline: 038 972 6999.";
  }

  if (q.includes("hotline") || q.includes("so dien thoai") || q.includes("lien he")) {
    return "Dạ, hotline của VPC là 038 972 6999 ạ.";
  }

  if (q.includes("thanh vien") || q.includes("tich diem") || q.includes("hang vang") || q.includes("bach kim")) {
    return "Dạ, Quý khách có thể đăng ký thành viên miễn phí trên app Trung Nguyên Legend. Khi thanh toán, Quý khách xuất trình mã QR hoặc thẻ thành viên để tích điểm. Mỗi 30.000đ = 1 điểm, 1 điểm = 1.000đ, mỗi lần đổi cần tối thiểu 30 điểm. Hạng Vàng từ 100 điểm giảm 10%, hạng Bạch Kim từ 300 điểm giảm 15% ạ.";
  }

  if (q.includes("chuyen khoan") || q.includes("thanh toan") || q.includes("vietinbank") || q.includes("qr") || q.includes("sepay")) {
    return "Dạ, Quý khách chuyển khoản VietinBank - chủ tài khoản NGO QUYNH TRANG - số tài khoản 101882692631. Nội dung chuyển khoản vui lòng ghi đúng mã đơn VPC-DH-... để hệ thống SePay tự ghi nhận nhé ạ.";
  }

  if (q.includes("ship") || q.includes("giao hang") || q.includes("phi giao")) {
    return "Dạ, để báo phí giao chính xác, VPC cần địa chỉ nhận hàng của Quý khách ạ. Cửa hàng sẽ kiểm tra phạm vi giao và xác nhận phí ship cụ thể nhé ạ.";
  }

  if (q.includes("dat hang") || q.includes("gio hang") || q.includes("order")) {
    return "Dạ, Quý khách chọn món trong Menu/Vật phẩm, thêm vào giỏ hàng, nhập họ tên, số điện thoại, hình thức nhận hàng và phương thức thanh toán để gửi đơn ạ.";
  }

  if (q.includes("ca phe") || q.includes("coffee") || q.includes("bac xiu") || q.includes("latte")) {
    return "Dạ, nếu Quý khách thích vị đậm và tỉnh táo, VPC gợi ý nhóm cà phê phin/cà phê năng lượng. Nếu thích dễ uống hơn, Quý khách có thể thử Bạc Xỉu, Latte hoặc các món cà phê pha chế ạ.";
  }

  if (q.includes("tra") || q.includes("sinh to") || q.includes("nuoc ep") || q.includes("giai nhiet")) {
    return "Dạ, nếu Quý khách muốn món thanh mát, VPC gợi ý nhóm trà, nước ép, sinh tố hoặc nước thanh nhiệt ạ.";
  }

  return "Dạ, VPC đã nhận câu hỏi của Quý khách ạ. Hiện hệ thống AI đang hơi gián đoạn, nhưng VPC vẫn có thể hỗ trợ nhanh về menu đồ uống, vật phẩm, đặt hàng, thanh toán, thành viên, địa chỉ, giờ mở cửa hoặc tra cứu đơn. Hotline hỗ trợ trực tiếp: 038 972 6999 ạ.";
}
'''

if "function getVPCLocalFallback" not in text:
    text = text.replace("export async function POST(req: Request) {", helper + "\nexport async function POST(req: Request) {", 1)

if "let incomingMessage = \"\";" not in text:
    text = text.replace("export async function POST(req: Request) {\n  try {", "export async function POST(req: Request) {\n  let incomingMessage = \"\";\n\n  try {", 1)

text = text.replace(
    'const message = body.message || body.question || body.prompt || "";',
    'const message = body.message || body.question || body.prompt || "";\n    incomingMessage = String(message || "");'
)

text = re.sub(
    r'return\s+NextResponse\.json\(\{\s*reply:\s*"Dạ, kết nối mạng của trợ lý ảo VPC đang hơi gián đoạn một chút\.[\s\S]*?debug:\s*debug\s*\?\s*\{[\s\S]*?\}\s*:\s*undefined\s*\},\s*\{\s*status:\s*500\s*\}\s*\);',
    '''return NextResponse.json({
      reply: getVPCLocalFallback(incomingMessage),
      provider: "local-fallback-after-error",
      debug: debug ? {
        errorName: error instanceof Error ? error.name : "Unknown",
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : ""
      } : undefined
    });''',
    text,
    count=1
)

path.write_text(text, encoding="utf-8")
print("Đã vá chatbox fallback trong src/app/api/chat/route.ts")
print("Backup:", backup)
