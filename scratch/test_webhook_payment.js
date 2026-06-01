const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Load environment variables
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

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const testOrderCode = "VPC-DH-20260528-999999";

async function runTest() {
  console.log("=== INTEGRATION TEST: AUTOMATIC PAYMENT DETECTION ===");

  try {
    // 1. Create a mock order in Supabase with status 'cho_chuyen_khoan'
    console.log(`\n1. Creating mock order on Supabase with code: ${testOrderCode}...`);
    const { error: insertError } = await supabase
      .from('don_hang')
      .insert({
        ma_don_hang: testOrderCode,
        danh_sach_san_pham: "Coffee Legend x1",
        tong_tien: 45000,
        phi_ship: 0,
        khoang_cach_km: 0,
        hinh_thuc_nhan_hang: "giao_hang_noi_thanh",
        phuong_thuc_thanh_toan: "chuyen_khoan",
        dia_chi_giao_hang: "123 Test Street, Hue",
        trang_thai: "cho_chuyen_khoan"
      });

    if (insertError) {
      throw new Error(`Failed to create mock order: ${insertError.message}`);
    }
    console.log("✅ Mock order created successfully on Supabase!");

    // 2. Simulate sending SePay Webhook payload to local Next.js server
    console.log("\n2. Sending mock Webhook payload (POST) to http://localhost:3000/api/payment-webhook...");
    const payload = JSON.stringify({
      id: 999999,
      gateway: "Vietcombank",
      transactionDate: new Date().toISOString(),
      amountIn: 45000, // Matching the order total
      amountOut: 0,
      code: `Thanh toan don hang ${testOrderCode}`, // Webhook contains order code in transfer content
      transactionContent: `Rut tien tu dong cho VPC ${testOrderCode}`,
      referenceNumber: "FT-TEST-999999"
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/payment-webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const reqPromise = new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body });
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(payload);
      req.end();
    });

    const response = await reqPromise;
    console.log(`📬 Webhook response code: ${response.statusCode}`);
    console.log(`📬 Webhook response body: ${response.body}`);

    if (response.statusCode !== 200) {
      throw new Error(`Webhook endpoint returned error status: ${response.statusCode}`);
    }

    // 3. Verify that the order status in Supabase was successfully updated to 'da_chuyen_khoan'
    console.log("\n3. Verifying order status in Supabase database...");
    const { data: updatedOrder, error: queryError } = await supabase
      .from('don_hang')
      .select('trang_thai, ghi_chu')
      .eq('ma_don_hang', testOrderCode)
      .single();

    if (queryError) {
      throw new Error(`Failed to query updated order: ${queryError.message}`);
    }

    console.log(`📊 Updated Order Status in Supabase: "${updatedOrder.trang_thai}"`);
    
    if (updatedOrder.trang_thai === 'da_chuyen_khoan') {
      console.log("🏆 SUCCESS! The order was automatically detected and updated to 'da_chuyen_khoan'!");
    } else {
      console.error(`❌ FAILURE! Expected 'da_chuyen_khoan' but got '${updatedOrder.trang_thai}'`);
    }

  } catch (err) {
    console.error("❌ TEST FAILED:", err.message);
    console.log("\n💡 Reminder: Make sure the Next.js dev server is running on port 3000 (npm run dev) before executing this test!");
  } finally {
    // 4. Cleanup: Delete the mock order from Supabase
    console.log(`\n4. Cleaning up... Deleting mock order ${testOrderCode} from Supabase...`);
    const { error: deleteError } = await supabase
      .from('don_hang')
      .delete()
      .eq('ma_don_hang', testOrderCode);

    if (deleteError) {
      console.error("❌ Error during cleanup:", deleteError.message);
    } else {
      console.log("🧹 Cleanup complete. Database restored to original state!");
    }
    console.log("\n=== TEST COMPLETED ===");
  }
}

runTest();
