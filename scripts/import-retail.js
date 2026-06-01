const fs = require('fs');
const path = require('path');

// 1. Tự động đọc thông tin cấu hình từ .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const index = trimmed.indexOf('=');
        if (index !== -1) {
          const key = trimmed.substring(0, index).trim();
          const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.log("⚠️ Cảnh báo: Không đọc được file cấu hình .env.local:", e.message);
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Lỗi: Thiếu thông tin Supabase credentials trong file .env.local!");
  console.error("Yêu cầu các khoá: NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 2. Kiểm tra tham số truyền vào
const filePathArg = process.argv[2];
if (!filePathArg) {
  console.log("\n📖 HƯỚNG DẪN SỬ DỤNG NHẬP KHO HÀNG RETAIL:");
  console.log("-----------------------------------------");
  console.log("Cú pháp chạy lệnh: node scripts/import-retail.js <đường-dẫn-file-kho>");
  console.log("Hỗ trợ định dạng: .csv hoặc .json\n");
  console.log("Cấu trúc File mẫu (.csv):");
  console.log("slug,stock_quantity,price");
  console.log("ca-phe-sang-tao-1-250gr,50,110000");
  console.log("phin-nhom-trung-nguyen,0,75000\n");
  process.exit(0);
}

const resolvedPath = path.resolve(process.cwd(), filePathArg);
if (!fs.existsSync(resolvedPath)) {
  console.error(`❌ Lỗi: Không tìm thấy file dữ liệu tại đường dẫn: ${filePathArg}`);
  process.exit(1);
}

// 3. Hàm phân tích CSV thủ công không cần thư viện ngoài
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0) return [];

  // Lấy tiêu đề cột và làm sạch
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Phân tách đơn giản bằng dấu phẩy
    const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    const obj = {};
    
    headers.forEach((header, idx) => {
      obj[header] = values[idx];
    });

    results.push(obj);
  }
  return results;
}

async function runImport() {
  console.log(`🚀 Đang đọc dữ liệu từ file: ${filePathArg}...`);
  const fileExt = path.extname(resolvedPath).toLowerCase();
  let items = [];

  try {
    const fileContent = fs.readFileSync(resolvedPath, 'utf8');
    if (fileExt === '.json') {
      items = JSON.parse(fileContent);
    } else if (fileExt === '.csv') {
      items = parseCSV(fileContent);
    } else {
      console.error("❌ Lỗi: Định dạng file không được hỗ trợ. Vui lòng dùng file .csv hoặc .json!");
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Lỗi khi đọc hoặc giải mã file dữ liệu:", err.message);
    process.exit(1);
  }

  if (items.length === 0) {
    console.log("⚠️ Không tìm thấy dòng dữ liệu nào hợp lệ để nhập kho.");
    process.exit(0);
  }

  console.log(`📦 Tìm thấy ${items.length} mặt hàng trong file. Tiến hành đồng bộ vào Supabase...`);
  
  let successCount = 0;
  let failCount = 0;

  for (const item of items) {
    // So khớp qua slug (tiên quyết) hoặc name/ten_san_pham
    const slug = item.slug;
    const name = item.name || item.ten_san_pham || item.title;
    const stockQty = parseInt(item.stock_quantity || item.ton_kho || item.quantity || 0, 10);
    const price = item.price || item.gia;

    if (!slug && !name) {
      console.log(`⚠️ Bỏ qua dòng dữ liệu không có cả 'slug' lẫn 'name'.`);
      failCount++;
      continue;
    }

    try {
      let query = supabase.from('products');
      
      // Xây dựng bộ lọc tìm kiếm sản phẩm
      if (slug) {
        query = query.update({ stock_quantity: stockQty });
        // Cập nhật thêm giá nếu có truyền giá mới
        if (price !== undefined) {
          query = query.update({ price: parseFloat(price), stock_quantity: stockQty });
        }
        
        const { data, error } = await query.eq('slug', slug.trim()).select();
        
        if (error) throw error;

        if (data && data.length > 0) {
          console.log(`✅ [SLUG] Đã cập nhật tồn kho món [${data[0].name}] (${slug}) thành: ${stockQty}`);
          successCount++;
          continue;
        }
      }

      // Nếu không tìm thấy theo slug hoặc không có slug, thử tìm theo tên
      if (name) {
        let updateData = { stock_quantity: stockQty };
        if (price !== undefined) {
          updateData.price = parseFloat(price);
        }

        const { data, error } = await supabase
          .from('products')
          .update(updateData)
          .ilike('name', name.trim())
          .select();

        if (error) throw error;

        if (data && data.length > 0) {
          console.log(`✅ [NAME] Đã cập nhật tồn kho món [${data[0].name}] thành: ${stockQty}`);
          successCount++;
        } else {
          console.log(`❌ Không tìm thấy sản phẩm nào khớp với slug: "${slug}" hoặc tên: "${name}"`);
          failCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Lỗi khi cập nhật sản phẩm (${slug || name}):`, err.message);
      failCount++;
    }
  }

  console.log("\n-----------------------------------------");
  console.log(`🏁 HOÀN THÀNH ĐỒNG BỘ KHO HÀNG RETAIL:`);
  console.log(`🔹 Thành công: ${successCount} mặt phẩm`);
  console.log(`🔹 Thất bại/Không khớp: ${failCount}`);
  console.log("-----------------------------------------\n");
}

runImport().catch(err => {
  console.error("💥 Kịch bản nhập kho gặp sự cố nghiêm trọng:", err);
});
