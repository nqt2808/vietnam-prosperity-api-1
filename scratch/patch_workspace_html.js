const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../index.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log('Patching workspace index.html...');

// 1. Đồng bộ ảnh sinh-to-dau
content = content.replace(
  `"sinh-to-dau": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk7Ed1aPNezQLUGt7YUjWDc6-cP5fFHBGhEQ&s"`,
  `"sinh-to-dau": "https://unie.com.vn/cach-lam-sinh-to-dau-tay-bo-duong-tai-nha-cho-be-tai-nha/?srsltid=AfmBOopyEXsl2zAfRhkEC2Lq9Ae2CJwFnRjIEwO_1Eo_3D-tZRFzoB8b"`
);

// 2. Cập nhật các bánh ngọt trong getDrinksFallback()
content = content.replace(
  `"ten_san_pham": "Bánh Mousse Red Velvet",`,
  `"ten_san_pham": "Bánh Mousse Red velvet",`
);
content = content.replace(
  `"ten_san_pham": "Bánh Mousse Socola",`,
  `"ten_san_pham": "Bánh Mousse Chocolate",`
);
content = content.replace(
  `"ten_san_pham": "Bánh Croissant Không Nhân",`,
  `"ten_san_pham": "Bánh Croissant không nhân",`
);
content = content.replace(
  `"ten_san_pham": "Bánh Croissant Hạnh Nhân",`,
  `"ten_san_pham": "Bánh Croissant Hạnh nhân",`
);
content = content.replace(
  `"ten_san_pham": "Bánh Mousse Chanh Dây",`,
  `"ten_san_pham": "Bánh Mousse Chanh dây",`
);

// Sửa mô tả cho các đồ uống trong getDrinksFallback()
content = content.replace(
  `"mo_ta": "Cacao sữa thơm béo.",`,
  `"mo_ta": "Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa béo ngậy ngọt ngào, tạo nên ly cacao đậm đà nồng ấm quyến rũ lòng người.",`
);
content = content.replace(
  `"mo_ta": "Nước chanh muối mật ong thanh nhẹ.",`,
  `"mo_ta": "Chanh muối ủ ấm áp hòa cùng mật ong rừng ngọt thanh tự nhiên, giúp làm dịu cổ họng, bù muối khoáng và thanh lọc nhẹ nhàng. Khách hàng có thể lựa chọn uống nóng hoặc uống lạnh ạ.",`
);
content = content.replace(
  `"mo_ta": "Nước ép dưa hấu tươi ngon giải nhiệt cực tốt.",`,
  `"mo_ta": "Dưa hấu đỏ mọng ép lạnh ngọt lịm mát lành, là thức uống tuyệt vời cho mùa Hè. Luôn là lựa chọn hàng đầu của mùa Hè nóng bức.",`
);
content = content.replace(
  `"mo_ta": "Nước thơm ép (dứa) ngọt thanh mát lạnh.",`,
  `"mo_ta": "Những trái Thơm chín vàng được ép nguyên chất mang vị ngọt thanh sắc nét, hương thơm nhiệt đới nồng nàn cuốn hút khó lòng chối từ.",`
);
content = content.replace(
  `"mo_ta": "Nước cam vắt nguyên chất giàu Vitamin C.",`,
  `"mo_ta": "Những trái cam sành tươi mọng nước được vắt nguyên chất ngọt lành, dồi dào đề kháng tự nhiên mang lại sự tươi trẻ, khỏe mạnh cho cơ thể.",`
);
content = content.replace(
  `"mo_ta": "Trà sữa mang hương vị Legend.",`,
  `"mo_ta": "Trà sữa thượng hạng chuẩn công thức Legend, thơm nồng đậm đà vị trà đen và béo ngậy dòng sữa đặc đặc trưng, ngọt ngào khó cưỡng. Sử dụng cùng với topping trân châu trắng giòn giòn và thạch mền mềm.",`
);
content = content.replace(
  `"mo_ta": "Trà thanh nhẹ, hương sen và lá nếp dịu, phù hợp để giải nhiệt.",`,
  `"mo_ta": "Vị chát thanh thoát của trà kết hợp hương lá nếp thơm mát dịu, hạt sen bùi béo bổ dưỡng và củ năng giòn mát vui miệng.",`
);
content = content.replace(
  `"mo_ta": "Trà vải thơm nhẹ kết hợp hương hoa hồng.",`,
  `"mo_ta": "Hồng trà thanh nhã quyện cùng mứt vải hoa hồng mang đến hương hoa hồng kiều diễm nồng nàn và những trái vải mọng nước ngọt lịm, mang lại cảm giác lãng mạn nhẹ nhàng.",`
);
content = content.replace(
  `"mo_ta": "Vị cà phê đậm hòa cùng lớp kem muối béo mặn nhẹ.",`,
  `"mo_ta": "Hương vị độc bản kết hợp giữa lớp kem muối đánh mịn màng có vị mặn nhẹ dịu và cà phê Chế phin 1 đắng mượt, kích hoạt vị giác bùng nổ hậu vị béo ngọt umami.",`
);

// 3. Cập nhật các tên retail/merchandise trong getMerchFallback()
content = content.replace(
  `"ten_san_pham": "Cà phê chất tiên phong",`, // nếu có
  `"ten_san_pham": "Cà phê chất tiên phong",`
);
// Tìm và sửa cf-chat-tien-phong và cf-hoa-tan-say-lanh
let dripIndex = content.indexOf('"slug": "ca-phe-drip-1-culi-robusta"');
if (dripIndex !== -1) {
  // Thêm 2 món Cà phê chất tiên phong và Cà phê hòa tan sấy lạnh vào getMerchFallback nếu chưa có
  // Hãy xem trong getMerchFallback có cf-chat-tien-phong không. Lúc nãy view từ 3100 đến 3400 ta thấy các món của getMerchFallback.
}

// 4. Ánh xạ danh mục động trong renderMenuItems()
const mapCategoryTitleFn = `    function mapCategoryTitle(title) {
      if (!title) return "";
      const t = title.trim();
      if (t === "Matcha + Cacao" || t === "Matcha & Cacao") return "Matcha và Cacao";
      if (t === "Sinh tố + Đá xay" || t === "Sinh tố & Đá xay") return "Sinh tố và Đá xay";
      if (t === "Trà + Trà sữa" || t === "Trà & Trà sữa") return "Trà và Trà sữa";
      if (t === "Cà phê bột / Sáng tạo" || t === "Cà phê bột & Sáng tạo") return "Cà phê phin";
      return t;
    }`;

// Chèn mapCategoryTitleFn ngay trước renderMenuItems
content = content.replace(
  `    function renderMenuItems(drinks, tabs, groups) {`,
  mapCategoryTitleFn + `\n\n    function renderMenuItems(drinks, tabs, groups) {`
);

// Bọc title trong renderMenuItems
content = content.replace(
  `<a class="tab-link" href="#\${group.id}">\${safeText(group.title)}</a>`,
  `<a class="tab-link" href="#\${group.id}">\${safeText(mapCategoryTitle(group.title))}</a>`
);
content = content.replace(
  `<h2>\${safeText(group.title)}</h2>`,
  `<h2>\${safeText(mapCategoryTitle(group.title))}</h2>`
);

// 5. Cập nhật getMerchCategoryInfo để gộp nhóm Phụ kiện và Quà tặng
content = content.replace(
  `      return {
        slug: "phu-kien-qua-tang",
        name: "Phụ kiện & Quà tặng",
        desc: "Túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và các bộ quà tặng đặc biệt."
      };`,
  `      return {
        slug: "vat-pham",
        name: "Vật phẩm",
        desc: "Các sản phẩm túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và bộ quà tặng ý nghĩa."
      };`
);

// Ghi đè file
fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully patched workspace index.html!');
