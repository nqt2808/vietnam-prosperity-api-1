const fs = require('fs');
const path = require('path');

const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');

const files = [projectIndex, desktopIndex, storefrontClient];

console.log("=== ENRICHING CHATBOT PROMOTIONS & MEMBERSHIP DETAILS ===");

const enrichedPromotions = `<strong>🔥 CHƯƠNG TRÌNH KHUYẾN MÃI SIÊU HOT TẠI TRUNG NGUYÊN LEGEND ÂU LẠC</strong><br><strong>📍 Địa chỉ:</strong> Khu TĐC Đông Nam Thủy An – Phường An Cựu, TP. Huế (Đối diện Aeon Mall Huế)<br><br>VPC hân hạnh mang đến cho Quý khách hàng các chương trình ưu đãi đặc sắc diễn ra từ ngày <strong>19/05 đến hết 30/06/2026</strong>:<br><br><strong>☀️ 1. HAPPY LUNCH – GIẢM NGAY 15% TỔNG HÓA ĐƠN ĐỒ UỐNG</strong><br>• <strong>Khung giờ vàng:</strong> 12:00 – 14:00 hàng ngày (kể cả Thứ Bảy và Chủ Nhật).<br>• <strong>Nội dung:</strong> Giảm giá trực tiếp 15% cho tất cả các món nước trong thực đơn khi Quý khách ghé quán thưởng thức hoặc đặt trực tuyến trong khung giờ trưa.<br>• <strong>Mục đích:</strong> Mang lại không gian thư giãn mát mẻ, yên tĩnh để Quý khách nạp năng lượng tiếp tục làm việc và học tập buổi chiều.<br><br><strong>🌙 2. HAPPY HOURS – MUA 1 TẶNG 1 (MUA 1 ĐƯỢC 2 CỰC ĐÃ)</strong><br>• <strong>Khung giờ vàng:</strong> 14:00 – 22:00 hàng ngày (Thứ Bảy & Chủ Nhật mở rộng đến 22:30).<br>• <strong>Nội dung:</strong> Khi mua 1 ly nước bất kỳ trong thực đơn ưu đãi, Quý khách sẽ được <strong>TẶNG NGAY 1 ly cùng loại hoặc tùy chọn</strong> trong danh mục thức uống được áp dụng.<br>• <strong>Danh mục thức uống áp dụng Mua 1 Tặng 1:</strong><br>&nbsp;&nbsp;+ <i>Trà Vải Hoa Hồng</i> (Thơm ngọt kiều diễm)<br>&nbsp;&nbsp;+ <i>Trà Đào Cam Sả</i> (Thanh mát giải nhiệt Hè)<br>&nbsp;&nbsp;+ <i>Trà Lá Nếp Sen Vàng</i> (Bùi béo, giòn củ năng sần sật)<br>&nbsp;&nbsp;+ <i>Trà Xanh Thạch Cà Phê</i> (Tỉnh thức mới lạ)<br>&nbsp;&nbsp;+ <i>Cà phê Năng Lượng Tư Duy</i> (Đậm đà truyền thống)<br>• <strong>Lưu ý:</strong> Chương trình áp dụng cho cả thưởng thức tại quán, mua mang đi (Take-away) và đặt giao hàng tận nơi qua website!<br><br>👉 Nhanh tay rủ bạn bè, đồng nghiệp ghé ngay Trung Nguyên Legend Âu Lạc trốn nóng và tận hưởng ưu đãi cực hời nhé ạ! 🍹`;

const enrichedMembership = `<strong>💳 CHƯƠNG TRÌNH KHÁCH HÀNG THÂN THIẾT (MEMBERSHIP)</strong><br><strong>Tích Điểm Tức Thì – Nâng Hạng Dễ Dàng – Nhận Đặc Quyền Đẳng Cấp</strong><br><br>VPC kết nối với hệ thống thành viên của <strong>Trung Nguyên Legend</strong> mang đến đặc quyền vượt trội cho Quý khách hàng thân thiết thông qua ứng dụng di động (App Trung Nguyên Legend):<br><br><strong>1. HẠNG BẠC (SILVER MEMBERSHIP)</strong><br>• <strong>Điều kiện kích hoạt:</strong> Có hóa đơn mua hàng đầu tiên từ <strong>70.000đ</strong> trở lên.<br>• <strong>Đặc quyền Bạc:</strong><br>&nbsp;&nbsp;+ Bắt đầu tích lũy điểm thưởng theo tỷ lệ 1% giá trị hóa đơn (10.000đ = 1 điểm).<br>&nbsp;&nbsp;+ Nhận ngay tin tức sớm nhất về các chương trình khuyến mãi, ưu đãi độc quyền.<br><br><strong>2. HẠNG VÀNG (GOLD MEMBERSHIP)</strong><br>• <strong>Điều kiện nâng hạng:</strong> Tích lũy đủ từ <strong>100 điểm</strong> trở lên.<br>• <strong>Đặc quyền Vàng:</strong><br>&nbsp;&nbsp;+ <strong>Giảm giá trực tiếp 10%</strong> cho toàn bộ thực đơn đồ ăn và thức uống khi thanh toán tại quán hoặc online.<br>&nbsp;&nbsp;+ Tặng phần quà sinh nhật đặc biệt hoặc mã giảm giá 20% trong tháng sinh nhật.<br>&nbsp;&nbsp;+ Được phép sử dụng điểm tích lũy để thanh toán trực tiếp cho hóa đơn mua hàng tiếp theo.<br><br><strong>3. HẠNG KIM CƯƠNG (PLATINUM MEMBERSHIP)</strong><br>• <strong>Điều kiện nâng hạng:</strong> Tích lũy đủ từ <strong>300 điểm</strong> trở lên.<br>• <strong>Đặc quyền Kim Cương:</strong><br>&nbsp;&nbsp;+ <strong>Giảm giá trực tiếp 15%</strong> cho toàn bộ thực đơn đồ ăn và thức uống trên mỗi hóa đơn.<br>&nbsp;&nbsp;+ Quà tặng sinh nhật đẳng cấp được thiết kế riêng dành tặng thành viên Platinum.<br>&nbsp;&nbsp;+ Ưu tiên phục vụ nhanh chóng tại quầy và khi đặt hàng trực tuyến.<br>&nbsp;&nbsp;+ Nhận vé mời tham gia miễn phí các buổi workshop chia sẻ tri thức, thưởng lãm cà phê nghệ thuật do Trung Nguyên Legend tổ chức.<br><br>📲 <strong>Hướng dẫn đăng ký:</strong> Quý khách chỉ cần quét mã QR tại quầy hoặc tải ứng dụng <strong>Trung Nguyên Legend</strong> trên App Store/Google Play, đăng ký bằng số điện thoại để bắt đầu tích lũy điểm ngay hôm nay ạ!`;

function enrichFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skipping missing file: ${filePath}`);
    return;
  }

  console.log(`Enriching details in: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Thay thế nội dung "promotions"
  // Tìm "name": "promotions" và replace phần "reply": "..."
  const promotionsRegex = /"name":\s*"promotions",([\s\S]*?)"reply":\s*"[^"]*"/g;
  if (promotionsRegex.test(content)) {
    content = content.replace(promotionsRegex, (match, p1) => {
      return `"name": "promotions",${p1}"reply": "${enrichedPromotions}"`;
    });
  } else {
    // Tránh trường hợp dùng template string ` thay vì "
    const promoTemplateRegex = /"name":\s*"promotions",([\s\S]*?)"reply":\s*`[^`]*`/g;
    if (promoTemplateRegex.test(content)) {
      content = content.replace(promoTemplateRegex, (match, p1) => {
        return `"name": "promotions",${p1}"reply": "${enrichedPromotions}"`;
      });
    }
  }

  // Thay thế nội dung "membership"
  const membershipRegex = /"name":\s*"membership",([\s\S]*?)"reply":\s*"[^"]*"/g;
  if (membershipRegex.test(content)) {
    content = content.replace(membershipRegex, (match, p1) => {
      return `"name": "membership",${p1}"reply": "${enrichedMembership}"`;
    });
  } else {
    const memberTemplateRegex = /"name":\s*"membership",([\s\S]*?)"reply":\s*`[^`]*`/g;
    if (memberTemplateRegex.test(content)) {
      content = content.replace(memberTemplateRegex, (match, p1) => {
        return `"name": "membership",${p1}"reply": "${enrichedMembership}"`;
      });
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`🎉 Successfully enriched details in: ${filePath}`);
}

files.forEach(file => enrichFile(file));
console.log("=== ENRICHMENT PROCESS COMPLETED ===");
