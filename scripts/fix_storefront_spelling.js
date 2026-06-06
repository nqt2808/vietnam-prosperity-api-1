const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/shared/storefront-client.tsx');
const backupPath = filePath + '.bak-spelling';

if (!fs.existsSync(filePath)) {
  console.error(`Không tìm thấy file tại ${filePath}`);
  process.exit(1);
}

// Đọc file
let content = fs.readFileSync(filePath, 'utf8');

// Tạo file backup
fs.writeFileSync(backupPath, content, 'utf8');

// Bản đồ thay thế các cụm từ chứa ký tự lỗi 
const mappings = [
  // Emojis & Icon prefixes
  { src: "   ịa chỉ", dst: "📍 Địa chỉ" },
  { src: "  Vị trí", dst: "📍 Vị trí" },
  { src: "  Các món trà", dst: "🍵 Các món trà" },
  { src: "   V ", dst: "📖 Về" },
  { src: "   KH M PH ", dst: "📖 KHÁM PHÁ" },
  { src: "☕ ", dst: "☕️" },
  { src: "☕", dst: "☕️" },
  { src: " ", dst: "🍹" },
  { src: " ", dst: "📖" },
  { src: " ối diện", dst: "Đối diện" },
  
  // Words with Đ / đ
  { src: " ịa chỉ", dst: "Địa chỉ" },
  { src: " ồng", dst: "Đồng" },
  { src: " ức", dst: "Đức" },
  { src: " ại Lễ", dst: "Đại Lễ" },
  { src: " ón tiếp", dst: "Đón tiếp" },
  { src: " ược", dst: "được" },
  { src: " ậm", dst: "đậm" },
  { src: " i u", dst: "điều" },
  { src: " ồng sở hữu", dst: "Đồng sở hữu" },
  { src: " ỨC", dst: "ĐỨC" },
  { src: " ại diện", dst: "Đại diện" },
  { src: " ông", dst: "Đông" },
  { src: " ây", dst: "Đây" },
  { src: " ại", dst: "Đại" },
  { src: " ón", dst: "Đón" },
  { src: " ầu", dst: "đầu" },
  { src: " ịnh", dst: "định" },
  { src: " ặc", dst: "đặc" },
  { src: " ến", dst: "đến" },
  { src: " ồng", dst: "đồng" },
  { src: " ối", dst: "đối" },
  { src: " ậm", dst: "đậm" },
  { src: " ơn", dst: "đơn" },
  { src: " óng", dst: "đóng" },
  { src: " i", dst: "đi" },
  { src: " ường", dst: "đường" },
  { src: " ã", dst: "đã" },
  { src: " ỏ", dst: "đỏ" },
  { src: " u", dst: "đủ" },
  { src: " iều", dst: "điều" },
  { src: " ặt", dst: "đặt" },
  { src: " ẹp", dst: "đẹp" },

  // Specific spelling fixes
  { src: "m i", dst: "mọi" },
  { src: "tr n", dst: "trọn" },
  { src: "đư ng", dst: "đường" },
  { src: "Gi  hoạt", dst: "Giờ hoạt" },
  { src: "Khu T C", dst: "Khu TĐC" },
  { src: " ông Nam", dst: "Đông Nam" },
  { src: "Phư ng", dst: "Phường" },
  { src: "Gi  mở", dst: "Giờ mở" },
  { src: "h c", dst: "học" },
  { src: "truy n", dst: "truyền" },
  { src: "ng t", dst: "ngọt" },
  { src: "ch n", dst: "chọn" },
  { src: "thanh l c", dst: "thanh lọc" },
  { src: "tr ng", dst: "trọng" },
  { src: "ngư i", dst: "người" },
  { src: "TỔNG HÓA  ƠN", dst: "TỔNG HÓA ĐƠN" },
  { src: " Ồ U NG", dst: "ĐỒ UỐNG" },
  { src: "Khung gi ", dst: "Khung giờ" },
  { src: "gi  trưa", dst: "giờ trưa" },
  { src: "chi u", dst: "chiều" },
  { src: " ƯỢC 2", dst: "ĐƯỢC 2" },
  { src: "CỰC  Ã", dst: "CỰC ĐÃ" },
  { src: "gi  vàng", dst: "giờ vàng" },
  { src: "gi  áp dụng", dst: "giờ áp dụng" },
  { src: "ki u", dst: "kiểu" },
  { src: "Trà  ào", dst: "Trà Đào" },
  { src: " ậm đà", dst: "Đậm đà" },
  { src: "cực h i", dst: "cực hời" },
  { src: "thi n", dst: "thiền" },
  { src: "3 n n", dst: "3 nền" },
  { src: "n n", dst: "nền" },
  { src: "KH M PH ", dst: "KHÁM PHÁ" },
  { src: "huy n", dst: "huyền" },
  { src: "Thi n", dst: "Thiền" },
  { src: "tìm v ", dst: "tìm về" },
  { src: " ịa điểm", dst: "Địa điểm" },
  { src: "sang tr ng", dst: "sang trọng" },
  { src: "nhi u", dst: "nhiều" },
  { src: "tuyệt v i", dst: "tuyệt vời" },
  { src: "nhật cư ng", dst: "nhật cường" },
  { src: "Nhật Cư ng", dst: "Nhật Cường" },
  { src: "th i gian", dst: "thời gian" },
  { src: "bày t ", dst: "bày tỏ" },
  { src: "g i món", dst: "gọi món" },
  { src: "Gi  Hàng", dst: "Giỏ Hàng" },
  { src: "gi  hàng", dst: "giỏ hàng" },
  { src: " i n", dst: "điền" },
  { src: "Ti n mặt", dst: "Tiền mặt" },
  { src: "ti n mặt", dst: "tiền mặt" },
  { src: "ti n đơn", dst: "tiền đơn" },
  { src: "ti n", dst: "tiền" },
  { src: "th i", dst: "thời" },
  { src: "đồng h nh", dst: "đồng hành" },
  { src: "thÆ°á»£c", dst: "thực" },
  { src: "cá»¥", dst: "cụ" },
  { src: "chÃ¡", dst: "chá" }
];

console.log("Đang quét và sửa các lỗi chính tả chứa ký tự ...");
let fixCount = 0;
mappings.forEach(({ src, dst }) => {
  if (content.includes(src)) {
    // Thay thế toàn bộ occurrences
    const regex = new RegExp(src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, dst);
    fixCount++;
  }
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Đã hoàn tất! Đã sửa ${fixCount} mẫu từ bị lỗi font.`);
console.log(`File gốc đã được cập nhật thành công.`);
console.log(`File backup lưu tại: ${backupPath}`);
