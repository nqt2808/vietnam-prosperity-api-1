const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
const envPath = path.resolve(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        env[key] = val;
      }
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function convert() {
  console.log("🌐 Đang tải danh sách người dùng từ Supabase...");
  
  try {
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Không thể tải danh sách user: ${listError.message}`);
    }

    if (usersData.users.length === 0) {
      throw new Error("Không có bất kỳ tài khoản nào trong cơ sở dữ liệu Auth để chuyển đổi!");
    }

    // Lấy user đầu tiên (duy nhất hiện tại)
    const targetUser = usersData.users[0];
    console.log(`👤 Tìm thấy người dùng hiện tại: ${targetUser.email} (ID: ${targetUser.id})`);

    console.log("🔐 Đang tiến hành chuyển đổi tài khoản thành Admin...");
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(targetUser.id, {
      email: 'admin@vpc.vn',
      password: '28082005',
      email_confirm: true,
      user_metadata: { full_name: 'Quản trị viên VPC' }
    });

    if (updateError) {
      throw new Error(`Không thể cập nhật tài khoản: ${updateError.message}`);
    }

    console.log("\n=======================================================");
    console.log("🎉 ĐÃ TẠO VÀ CẤU HÌNH TÀI KHOẢN ADMIN THÀNH CÔNG!");
    console.log(`📧 Email đăng nhập: admin@vpc.vn`);
    console.log(`🔑 Mật khẩu: 28082005`);
    console.log("=======================================================");
    console.log("✨ Bạn đã vượt qua lỗi trigger bằng cách tái cấu trúc tài khoản hiện có.");
    console.log("Bây giờ bạn có thể mở trang /login để đăng nhập tài khoản này!");

  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  }
}

convert();
