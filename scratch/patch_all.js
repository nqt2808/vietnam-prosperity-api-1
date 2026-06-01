const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const storefrontClient = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const globalsCss = path.join(__dirname, '../src/app/globals.css');

// 6 đoạn giới thiệu mới của khách hàng
const aboutParagraphs = [
  "Vietnam Prosperity Coffee Company Limited, hay còn được biết đến với tên gọi Vietnam Prosperity Coffee, được thành lập vào năm 2025 với định hướng hoạt động trong lĩnh vực dịch vụ phục vụ đồ uống, phát triển không gian cà phê hiện đại và mang đến những trải nghiệm thưởng thức chất lượng dành cho khách hàng tại Thành phố Huế.",
  "Công ty được đồng sở hữu bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. Xuất phát từ niềm yêu thích dành cho cà phê, sản phẩm Trung Nguyên và những giá trị trải nghiệm mà thương hiệu Trung Nguyên Legend mang lại, hai nhà sáng lập cùng hướng đến việc xây dựng một điểm đến cà phê chuyên nghiệp, tiện lợi và giàu cảm hứng cho khách hàng tại khu vực Âu Lạc nói riêng và Thành phố Huế chung.",
  "Với vai trò là đơn vị vận hành cửa hàng và website hỗ trợ khách hàng kết nối với Trung Nguyên Legend Âu Lạc, Vietnam Prosperity Coffee không chỉ tập trung vào việc phục vụ đồ uống chất lượng, mà còn chú trọng xây dựng một không gian phù hợp để khách hàng gặp gỡ, học tập, làm việc, thư giãn và tận hưởng những khoảnh khắc ý nghĩa bên ly cà phê.",
  "Chúng tôi tin rằng cà phê không chỉ là một thức uống quen thuộc trong đời sống hằng ngày, mà còn là nguồn năng lượng, cảm hứng và sự kết nối. Vì vậy, mỗi sản phẩm và dịch vụ tại Trung Nguyên Legend Âu Lạc đều được hướng đến sự chỉn chu, tiện lợi và thân thiện, nhằm mang lại trải nghiệm tốt hơn cho từng khách hàng khi ghé thăm hoặc đặt hàng trực tuyến.",
  "Thông qua website này, Vietnam Prosperity Coffee mong muốn mang đến một kênh hỗ trợ nhanh chóng và thuận tiện, giúp khách hàng dễ dàng xem menu đồ uống, lựa chọn món yêu thích, đặt hàng, theo dõi đơn hàng và tìm hiểu thêm về các sản phẩm cà phê, dụng cụ pha chế, ly tách, bộ quà tặng cùng các vật phẩm thương hiệu của Trung Nguyên Legend đang được cung cấp tại cửa hàng Âu Lạc.",
  "Trong quá trình phát triển, Vietnam Prosperity Coffee luôn hướng đến tinh thần chuyên nghiệp, tận tâm và không ngừng hoàn thiện. Chúng tôi kỳ vọng website này sẽ trở thành cầu nối hiệu quả giữa khách hàng và Trung Nguyên Legend Âu Lạc, đồng thời góp phần lan tỏa giá trị của cà phê năng lượng, không gian truyền cảm hứng và phong cách phục vụ hiện đại đến cộng đồng yêu cà phê tại Huế."
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
    keywords: ["địa chỉ", "ở đâu", "quán", "vị trí", "đường", "đối diện", "bản đồ", "map", "tìm", "đến", "an cựu", "thủy an", "huế", "aeon"],
    reply: `<strong>📍 Vị trí & Giờ hoạt động của quán:</strong><br>\n• <strong>Địa chỉ:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế (nằm ngay đối diện siêu thị <strong>Aeon Mall Huế</strong> 🏬).<br>\n• <strong>Giờ mở cửa:</strong> <strong>06:30 AM - 09:30 PM</strong> hàng ngày (kể cả cuối tuần và ngày lễ).<br>\n• Rất hân hạnh được đón tiếp quý khách ghé thăm để tận hưởng không gian mát lạnh, yên tĩnh lý tưởng để học tập và làm việc! 🤎`
  },
  {
    name: "coffee",
    keywords: ["cà phê", "cafe", "coffee", "phin", "đen", "sữa", "năng lượng", "espresso", "americano", "latte", "cappuccino", "muối", "dừa", "bạc xỉu", "trứng", "cold brew"],
    reply: `<strong>☕️ Gợi ý Cà phê năng lượng đặc trưng của quán:</strong><br>\n• <strong>Cà phê truyền thống:</strong> Hãy thử ngay dòng <i>Cà phê phin năng lượng</i> hoặc <i>Success sữa đá/đá viên</i> đậm đà nguyên bản.<br>\n• <strong>Món uống hiện đại (Signature):</strong> <strong style="color: #c89b3c;">Cà phê muối Legend</strong> hoặc <strong style="color: #c89b3c;">Cà phê cốt dừa</strong> béo ngậy ngọt ngào cực kỳ được yêu thích!<br>\n• <strong>Ý vị phương Tây:</strong> Latte, Cappuccino, Americano thanh lịch.<br>\n👉 Bấm vào mục <strong>Menu Đồ Uống</strong> phía trên để chọn món ngay nhé!`
  },
  {
    name: "cold_drinks",
    keywords: ["trà", "matcha", "nước ép", "sinh tố", "đá xay", "hibiscus", "thanh nhiệt", "giải nhiệt", "hoa cúc", "đào", "sen", "sữa tươi", "cacao", "chanh dây", "cam vắt", "dừa tươi"],
    reply: `<strong>🍹 Các món trà & nước giải nhiệt thanh mát:</strong><br>\n• <strong>Trà thảo mộc:</strong> <i>Trà là nếp sen vàng</i> bùi bùi thơm mát, <i>Trà đào cam sả</i> sảng khoái hoặc <i>Trà hoa cúc Chamomile</i> nhẹ nhàng.<br>\n• <strong>Thanh nhiệt ngày hè:</strong> <i>Chanh sả gừng hạt chia</i>, <i>Hibiscus chanh dây hạt chia</i> chua ngọt giải nhiệt cực đỉnh.<br>\n• <strong>Đá xay & Sinh tố:</strong> Trà xanh đá xay thơm mịn hay Kim quất đá xay mát lạnh.<br>\n👉 Hãy lựa chọn món yêu thích của bạn trong menu để thanh lọc cơ thể ngay hôm nay!`
  },
  {
    name: "merchandise",
    keywords: ["vật phẩm", "merch", "ly", "tách", "phin nhôm", "túi canvas", "g7", "sách", "dụng cụ", "hạt", "bột", "sáng tạo", "drip", "phụ kiện", "gift", "quà tặng", "canvas"],
    reply: `<strong>🎁 Chuyên mục Vật phẩm & Cà phê đóng gói Trung Nguyên Legend:</strong><br>\n• <strong>Cà phê đóng gói:</strong> Cà phê phin giấy Drip (1, 2, 4, 5), Cà phê Sáng tạo (1, 2, 3, 4, 5, 8), G7 hòa tan, Legend Special Edition.<br>\n• <strong>Dụng cụ pha chế:</strong> Phin nhôm hoa văn cổ điển, Phin inox cao cấp.<br>\n• <strong>Vật phẩm thương hiệu:</strong> Ly sứ Legend VIP đen sang trọng, Bộ tách đĩa, Bình giữ nhiệt, Túi canvas cao cấp.<br>\n👉 Kéo xuống mục <strong>Vật Phẩm Cà Phê</strong> để chọn mua làm quà tặng ý nghĩa cho người thân và đối tác!`
  },
  {
    name: "promotions",
    keywords: ["khuyến mãi", "ưu đãi", "giảm giá", "voucher", "deal", "quà", "chiết khấu", "hot", "săn", "deal hot"],
    reply: `<strong>🔥 Chương trình khuyến mãi "Mua 1 Được 2" cực đã:</strong><br>\n• <strong>Nội dung:</strong> Mua 1 ly nước tặng ngay 1 ly cùng loại hoặc tùy chọn trong danh mục ưu đãi.<br>\n• <strong>Thời gian áp dụng:</strong> Khung giờ vàng <strong>14:00 - 21:30</strong> hàng ngày (kể cả cuối tuần) từ ngày <strong>19/05 đến hết 30/06</strong>.<br>\n• Đây là chương trình tri ân đặc biệt giúp quý khách giải nhiệt, tránh nóng và tiếp thêm năng lượng học tập, làm việc trong những ngày hè oi bức tại Huế! 🍹`
  },
  {
    name: "civilizations",
    keywords: ["văn minh", "nền văn minh", "ottoman", "roman", "thiền", "ba nền văn minh", "3 nền văn minh", "triết lý"],
    reply: `<strong>🏛️ Khám phá 3 Nền Văn Minh Cà Phê hội tụ tại quán:</strong><br>\n• <strong>Văn minh Ottoman:</strong> Coi cà phê là thức uống tâm linh, biểu tượng của sự kết nối, bang giao và sẻ chia văn hóa xã hội đậm nét Thổ Nhĩ Kỳ.<br>\n• <strong>Văn minh Roman:</strong> Đại diện cho sự khai phóng, sáng tạo khoa học kỹ thuật và nghệ thuật phương Tây tinh tế (Espresso, Latte, Cappuccino).<br>\n• <strong>Văn minh Thiền:</strong> Hội tụ triết lý phương Đông sâu sắc, nơi giọt cà phê mang lại sự tĩnh lặng, tỉnh thức, thấu hiểu và chiêm nghiệm bản thân.<br>\n👉 Hãy ghé thăm Trung Nguyên Legend Âu Lạc để trực tiếp thưởng thức và trải nghiệm sự giao thoa độc đáo này!`
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

// Chuyển đổi mảng Intents thành string code
function getJsIntentsString() {
  return JSON.stringify(enrichedChatbotIntents, null, 2);
}

// 1. Cập nhật globals.css
function patchGlobalsCss() {
  console.log(`\n========================================\nPatching: ${globalsCss}`);
  let content = fs.readFileSync(globalsCss, 'utf8');
  
  const customScrollbarClass = `
/* Chatbot Suggest Scrollbar */
.custom-scrollbar-chat {
  scrollbar-width: thin;
  scrollbar-color: #c89b3c rgba(27, 18, 12, 0.4);
}

.custom-scrollbar-chat::-webkit-scrollbar {
  height: 4px !important;
  display: block !important;
}

.custom-scrollbar-chat::-webkit-scrollbar-track {
  background: rgba(27, 18, 12, 0.2);
  border-radius: 999px;
}

.custom-scrollbar-chat::-webkit-scrollbar-thumb {
  background: #c89b3c;
  border-radius: 999px;
  transition: background 0.2s;
}

.custom-scrollbar-chat::-webkit-scrollbar-thumb:hover {
  background: #f4d17b;
}
`;

  if (!content.includes('.custom-scrollbar-chat')) {
    content += '\n' + customScrollbarClass;
    fs.writeFileSync(globalsCss, content, 'utf8');
    console.log('Successfully appended .custom-scrollbar-chat class to globals.css');
  } else {
    console.log('.custom-scrollbar-chat class already exists in globals.css');
  }
}

// 2. Cập nhật các file index.html
function patchIndexHtml(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  console.log(`\n========================================\nPatching: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // A. CSS của quick-chat và scrollbar
  const originalQuickChatCss = /\.quick-chat\s*\{[^}]*width:\s*none;[^}]*\}/s;
  const newQuickChatCss = `.quick-chat {
      display: flex;
      overflow-x: auto;
      gap: 8px;
      padding: 0 14px 12px;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: var(--gold) rgba(58, 33, 20, 0.08);
    }`;

  content = content.replace(originalQuickChatCss, newQuickChatCss);
  content = content.replace(/\.quick-chat::-webkit-scrollbar\s*\{[^}]*none;[^}]*\}/s, `.quick-chat::-webkit-scrollbar {
      height: 5px;
      display: block;
    }
    .quick-chat::-webkit-scrollbar-track {
      background: rgba(58, 33, 20, 0.05);
      border-radius: 999px;
    }
    .quick-chat::-webkit-scrollbar-thumb {
      background: var(--gold);
      border-radius: 999px;
      transition: background 0.2s;
    }
    .quick-chat::-webkit-scrollbar-thumb:hover {
      background: var(--gold-light);
    }`);

  // B. Cập nhật trang Giới thiệu mới 100% (bố cục dích dắc 3 hàng)
  const originalAboutSectionRegex = /<!-- ABOUT PAGE -->\s*<main id="about"[^>]*>.*?<\/main>/s;
  const newAboutSection = `<!-- ABOUT PAGE -->
  <main id="about" class="page">
    <section class="sub-hero">
      <div class="container">
        <h1>Giới thiệu</h1>
        <p>Vietnam Prosperity Coffee là đơn vị sở hữu và vận hành website hỗ trợ khách hàng kết nối với Trung Nguyên Legend Âu Lạc.</p>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container" style="max-width: 1200px;">
        <!-- Row 1: Ảnh trái, Chữ phải -->
        <div class="about-row">
          <div class="about-img-col">
            <img class="about-img"
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
              alt="VPC Cà phê năng lượng" />
          </div>
          <div class="about-text">
            <h2 style="font-size: 36px; margin-bottom: 18px; color: var(--coffee-dark); font-weight: 900;">Về chúng tôi</h2>
            <p>
              ${aboutParagraphs[0]}
            </p>
            <p>
              ${aboutParagraphs[1]}
            </p>
          </div>
        </div>

        <!-- Row 2: Chữ trái, Ảnh phải (Zigzag) -->
        <div class="about-row reverse">
          <div class="about-img-col">
            <img class="about-img"
              src="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/660455604_1376016174556571_698903480620260313_n.jpg?stp=dst-jpg_p960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHiReb_y6I50Dvzr0qq3ogLR4dJIIjg-alHh0kgiOD5qbnm80_-e1xiA--564npcEF_S1DicSvr7Qvkc-X_i9Wq&_nc_ohc=HTzCnH8BhdcQ7kNvwGEk3b1&_nc_oc=AdpMKRpZkIad5T8DDjcfL5TX7CiI03fMlQLdViXQQqvHUXBUVrmFtuxtJt3b_X-ZWB4SdbG3oC-LkZxNJxQaopap&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=5d35D0H2Mg3Iw7p6HP7ltA&_nc_ss=7b2a8&oh=00_Af5NrJ_0DG-bVPbSMmHIo_qyD-Od1AXK-gJbMHMkuYuS1Q&oe=6A0FF6D7"
              alt="Không gian Trung Nguyên Legend Âu Lạc" />
          </div>
          <div class="about-text">
            <p>
              ${aboutParagraphs[2]}
            </p>
            <p>
              ${aboutParagraphs[3]}
            </p>
          </div>
        </div>

        <!-- Row 3: Ảnh trái, Chữ phải -->
        <div class="about-row">
          <div class="about-img-col">
            <img class="about-img"
              src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/674069481_122106871616884434_4197620687631812932_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&oh=00_Af6KGmJ7_cqKYnYij_BIUHs-ik4iJIQ1cndhZuNNUD2r1g&oe=6A136B60"
              alt="Sách tri thức và vật phẩm" />
          </div>
          <div class="about-text">
            <p>
              ${aboutParagraphs[4]}
            </p>
            <p style="margin-bottom: 24px;">
              ${aboutParagraphs[5]}
            </p>
            <button class="btn btn-primary" onclick="showPage('contact')">Liên hệ ngay</button>
          </div>
        </div>
      </div>
    </section>
  </main>`;

  content = content.replace(originalAboutSectionRegex, newAboutSection);

  // C. Cập nhật các nút câu hỏi gợi ý chatbot trong HTML tĩnh
  const originalQuickChatHtml = /<div class="quick-chat">.*?<\/div>/s;
  const newQuickChatHtml = `<div class="quick-chat">
      <button onclick="chatAnswer('coffee')">☕ Gợi ý Cà phê năng lượng</button>
      <button onclick="chatAnswer('cool')">🍹 Món uống thanh mát</button>
      <button onclick="chatAnswer('civilizations')">🏛️ 3 Nền văn minh Cà phê</button>
      <button onclick="chatAnswer('promotions')">🔥 Khuyến mãi Mua 1 Được 2</button>
      <button onclick="chatAnswer('vinfast_event')">🚗 Sự kiện lái thử VinFast</button>
      <button onclick="chatAnswer('nhat_cuong')">🎭 Nghệ sĩ Nhật Cường ghé thăm</button>
      <button onclick="chatAnswer('payment')">💳 Hướng dẫn thanh toán VietQR</button>
      <button onclick="chatAnswer('order')">📦 Quy trình đặt hàng</button>
    </div>`;
  content = content.replace(originalQuickChatHtml, newQuickChatHtml);

  // D. Cập nhật hàm chatAnswer(type) để xử lý các gợi ý mới (Dùng dấu nháy đơn thay cho backtick lồng để tránh lỗi compile)
  const originalChatAnswerFunc = /function chatAnswer\(type\)\s*\{.*?\}\s*\n\s*\n\s*\/\/ 10\./s;
  const newChatAnswerFunc = `function chatAnswer(type) {
      const answers = {
        coffee: '<strong>☕️ Gợi ý Cà phê năng lượng đặc trưng của quán:</strong><br>• Hãy thử ngay dòng Cà phê phin năng lượng hoặc Success sữa đá cực kỳ đậm đà truyền thống.<br>• Hoặc Cà phê muối Legend, Cà phê cốt dừa béo ngậy siêu ngon!',
        cool: '<strong>🍹 Các món trà & nước giải nhiệt thanh mát:</strong><br>• Trà thảo mộc: Trà là nếp sen vàng, Trà đào cam sả.<br>• Giải nhiệt hè: Hibiscus chanh dây hạt chia, Chanh sả gừng hạt chia hoặc nước ép trái cây tươi mát lạnh!',
        civilizations: '<strong>🏛️ Khám phá 3 Nền Văn Minh Cà Phê tại quán:</strong><br>• <strong>Ottoman:</strong> Cà phê tâm linh và kết nối xã hội.<br>• <strong>Roman:</strong> Cà phê khai phóng, sáng tạo khoa học kỹ thuật hiện đại.<br>• <strong>Thiền:</strong> Cà phê tĩnh lặng, triết lý chiêm nghiệm bản thân phương Đông.',
        promotions: '<strong>🔥 Khuyến mãi "Mua 1 Được 2" siêu hot:</strong><br>• Áp dụng trong khung giờ vàng <strong>14:00 - 21:30</strong> hàng ngày (từ 19/05 đến 30/06) khi mua các món nước tại quán. Rủ cạ cứng đi tránh nóng ngay nào!',
        vinfast_event: '<strong>🚗 Sự kiện Lái thử xe điện VinFast:</strong><br>• Lái thử các dòng xe thông minh VF3, VF5, VF6, VF7, VF8 tại không gian quán mát mẻ và nhận quà tặng lưu niệm VinFast vô cùng độc đáo.',
        nhat_cuong: '<strong>🎭 Nghệ sĩ hài Nhật Cường ghé thăm:</strong><br>• Nghệ sĩ Nhật Cường đã thưởng thức cà phê phin năng lượng, khen ngợi tủ sách tri thức đặc sắc của quán và giao lưu chụp ảnh cùng nhiều khán giả tại quán.',
        payment: '<strong>💳 Hướng dẫn thanh toán chuyển khoản tự động VietQR:</strong><br>• Khi đặt hàng chuyển khoản, bạn quét mã VietQR tự động. Hệ thống sẽ phát hiện giao dịch thành công realtime qua kết nối Supabase sau 2-5 giây và chuyển barista chuẩn bị ngay. Không cần chụp màn hình chuyển khoản gửi quán! Chủ tài khoản: Ngô Quỳnh Trang (Vietcombank: 1034103679).',
        order: '<strong>📦 Quy trình đặt hàng siêu tốc:</strong><br>1. Vào menu chọn món ăn/đồ uống/vật phẩm rồi bấm Đặt hàng.<br>2. Vào Giỏ hàng điền thông tin người nhận.<br>3. Chọn thanh toán chuyển khoản hoặc tiền mặt và bấm xác nhận. Theo dõi tiến trình qua Tra cứu đơn hàng.'
      };

      const replyMsg = answers[type] || "Trang đang tìm câu trả lời...";
      const buttonText = document.querySelector('button[onclick="chatAnswer(\'" + type + "\')"]') ? document.querySelector('button[onclick="chatAnswer(\'" + type + "\')"]').innerText : 'Gợi ý nhanh';
      
      document.getElementById("chatMessagesList").innerHTML += '<div class="chat-msg user">' + buttonText + '</div><div class="chat-msg bot">' + replyMsg + '</div>';
      const chatBody = document.getElementById("chatBody");
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // 10.`;

  content = content.replace(originalChatAnswerFunc, newChatAnswerFunc);

  // E. Cập nhật hàm handleLookupOrder trong HTML tĩnh để hiển thị hóa đơn và tiến trình chuẩn bị của Barista (Không dùng backtick lồng)
  const originalLookupOrderFunc = /async function handleLookupOrder\(event\)\s*\{.*?\}\s*\n\s*\/\/ 11\./s;
  const newLookupOrderFunc = `async function handleLookupOrder(event) {
      event.preventDefault();
      const codeInput = document.getElementById("lookupOrderCode");
      const code = codeInput ? codeInput.value.trim() : "";
      const resultBox = document.getElementById("lookupResultBox");

      if (!code) {
        alert("Vui lòng nhập mã đơn hàng.");
        return;
      }

      resultBox.innerHTML = "<p>Đang tìm kiếm thông tin đơn hàng...</p>";
      resultBox.style.display = "block";

      try {
        const response = await fetch(API_URL + '/api/don-hang/' + code);
        if (!response.ok) {
          throw new Error("Không tìm thấy đơn hàng");
        }
        const result = await response.json();
        const order = result.data || result;

        if (!order || (!order.ma_don_hang && !order.order_number)) {
          resultBox.innerHTML = "<p style='color: #8e2b20;'>Không tìm thấy đơn hàng với mã đã nhập. Vui lòng kiểm tra lại.</p>";
          return;
        }

        const status = order.trang_thai || order.status;
        const paymentMethod = order.phuong_thuc_thanh_toan || order.payment_method;
        const total = order.tong_tien || order.total;
        const shippingAddress = order.dia_chi || (order.shipping_address ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address).address : order.shipping_address.address) : "Nhận tại cửa hàng");
        const name = order.ho_ten || (order.shipping_address ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address).name : order.shipping_address.name) : "");
        const phone = order.so_dien_thoai || (order.shipping_address ? (typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address).phone : order.shipping_address.phone) : "");

        // 1. Phân tích Barista Progress
        let currentStepIdx = 0;
        const initStatuses = ['da_dat_don', 'cho_chuyen_khoan', 'cho_xac_nhan_chuyen_khoan', 'khach_bao_da_chuyen_khoan'];
        const prepareStatuses = ['da_thanh_toan', 'da_nhan_don', 'dang_lam_don', 'da_chuyen_khoan'];
        const shippingStatuses = ['da_giao_shipper'];
        const doneStatuses = ['hoan_thanh'];

        if (initStatuses.includes(status)) currentStepIdx = 0;
        else if (prepareStatuses.includes(status)) currentStepIdx = 1;
        else if (shippingStatuses.includes(status)) currentStepIdx = 2;
        else if (doneStatuses.includes(status)) currentStepIdx = 3;

        let baristaExplanation = "";
        if (status === 'da_dat_don') {
          baristaExplanation = "📩 <b>Hệ thống đã tiếp nhận:</b> Đơn hàng đã được nhận thành công và đang chờ barista in hóa đơn chuẩn bị.";
        } else if (status === 'cho_chuyen_khoan') {
          baristaExplanation = "💳 <b>Chờ quét mã thanh toán:</b> Đơn hàng của bạn đang chờ thực hiện giao dịch chuyển khoản VietQR tự động.";
        } else if (status === 'cho_xac_nhan_chuyen_khoan' || status === 'khach_bao_da_chuyen_khoan') {
          baristaExplanation = "🔄 <b>Đang xác minh giao dịch:</b> Hệ thống đã nhận được báo báo chuyển khoản, đang đối soát số dư ngân hàng realtime.";
        } else if (status === 'da_thanh_toan' || status === 'da_nhan_don' || status === 'da_chuyen_khoan') {
          baristaExplanation = "☕ <b>Barista tiếp nhận:</b> Thanh toán thành công! Barista đang tập hợp nguyên liệu cao cấp nhất để chuẩn bị làm đồ uống.";
        } else if (status === 'dang_lam_don') {
          baristaExplanation = "🔥 <b>Đang pha chế:</b> Đồ uống của bạn đang được pha chế tỉ mỉ thủ công để giữ được hương vị tinh túy nhất.";
        } else if (status === 'da_giao_shipper') {
          baristaExplanation = "🛵 <b>Đang giao hàng:</b> Nước uống đã được pha chế xong, đóng gói chuyên dụng và bàn giao cho shipper di chuyển cực nhanh tới địa chỉ của bạn.";
        } else if (status === 'hoan_thanh') {
          baristaExplanation = "🎉 <b>Hoàn thành:</b> Đơn hàng đã được giao nhận thành công tốt đẹp! Chúc bạn thưởng thức đồ uống thật sảng khoái và tràn đầy năng lượng tỉnh thức.";
        }

        let statusHtml = "";
        if (status === 'tu_choi_don') {
          statusHtml = '<div style="padding: 14px; background: #fff1f1; border: 1px solid #f8d7da; border-radius: 12px; color: #842029; display: flex; align-items: center; gap: 10px; margin-bottom: 20px;"><strong style="font-size: 20px;">⚠️</strong><div><strong style="display: block; font-size: 14px;">ĐƠN HÀNG ĐÃ BỊ HỦY</strong><span style="font-size: 11px; opacity: 0.85;">Đơn hàng này đã bị từ chối hoặc hủy bởi cửa hàng. Xin lỗi vì sự bất tiện này.</span></div></div>';
        } else {
          const steps = [
            { label: 'Tiếp nhận', desc: 'Đơn mới / Chờ xác nhận' },
            { label: 'Pha chế', desc: 'Đang pha chế thức uống' },
            { label: 'Đang giao', desc: 'Shipper đang trên đường' },
            { label: 'Hoàn thành', desc: 'Giao hàng thành công' }
          ];

          const widthPct = (currentStepIdx / 3) * 100;
          
          let stepsHtml = '';
          for (let idx = 0; idx < steps.length; idx++) {
            const isCompleted = idx < currentStepIdx;
            const isActive = idx === currentStepIdx;
            let stepClass = "";
            if (isActive) stepClass = "active";
            else if (isCompleted) stepClass = "completed";
            
            const nodeText = isCompleted ? '✓' : (idx + 1);
            const descText = isActive ? steps[idx].desc : (isCompleted ? 'Đã xong' : 'Chờ');
            
            stepsHtml += '<div class="timeline-step ' + stepClass + '"><div class="timeline-node">' + nodeText + '</div><div class="timeline-label" style="font-size: 11px; font-weight: 800;">' + steps[idx].label + '</div><div class="timeline-desc" style="font-size: 9px;">' + descText + '</div></div>';
          }

          statusHtml = '<div class="timeline-container"><div class="timeline-steps"><div class="timeline-progress-line" style="width: ' + widthPct + '%;"></div>' + stepsHtml + '</div></div><div style="margin-top: 14px; background: rgba(200, 155, 60, 0.08); border: 1px solid rgba(200, 155, 60, 0.2); border-radius: 12px; padding: 12px 16px; font-size: 12px; color: var(--coffee-dark); line-height: 1.5;">' + baristaExplanation + '</div>';
        }

        // 2. Phân tích chi tiết hóa đơn
        let itemsHtml = "";
        const orderItems = order.order_items || order.chi_tiet_don_hang || [];
        if (orderItems && orderItems.length > 0) {
          let listHtml = '';
          for (let i = 0; i < orderItems.length; i++) {
            const item = orderItems[i];
            const name = item.product_name || item.ten_san_pham || "Sản phẩm";
            const qty = item.quantity || item.so_luong || 1;
            const price = item.price || item.don_gia || 0;
            const totalItem = price * qty;
            listHtml += '<div style="display: flex; justify-content: space-between; align-items: center; background: #fffcf8; padding: 10px 14px; border-radius: 12px; border: 1px solid rgba(58, 33, 20, 0.05); font-size: 12.5px;"><span style="font-weight: 700; color: var(--coffee-dark);">' + safeText(name) + ' <span style="color: var(--muted); font-weight: normal; margin-left: 6px;">x' + qty + '</span></span><span style="font-weight: 700; color: var(--gold);">' + formatMoney(totalItem) + '</span></div>';
          }
          itemsHtml = '<div style="margin-top: 20px; border-top: 1px dashed #decdb9; padding-top: 16px;"><h4 style="font-size: 12px; font-weight: 900; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">🧾 CHI TIẾT HÓA ĐƠN</h4><div style="display: flex; flex-direction: column; gap: 8px;">' + listHtml + '</div></div>';
        }

        const finalOrderCode = order.ma_don_hang || order.order_number;
        const totalAmountText = formatMoney(total);
        const receiveTypeText = order.hinh_thuc_nhan_hang === 'den_lay_tai_quan' ? 'Đến lấy tại quán' : 'Giao hàng tận nơi';
        const payMethodText = paymentMethod === 'chuyen_khoan' ? 'Chuyển khoản Vietcombank' : 'Tiền mặt (COD)';

        resultBox.innerHTML = '<h3 style="margin-bottom: 14px; color: var(--coffee-dark); text-align: center;">Trạng thái đơn hàng</h3><div class="invoice-code" style="text-align: center;">Mã đơn hàng: <strong>' + finalOrderCode + '</strong></div>' + statusHtml + itemsHtml + '<div style="margin-top: 20px; font-size: 13.5px; line-height: 1.6; border-top: 1px dashed #decdb9; padding-top: 16px;"><p><strong>Khách hàng:</strong> ' + safeText(name) + '</p><p><strong>Số điện thoại:</strong> ' + safeText(phone) + '</p><p><strong>Địa chỉ:</strong> ' + safeText(shippingAddress) + '</p><p><strong>Hình thức nhận:</strong> ' + receiveTypeText + '</p><p><strong>Thanh toán:</strong> ' + payMethodText + '</p><p><strong>Tổng cộng:</strong> <strong style="color: var(--gold); font-size: 16px;">' + totalAmountText + '</strong></p></div>';

      } catch (error) {
        console.error("Lỗi tra cứu đơn:", error);
        resultBox.innerHTML = "<p style='color: #8e2b20;'>Không tìm thấy đơn hàng hoặc máy chủ bận. Bạn vui lòng kiểm tra lại mã hoặc liên hệ Số điện thoại **038 972 6999** để được hỗ trợ kiểm tra trực tiếp.</p>";
      }
    }

    // 11.`;

  content = content.replace(originalLookupOrderFunc, newLookupOrderFunc);

  // F. Cập nhật mảng chatbotIntents trong file index.html
  const originalChatbotIntentsRegex = /const chatbotIntents = \[.*?\];/s;
  const newChatbotIntentsCode = `const chatbotIntents = ${getJsIntentsString()};`;
  content = content.replace(originalChatbotIntentsRegex, newChatbotIntentsCode);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated: ${filePath}`);
}

// 3. Cập nhật storefront-client.tsx
function patchStorefrontClient() {
  if (!fs.existsSync(storefrontClient)) {
    console.log(`File not found: ${storefrontClient}`);
    return;
  }
  console.log(`\n========================================\nPatching: ${storefrontClient}`);
  let content = fs.readFileSync(storefrontClient, 'utf8');

  // A. Cập nhật chatbotIntents trong Next.js
  const originalIntentsRegex = /const chatbotIntents: ChatbotIntent\[] = \[.*?];/s;
  const newIntentsCode = `const chatbotIntents: ChatbotIntent[] = ${getJsIntentsString()};`;
  content = content.replace(originalIntentsRegex, newIntentsCode);

  // B. Cập nhật About view dích dắc mới trong Next.js React
  const originalReactAboutRegex = /\{\/\* About content rows \(Zigzag\) \*\/\}.*?\{\/\* Specialties grid \*\/\}/s;
  const newReactAboutView = `{/* About content rows (Zigzag) */}
            <div className="space-y-16">
              {/* Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-[#decdb9]/10">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
                    alt="VPC Cà phê năng lượng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <h2 className="text-3.5xl font-black text-white leading-snug">
                    Về chúng tôi
                  </h2>
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[0]}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[1]}
                  </p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 lg:order-1 order-2">
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[2]}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[3]}
                  </p>
                </div>
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-[#decdb9]/10 lg:order-2 order-1">
                  <img
                    src="https://scontent.fdad2-1.fna.fbcdn.net/v/t39.30808-6/660455604_1376016174556571_698903480620260313_n.jpg?stp=dst-jpg_p960x960_tt6&_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHiReb_y6I50Dvzr0qq3ogLR4dJIIjg-alHh0kgiOD5qbnm80_-e1xiA--564npcEF_S1DicSvr7Qvkc-X_i9Wq&_nc_ohc=HTzCnH8BhdcQ7kNvwGEk3b1&_nc_oc=AdpMKRpZkIad5T8DDjcfL5TX7CiI03fMlQLdViXQQqvHUXBUVrmFtuxtJt3b_X-ZWB4SdbG3oC-LkZxNJxQaopap&_nc_zt=23&_nc_ht=scontent.fdad2-1.fna&_nc_gid=5d35D0H2Mg3Iw7p6HP7ltA&_nc_ss=7b2a8&oh=00_Af5NrJ_0DG-bVPbSMmHIo_qyD-Od1AXK-gJbMHMkuYuS1Q&oe=6A0FF6D7"
                    alt="Không gian Trung Nguyên Legend Âu Lạc"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border border-[#decdb9]/10">
                  <img
                    src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/674069481_122106871616884434_4197620687631812932_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&oh=00_Af6KGmJ7_cqKYnYij_BIUHs-ik4iJIQ1cndhZuNNUD2r1g&oe=6A136B60"
                    alt="Sách tri thức và vật phẩm"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-6">
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[4]}
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-[#a89882]">
                    ${aboutParagraphs[5]}
                  </p>
                </div>
              </div>
            </div>

            {/* Specialties grid */}`;

  content = content.replace(originalReactAboutRegex, newReactAboutView);

  // C. Cập nhật Clickable Prompts trong storefront-client.tsx
  const originalPromptsRegex = /\{\/\* Clickable Automated Prompts \*\/\}\s*<div[^>]*>.*?<\/div>/s;
  const newPromptsHtml = `{/* Clickable Automated Prompts */}
            <div className="p-2.5 bg-[#170e0a] border-t border-[#decdb9]/10 flex gap-2 overflow-x-auto custom-scrollbar-chat scroll-smooth shrink-0">
              <button
                onClick={() => handleChatQuestion(
                  'Cà phê phin đặc trưng',
                  'Chào bạn! Dòng cà phê phin đặc trưng nhất của chúng tôi là dòng Coffee Legend và Năng lượng Tư duy. Cà phê phin Legend mang hương thơm nồng nàn quyến rũ, vị đắng đậm đà truyền thống. Bạn có thể gọi thêm Sữa đá để cảm nhận vị béo ngậy ngào ngạt!'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                ☕ Cà phê Năng lượng
              </button>
              <button
                onClick={() => handleChatQuestion(
                  'Món Signature Âu Lạc',
                  'Signature của chúng tôi bao gồm: Cà phê muối Legend (mặn nhẹ, béo ngậy cực cuốn), Cà phê cốt dừa (thơm bùi mát lạnh) và Cà phê trứng (kem trứng đánh mịn béo ngậy). Rất nhiều khách hàng Huế yêu thích và đặt hàng mỗi ngày!'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                🥥 Món Signature
              </button>
              <button
                onClick={() => handleChatQuestion(
                  '3 Nền Văn Minh Cà Phê',
                  'Chúng tôi tự hào hội tụ 3 nền văn minh cà phê thế giới: Ottoman (cà phê tâm linh gắn kết), Roman (cà phê khai phóng sáng tạo khoa học kỹ thuật) và Thiền (cà phê chiêm nghiệm bản thân sâu lắng phương Đông). Hãy trực tiếp ghé thăm quán hoặc đặt hàng để khám phá nhé!'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                🏛️ 3 Nền Văn Minh
              </button>
              <button
                onClick={() => handleChatQuestion(
                  'Khuyến mãi Mua 1 Được 2',
                  'Tin vui cho tín đồ mê nước mát! Chương trình khuyến mãi "Mua 1 Được 2" đang diễn ra cực nhiệt trong khung giờ 14:00 - 21:30 hàng ngày từ 19/05 đến 30/06. Rủ ngay cạ cứng đi tránh nóng thôi nào!'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                🔥 Mua 1 Được 2
              </button>
              <button
                onClick={() => handleChatQuestion(
                  'Sự kiện lái thử VinFast',
                  'Trải nghiệm và lái thử trực tiếp các dòng xe điện thông minh siêu hot từ VF3, VF5, VF6, VF7 đến VF8 ngay tại không gian thoáng mát của Trung Nguyên Legend Âu Lạc, nhận kèm những phần quà lưu niệm cao cấp từ VinFast!'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                🚗 Lái thử VinFast
              </button>
              <button
                onClick={() => handleChatQuestion(
                  'Nghệ sĩ Nhật Cường ghé thăm',
                  'Chúng tôi hân hạnh tiếp đón danh hài Nhật Cường ghé quán giao lưu cùng khán giả Huế, thưởng thức cà phê phin năng lượng truyền thống đậm đà và đánh giá cao tủ sách tri thức của quán.'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                🎭 Nghệ sĩ Nhật Cường
              </button>
              <button
                onClick={() => handleChatQuestion(
                  'Hướng dẫn thanh toán VietQR',
                  'Thanh toán chuyển khoản thông minh 100% tự động! Bạn chỉ cần quét mã VietQR tự động điền sẵn số tiền và nội dung (Mã Đơn Hàng). Hệ thống tự xác nhận realtime qua Supabase sau 2-5 giây cực kỳ nhanh chóng. Thông tin tài khoản: Ngô Quỳnh Trang (Vietcombank: 1034103679).'
                )}
                className="shrink-0 text-[9px] font-extrabold px-3 py-1.5 rounded-full bg-[#c89b3c]/15 hover:bg-[#c89b3c]/25 text-[#c89b3c] border border-[#c89b3c]/30 transition-colors"
              >
                💳 Thanh toán VietQR
              </button>
            </div>`;
  
  content = content.replace(originalPromptsRegex, newPromptsHtml);

  fs.writeFileSync(storefrontClient, content, 'utf8');
  console.log(`Successfully updated: ${storefrontClient}`);
}

// Chạy toàn bộ tiến trình
try {
  patchGlobalsCss();
  patchIndexHtml(projectIndexHtml);
  patchIndexHtml(desktopIndexHtml);
  patchStorefrontClient();
  console.log('\n🌟🌟🌟 ALL FILES PATCHED SUCCESSFULLY! 🌟🌟🌟\n');
} catch (err) {
  console.error('❌ Error during patching process:', err);
}
