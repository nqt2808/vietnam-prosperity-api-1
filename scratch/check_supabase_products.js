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
  
  console.log("--- Fetching products from Supabase ---");
  const { data: products, error: err } = await supabase
    .from('products')
    .select('id, name, slug, description, short_description, price');
  
  if (err) {
    console.error("Error products:", err.message);
  } else {
    products.forEach(p => {
      if (p.slug.includes('drip') || p.slug.includes('success') || p.slug.includes('hat-moc')) {
        console.log(`\nSlug: "${p.slug}" | Name: "${p.name}" | Price: ${p.price}`);
        console.log(`Short Desc: "${p.short_description}"`);
        console.log(`Desc: "${p.description}"`);
      }
    });
  }
}

run();
