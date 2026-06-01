const http = require('https');

function getAPI(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function run() {
  console.log("=== VERIFYING LIVE RENDER.COM BACKEND ENDPOINTS ===");
  
  try {
    console.log("\n1. Fetching /api/do-uong...");
    const drinks = await getAPI('https://vpc-70cs.onrender.com/api/do-uong');
    if (Array.isArray(drinks)) {
      console.log(`✅ Success! Found ${drinks.length} drinks.`);
      console.log("Sample drinks:");
      drinks.slice(0, 3).forEach(d => {
        console.log(`  - Name: ${d.ten_san_pham} | Slug: ${d.slug} | Category: ${d.ten_danh_muc}`);
      });
      
      // Check if cakes (bánh) are also in this endpoint (they were consolidated into san_pham_do_uong)
      const cakes = drinks.filter(d => d.slug_danh_muc === 'banh' || (d.ten_danh_muc && d.ten_danh_muc.toLowerCase().includes('bánh')));
      console.log(`  🎂 Cakes inside drinks array: ${cakes.length} items`);
      if (cakes.length > 0) {
        console.log("Sample cakes found inside drinks array:");
        cakes.slice(0, 3).forEach(c => {
          console.log(`    * ${c.ten_san_pham} (${c.slug})`);
        });
      }
    } else {
      console.log("❌ Response is not an array:", drinks);
    }
  } catch (err) {
    console.error("❌ Error fetching drinks:", err.message);
  }
  
  try {
    console.log("\n2. Fetching /api/vat-pham...");
    let merch = await getAPI('https://vpc-70cs.onrender.com/api/vat-pham');
    if (!Array.isArray(merch)) {
      console.log("⚠️ /api/vat-pham failed or not array. Trying /api/merchandise...");
      merch = await getAPI('https://vpc-70cs.onrender.com/api/merchandise');
    }
    
    if (Array.isArray(merch)) {
      console.log(`✅ Success! Found ${merch.length} merchandise products.`);
      console.log("Sample merchandise:");
      merch.slice(0, 3).forEach(m => {
        console.log(`  - Name: ${m.ten_san_pham} | Slug: ${m.slug} | Price: ${m.gia}đ`);
      });
    } else {
      console.log("❌ Response is not an array:", merch);
    }
  } catch (err) {
    console.error("❌ Error fetching merchandise:", err.message);
  }
}

run();
