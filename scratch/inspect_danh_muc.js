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
  const { data, error } = await supabase.from('danh_muc_san_pham').select('*');
  if (error) {
    console.error("❌ Error fetching danh_muc_san_pham:", error.message);
  } else {
    console.log("✅ danh_muc_san_pham data size:", data.length);
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
      console.log("Sample rows:", data.slice(0, 5));
    } else {
      console.log("Empty table");
    }
  }
}

run();
