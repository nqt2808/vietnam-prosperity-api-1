const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: 'db.dmhorzhlftjuvijdmxku.supabase.co',
    port: 5432,
    user: 'postgres',
    password: 'VpcDbPasswordSecure2026Key99',
    database: 'postgres',
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log("⚡ Connecting directly to Supabase via host...");
  await client.connect();
  console.log("✅ Connected successfully!");

  try {
    console.log("🛠️ Dropping existing public policies if they exist to avoid duplicate errors...");
    await client.query(`DROP POLICY IF EXISTS "Allow public select on san_pham_do_uong" ON public.san_pham_do_uong;`);
    await client.query(`DROP POLICY IF EXISTS "Allow public select on danh_muc_san_pham" ON public.danh_muc_san_pham;`);
    await client.query(`DROP POLICY IF EXISTS "Allow public insert on don_hang" ON public.don_hang;`);
    await client.query(`DROP POLICY IF EXISTS "Allow public select on don_hang" ON public.don_hang;`);

    console.log("🛠️ Creating SELECT policy for 'san_pham_do_uong'...");
    await client.query(`
      CREATE POLICY "Allow public select on san_pham_do_uong" 
      ON public.san_pham_do_uong 
      FOR SELECT 
      USING (true);
    `);

    console.log("🛠️ Creating SELECT policy for 'danh_muc_san_pham'...");
    await client.query(`
      CREATE POLICY "Allow public select on danh_muc_san_pham" 
      ON public.danh_muc_san_pham 
      FOR SELECT 
      USING (true);
    `);

    console.log("🛠️ Creating INSERT policy for 'don_hang'...");
    await client.query(`
      CREATE POLICY "Allow public insert on don_hang" 
      ON public.don_hang 
      FOR INSERT 
      WITH CHECK (true);
    `);

    console.log("🛠️ Creating SELECT policy for 'don_hang'...");
    await client.query(`
      CREATE POLICY "Allow public select on don_hang" 
      ON public.don_hang 
      FOR SELECT 
      USING (true);
    `);

    console.log("🎉 All public read/write RLS policies created successfully on Supabase!");

  } catch (err) {
    console.error("❌ Error updating database policies:", err);
  } finally {
    await client.end();
  }
}

run();
