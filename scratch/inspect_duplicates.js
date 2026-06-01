const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function run() {
  const { data: drinks } = await supabase.from('san_pham_do_uong').select('slug, ten_san_pham');
  const { data: merch } = await supabase.from('san_pham_merchandise').select('slug, ten_san_pham');

  const drinkSlugs = new Set(drinks.map(d => d.slug));
  const merchSlugs = new Set(merch.map(m => m.slug));

  const common = [];
  for (const slug of drinkSlugs) {
    if (merchSlugs.has(slug)) {
      common.push(slug);
    }
  }

  console.log(`🍹 Số lượng đồ uống: ${drinks.length}`);
  console.log(`🎁 Số lượng vật phẩm: ${merch.length}`);
  console.log(`🔍 Các slug trùng lặp giữa 2 bảng (${common.length}):`);
  common.forEach(slug => {
    const dItem = drinks.find(d => d.slug === slug);
    const mItem = merch.find(m => m.slug === slug);
    console.log(`- Slug: "${slug}"\n  🍹 Drink: "${dItem.ten_san_pham}"\n  🎁 Merch: "${mItem.ten_san_pham}"`);
  });
}

run();
