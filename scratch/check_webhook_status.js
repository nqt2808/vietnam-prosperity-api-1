const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read env
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
  console.log("Missing env keys!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkWebhookOrders() {
  console.log("Checking orders in Supabase for webhook updates...");
  
  // Query all orders with ghi_chu or specific status
  const { data: orders, error } = await supabase
    .from('don_hang')
    .select('id, ma_don_hang, trang_thai, ghi_chu, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return;
  }

  console.log(`Total orders found: ${orders.length}`);

  const webhookOrders = orders.filter(o => {
    const note = o.ghi_chu || '';
    return note.includes('SePay') || note.includes('Webhook') || note.includes('Hệ thống') || note.includes('xác nhận');
  });

  console.log(`Orders updated by webhook: ${webhookOrders.length}`);
  
  if (webhookOrders.length > 0) {
    webhookOrders.forEach(o => {
      console.log(`- Mã đơn: ${o.ma_don_hang} | Trạng thái: ${o.trang_thai} | Ghi chú: "${o.ghi_chu.replace(/\n/g, ' ')}"`);
    });
  } else {
    console.log("No orders found containing webhook updates in comments.");
    
    // Print the last 5 orders for review
    console.log("\nLast 5 orders:");
    orders.slice(0, 5).forEach(o => {
      console.log(`- Mã đơn: ${o.ma_don_hang} | Trạng thái: ${o.trang_thai} | Ghi chú: "${o.ghi_chu || ''}"`);
    });
  }
}

checkWebhookOrders();
