const fs = require('fs');
const path = require('path');

const projectIndex = 'd:/Du-an/website-vpc/index.html';
const desktopIndex = 'c:/Users/dell 7620/Desktop/index.html';

const newCss = `
    /* Zigzag About Page */
    .about-row {
      display: flex;
      flex-direction: column;
      gap: 32px;
      margin-bottom: 60px;
      align-items: center;
    }
    .about-row:last-child {
      margin-bottom: 0;
    }
    .about-img-col {
      width: 100%;
    }
    .about-img {
      width: 100%;
      aspect-ratio: 16/10;
      object-fit: cover;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      display: block;
    }
    .about-text {
      width: 100%;
      font-size: 18px;
      line-height: 1.8;
      color: var(--muted);
    }
    .about-text p {
      margin-bottom: 16px;
    }
    .about-text p:last-child {
      margin-bottom: 0;
    }
    @media (min-width: 981px) {
      .about-row {
        flex-direction: row;
        gap: 54px;
      }
      .about-row .about-img-col, .about-row .about-text {
        flex: 1;
        width: 50%;
      }
      .about-row.reverse .about-img-col {
        order: 2;
      }
      .about-row.reverse .about-text {
        order: 1;
      }
    }
`;

const newAboutSection = `
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
              Vietnam Prosperity Coffee (VPC) tự hào là thương hiệu kết nối và mang đến không gian cà phê năng lượng đặc trưng của Trung Nguyên Legend giữa lòng Cố đô Huế.
            </p>
            <p>
              Với sứ mệnh lan tỏa văn hóa cà phê tỉnh thức, chúng tôi không chỉ phục vụ đồ uống mà còn đồng hành cùng sự sáng tạo và năng lượng tư duy của khách hàng.
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
              Không gian tại cửa hàng Âu Lạc được thiết kế hiện đại, bài trí tinh tế cùng tủ sách tri thức truyền cảm hứng dấn thân, lập nghiệp mạnh mẽ.
            </p>
            <p>
              Đây là điểm hẹn lý tưởng để học tập, làm việc, kết nối bạn bè và cùng nhau chia sẻ những ý tưởng sáng tạo đột phá.
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
              Thông qua hệ thống website tiện lợi, khách hàng có thể dễ dàng tra cứu menu, đặt đồ uống giao tận nhà hoặc mua sắm các sản phẩm đóng gói và quà tặng.
            </p>
            <p style="margin-bottom: 24px;">
              Chúng tôi cam kết phục vụ tận tâm từ trái tim, mang lại trải nghiệm hoàn hảo nhất cho quý khách trong từng khoảnh khắc thưởng thức.
            </p>
            <button class="btn btn-primary" onclick="showPage('contact')">Liên hệ ngay</button>
          </div>
        </div>
      </div>
    </section>
`;

function patchAbout(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  console.log(`⚙️ Patching about page for: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject new CSS in <style> block
  if (!content.includes('Zigzag About Page')) {
    content = content.replace(
      '</style>',
      `${newCss}\n  </style>`
    );
  }

  // Find the <main id="about" ...> and replace its section
  const mainAboutRegex = /<main id="about" class="page">([\s\S]*?)<\/main>/;
  const match = content.match(mainAboutRegex);
  if (match) {
    const mainAboutContent = match[1];
    // Find the section section-soft inside it
    const sectionRegex = /<section class="section section-soft">[\s\S]*?<\/section>/;
    if (sectionRegex.test(mainAboutContent)) {
      const updatedMainAbout = mainAboutContent.replace(sectionRegex, newAboutSection);
      content = content.replace(mainAboutContent, updatedMainAbout);
      console.log(`   ✅ Replaced about section successfully`);
    } else {
      console.log(`   ❌ Could not find section-soft inside main id="about"`);
    }
  } else {
    console.log(`   ❌ Could not find main id="about"`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

patchAbout(projectIndex);
patchAbout(desktopIndex);
