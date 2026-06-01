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
  console.log("Connected to PostgreSQL via direct connection!");

  try {
    // ---- 1. CHECK & DEDUPLICATE san_pham_do_uong BY NAME ----
    console.log("\n🔍 Checking duplicates by NAME (ten_san_pham) in 'san_pham_do_uong'...");
    
    const drinkDuplicatesRes = await client.query(`
      SELECT LOWER(TRIM(ten_san_pham)) as name_key, COUNT(*), array_agg(id ORDER BY created_at ASC, id ASC) as ids, array_agg(slug ORDER BY created_at ASC, id ASC) as slugs
      FROM public.san_pham_do_uong
      GROUP BY LOWER(TRIM(ten_san_pham))
      HAVING COUNT(*) > 1;
    `);

    console.log(`Found ${drinkDuplicatesRes.rows.length} duplicate name groups in san_pham_do_uong.`);
    
    let deletedDrinks = 0;
    for (const row of drinkDuplicatesRes.rows) {
      const ids = row.ids;
      const slugs = row.slugs;
      const oldestId = ids[0];
      const idsToDelete = ids.slice(1);
      const slugsToDelete = slugs.slice(1);

      console.log(`  - Name '${row.name_key}': keeping ID ${oldestId} (${slugs[0]}), deleting IDs: ${idsToDelete.join(', ')} (${slugsToDelete.join(', ')})`);
      
      const delRes = await client.query(`
        DELETE FROM public.san_pham_do_uong
        WHERE id = ANY($1::bigint[]);
      `, [idsToDelete]);
      
      deletedDrinks += delRes.rowCount;
    }

    // ---- 2. CHECK & DEDUPLICATE san_pham_merchandise BY NAME ----
    console.log("\n🔍 Checking duplicates by NAME (ten_san_pham) in 'san_pham_merchandise'...");
    
    const merchDuplicatesRes = await client.query(`
      SELECT LOWER(TRIM(ten_san_pham)) as name_key, COUNT(*), array_agg(id ORDER BY created_at ASC, id ASC) as ids, array_agg(slug ORDER BY created_at ASC, id ASC) as slugs
      FROM public.san_pham_merchandise
      GROUP BY LOWER(TRIM(ten_san_pham))
      HAVING COUNT(*) > 1;
    `);

    console.log(`Found ${merchDuplicatesRes.rows.length} duplicate name groups in san_pham_merchandise.`);
    
    let deletedMerch = 0;
    for (const row of merchDuplicatesRes.rows) {
      const ids = row.ids;
      const slugs = row.slugs;
      const oldestId = ids[0];
      const idsToDelete = ids.slice(1);
      const slugsToDelete = slugs.slice(1);

      console.log(`  - Name '${row.name_key}': keeping ID ${oldestId} (${slugs[0]}), deleting IDs: ${idsToDelete.join(', ')} (${slugsToDelete.join(', ')})`);
      
      const delRes = await client.query(`
        DELETE FROM public.san_pham_merchandise
        WHERE id = ANY($1::bigint[]);
      `, [idsToDelete]);
      
      deletedMerch += delRes.rowCount;
    }

    console.log("\n==========================================");
    console.log("🎉 DE-DUPLICATION BY NAME COMPLETE!");
    console.log(`🍹 Duplicate Drinks Deleted: ${deletedDrinks}`);
    console.log(`🎁 Duplicate Merchandise Deleted: ${deletedMerch}`);
    console.log("==========================================");

  } catch (err) {
    console.error("❌ SQL Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
