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
  // Query 1 row from don_hang to see its columns
  const { data, error } = await supabase
    .from('don_hang')
    .select('*')
    .limit(1);

  if (error) {
    console.error("❌ Error querying don_hang:", error.message);
  } else {
    console.log("✅ Query successful!");
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("Table is empty. Let's try to query the schema via RPC or just examine a mock select.");
      const { data: cols, error: err2 } = await supabase
        .from('don_hang')
        .select()
        .limit(0);
      if (err2) {
        console.error("Error limit 0:", err2.message);
      } else {
        console.log("Data columns:", cols);
      }
    }
  }
}

run();
