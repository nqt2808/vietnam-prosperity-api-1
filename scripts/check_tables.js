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

  await client.connect();
  console.log("Connected to PostgreSQL!");

  try {
    console.log("\n--- Categories (danh_muc_san_pham) ---");
    const catRes = await client.query("SELECT * FROM public.danh_muc_san_pham;");
    console.table(catRes.rows);

    console.log("\n--- Tables list ---");
    const tablesRes = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
    console.table(tablesRes.rows);

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
