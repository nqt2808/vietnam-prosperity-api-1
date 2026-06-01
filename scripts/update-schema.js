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
    // 1. Find and drop CHECK constraints for 'orders.status'
    console.log("🔍 Checking constraints for orders.status...");
    const resStatus = await client.query(`
      SELECT tc.constraint_name 
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'orders' AND ccu.column_name = 'status' AND tc.constraint_type = 'CHECK';
    `);

    for (let row of resStatus.rows) {
      console.log(`💥 Dropping constraint: ${row.constraint_name}`);
      await client.query(`ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS "${row.constraint_name}" CASCADE;`);
    }

    // 2. Find and drop CHECK constraints for 'orders.payment_status'
    console.log("🔍 Checking constraints for orders.payment_status...");
    const resPayStatus = await client.query(`
      SELECT tc.constraint_name 
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'orders' AND ccu.column_name = 'payment_status' AND tc.constraint_type = 'CHECK';
    `);

    for (let row of resPayStatus.rows) {
      console.log(`💥 Dropping constraint: ${row.constraint_name}`);
      await client.query(`ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS "${row.constraint_name}" CASCADE;`);
    }

    console.log("🎉 All CHECK constraints on status & payment_status dropped successfully!");

  } catch (err) {
    console.error("❌ Error updating database schema:", err);
  } finally {
    await client.end();
  }
}

run();
