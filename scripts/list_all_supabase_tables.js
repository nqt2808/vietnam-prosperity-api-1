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
  console.log("🔍 Fetching a sample row from 'don_hang'...");
  const { data: sampleRow, error: sampleErr } = await supabase
    .from('don_hang')
    .select('*')
    .limit(1);

  if (sampleErr) {
    console.error("❌ Error:", sampleErr.message);
  } else {
    if (sampleRow.length > 0) {
      console.log("Sample Row Keys in 'don_hang':", Object.keys(sampleRow[0]));
      console.log("Sample Row Content:", sampleRow[0]);
    } else {
      console.log("Table 'don_hang' is empty, fetching schema catalog metadata...");
      // Query the columns list via RPC or check if we can query it
    }
  }
}

run();
