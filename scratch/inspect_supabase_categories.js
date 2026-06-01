const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Đọc file .env.local
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️ .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    // Bỏ dấu nháy nếu có
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('⚠️ Supabase credentials not found in .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectCategories() {
  console.log('Connecting to Supabase at:', supabaseUrl);
  
  // 1. Lấy tất cả danh mục
  const { data: categories, error } = await supabase
    .from('danh_muc_san_pham')
    .select('*');
    
  if (error) {
    console.error('❌ Error fetching categories:', error);
    return;
  }
  
  console.log('\n=== Danh sách danh mục trong "danh_muc_san_pham" ===');
  categories.forEach(cat => {
    console.log(`ID: ${cat.id} | Slug: ${cat.slug} | Tên: "${cat.ten_danh_muc}"`);
  });
}

inspectCategories();
