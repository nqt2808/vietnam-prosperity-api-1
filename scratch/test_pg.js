const { Client } = require('pg');

const regions = [
  'ap-southeast-1', // Singapore
  'ap-northeast-1', // Tokyo
  'ap-northeast-2', // Seoul
  'ap-northeast-3', // Osaka
  'ap-southeast-2', // Sydney
  'ap-south-1',     // Mumbai
  'us-east-1',      // N. Virginia
  'us-west-2',      // Oregon
  'eu-central-1',   // Frankfurt
  'eu-west-1'       // Ireland
];

async function scan() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    console.log(`🔍 Đang thử kết nối qua pooler của region: ${r} (${host})...`);
    
    const client = new Client({
      host: host,
      port: 5432,
      user: 'postgres.dmhorzhlftjuvijdmxku',
      password: 'VpcDbPasswordSecure2026Key99',
      database: 'postgres',
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000 // Timeout nhanh để quét cho lẹ
    });

    try {
      await client.connect();
      console.log(`🎉 KẾT NỐI THÀNH CÔNG! Region đúng của database là: ${r}`);
      const res = await client.query("SELECT NOW();");
      console.log("SQL Test Result:", res.rows[0]);
      await client.end();
      break; // Dừng quét khi tìm thấy
    } catch (err) {
      console.log(`❌ Thất bại ở region ${r}: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
    console.log("--------------------------------------------------");
  }
}

scan();
