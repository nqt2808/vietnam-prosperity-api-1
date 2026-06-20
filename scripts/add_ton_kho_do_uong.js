const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Tự động phân tích file .env.local để lấy DATABASE_URL
let dbUrl = process.env.DATABASE_URL;
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
          if (key === 'DATABASE_URL') {
            dbUrl = val;
          }
        }
      }
    });
  }
} catch (e) {
  console.log("⚠️ Cảnh báo: Không đọc được .env.local:", e.message);
}

if (!dbUrl) {
  console.error("❌ Lỗi: Thiếu DATABASE_URL trong file .env.local!");
  process.exit(1);
}

async function run() {
  console.log("🚀 Đang kết nối tới PostgreSQL Supabase...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();
  console.log("✅ Đã kết nối thành công!");

  try {
    const migrationSqlPath = path.join(__dirname, '../supabase/migrations/20260619_add_ton_kho_to_do_uong.sql');
    console.log(`📖 Đang đọc nội dung file di trú: ${migrationSqlPath}...`);
    const sql = fs.readFileSync(migrationSqlPath, 'utf8');

    console.log("⚡ Đang thực thi lệnh thêm cột ton_kho vào bảng san_pham_do_uong...");
    await client.query(sql);
    console.log("🎉 Hoàn thành! Đã thêm cột ton_kho (mặc định 99) vào bảng san_pham_do_uong thành công.");
  } catch (err) {
    console.error("❌ Gặp lỗi khi thực thi câu lệnh SQL:", err.message);
    console.error(err);
  } finally {
    await client.end();
    console.log("🔌 Đã đóng kết nối cơ sở dữ liệu.");
  }
}

run();
