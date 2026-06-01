const fs = require('fs');
const path = require('path');

const projectIndex = 'd:/Du-an/website-vpc/index.html';
const desktopIndex = 'c:/Users/dell 7620/Desktop/index.html';

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }

  console.log(`⚙️ Patching file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Tên các món bánh ngọt (Mousse Chanh Dây, Red Velvet, Dâu, Socola, Croissant, Tiramisu)
  content = content.replace(/Bánh Mousse Chanh Dây/g, 'Bánh Mousse Chanh dây');
  content = content.replace(/Bánh mousse chanh dây/g, 'Bánh Mousse Chanh dây');
  content = content.replace(/Bánh Mousse Red Velvet/g, 'Bánh Mousse Red velvet');
  content = content.replace(/Bánh mousse red velvet/g, 'Bánh Mousse Red velvet');
  content = content.replace(/Bánh Mousse Dâu/g, 'Bánh Mousse Dâu');
  content = content.replace(/Bánh mousse dâu/g, 'Bánh Mousse Dâu');
  content = content.replace(/Bánh Mousse Socola/g, 'Bánh Mousse Chocolate');
  content = content.replace(/Bánh mousse socola/g, 'Bánh Mousse Chocolate');
  content = content.replace(/Bánh Croissant Không Nhân/g, 'Bánh Croissant không nhân');
  content = content.replace(/Bánh croissant không nhân/g, 'Bánh Croissant không nhân');
  content = content.replace(/Bánh Croissant Hạnh Nhân/g, 'Bánh Croissant Hạnh nhân');
  content = content.replace(/Bánh croissant hạnh nhân/g, 'Bánh Croissant Hạnh nhân');
  content = content.replace(/Bánh Tiramisu/g, 'Bánh Tiramisu');
  content = content.replace(/Bánh tiramisu/g, 'Bánh Tiramisu');

  // 2. Mô tả các món uống
  // - Cacao sữa
  content = content.replace(
    /Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa đặc đắng đặc sắc[\s\S]*?quyến rũ lòng người\./g,
    'Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa béo ngậy ngọt ngào, tạo nên ly cacao đậm đà nồng ấm quyến rũ lòng người.'
  );
  content = content.replace(
    /Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa đặc béo ngậy ngọt ngào[\s\S]*?quyến rũ lòng người\./g,
    'Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa béo ngậy ngọt ngào, tạo nên ly cacao đậm đà nồng ấm quyến rũ lòng người.'
  );
  content = content.replace(
    /"mo_ta": "Cacao sữa thơm béo\."/g,
    '"mo_ta": "Cacao nguyên chất đắng thơm nồng nàn quyện hòa sữa béo ngậy ngọt ngào, tạo nên ly cacao đậm đà nồng ấm quyến rũ lòng người."'
  );

  // - Chanh muối mật ong
  content = content.replace(
    /Chanh muối ủ ấm áp hòa cùng mật ong rừng ngọt thanh tự nhiên, giúp làm dịu cổ họng, bù muối khoáng và thanh lọc nhẹ nhàng\./g,
    'Chanh muối ủ ấm áp hòa cùng mật ong rừng ngọt thanh tự nhiên, giúp làm dịu cổ họng, bù muối khoáng và thanh lọc nhẹ nhàng. Khách hàng có thể lựa chọn uống nóng hoặc uống lạnh ạ.'
  );
  content = content.replace(
    /"mo_ta": "Nước chanh muối mật ong thanh nhẹ\."/g,
    '"mo_ta": "Chanh muối ủ ấm áp hòa cùng mật ong rừng ngọt thanh tự nhiên, giúp làm dịu cổ họng, bù muối khoáng và thanh lọc nhẹ nhàng. Khách hàng có thể lựa chọn uống nóng hoặc uống lạnh ạ."'
  );

  // - Dưa hấu
  content = content.replace(
    /Dưa hấu đỏ mọng ép lạnh ngọt lịm mát lành, là thức uống tuyệt vời nhất để bù nước và làm mát cơ thể tức thì\./g,
    'Dưa hấu đỏ mọng ép lạnh ngọt lịm mát lành, là thức uống tuyệt vời cho mùa Hè. Luôn là lựa chọn hàng đầu của mùa Hè nóng bức.'
  );
  content = content.replace(
    /"mo_ta": "Nước ép dưa hấu tươi ngon giải nhiệt cực tốt\."/g,
    '"mo_ta": "Dưa hấu đỏ mọng ép lạnh ngọt lịm mát lành, là thức uống tuyệt vời cho mùa Hè. Luôn là lựa chọn hàng đầu của mùa Hè nóng bức."'
  );

  // - Nước thơm ép
  content = content.replace(
    /Nước ép dứa chín nguyên chất mang vị ngọt thanh sắc nét, hương thơm nhiệt đới nồng nàn cuốn hút khó lòng chối từ\./g,
    'Những trái Thơm chín vàng được ép nguyên chất mang vị ngọt thanh sắc nét, hương thơm nhiệt đới nồng nàn cuốn hút khó lòng chối từ.'
  );
  content = content.replace(
    /"mo_ta": "Nước thơm ép \(dứa\) ngọt thanh mát lạnh\."/g,
    '"mo_ta": "Những trái Thơm chín vàng được ép nguyên chất mang vị ngọt thanh sắc nét, hương thơm nhiệt đới nồng nàn cuốn hút khó lòng chối từ."'
  );

  // - Cam vắt
  content = content.replace(
    /Những trái cam tươi mọng nước được vắt nguyên chất ngọt lành, dồi dào đề kháng tự nhiên mang lại sự tươi trẻ, khỏe mạnh cho cơ thể\./g,
    'Những trái cam sành tươi mọng nước được vắt nguyên chất ngọt lành, dồi dào đề kháng tự nhiên mang lại sự tươi trẻ, khỏe mạnh cho cơ thể.'
  );
  content = content.replace(
    /"mo_ta": "Nước cam vắt nguyên chất giàu Vitamin C\."/g,
    '"mo_ta": "Những trái cam sành tươi mọng nước được vắt nguyên chất ngọt lành, dồi dào đề kháng tự nhiên mang lại sự tươi trẻ, khỏe mạnh cho cơ thể."'
  );

  // - Trà sữa Legend
  content = content.replace(
    /Trà sữa thượng hạng chuẩn công thức Legend, thơm nồng đậm đà vị trà đen và béo ngậy dòng sữa đặc đặc trưng, ngọt ngào khó cưỡng\./g,
    'Trà sữa thượng hạng chuẩn công thức Legend, thơm nồng đậm đà vị trà đen và béo ngậy dòng sữa đặc đặc trưng, ngọt ngào khó cưỡng. Sử dụng cùng với topping trân châu trắng giòn giòn và thạch mền mềm.'
  );
  content = content.replace(
    /"mo_ta": "Trà sữa mang hương vị Legend\."/g,
    '"mo_ta": "Trà sữa thượng hạng chuẩn công thức Legend, thơm nồng đậm đà vị trà đen và béo ngậy dòng sữa đặc đặc trưng, ngọt ngào khó cưỡng. Sử dụng cùng với topping trân châu trắng giòn giòn và thạch mền mềm."'
  );

  // - Trà lá nếp sen vàng
  content = content.replace(
    /Vị chát thanh thoát của trà kết hợp hương lá nếp thơm mát dịu, hạt sen bùi béo bổ dưỡng và thạch giòn mát sần sật vui miệng\./g,
    'Vị chát thanh thoát, nhẹ nhàng của trà kết hợp với hương lá nếp thơm mát dịu, hạt sen bùi béo bổ dưỡng và củ năng giòn mát vui miệng.'
  );
  content = content.replace(
    /"mo_ta": "Trà thanh nhẹ, hương sen và lá nếp dịu, phù hợp để giải nhiệt\."/g,
    '"mo_ta": "Vị chát thanh thoát, nhẹ nhàng của trà kết hợp với hương lá nếp thơm mát dịu, hạt sen bùi béo bổ dưỡng và củ năng giòn mát vui miệng."'
  );

  // - Trà vải hoa hồng
  content = content.replace(
    /Trà đen thanh nhã quyện cùng hương hoa hồng kiều diễm nồng nàn và những trái vải mọng nước ngọt lịm, mang lại cảm giác lãng mạn nhẹ nhàng\./g,
    'Hồng trà thanh nhã quyện cùng mứt vải hoa hồng mang đến hương hoa hồng kiều diễm nồng nàn và những trái vải mọng nước ngọt lịm, mang lại cảm giác lãng mạn nhẹ nhàng.'
  );
  content = content.replace(
    /"mo_ta": "Trà vải thơm nhẹ kết hợp hương hoa hồng\."/g,
    '"mo_ta": "Hồng trà thanh nhã quyện cùng mứt vải hoa hồng mang đến hương hoa hồng kiều diễm nồng nàn và những trái vải mọng nước ngọt lịm, mang lại cảm giác lãng mạn nhẹ nhàng."'
  );

  // - Cà phê muối Legend
  content = content.replace(
    /Hương vị độc bản kết hợp giữa lớp kem muối đánh mịn màng có vị mặn nhẹ dịu và cà phê Espresso đắng mượt, kích hoạt vị giác bùng nổ hậu vị béo ngọt umami\./g,
    'Hương vị độc bản kết hợp giữa lớp kem muối đánh mịn màng có vị mặn nhẹ dịu và cà phê Chế phin 1 đắng mượt, kích hoạt vị giác bùng nổ hậu vị béo ngọt umami.'
  );
  content = content.replace(
    /"mo_ta": "Vị cà phê đậm hòa cùng lớp kem muối béo mặn nhẹ\."/g,
    '"mo_ta": "Hương vị độc bản kết hợp giữa lớp kem muối đánh mịn màng có vị mặn nhẹ dịu và cà phê Chế phin 1 đắng mượt, kích hoạt vị giác bùng nổ hậu vị béo ngọt umami."'
  );

  // 3. Ảnh sinh tố dâu (sinh-to-dau)
  content = content.replace(
    /"sinh-to-dau": "https:\/\/encrypted-tbn0.gstatic.com\/images\?q=tbn:ANd9GcQk7Ed1aPNezQLUGt7YUjWDc6-cP5fFHBGhEQ&s"/g,
    '"sinh-to-dau": "https://unie.com.vn/cach-lam-sinh-to-dau-tay-bo-duong-tai-nha-cho-be-tai-nha/?srsltid=AfmBOopyEXsl2zAfRhkEC2Lq9Ae2CJwFnRjIEwO_1Eo_3D-tZRFzoB8b"'
  );

  // 4. Đồng bộ các nhóm Cà phê bột / Sáng tạo, Matcha, Sinh tố, Trà
  content = content.replace(/Matcha \+ Cacao/g, 'Matcha và Cacao');
  content = content.replace(/Matcha & Cacao/g, 'Matcha và Cacao');
  content = content.replace(/Sinh tố \+ Đá xay/g, 'Sinh tố và Đá xay');
  content = content.replace(/Sinh tố & Đá xay/g, 'Sinh tố và Đá xay');
  content = content.replace(/Trà \+ Trà sữa/g, 'Trà và Trà sữa');
  content = content.replace(/Trà & Trà sữa/g, 'Trà và Trà sữa');
  content = content.replace(/Cà phê bột\/ Sáng tạo/g, 'Cà phê phin');
  content = content.replace(/Cà phê bột \/ Sáng tạo/g, 'Cà phê phin');

  // Xử lý hàm mapCategoryTitle
  const mapCategoryTitleFn = `    function mapCategoryTitle(title) {
      if (!title) return "";
      const t = title.trim();
      if (t === "Matcha + Cacao" || t === "Matcha & Cacao") return "Matcha và Cacao";
      if (t === "Sinh tố + Đá xay" || t === "Sinh tố & Đá xay") return "Sinh tố và Đá xay";
      if (t === "Trà + Trà sữa" || t === "Trà & Trà sữa") return "Trà và Trà sữa";
      if (t === "Cà phê bột / Sáng tạo" || t === "Cà phê bột/ Sáng tạo" || t === "Cà phê bột & Sáng tạo") return "Cà phê phin";
      return t;
    }`;

  if (!content.includes('function mapCategoryTitle')) {
    content = content.replace(
      `    function renderMenuItems(drinks, tabs, groups) {`,
      mapCategoryTitleFn + `\n\n    function renderMenuItems(drinks, tabs, groups) {`
    );
  }

  // Thay thế safeText(group.title) trong renderMenuItems
  content = content.replace(
    /<a class="tab-link" href="#\${group.id}">\${safeText\(group.title\)}<\/a>/g,
    `<a class="tab-link" href="#\${group.id}">\${safeText(mapCategoryTitle(group.title))}</a>`
  );
  content = content.replace(
    /<h2>\${safeText\(group.title\)}<\/h2>/g,
    `<h2>\${safeText(mapCategoryTitle(group.title))}</h2>`
  );

  // 5. getMerchCategoryInfo (Sữa đặc Brothers, Phụ kiện & Quà tặng -> Vật phẩm)
  // Cập nhật Sữa đặc Brothers sang Dụng cụ pha chế
  if (!content.includes('slug === "sua-dac-co-duong-brothers"')) {
    content = content.replace(
      `      if (slug.includes("phin-") || name.includes("phin")) {`,
      `      if (slug.includes("phin-") || name.includes("phin") || slug === "sua-dac-co-duong-brothers") {`
    );
  }

  // Cập nhật Phụ kiện & Quà tặng -> Vật phẩm
  content = content.replace(
    `      return {
        slug: "phu-kien-qua-tang",
        name: "Phụ kiện & Quà tặng",
        desc: "Túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và các bộ quà tặng đặc biệt."
      };`,
    `      return {
        slug: "vat-pham",
        name: " Vật phẩm",
        desc: "Các sản phẩm túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và bộ quà tặng ý nghĩa."
      };`
  );
  content = content.replace(
    `      return {
        slug: "vat-pham",
        name: "Vật phẩm",
        desc: "Các sản phẩm túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và bộ quà tặng ý nghĩa."
      };`,
    `      return {
        slug: "vat-pham",
        name: " Vật phẩm",
        desc: "Các sản phẩm túi canvas văn minh cà phê, sổ tay Legend truyền cảm hứng, khăn rằn truyền thống và bộ quà tặng ý nghĩa."
      };`
  );

  // 6. Xóa item "Ly The Spirit Of Philosophy" trong getMerchFallback
  // Tìm và xóa item này trong JSON
  const regexLySpirit = /\{\s*"ten_san_pham": "Ly The Spirit Of Philosophy"[\s\S]*?\},\s*/g;
  content = content.replace(regexLySpirit, '');

  // 7. Tên CF chất tiên phong và CF hòa tan sấy lạnh
  content = content.replace(/"ten_san_pham": "CF chất tiên phong",/g, '"ten_san_pham": "Cà phê chất tiên phong",');
  content = content.replace(/"ten_san_pham": "CF hòa tan sấy lạnh",/g, '"ten_san_pham": "Cà phê hòa tan sấy lạnh",');

  // 8. Bên nhận quyền thương hiệu footer
  // footer.tsx & index.html
  // Sửa "Bên nhận quyền thương hiệu Trung Nguyên Legend Âu Lạc." thành "Bên nhận quyền thương hiệu Trung Nguyên Legend."
  content = content.replace(
    /Bên nhận quyền thương hiệu Trung Nguyên Legend Âu Lạc\./g,
    'Bên nhận quyền thương hiệu Trung Nguyên Legend.'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Patched successfully!`);
}

patchFile(projectIndex);
patchFile(desktopIndex);
