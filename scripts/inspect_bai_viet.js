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
    console.log("\n--- Table Column Info for public.bai_viet ---");
    const colRes = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'bai_viet';
    `);
    console.table(colRes.rows);

    console.log("\n--- Checking if there are any existing rows ---");
    const rowRes = await client.query("SELECT * FROM public.bai_viet LIMIT 1;");
    console.log(JSON.stringify(rowRes.rows, null, 2));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
