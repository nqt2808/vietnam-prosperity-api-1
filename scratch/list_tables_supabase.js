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
  
  console.log("Checking if 'san_pham_do_uong' has columns...");
  const { data: drinks, error: drinksErr } = await supabase
    .from('san_pham_do_uong')
    .select('*')
    .limit(1);
    
  if (drinksErr) {
    console.error("❌ Error san_pham_do_uong:", drinksErr.message);
  } else {
    console.log("✅ san_pham_do_uong sample keys:", drinks.length > 0 ? Object.keys(drinks[0]) : "Empty table");
  }

  console.log("\nChecking 'san_pham_merchandise'...");
  const { data: merch, error: merchErr } = await supabase
    .from('san_pham_merchandise')
    .select('*')
    .limit(1);
    
  if (merchErr) {
    console.error("❌ Error san_pham_merchandise:", merchErr.message);
  } else {
    console.log("✅ san_pham_merchandise sample keys:", merch.length > 0 ? Object.keys(merch[0]) : "Empty table");
  }

  console.log("\nChecking 'vat_pham'...");
  const { data: vp, error: vpErr } = await supabase
    .from('vat_pham')
    .select('*')
    .limit(1);
    
  if (vpErr) {
    console.error("❌ Error vat_pham:", vpErr.message);
  } else {
    console.log("✅ vat_pham sample keys:", vp.length > 0 ? Object.keys(vp[0]) : "Empty table");
  }
}

run();
