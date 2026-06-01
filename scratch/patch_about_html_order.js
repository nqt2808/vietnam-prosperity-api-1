const fs = require('fs');
const path = require('path');

const projectIndexHtml = path.join(__dirname, '../index.html');
const desktopIndexHtml = 'C:\\Users\\dell 7620\\Desktop\\index.html';

const aboutImages = [
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773457/660455604_1376016174556571_698903480620260313_n_gfnhyd.jpg",
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773457/658147470_1376016321223223_8548167742163448076_n_axvtps.jpg",
  "https://res.cloudinary.com/dojibbcof/image/upload/v1779773453/z7635707229351_3a55bdc90f6cd62dd840a98fe0846012_nzeb9y.jpg"
];

const aboutParagraphs = [
  "Vietnam Prosperity Coffee Company Limited, hay còn được biết đến với tên gọi Vietnam Prosperity Coffee, được thành lập vào năm 2025 với định hướng hoạt động trong lĩnh vực dịch vụ phục vụ đồ uống, phát triển không gian cà phê hiện đại và mang đến những trải nghiệm thưởng thức chất lượng dành cho khách hàng tại Thành phố Huế.",
  "Công ty được đồng sở hữu bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. Xuất phát từ niềm yêu thích dành cho cà phê, sản phẩm Trung Nguyên và những giá trị trải nghiệm mà thương hiệu Trung Nguyên Legend mang lại, hai nhà sáng lập cùng hướng đến việc xây dựng một điểm đến cà phê chuyên nghiệp, tiện lợi và giàu cảm hứng cho khách hàng tại khu vực Âu Lạc nói riêng và Thành phố Huế nói chung.",
  "Với vai trò là đơn vị vận hành cửa hàng và website hỗ trợ khách hàng kết nối với Trung Nguyên Legend Âu Lạc, Vietnam Prosperity Coffee không chỉ tập trung vào việc phục vụ đồ uống chất lượng, mà còn chú trọng xây dựng một không gian phù hợp để khách hàng gặp gỡ, học tập, làm việc, thư giãn và tận hưởng những khoảnh khắc ý nghĩa bên ly cà phê.",
  "Chúng tôi tin rằng cà phê không chỉ là một thức uống quen thuộc trong đời sống hằng ngày, mà còn là nguồn năng lượng, cảm hứng và sự kết nối. Vì vậy, mỗi sản phẩm và dịch vụ tại Trung Nguyên Legend Âu Lạc đều được hướng đến sự chỉn chu, tiện lợi và thân thiện, nhằm mang lại trải nghiệm tốt hơn cho từng khách hàng khi ghé thăm hoặc đặt hàng trực tuyến.",
  "Thông qua website này, Vietnam Prosperity Coffee mong muốn mang đến một kênh hỗ trợ nhanh chóng và thuận tiện, giúp khách hàng dễ dàng xem menu đồ uống, lựa chọn món yêu thích, đặt hàng, theo dõi đơn hàng và tìm hiểu thêm về các sản phẩm cà phê, dụng cụ pha chế, ly tách, bộ quà tặng cùng các vật phẩm thương hiệu của Trung Nguyên Legend đang được cung cấp tại cửa hàng Âu Lạc.",
  "Trong quá trình phát triển, Vietnam Prosperity Coffee luôn hướng đến tinh thần chuyên nghiệp, tận tâm và không ngừng hoàn thiện. Chúng tôi kỳ vọng website này sẽ trở thành cầu nối hiệu quả giữa khách hàng và Trung Nguyên Legend Âu Lạc, đồng thời góp phần lan tỏa giá trị của cà phê năng lượng, không gian truyền cảm hứng và phong cách phục vụ hiện đại đến cộng đồng yêu cà phê tại Huế."
];

function patchHtmlAboutLayoutDirectHTML(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  console.log(`\n========================================\nPatching directly via HTML tag order: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split(/\r?\n/);

  let startIdx = -1;
  let endIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<main id="about"') || lines[i].includes("<main id='about'")) {
      startIdx = i;
    }
    if (startIdx !== -1 && lines[i].includes('</main>') && endIdx === -1 && i > startIdx) {
      endIdx = i;
      break;
    }
  }

  if (startIdx !== -1 && endIdx !== -1) {
    // Sắp xếp HTML trực tiếp để Hàng 2 có Đoạn 2 nằm TRƯỚC Ảnh 2 trong mã nguồn!
    const newAboutPageHtml = `  <main id="about" class="page">
    <section class="sub-hero">
      <div class="container">
        <h1>Giới thiệu</h1>
        <p>Vietnam Prosperity Coffee là đơn vị sở hữu và vận hành website hỗ trợ khách hàng kết nối với Trung Nguyên Legend Âu Lạc.</p>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container" style="max-width: 1200px;">
        <!-- Row 1: Ảnh 1 trái, Đoạn 1 phải (Ảnh trước, Chữ sau) -->
        <div class="about-row">
          <div class="about-img-col">
            <img class="about-img"
              src="${aboutImages[0]}"
              alt="VPC Cà phê năng lượng" />
          </div>
          <div class="about-text" style="display: flex; flex-direction: column; gap: 20px;">
            <h2 style="font-size: 36px; margin-bottom: 8px; color: var(--coffee-dark); font-weight: 900; line-height: 1.2;">Về chúng tôi</h2>
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[0]}
            </p>
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[1]}
            </p>
          </div>
        </div>

        <!-- Row 2: Đoạn 2 trái, Ảnh 2 phải (Sắp xếp HTML trực tiếp: Chữ trước, Ảnh sau) -->
        <div class="about-row">
          <div class="about-text" style="display: flex; flex-direction: column; gap: 20px;">
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[2]}
            </p>
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[3]}
            </p>
          </div>
          <div class="about-img-col">
            <img class="about-img"
              src="${aboutImages[1]}"
              alt="Không gian Trung Nguyên Legend Âu Lạc" />
          </div>
        </div>

        <!-- Row 3: Ảnh 3 trái, Đoạn 3 phải (Ảnh trước, Chữ sau) -->
        <div class="about-row">
          <div class="about-img-col">
            <img class="about-img"
              src="${aboutImages[2]}"
              alt="Sách tri thức và vật phẩm" />
          </div>
          <div class="about-text" style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start;">
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[4]}
            </p>
            <p style="margin-bottom: 0; text-align: justify; font-size: 15px; line-height: 1.8; color: var(--text);">
              ${aboutParagraphs[5]}
            </p>
            <button class="btn btn-primary" onclick="showPage('contact')" style="margin-top: 10px;">Liên hệ ngay</button>
          </div>
        </div>
      </div>
    </section>
  </main>`;

    lines.splice(startIdx, endIdx - startIdx + 1, newAboutPageHtml);
    content = lines.join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Successfully patched layout with direct HTML order for: ${filePath}`);
  } else {
    console.log(`⚠️ Could not locate <main id="about"> section in ${filePath}`);
  }
}

// Chạy patch trực tiếp cho cả hai file index.html
patchHtmlAboutLayoutDirectHTML(projectIndexHtml);
patchHtmlAboutLayoutDirectHTML(desktopIndexHtml);

console.log('\n🌟🌟🌟 DIRECT HTML ORDER APPLIED SUCCESSFULLY! 🌟🌟🌟\n');
