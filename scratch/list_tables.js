const { Client } = require('pg');

async function run() {
  const client = new Client({
    user: 'postgres',
    host: 'db.dmhorzhlftjuvijdmxku.supabase.co',
    database: 'postgres',
    password: 'VpcDbPasswordSecure2026Key99',
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log("Connected to PostgreSQL successfully via direct connection!");

  try {
    // 1. Add hinh_anh column if not exists in san_pham_merchandise
    console.log("Checking and altering san_pham_merchandise table...");
    await client.query(`
      ALTER TABLE public.san_pham_merchandise 
      ADD COLUMN IF NOT EXISTS hinh_anh TEXT;
    `);
    console.log("✅ Column 'hinh_anh' ensured in san_pham_merchandise!");

    // 2. Print current columns for both tables to confirm
    const colsRes = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema='public' 
        AND table_name IN ('san_pham_do_uong', 'san_pham_merchandise')
      ORDER BY table_name, column_name;
    `);
    
    console.log("\nColumns structure:");
    colsRes.rows.forEach(r => {
      console.log(`- [${r.table_name}] ${r.column_name} (${r.data_type})`);
    });

  } catch (err) {
    console.error("❌ SQL Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
