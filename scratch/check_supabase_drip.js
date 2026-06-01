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
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing keys in .env.local!");
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log("--- Checking categories table in Supabase ---");
  const { data: categories, error: err } = await supabase
    .from('categories')
    .select('id, name, slug, description');
  
  if (err) {
    console.error("Error categories:", err.message);
  } else {
    categories.forEach(c => {
      if (c.slug.includes('drip') || c.slug.includes('giay') || c.slug.includes('hat') || c.slug.includes('merch')) {
        console.log(`\nSlug: "${c.slug}" | Name: "${c.name}"`);
        console.log(`Description: "${c.description}"`);
      }
    });
  }

  console.log("\n--- Checking danh_muc_san_pham table in Supabase ---");
  const { data: customCats, error: err2 } = await supabase
    .from('danh_muc_san_pham')
    .select('id, ten_danh_muc, slug');
  
  if (err2) {
    console.error("Error danh_muc_san_pham:", err2.message);
  } else {
    customCats.forEach(c => {
      if (c.slug.includes('drip') || c.slug.includes('giay') || c.slug.includes('hat')) {
        console.log(`Slug: "${c.slug}" | Name: "${c.ten_danh_muc}"`);
      }
    });
  }
}

run();
