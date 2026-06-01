const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dmhorzhlftjuvijdmxku.supabase.co";
const supabaseKey = "sb_publishable_KUqsOrcyCYRwSHCbSF_psg_zip3ze34"; // Public anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("⚡ Testing anonymous select from 'san_pham_do_uong'...");
  const { data: drinks, error: drinksErr } = await supabase
    .from('san_pham_do_uong')
    .select('*, danh_muc_san_pham (slug, ten_danh_muc)')
    .limit(2);

  if (drinksErr) {
    console.error("❌ Anon select from san_pham_do_uong failed:", drinksErr.message);
  } else {
    console.log("✅ Anon select from san_pham_do_uong succeeded! Sample:", drinks);
  }

  console.log("\n⚡ Testing anonymous select from 'products'...");
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('*, categories (slug, name)')
    .limit(2);

  if (prodErr) {
    console.error("❌ Anon select from products failed:", prodErr.message);
  } else {
    console.log("✅ Anon select from products succeeded! Sample:", products);
  }
}

run();
