const { Client } = require('pg');
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

const connectionString = env.DATABASE_URL + (env.DATABASE_URL.includes('?') ? '&' : '?') + 'options=project%3Ddmhorzhlftjuvijdmxku';
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!connectionString || !supabaseUrl || !supabaseKey) {
  console.error("❌ Lỗi: Thiếu cấu hình DATABASE_URL hoặc Supabase keys trong file .env.local!");
  process.exit(1);
}

// 2. Chạy SQL tạo bảng profiles và Trigger qua kết nối pg trực tiếp
async function fixDatabaseSchema() {
  console.log("🐘 Đang kết nối trực tiếp đến PostgreSQL của Supabase...");
  const correctedConnectionString = connectionString
    .replace(':6543', ':5432') + (connectionString.includes('?') ? '&' : '?') + 'options=project%3Ddmhorzhlftjuvijdmxku';
    
  const pgClient = new Client({
    connectionString: correctedConnectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await pgClient.connect();
    console.log("✅ Đã kết nối PostgreSQL thành công!");

    console.log("🔨 Đang khởi tạo bảng 'profiles' và cấu hình Trigger...");
    const sql = `
      -- 1. Tạo bảng profiles nếu chưa có
      CREATE TABLE IF NOT EXISTS public.profiles (
        id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name   TEXT,
        phone       TEXT,
        avatar_url  TEXT,
        address     TEXT,
        city        TEXT,
        district    TEXT,
        role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      );

      -- 2. Bật Row Level Security (RLS)
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- 3. Tạo RLS policies
      DROP POLICY IF EXISTS "Allow public read for profiles" ON public.profiles;
      CREATE POLICY "Allow public read for profiles" ON public.profiles FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
      CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

      -- 4. Tạo hoặc thay thế hàm trigger tự động tạo profile
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, full_name, avatar_url, role)
        VALUES (
          new.id,
          COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
          COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
          'customer'
        )
        ON CONFLICT (id) DO NOTHING;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- 5. Cấu hình trigger liên kết với auth.users
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;

    await pgClient.query(sql);
    console.log("✅ Đã khắc phục và đồng bộ Schema bảng 'profiles' & Trigger thành công!");

  } catch (err) {
    console.error("❌ Lỗi khi khởi tạo Schema trong Database:", err.message);
    throw err;
  } finally {
    await pgClient.end();
    console.log("🔌 Đã ngắt kết nối PostgreSQL.");
  }
}

// 3. Đăng ký tài khoản Admin thông qua Supabase Auth
async function createAdminUser() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const ADMIN_EMAIL = 'admin@vpc.vn';
  const ADMIN_PASSWORD = '28082005';
  const ADMIN_FULLNAME = 'Quản trị viên VPC';

  console.log(`\n👤 Đang kết nối Auth Supabase: ${supabaseUrl}...`);

  try {
    // Tìm tài khoản Auth cũ
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let adminUser = usersData.users.find(u => u.email === ADMIN_EMAIL);
    let userId = '';

    if (!adminUser) {
      console.log(`➕ Đang tạo tài khoản Auth mới: ${ADMIN_EMAIL}...`);
      const { data: createdData, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: ADMIN_FULLNAME }
      });

      if (createError) throw createError;
      adminUser = createdData.user;
      userId = adminUser.id;
      console.log(`✅ Tạo tài khoản Auth thành công! ID: ${userId}`);
    } else {
      userId = adminUser.id;
      console.log(`ℹ️ Tài khoản Auth ${ADMIN_EMAIL} đã tồn tại. ID: ${userId}`);
      
      // Đồng bộ mật khẩu mới
      console.log(`🔐 Đang cập nhật mật khẩu mới: ${ADMIN_PASSWORD}...`);
      const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, {
        password: ADMIN_PASSWORD,
        user_metadata: { full_name: ADMIN_FULLNAME }
      });
      if (updateAuthError) throw updateAuthError;
      console.log(`✅ Cập nhật mật khẩu thành công!`);
    }

    // Phân quyền admin trong profiles
    console.log(`🛡️ Đang phân quyền 'admin' trong bảng profiles...`);
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: ADMIN_FULLNAME,
        role: 'admin',
        updated_at: new Date().toISOString()
      });

    if (upsertError) throw upsertError;
    console.log(`🎉 Đã phân quyền 'admin' cho profile thành công!`);

    console.log("\n=======================================================");
    console.log("🚀 TÀI KHOẢN ĐĂNG NHẬP TRANG QUẢN TRỊ ADMIN THÀNH CÔNG:");
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Mật khẩu: ${ADMIN_PASSWORD}`);
    console.log("=======================================================");
    console.log("✨ Bạn có thể sử dụng email và mật khẩu này để đăng nhập hệ thống!");

  } catch (error) {
    console.error("❌ Lỗi Auth:", error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    await fixDatabaseSchema();
    await createAdminUser();
  } catch (err) {
    console.error("❌ Lỗi tổng quan:", err.message);
    process.exit(1);
  }
}

main();
