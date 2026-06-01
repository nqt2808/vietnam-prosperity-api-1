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

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Checking Supabase tables...");
  
  // Try querying 'orders' table
  const { data: orders, error: ordersErr } = await supabase
    .from('orders')
    .select('*')
    .limit(1);
    
  console.log("Query 'orders' error:", ordersErr ? ordersErr.message : "None (Success!)");
  if (orders) console.log("Sample order:", orders[0]);

  // Try querying 'don_hang' table
  const { data: don_hang, error: donHangErr } = await supabase
    .from('don_hang')
    .select('*')
    .limit(1);
    
  console.log("Query 'don_hang' error:", donHangErr ? donHangErr.message : "None (Success!)");
  if (don_hang) console.log("Sample don_hang:", don_hang[0]);

  // Try querying 'profiles' table
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  console.log("Query 'profiles' error:", profilesErr ? profilesErr.message : "None (Success!)");
  if (profiles) console.log("Sample profile:", profiles[0]);
}

run();
