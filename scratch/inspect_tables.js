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
  console.log("🔍 INSPECTING TABLES...");
  
  // 1. san_pham_do_uong
  const { data: drinks, error: drinksErr } = await supabase
    .from('san_pham_do_uong')
    .select('*')
    .limit(1);
  console.log("\n🍹 san_pham_do_uong:", drinksErr ? drinksErr.message : "Success!");
  if (drinks && drinks.length > 0) {
    console.log("Keys:", Object.keys(drinks[0]));
    console.log("Sample:", drinks[0]);
  }

  // 2. san_pham_merchandise
  const { data: merch, error: merchErr } = await supabase
    .from('san_pham_merchandise')
    .select('*')
    .limit(1);
  console.log("\n🎁 san_pham_merchandise:", merchErr ? merchErr.message : "Success!");
  if (merch && merch.length > 0) {
    console.log("Keys:", Object.keys(merch[0]));
    console.log("Sample:", merch[0]);
  }

  // 3. danh_muc_san_pham
  const { data: customCats, error: customCatsErr } = await supabase
    .from('danh_muc_san_pham')
    .select('*');
  console.log("\n📂 danh_muc_san_pham:", customCatsErr ? customCatsErr.message : "Success!");
  if (customCats) {
    customCats.forEach(c => {
      console.log(`ID: ${c.id} | Slug: ${c.slug} | Name: ${c.ten_danh_muc} | Hien thi: ${c.hien_thi}`);
    });
  }
}

run();
