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
  console.log("Testing don_hang query...");
  const { data, error } = await supabase
    .from('don_hang')
    .select(`*, thong_tin_khach_hang:khach_hang_id (ho_ten, so_dien_thoai, email, dia_chi)`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("❌ Query error:", error.message);
    console.error(error);
  } else {
    console.log(`✅ Query successful! Retrieved ${data.length} orders.`);
    if (data.length > 0) {
      console.log("Sample order:", JSON.stringify(data[0], null, 2));
    }
  }
}

run();
