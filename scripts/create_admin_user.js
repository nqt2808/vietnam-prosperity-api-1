const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Đọc cấu hình từ .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Lỗi: Thiếu cấu hình Supabase trong file .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Thông tin tài khoản Admin mong muốn
const ADMIN_EMAIL = 'admin@vpc.vn';
const ADMIN_PASSWORD = '28082005';
const ADMIN_FULLNAME = 'Quản trị viên VPC';

async function createAdminUser() {
  console.log(`🌐 Đang kết nối tới Supabase: ${supabaseUrl}...`);
  
  try {
    // 2. Tìm xem email admin này đã tồn tại trong danh sách Auth chưa
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Không thể liệt kê danh sách users: ${listError.message}`);
    }

    let adminUser = usersData.users.find(u => u.email === ADMIN_EMAIL);
    let userId = '';

    if (!adminUser) {
      console.log(`👤 Đang tạo tài khoản Auth mới cho email: ${ADMIN_EMAIL}...`);
      const { data: createdData, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: ADMIN_FULLNAME }
      });

      if (createError) {
        throw new Error(`Lỗi tạo user Auth: ${createError.message}`);
      }

      adminUser = createdData.user;
      userId = adminUser.id;
      console.log(`✅ Đã tạo tài khoản Auth thành công! ID: ${userId}`);
    } else {
      userId = adminUser.id;
      console.log(`ℹ️ Tài khoản Auth ${ADMIN_EMAIL} đã tồn tại từ trước. ID: ${userId}`);
      
      // Cập nhật mật khẩu mới nếu tài khoản đã tồn tại
      console.log(`🔐 Đang đồng bộ cập nhật mật khẩu mới: ${ADMIN_PASSWORD}...`);
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        user_metadata: { full_name: ADMIN_FULLNAME }
      });
      if (updateAuthError) {
        console.warn(`⚠️ Cảnh báo: Không thể cập nhật mật khẩu mới: ${updateAuthError.message}`);
      } else {
        console.log(`✅ Cập nhật mật khẩu thành công!`);
      }
    }

    // 3. Phân quyền và cập nhật thông tin trong bảng profiles (hoặc các bảng phân quyền liên quan)
    console.log(`🛡️ Đang phân quyền 'admin' trong bảng profiles cho ID: ${userId}...`);
    
    // Kiểm tra xem bảng profiles có tồn tại bản ghi của user chưa
    const { data: existingProfile, error: getProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (getProfileError && getProfileError.code !== 'PGRST116') { // PGRST116 là mã "không tìm thấy bản ghi"
      console.warn(`⚠️ Không thể kiểm tra profile cũ: ${getProfileError.message}`);
    }

    const profileData = {
      id: userId,
      full_name: ADMIN_FULLNAME,
      role: 'admin',
      updated_at: new Date().toISOString()
    };

    if (existingProfile) {
      // Cập nhật profile cũ lên role admin
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: ADMIN_FULLNAME })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Lỗi khi cập nhật profile admin: ${updateError.message}`);
      }
      console.log(`🎉 Đã cập nhật thành công role 'admin' cho profile cũ!`);
    } else {
      // Chèn profile mới nếu chưa có
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (insertError) {
        throw new Error(`Lỗi khi chèn profile admin mới: ${insertError.message}`);
      }
      console.log(`🎉 Đã khởi tạo và phân quyền 'admin' cho profile thành công!`);
    }

    console.log("\n=======================================================");
    console.log("🚀 THÔNG TIN ĐĂNG NHẬP TRANG QUẢN TRỊ ADMIN:");
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Mật khẩu: ${ADMIN_PASSWORD}`);
    console.log("=======================================================");
    console.log("✨ Đã hoàn thành cấu hình tài khoản admin!");

  } catch (error) {
    console.error("❌ Lỗi thực thi script:", error.message);
    process.exit(1);
  }
}

createAdminUser();
