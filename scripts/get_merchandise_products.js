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
  console.log("Fetching existing Merchandise products...");
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, price, category_id')
    .eq('category_id', '65e10cc7-af35-4dce-aac6-067196b73e45');
    
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log("Products list:");
  products.forEach(p => {
    console.log(`ID: ${p.id} | Slug: ${p.slug} | Name: ${p.name} | Price: ${p.price}`);
  });
}

run();
