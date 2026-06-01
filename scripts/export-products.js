const fs = require('fs');
const path = require('path');

const API_URL = "https://vpc-70cs.onrender.com";
const DESKTOP_PATH = "C:\\Users\\dell 7620\\Desktop\\danh_sach_san_pham.txt";

// Định dạng tiền tệ
function formatMoney(value) {
  if (value === null || value === undefined || Number(value) === 0) {
    return "Liên hệ";
  }
  return Number(value).toLocaleString("vi-VN") + "đ";
}

async function exportProducts() {
  console.log("📥 Đang kết nối tới máy chủ để lấy danh sách sản phẩm...");
  
  let drinks = [];
  let merchandise = [];

  // 1. Tải danh sách Đồ uống
  try {
    const res = await fetch(`${API_URL}/api/do-uong`);
    if (res.ok) {
      drinks = await res.json();
      console.log(`✅ Đã tải ${drinks.length} món đồ uống.`);
    } else {
      console.warn("⚠️ Không thể tải danh sách đồ uống từ endpoint chính.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách đồ uống:", err.message);
  }

  // 2. Tải danh sách Vật phẩm
  try {
    let res = await fetch(`${API_URL}/api/vat-pham`);
    if (!res.ok) {
      res = await fetch(`${API_URL}/api/merchandise`);
    }
    if (res.ok) {
      merchandise = await res.json();
      console.log(`✅ Đã tải ${merchandise.length} vật phẩm.`);
    } else {
      console.warn("⚠️ Không thể tải danh sách vật phẩm.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi tải danh sách vật phẩm:", err.message);
  }

  // 3. Phân nhóm đồ uống theo danh mục
  const groupedDrinks = {};
  drinks.forEach(item => {
    const category = item.ten_danh_muc || "Khác";
    if (!groupedDrinks[category]) {
      groupedDrinks[category] = [];
    }
    groupedDrinks[category].push(item);
  });

  // 4. Phân nhóm vật phẩm theo danh mục
  const groupedMerch = {};
  merchandise.forEach(item => {
    const category = item.ten_danh_muc || "Vật phẩm";
    if (!groupedMerch[category]) {
      groupedMerch[category] = [];
    }
    groupedMerch[category].push(item);
  });

  // 5. Tạo nội dung file văn bản
  let content = "======================================================================\n";
  content += "        DANH SÁCH SẢN PHẨM TRUNG NGUYÊN LEGEND ÂU LẠC HUẾ\n";
  content += "              (Xuất tự động từ hệ thống Website VPC)\n";
  content += "======================================================================\n\n";

  // PHẦN I: ĐỒ UỐNG
  content += "=== PHẦN I: DANH SÁCH ĐỒ UỐNG & MÓN NƯỚC ===\n";
  content += "--------------------------------------------\n\n";
  
  if (Object.keys(groupedDrinks).length === 0) {
    content += "(Không có dữ liệu đồ uống hoặc lỗi kết nối máy chủ)\n\n";
  } else {
    for (const [category, items] of Object.entries(groupedDrinks)) {
      content += `📂 DANH MỤC: ${category.toUpperCase()}\n`;
      content += "--------------------------------------------\n";
      
      items.forEach((item, idx) => {
        let priceStr = "";
        if (item.gia_den && item.gia_sua) {
          priceStr = `Đen: ${formatMoney(item.gia_den)} | Sữa: ${formatMoney(item.gia_sua)}`;
        } else if (item.gia_den) {
          priceStr = formatMoney(item.gia_den);
        } else if (item.gia_sua) {
          priceStr = formatMoney(item.gia_sua);
        } else if (item.gia) {
          priceStr = formatMoney(item.gia);
        } else {
          priceStr = "Liên hệ";
        }

        const isSoldOut = item.sold_out || item.status === 'soldout' || item.trang_thai === 'ngung_ban' || item.ton_kho === 0 || item.stock_quantity === 0;
        const statusStr = isSoldOut ? " [TẠM HẾT]" : "";

        content += `${idx + 1}. ${item.ten_san_pham}${statusStr}\n`;
        content += `   💰 Giá: ${priceStr}\n`;
        if (item.mo_ta) {
          content += `   📝 Mô tả: ${item.mo_ta}\n`;
        }
        content += "\n";
      });
      content += "\n";
    }
  }

  // PHẦN II: VẬT PHẨM
  content += "=== PHẦN II: DANH SÁCH VẬT PHẨM & CÀ PHÊ ĐÓNG GÓI ===\n";
  content += "----------------------------------------------------\n\n";

  if (Object.keys(groupedMerch).length === 0) {
    content += "(Không có dữ liệu vật phẩm hoặc lỗi kết nối máy chủ)\n\n";
  } else {
    for (const [category, items] of Object.entries(groupedMerch)) {
      content += `📂 DANH MỤC: ${category.toUpperCase()}\n`;
      content += "--------------------------------------------\n";

      items.forEach((item, idx) => {
        const priceStr = formatMoney(item.gia);
        const stockQty = item.stock_quantity !== undefined ? item.stock_quantity : (item.ton_kho !== undefined ? item.ton_kho : "Chưa cập nhật");
        const isSoldOut = stockQty !== "Chưa cập nhật" && Number(stockQty) <= 0;
        const statusStr = isSoldOut ? " [TẠM HẾT HÀNG]" : "";

        content += `${idx + 1}. ${item.ten_san_pham || item.name}${statusStr}\n`;
        content += `   💰 Giá: ${priceStr}\n`;
        content += `   📦 Tồn kho: ${stockQty} sản phẩm\n`;
        if (item.mo_ta || item.description) {
          content += `   📝 Mô tả: ${item.mo_ta || item.description}\n`;
        }
        content += "\n";
      });
      content += "\n";
    }
  }

  content += `\n* Xuất vào lúc: ${new Date().toLocaleString("vi-VN")}\n`;
  content += "* Bản quyền vận hành: Vietnam Prosperity Coffee - Since 2025.\n";

  // 6. Ghi ra file notepad ngoài Desktop
  try {
    fs.writeFileSync(DESKTOP_PATH, content, 'utf8');
    console.log(`\n🎉 THÀNH CÔNG RỰC RỠ!`);
    console.log(`Đã tạo file notepad danh sách sản phẩm tại màn hình chính Desktop của anh:`);
    console.log(`📍 Đường dẫn: ${DESKTOP_PATH}\n`);
  } catch (err) {
    console.error("❌ Lỗi khi ghi file ra ngoài Desktop:", err.message);
  }
}

exportProducts();
