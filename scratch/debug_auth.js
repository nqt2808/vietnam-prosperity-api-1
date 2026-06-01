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

async function debug() {
  console.log("🔍 1. Kiểm tra xem tài khoản admin@vpc.vn đã có sẵn trong Auth chưa...");
  try {
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("❌ Không thể list users:", listError.message);
    } else {
      console.log(`Số lượng users hiện tại: ${usersData.users.length}`);
      const found = usersData.users.find(u => u.email === 'admin@vpc.vn');
      if (found) {
        console.log("🎉 Tìm thấy tài khoản admin@vpc.vn trong Auth! ID:", found.id);
        
        // Thử cập nhật mật khẩu thành 28082005
        console.log("🔐 Đang đặt lại mật khẩu là 28082005...");
        const { error: updateError } = await supabase.auth.admin.updateUserById(found.id, {
          password: '28082005'
        });
        if (updateError) {
          console.error("❌ Lỗi cập nhật mật khẩu:", updateError.message);
        } else {
          console.log("✅ Đã cập nhật mật khẩu thành công!");
        }
        return;
      } else {
        console.log("❌ Không tìm thấy admin@vpc.vn trong danh sách Auth.");
      }
    }
  } catch (err) {
    console.error("Lỗi liệt kê user:", err.message);
  }

  console.log("\n🔍 2. Thử tạo một tài khoản ngẫu nhiên để test lỗi Trigger...");
  const randomEmail = `test_admin_${Math.floor(1000 + Math.random() * 9000)}@vpc.store`;
  try {
    const { data: createdData, error: createError } = await supabase.auth.admin.createUser({
      email: randomEmail,
      password: 'testPassword123!',
      email_confirm: true
    });

    if (createError) {
      console.error(`❌ Tạo user ${randomEmail} thất bại:`, createError.message);
    } else {
      console.log(`🎉 Tạo thành công user ${randomEmail}! ID:`, createdData.user.id);
      
      // Xóa user test vừa tạo để dọn dẹp
      await supabase.auth.admin.deleteUser(createdData.user.id);
      console.log("🧹 Đã dọn dẹp user test.");
    }
  } catch (err) {
    console.error("Lỗi ngoại lệ khi tạo user test:", err.message);
  }
}

debug();
