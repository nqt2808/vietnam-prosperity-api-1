const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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

  console.log("⚡ Connecting to Supabase database...");
  await client.connect();
  console.log("✅ Connected successfully!");

  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260616_update_reviews_and_stock.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log("🚀 Executing SQL migration...");
    await client.query(sql);
    console.log("🎉 Migration applied successfully!");

  } catch (err) {
    console.error("❌ Error executing migration:", err);
  } finally {
    await client.end();
  }
}

run();
