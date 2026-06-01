const fs = require('fs');
const path = require('path');

const targetPaths = [
  path.join(__dirname, '../index.html'),
  'C:\\Users\\dell 7620\\Desktop\\index.html'
];

const getDrinksFallbackFn = `
    function getDrinksFallback() {
      return [
        { "ten_san_pham": "Coffee Legend", "slug": "coffee-legend", "mo_ta": "Dòng cà phê phin đặc trưng, đậm đà và giàu năng lượng.", "gia_den": 165000, "gia_sua": 0, "slug_danh_muc": "ca-phe-phin", "ten_danh_muc": "Cà phê phin", "sold_out": false },
        { "ten_san_pham": "Năng Lượng Tư Duy", "slug": "nang-luong-tu-duy", "mo_ta": "Cà phê phin năng lượng tư duy đậm đà.", "gia_den": 36000, "gia_sua": 41000, "slug_danh_muc": "ca-phe-phin", "ten_danh_muc": "Cà phê phin", "sold_out": false },
        { "ten_san_pham": "Năng Lượng Khám Phá", "slug": "nang-luong-kham-pha", "mo_ta": "Cà phê phin năng lượng khám phá thơm ngon.", "gia_den": 42000, "gia_sua": 47000, "slug_danh_muc": "ca-phe-phin", "ten_danh_muc": "Cà phê phin", "sold_out": false },
        { "ten_san_pham": "Success Sữa Đá", "slug": "success-sua-da", "mo_ta": "Cà phê máy pha cùng sữa đá, đậm vị và dễ uống.", "gia_den": 50000, "gia_sua": 0, "slug_danh_muc": "ca-phe-may", "ten_danh_muc": "Cà phê máy", "sold_out": false },
        { "ten_san_pham": "Double Espresso", "slug": "double-espresso", "mo_ta": "Hai shot espresso mạnh mẽ và đậm đà nguyên bản.", "gia_den": 48000, "gia_sua": 0, "slug_danh_muc": "ca-phe-may", "ten_danh_muc": "Cà phê máy", "sold_out": false },
        { "ten_san_pham": "Latte", "slug": "latte", "mo_ta": "Cà phê latte béo nhẹ nghệ thuật, dễ uống.", "gia_den": 73000, "gia_sua": 0, "slug_danh_muc": "ca-phe-may", "ten_danh_muc": "Cà phê máy", "sold_out": false },
        { "ten_san_pham": "Cappuccino", "slug": "cappuccino", "mo_ta": "Cà phê cappuccino thơm béo nghệ thuật với lớp bọt sữa mịn.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "ca-phe-may", "ten_danh_muc": "Cà phê máy", "sold_out": false },
        { "ten_san_pham": "Cà phê dừa", "slug": "ca-phe-dua", "mo_ta": "Cà phê kết hợp vị dừa béo nhẹ, thơm mát đặc trưng.", "gia_den": 79000, "gia_sua": 0, "slug_danh_muc": "ca-phe-pha-che", "ten_danh_muc": "Cà phê pha chế", "sold_out": false },
        { "ten_san_pham": "Cà phê hạnh nhân", "slug": "ca-phe-hanh-nhan", "mo_ta": "Cà phê thơm vị hạnh nhân ngọt bùi quyến rũ.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "ca-phe-pha-che", "ten_danh_muc": "Cà phê pha chế", "sold_out": false },
        { "ten_san_pham": "Cà phê muối Legend", "slug": "ca-phe-muoi-legend", "mo_ta": "Vị cà phê phin đậm đà hòa cùng lớp kem muối béo mịn ngọt mặn umami.", "gia_den": 63000, "gia_sua": 0, "slug_danh_muc": "ca-phe-pha-che", "ten_danh_muc": "Cà phê pha chế", "sold_out": false },
        { "ten_san_pham": "Cà phê trứng", "slug": "ca-phe-trung", "mo_ta": "Cà phê phin đậm đà quyện cùng lòng đỏ trứng gà đánh bông béo ngậy thơm nức.", "gia_den": 79000, "gia_sua": 0, "slug_danh_muc": "ca-phe-pha-che", "ten_danh_muc": "Cà phê pha chế", "sold_out": false },
        { "ten_san_pham": "Bạc xỉu", "slug": "bac-xiu", "mo_ta": "Cà phê sữa béo nhẹ ngọt ngào dòng sữa đặc trưng Âu Lạc.", "gia_den": 48000, "gia_sua": 0, "slug_danh_muc": "ca-phe-pha-che", "ten_danh_muc": "Cà phê pha chế", "sold_out": false },
        { "ten_san_pham": "Trà đào cam sả", "slug": "tra-dao-cam-sa", "mo_ta": "Trà đào cam sả thanh mát ngọt ngào sảng khoái ngày hè.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "tra-tra-sua", "ten_danh_muc": "Trà & Trà sữa", "sold_out": false },
        { "ten_san_pham": "Trà lá nếp sen vàng", "slug": "tra-la-nep-sen-vang", "mo_ta": "Trà thanh nhẹ hương lá nếp, kết hợp hạt sen bùi béo bổ dưỡng.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "tra-tra-sua", "ten_danh_muc": "Trà & Trà sữa", "sold_out": false },
        { "ten_san_pham": "Trà vải hoa hồng", "slug": "tra-vai-hoa-hong", "mo_ta": "Hương trà vải kiều diễm quyện hương hoa hồng nồng nàn dịu dàng.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "tra-tra-sua", "ten_danh_muc": "Trà & Trà sữa", "sold_out": false },
        { "ten_san_pham": "Hibiscus chanh dây hạt chia", "slug": "hibiscus-chanh-day-hat-chia", "mo_ta": "Vị chua ngọt thanh khiết của hoa Hibiscus đỏ rực cùng chanh dây hạt chia bổ dưỡng.", "gia_den": 58000, "gia_sua": 0, "slug_danh_muc": "nuoc-thanh-nhiet", "ten_danh_muc": "Nước thanh nhiệt", "sold_out": false },
        { "ten_san_pham": "Chanh sả gừng hạt chia", "slug": "chanh-sa-gung-hat-chia", "mo_ta": "Thức uống ấm nóng hoặc mát lạnh sảng khoái từ chanh tươi, sả, gừng và hạt chia.", "gia_den": 58000, "gia_sua": 0, "slug_danh_muc": "nuoc-thanh-nhiet", "ten_danh_muc": "Nước thanh nhiệt", "sold_out": false },
        { "ten_san_pham": "Nước chanh muối mật ong", "slug": "nuoc-chanh-muoi-mat-ong", "mo_ta": "Chanh muối ủ hòa quyện mật ong rừng ngọt thanh tự nhiên dễ chịu.", "gia_den": 45000, "gia_sua": 0, "slug_danh_muc": "nuoc-thanh-nhiet", "ten_danh_muc": "Nước thanh nhiệt", "sold_out": false },
        { "ten_san_pham": "Sinh tố Xoài", "slug": "sinh-to-xoai", "mo_ta": "Sinh tố xoài cát chín thơm mát béo ngậy ngọt lành.", "gia_den": 63000, "gia_sua": 0, "slug_danh_muc": "sinh-to-da-xay", "ten_danh_muc": "Sinh tố & Đá xay", "sold_out": false },
        { "ten_san_pham": "Sinh tố Bơ", "slug": "sinh-to-bo", "mo_ta": "Sinh tố bơ sáp thơm ngậy mịn màng bổ dưỡng.", "gia_den": 63000, "gia_sua": 0, "slug_danh_muc": "sinh-to-da-xay", "ten_danh_muc": "Sinh tố & Đá xay", "sold_out": false },
        { "ten_san_pham": "Nước Ép Chanh Dây", "slug": "nuoc-ep-chanh-day", "mo_ta": "Nước ép chanh dây chua chua ngọt ngọt tươi mát thanh lọc cơ thể.", "gia_den": 58000, "gia_sua": 0, "slug_danh_muc": "nuoc-ep", "ten_danh_muc": "Nước ép", "sold_out": false },
        { "ten_san_pham": "Cam vắt", "slug": "cam-vat", "mo_ta": "Cam sành chín vắt mọng nước ngọt mát dồi dào đề kháng.", "gia_den": 58000, "gia_sua": 0, "slug_danh_muc": "nuoc-ep", "ten_danh_muc": "Nước ép", "sold_out": false },
        { "ten_san_pham": "Matcha Yến Mạch", "slug": "matcha-yen-mach", "mo_ta": "Matcha Uji Nhật Bản xanh mướt quyện sữa yến mạch thanh thuần béo thơm.", "gia_den": 68000, "gia_sua": 0, "slug_danh_muc": "matcha-cacao", "ten_danh_muc": "Matcha & Cacao", "sold_out": false },
        { "ten_san_pham": "Cacao sữa", "slug": "cacao-sua", "mo_ta": "Cacao nguyên chất đắng thơm nồng quyện sữa béo ngậy ngọt ngào.", "gia_den": 53000, "gia_sua": 0, "slug_danh_muc": "matcha-cacao", "ten_danh_muc": "Matcha & Cacao", "sold_out": false },
        { "ten_san_pham": "Panna Cotta", "slug": "panna-cotta", "mo_ta": "Bánh Panna Cotta ngọt mát mềm mịn núng nính kèm mứt dâu rừng ngọt ngào.", "gia_den": 25000, "gia_sua": 0, "slug_danh_muc": "banh", "ten_danh_muc": "Bánh ngọt", "sold_out": false },
        { "ten_san_pham": "Bánh Mousse Chanh Dây", "slug": "banh-mousse-chanh-day", "mo_ta": "Bánh mousse mousse chanh dây mềm tan chua ngọt dịu mắt.", "gia_den": 39000, "gia_sua": 0, "slug_danh_muc": "banh", "ten_danh_muc": "Bánh ngọt", "sold_out": false }
      ];
    }
`;

targetPaths.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.warn(`File ${filePath} does not exist, skipping...`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  console.log(`Patching ${filePath}...`);

  // 1. Thêm getDrinksFallbackFn vào trước renderMenu nếu chưa có
  if (!content.includes('function getDrinksFallback()')) {
    content = content.replace(
      'async function renderMenu() {',
      getDrinksFallbackFn + '\n\n    async function renderMenu() {'
    );
    console.log('- Added getDrinksFallback function.');
  }

  // 2. Cập nhật renderMenu để bắt lỗi API và dùng getDrinksFallback
  const oldFetchBlock = `        const drinks = await fetchAPI("/api/do-uong");
        const processedDrinks = [];`;

  const newFetchBlock = `        let drinks;
        try {
          drinks = await fetchAPI("/api/do-uong");
        } catch (apiErr) {
          console.warn("⚠️ API tải menu nước lỗi, chuyển sang dữ liệu dự phòng tĩnh:", apiErr.message);
          drinks = getDrinksFallback();
        }
        const processedDrinks = [];`;

  if (content.includes(oldFetchBlock)) {
    content = content.replace(oldFetchBlock, newFetchBlock);
    console.log('- Replaced API call with safe try-catch fallback.');
  } else {
    // Thử so khớp lỏng hơn
    const oldFetchBlockAlternative = `        const drinks = await fetchAPI('/api/do-uong');
        const processedDrinks = [];`;
    if (content.includes(oldFetchBlockAlternative)) {
      content = content.replace(oldFetchBlockAlternative, newFetchBlock);
      console.log('- Replaced API call (alternative quotes) with safe try-catch fallback.');
    } else {
      console.warn('! Could not find the exact drinks fetch statement to wrap.');
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Successfully patched ${filePath}!`);
});
