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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: legacyCats } = await supabase.from('categories').select('*');
  console.log("=== Legacy Categories ===");
  legacyCats.forEach(c => console.log(`Slug: ${c.slug} | Name: ${c.name} | ID: ${c.id}`));

  const { data: legacyProds } = await supabase.from('products').select('name, slug, category_id');
  console.log("\n=== Legacy Products ===");
  legacyProds.forEach(p => {
    const cat = legacyCats.find(c => c.id === p.category_id);
    console.log(`- [${p.slug}] ${p.name} -> Cat: ${cat ? cat.name : 'None'} (${cat ? cat.slug : ''})`);
  });
}

run();
