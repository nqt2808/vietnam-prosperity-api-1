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
  
  console.log("--- FETCHING danh_muc_san_pham ---");
  const { data: customCats, error: err1 } = await supabase
    .from('danh_muc_san_pham')
    .select('id, ten_danh_muc, slug');
  if (err1) console.error(err1.message);
  else console.log(customCats);

  console.log("\n--- FETCHING categories ---");
  const { data: nextCats, error: err2 } = await supabase
    .from('categories')
    .select('id, name, slug');
  if (err2) console.error(err2.message);
  else console.log(nextCats);
}

run();
