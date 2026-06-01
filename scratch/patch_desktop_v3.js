const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';

const newAboutImages = [
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773457/660455604_1376016174556571_698903480620260313_n_gfnhyd.jpg",
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773457/658147470_1376016321223223_8548167742163448076_n_axvtps.jpg",
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773453/z7635707229351_3a55bdc90f6cd62dd840a98fe0846012_nzeb9y.jpg"
];

// Định nghĩa chatbotIntents mới phong phú
const enrichedChatbotIntents = [
  {
    name: "shipping",
    keywords: ["ship", "giao hàng", "vận chuyển", "khoảng cách", "phí ship", "phí giao", "km", "nơi", "tận nhà", "tận nơi", "giao nước", "delivery"],
    reply: `<strong>🚚 Chính sách giao hàng của Trung Nguyên Legend Âu Lạc:</strong><br>\n• <strong>Miễn phí ship (Free ship):</strong> Cho mọi đơn hàng nước trong bán kính dưới <strong>2km</strong>.<br>\n• <strong>Bán kính từ 3km trở lên:</strong> Phí ship cực rẻ chỉ <strong>5.000đ/km</strong>.<br>\n• <strong>Phạm vi tối đa:</strong> Chúng tôi chỉ nhận giao hàng dưới <strong>10km</strong> để đảm bảo đồ uống luôn mát lạnh và giữ trọn hương vị tuyệt hảo nhất! ☕️`
  },
  {
    name: "location",
    keywords: ["địa chỉ", "ở đâu", "quán", "vị trí", "đường", "đối diện", "bản đồ", "map", "tìm", "đến", "an cựu", "thủy an", "huế", "aeon", "địa điểm", "mở cửa"],
    reply: `<strong>📍 Vị trí & Giờ hoạt động của quán:</strong><br>\n• <strong>Địa chỉ:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế (nằm ngay đối diện siêu thị <strong>Aeon Mall Huế</strong> 🏬).<br>\n• <strong>Giờ mở cửa:</strong> <strong>06:30 AM - 09:30 PM</strong> hàng ngày (kể cả cuối tuần và ngày lễ).<br>\n• Rất hân hạnh được đón tiếp quý khách ghé thăm để tận hưởng không gian mát lạnh, yên tĩnh lý tưởng để học tập và làm việc! 🤎`
  },
  {
    name: "coffee",
    keywords: ["cà phê", "cafe", "coffee", "phin", "đen", "sữa", "năng lượng", "espresso", "americano", "latte", "cappuccino", "muối", "dừa", "bạc xỉu", "trứng", "cold brew", "gợi ý cà phê"],
    reply: `<strong>☕️ Gợi ý Cà phê năng lượng đặc trưng của quán:</strong><br>\n• <strong>Cà phê truyền thống:</strong> Hãy thử ngay dòng <i>Cà phê phin năng lượng</i> hoặc <i>Success sữa đá/đá viên</i> đậm đà nguyên bản.<br>\n• <strong>Món uống hiện đại (Signature):</strong> <strong style="color: #c89b3c;">Cà phê muối Legend</strong> hoặc <strong style="color: #c89b3c;">Cà phê cốt dừa</strong> béo ngậy ngọt ngào cực kỳ được yêu thích!<br>\n• <strong>Ý vị phương Tây:</strong> Latte, Cappuccino, Americano thanh lịch.<br>\n👉 Bấm vào mục <strong>Menu Đồ Uống</strong> phía trên để chọn món ngay nhé!`
  },
  {
    name: "cold_drinks",
    keywords: ["trà", "matcha", "nước ép", "sinh tố", "đá xay", "hibiscus", "thanh nhiệt", "giải nhiệt", "hoa cúc", "đào", "sen", "sữa tươi", "cacao", "chanh dây", "cam vắt", "dừa tươi", "thanh mát"],
    reply: `<strong>🍹 Các món trà & nước giải nhiệt thanh mát:</strong><br>\n• <strong>Trà thảo mộc:</strong> <i>Trà là nếp sen vàng</i> bùi bùi thơm mát, <i>Trà đào cam sả</i> sảng khoái hoặc <i>Trà hoa cúc Chamomile</i> nhẹ nhàng.<br>\n• <strong>Thanh nhiệt ngày hè:</strong> <i>Chanh sả gừng hạt chia</i>, <i>Hibiscus chanh dây hạt chia</i> chua ngọt giải nhiệt cực đỉnh.<br>\n• <strong>Đá xay & Sinh tố:</strong> Trà xanh đá xay thơm mịn hay Kim quất đá xay mát lạnh.<br>\n👉 Hãy lựa chọn món yêu thích của bạn trong menu để thanh lọc cơ thể ngay hôm nay!`
  },
  {
    name: "merchandise",
    keywords: ["vật phẩm", "merch", "ly", "tách", "phin nhôm", "túi canvas", "g7", "sách", "dụng cụ", "hạt", "bột", "sáng tạo", "drip", "phụ kiện", "gift", "quà tặng", "canvas"],
    reply: `<strong>🎁 Chuyên mục Vật phẩm & Cà phê đóng gói Trung Nguyên Legend:</strong><br>\n• <strong>Cà phê đóng gói:</strong> Cà phê phin giấy Drip (1, 2, 4, 5), Cà phê Sáng tạo (1, 2, 3, 4, 5, 8), G7 hòa tan, Legend Special Edition.<br>\n• <strong>Dụng cụ pha chế:</strong> Phin nhôm hoa văn cổ điển, Phin inox cao cấp.<br>\n• <strong>Vật phẩm thương hiệu:</strong> Ly sứ Legend VIP đen sang trọng, Bộ tách đĩa, Bình giữ nhiệt, Túi canvas cao cấp.<br>\n👉 Kéo xuống mục <strong>Vật Phẩm Cà Phê</strong> để chọn mua làm quà tặng ý nghĩa cho người thân và đối tác!`
  },
  {
    name: "promotions",
    keywords: ["khuyến mãi", "ưu đãi", "giảm giá", "voucher", "deal", "quà", "chiết khấu", "hot", "săn", "deal hot", "chương trình khuyến mãi"],
    reply: `<strong>🔥 Chương trình khuyến mãi "Mua 1 Được 2" cực đã:</strong><br>\n• <strong>Nội dung:</strong> Mua 1 ly nước tặng ngay 1 ly cùng loại hoặc tùy chọn trong danh mục ưu đãi.<br>\n• <strong>Thời gian áp dụng:</strong> Khung giờ vàng <strong>14:00 - 21:30</strong> hàng ngày (kể cả cuối tuần) từ ngày <strong>19/05 đến hết 30/06</strong>.<br>\n• Đây là chương trình tri ân đặc biệt giúp quý khách giải nhiệt, tránh nóng và tiếp thêm năng lượng học tập, làm việc trong những ngày hè oi bức tại Huế! 🍹`
  },
  {
    name: "civilizations",
    keywords: ["văn minh", "nền văn minh", "ottoman", "roman", "thiền", "ba nền văn minh", "3 nền văn minh", "triết lý"],
    reply: `<strong>🏛️ Khám phá 3 Nền Văn Minh Cà Phê hội tụ tại quán:</strong><br>\n• <strong>Văn minh Ottoman:</strong> Coi cà phê là thức uống tâm linh, biểu tượng của sự kết nối, bang giao và sẻ chia văn hóa xã hội đậm nét Thổ Nhĩ Kỳ.<br>\n• <strong>Văn minh Roman:</strong> Đại diện cho sự khai phóng, sáng tạo khoa học kỹ thuật và nghệ thuật phương Tây tinh tế (Espresso, Latte, Cappuccino).<br>\n• <strong>Văn minh Thiền:</strong> Hội tụ triết lý phương Đông sâu sắc, nơi giọt cà phê mang lại sự tĩnh lặng, tỉnh thức, thấu hiểu và chiêm nghiệm bản thân.<br>\n👉 Hãy ghé thăm Trung Nguyên Legend Âu Lạc để trực tiếp thưởng thức và trải nghiệm sự giao thoa độc đáo này!`
  },
  {
    name: "membership",
    keywords: ["thành viên", "membership", "tích điểm", "hạng thẻ", "thẻ", "ưu đãi thành viên", "đăng ký thành viên"],
    reply: `<strong>💳 Chương trình Thành viên Premium - Vietnam Prosperity Coffee:</strong><br>\n• <strong>Hạng Đồng (Bronze):</strong> Đăng ký tài khoản nhận ngay Voucher giảm 10% đơn hàng đầu tiên.<br>\n• <strong>Hạng Bạc (Silver):</strong> Tích lũy chi tiêu đạt 1.000.000đ, giảm 5% cho mọi hóa đơn sau đó.<br>\n• <strong>Hạng Vàng (Gold):</strong> Tích lũy chi tiêu đạt 5.000.000đ, giảm 10% và nhận nước miễn phí trong ngày sinh nhật.<br>\n• <strong>Hạng Kim Cương (Diamond):</strong> Tích lũy đạt 15.000.000đ, giảm 15% trọn đời và giao hàng miễn phí dưới 5km.<br>\n👉 Bấm nút <strong>Đăng ký/Đăng nhập</strong> ở góc trên bên phải màn hình để bắt đầu tích lũy và hưởng ưu đãi dành riêng cho thành viên!`
  },
  {
    name: "vinfast_event",
    keywords: ["vinfast", "xe điện", "vf3", "vf5", "vf6", "vf7", "vf8", "lái thử", "sự kiện vinfast"],
    reply: `<strong>🚗 Sự kiện Lái thử xe điện VinFast Thế Hệ Mới:</strong><br>\n• <strong>Nội dung:</strong> Trực tiếp trải nghiệm và lái thử các mẫu xe điện thông minh siêu HOT của VinFast từ VF3, VF5, VF6, VF7 đến VF8.<br>\n• <strong>Không gian:</strong> Được tổ chức ngay tại khuôn viên thoáng đãng, sang trọng của Trung Nguyên Legend Âu Lạc.<br>\n• <strong>Ưu đãi:</strong> Khách hàng tham gia lái thử không chỉ được thưởng thức nước mát mà còn nhận ngay những phần quà lưu niệm độc quyền cực kỳ giá trị từ VinFast!`
  },
  {
    name: "nhat_cuong",
    keywords: ["nhật cường", "nghệ sĩ", "hài", "giao lưu", "diễn viên"],
    reply: `<strong>🎭 Đón tiếp Nghệ sĩ hài Nhật Cường ghé thăm quán:</strong><br>\n• Không gian năng lượng của Trung Nguyên Legend Âu Lạc rất vinh hạnh được tiếp đón và phục vụ nghệ sĩ hài danh tiếng <strong>Nhật Cường</strong> ghé thăm.<br>\n• Nghệ sĩ đã dành thời gian thưởng thức ly cà phê phin năng lượng truyền thống đậm đà của quán, bày tỏ sự yêu thích đặc biệt với không gian bài trí sách tri thức và giao lưu ấm áp, chụp hình lưu niệm cùng toàn thể khán giả và người hâm mộ tại Huế.`
  },
  {
    name: "livestream",
    keywords: ["livestream", "live", "mega live", "săn deal", "bán ly"],
    reply: `<strong>📺 Sự kiện Mega Livestream Săn Deal Hè cực chất:</strong><br>\n• Sự kiện phát sóng trực tiếp đặc biệt giới thiệu các dòng sản phẩm quà tặng cao cấp: các mẫu ly sứ Legend VIP đen huyền thoại, bình giữ nhiệt Trung Nguyên Legend chỉn chu và các gói quà tặng sang trọng.<br>\n• Trong phiên live, hàng loạt <strong>Voucher đồ uống cực sốc</strong> và ưu đãi giảm giá độc quyền đã được gửi tặng để tri ân khách hàng trực tuyến.`
  },
  {
    name: "payment",
    keywords: ["thanh toán", "chuyển khoản", "vietqr", "qr", "ngân hàng", "mã qr", "vcb", "1034103679", "quỳnh trang", "tiền mặt", "cod", "tài khoản"],
    reply: `<strong>💳 Hướng dẫn Thanh toán & Chuyển khoản VietQR tự động thông minh:</strong><br>\n• <strong>1. Quét mã VietQR động:</strong> Khi bạn tiến hành đặt đơn và chọn <i>Chuyển khoản</i>, màn hình sẽ hiển thị mã VietQR được tạo tự động chứa chính xác số tiền đơn hàng và nội dung chuyển khoản là mã đơn hàng của bạn (ví dụ: VPC-DH-...).<br>\n• <strong>2. Tự động xác thực Realtime:</strong> Hệ thống sử dụng Realtime Payment Listener kết nối với Supabase để phát hiện giao dịch thành công ngay lập tức (chỉ sau 2-5 giây) và gửi đơn đến quầy Barista. Bạn <strong>không cần</strong> phải chụp ảnh màn hình chuyển khoản gửi cho quán!<br>\n• <strong>3. Thanh toán Tiền mặt (COD):</strong> Bạn cũng có thể chọn trả tiền mặt trực tiếp cho Shipper khi nhận nước.<br>\n• <strong>Thông tin tài khoản:</strong> Ngô Quỳnh Trang (Vietcombank: <code>1034103679</code>).`
  },
  {
    name: "about_us",
    keywords: ["vietnam prosperity coffee", "tuyết mai", "minh đức", "quản lý", "sở hữu", "thành lập", "nguyễn minh đức", "nguyễn thị tuyết mai", "ngo quynh trang", "ai sở hữu", "ai quản lý", "chủ quán", "chủ sở hữu", "lịch sử", "năm thành lập", "ngô quỳnh trang", "quỳnh trang"],
    reply: `<strong>🏛️ Về Vietnam Prosperity Coffee & Nhà sáng lập:</strong><br>\n• <strong>Lịch sử & Vận hành:</strong> Vietnam Prosperity Coffee được thành lập vào năm 2025 với định hướng hoạt động trong lĩnh vực dịch vụ phục vụ đồ uống và là đơn vị nhượng quyền, vận hành chính thức cửa hàng & website hỗ trợ khách hàng kết nối với <strong>Trung Nguyên Legend Âu Lạc</strong> tại Huế.<br>\n• <strong>Đồng sở hữu:</strong> Công ty được đồng sáng lập bởi <strong>Ông Nguyễn Minh Đức</strong> và <strong>Bà Nguyễn Thị Tuyết Mai</strong>, hướng đến việc xây dựng một điểm đến cà phê chuyên nghiệp, tiện lợi và giàu cảm hứng số một tại Huế.<br>\n• <strong>Thông tin thanh toán:</strong> Tài khoản đại diện giao dịch là Bà <strong>Ngô Quỳnh Trang</strong> (Vietcombank: <code>1034103679</code>).`
  }
];

function getJsIntentsString() {
  return JSON.stringify(enrichedChatbotIntents, null, 2);
}

function patchHtmlFileRobustly(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  console.log(`\n========================================\nPatching robustly: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split(/\r?\n/);
  
  // 1. Tìm và thay thế khối quick-chat
  let startQuickChat = -1;
  let endQuickChat = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div class="quick-chat">')) {
      startQuickChat = i;
    }
    if (startQuickChat !== -1 && lines[i].includes('</div>') && endQuickChat === -1 && i > startQuickChat) {
      endQuickChat = i;
      break;
    }
  }

  if (startQuickChat !== -1 && endQuickChat !== -1) {
    const newQuickChatHtml = `    <div class="quick-chat">
      <button onclick="chatAnswer('coffee')">☕ Gợi ý Cà phê</button>
      <button onclick="chatAnswer('cool')">🍹 Món uống thanh mát</button>
      <button onclick="chatAnswer('civilizations')">🏛️ 3 Nền văn minh Cà phê</button>
      <button onclick="chatAnswer('promotions')">🔥 Chương trình Khuyến mãi</button>
      <button onclick="chatAnswer('membership')">💳 Chương trình thành viên</button>
      <button onclick="chatAnswer('location')">🚗 Địa điểm, giờ mở cửa</button>
    </div>`;
    
    // Thay thế mảng lines
    lines.splice(startQuickChat, endQuickChat - startQuickChat + 1, newQuickChatHtml);
    console.log(`✅ Patched quick-chat block (lines ${startQuickChat + 1} to ${endQuickChat + 1})`);
  } else {
    console.log('⚠️ Could not locate quick-chat HTML block!');
  }

  // Khâu lại thành chuỗi để tiếp tục xử lý
  content = lines.join('\n');

  // 2. Thay 3 ảnh trang Giới thiệu sang Cloudinary mới
  // Hàng 1
  content = content.replace(
    /src="https:\/\/images\.unsplash\.com\/photo-1495474472287-4d71bcdd2085[^"]*"/,
    `src="${newAboutImages[0]}"`
  );
  // Hàng 2
  content = content.replace(
    /src="https:\/\/scontent\.fdad2-1\.fna\.fbcdn\.net\/v\/t39\.30808-6\/660455604_1376016174556571_698903480620260313_n\.jpg[^"]*"/g,
    `src="${newAboutImages[1]}"`
  );
  // Hàng 3
  content = content.replace(
    /src="https:\/\/scontent\.fsgn2-3\.fna\.fbcdn\.net\/v\/t39\.30808-6\/674069481_122106871616884434_4197620687631812932_n\.jpg[^"]*"/g,
    `src="${newAboutImages[2]}"`
  );
  console.log('✅ Updated About Images URLs to Cloudinary');

  // 3. Cập nhật mảng chatbotIntents
  const originalChatbotIntentsRegex = /const chatbotIntents = \[.*?\];/s;
  const newChatbotIntentsCode = `const chatbotIntents = ${getJsIntentsString()};`;
  if (originalChatbotIntentsRegex.test(content)) {
    content = content.replace(originalChatbotIntentsRegex, newChatbotIntentsCode);
    console.log('✅ Updated chatbotIntents array');
  }

  // 4. Đồng bộ hóa đổi tên nhóm "Ly / Tách / Bình giữ nhiệt" -> "Ly, Tách, Bình giữ nhiệt"
  // Thay thế các biến thể
  content = content.replace(/Ly \/ Tách \/ Bình giữ nhiệt/g, "Ly, Tách, Bình giữ nhiệt");
  content = content.replace(/Ly tách & Bình/g, "Ly, Tách, Bình giữ nhiệt");
  content = content.replace(/ly-tach-binh-giu-nhiet/g, "ly-tach-binh-giu-nhiet");
  content = content.replace(/"ly-tach-binh":/g, '"ly-tach-binh-giu-nhiet":');
  content = content.replace(/slug:\s*"ly-tach-binh",\s*name:\s*"Ly tách & Bình"/g, 'slug: "ly-tach-binh-giu-nhiet", name: "Ly, Tách, Bình giữ nhiệt"');
  
  // 5. Cập nhật mô tả danh mục tĩnh
  content = content.replace(
    /"ly-tach-binh-giu-nhiet": "Ly sứ, tách sứ, bình giữ nhiệt và ly giữ nhiệt Trung Nguyên Legend\."/g,
    `"ly-tach-binh-giu-nhiet": "Ly sứ, tách sứ, bình giữ nhiệt và ly giữ nhiệt Trung Nguyên Legend."`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fully patched: ${filePath}`);
}

// Chạy patch cho cả hai file index.html
patchHtmlFileRobustly(projectIndexHtml);
patchHtmlFileRobustly(desktopIndexHtml);

console.log('\n🌟🌟🌟 DESKTOP AND PROJECT HTML ROBUSTLY PATCHED SUCCESSFULLY! 🌟🌟🌟\n');
