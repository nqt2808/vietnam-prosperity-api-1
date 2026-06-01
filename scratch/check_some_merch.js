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

async function run() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log("--- Querying sample products from san_pham_merchandise ---");
  const { data: items, error } = await supabase
    .from('san_pham_merchandise')
    .select('slug, ten_san_pham, danh_muc_id')
    .limit(30);
    
  if (error) console.error(error);
  else {
    items.forEach(item => {
      console.log(`Slug: ${item.slug} | Name: ${item.ten_san_pham} | Cat ID: ${item.danh_muc_id}`);
    });
  }
}

run();
