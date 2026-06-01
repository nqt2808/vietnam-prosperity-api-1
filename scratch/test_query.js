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
  const { data: allDrinks, error: err1 } = await supabase.from('san_pham_do_uong').select('*');
  const { count, error: err2 } = await supabase.from('san_pham_do_uong').select('*', { count: 'exact', head: true });

  console.log(`Select * size: ${allDrinks ? allDrinks.length : 0}`);
  console.log(`Count exact: ${count}`);
  
  if (allDrinks) {
    const active = allDrinks.filter(d => d.hien_thi === true).length;
    const inactive = allDrinks.filter(d => d.hien_thi === false).length;
    console.log(`Active (hien_thi = true): ${active}`);
    console.log(`Inactive (hien_thi = false): ${inactive}`);

    // In ra các slug
    console.log("All slugs:", allDrinks.map(d => d.slug).join(', '));
  }
}

run();
