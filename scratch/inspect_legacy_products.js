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
  console.log("🔍 Fetching legacy products & categories...");
  
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('*');
    
  if (catErr) {
    console.error("Error fetching categories:", catErr.message);
    return;
  }
  
  console.log(`Found ${categories.length} categories.`);
  categories.forEach(c => console.log(`Category: ${c.name} | Slug: ${c.slug} | ID: ${c.id}`));

  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*, product_images(*)');

  if (prodErr) {
    console.error("Error fetching products:", prodErr.message);
    return;
  }

  console.log(`Found ${products.length} products in legacy table.`);
  
  // Group by category
  const grouped = {};
  products.forEach(p => {
    const cat = categories.find(c => c.id === p.category_id);
    const catName = cat ? cat.name : 'Unknown';
    if (!grouped[catName]) grouped[catName] = [];
    grouped[catName].push(p);
  });

  for (const catName in grouped) {
    console.log(`\n📦 Category: ${catName} (${grouped[catName].length} products)`);
    grouped[catName].slice(0, 5).forEach(p => {
      console.log(`  - [${p.slug}] ${p.name} | Price: ${p.price} | Status: ${p.status}`);
      if (p.product_images && p.product_images.length > 0) {
        console.log(`    Images: ${p.product_images.map(img => img.url).join(', ')}`);
      }
    });
    if (grouped[catName].length > 5) {
      console.log(`  ... and ${grouped[catName].length - 5} more`);
    }
  }
}

run();
