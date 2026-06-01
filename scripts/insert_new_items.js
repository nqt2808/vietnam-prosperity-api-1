const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Tự động phân tích file .env.local
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
  console.log("🚀 Đang kết nối tới PostgreSQL Supabase qua Pooler URL...");
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  await client.connect();
  console.log("✅ Đã kết nối thành công!");

  try {
    const migrationSqlPath = path.join(__dirname, '../supabase/migrations/20260525000000_add_new_items.sql');
    console.log(`📖 Đang đọc nội dung file di trú: ${migrationSqlPath}...`);
    const sql = fs.readFileSync(migrationSqlPath, 'utf8');

    console.log("⚡ Đang thực thi các câu lệnh chèn và cập nhật vật phẩm mới...");
    await client.query(sql);
    console.log("🎉 Hoàn thành! 17 vật phẩm mới cùng hình ảnh đã được cập nhật thành công lên Supabase.");
  } catch (err) {
    console.error("❌ Gặp lỗi khi thực thi câu lệnh SQL:", err.message);
    console.error(err);
  } finally {
    await client.end();
    console.log("🔌 Đã đóng kết nối cơ sở dữ liệu.");
  }
}

run();
