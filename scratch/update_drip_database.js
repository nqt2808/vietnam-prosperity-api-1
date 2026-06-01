const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Read environment variables
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

const newDripCategoryDesc = "Dòng cà phê Drip của Trung Nguyên là dòng cà phê hạt mộc rang xay nguyên bản, được thiết kế để kết hợp giữa kiểu pha phin truyền thống Việt Nam và phong cách Drip của phương Tây";

async function updateDatabase() {
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase keys in .env.local!");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  console.log("📡 Connecting to Supabase database...");

  // A. Cập nhật description cho danh mục Drip trong bảng categories (Next.js)
  const { data: catUpdate, error: catErr } = await supabase
    .from('categories')
    .update({ description: newDripCategoryDesc })
    .eq('slug', 'ca-phe-phin-giay');

  if (catErr) {
    console.error("❌ Error updating categories table:", catErr.message);
  } else {
    console.log("✅ Successfully updated Cà phê phin giấy category description in Supabase categories table!");
  }

  // B. Cập nhật description cho sản phẩm ca-phe-drip-1-culi-robusta trong bảng products (Next.js)
  const newProductShortDesc = "Hộp 10 túi lọc cà phê Drip từ hạt mộc Culi Robusta rang xay nguyên bản.";
  const newProductDesc = "Hộp 10 túi lọc cà phê Drip được chế biến 100% từ hạt mộc Robusta tuyển chọn chín mọng, rang xay nguyên bản, đậm vị đắng truyền thống, mang lại tách cà phê phin giấy nhỏ giọt thơm ngon tuyệt hảo cho người bận rộn.";
  
  const { data: prodUpdate, error: prodErr } = await supabase
    .from('products')
    .update({ 
      short_description: newProductShortDesc,
      description: newProductDesc
    })
    .eq('slug', 'ca-phe-drip-1-culi-robusta');

  if (prodErr) {
    console.error("❌ Error updating products table:", prodErr.message);
  } else {
    console.log("✅ Successfully updated Cà phê Drip 1 product in Supabase products table!");
  }
}

// 2. Cập nhật các file index.html tĩnh (dự án và Desktop)
const projectIndex = path.join(__dirname, '../index.html');
const desktopIndex = 'C:\\Users\\dell 7620\\Desktop\\index.html';
const indexes = [projectIndex, desktopIndex];

function updateIndexHtmlFiles() {
  indexes.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ Skipping missing file: ${filePath}`);
      return;
    }

    console.log(`Patching HTML: ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Cập nhật lại mô tả danh mục ca-phe-drip trong index.html cho chuẩn xác chữ "hạt mộc"
    const oldDripGroupDesc = `"ca-phe-drip": "Dòng cà phê Drip của Trung Nguyên là dòng cà phê hạt rang xay nguyên bản, được thiết kế để kết hợp giữa kiểu pha phin truyền thống Việt Nam và phong cách Drip của phương Tây",`;
    const newDripGroupDesc = `"ca-phe-drip": "${newDripCategoryDesc}",`;
    if (content.includes(oldDripGroupDesc)) {
      content = content.replace(oldDripGroupDesc, newDripGroupDesc);
      console.log("- Updated category group description to emphasize pure whole bean / hạt mộc.");
    }

    // Cập nhật mô tả các sản phẩm Drip cụ thể để thể hiện rõ chúng được làm từ hạt mộc rang xay
    const oldDrip1 = `"ca-phe-drip-1-culi-robusta": "Cà phê phin giấy tiện lợi chiết xuất từ hạt Culi Robusta chín mọng, mang đến vị đắng đậm sâu lắng, mạnh mẽ đặc trưng chuẩn gu phin truyền thống cho người bận rộn.",`;
    const newDrip1 = `"ca-phe-drip-1-culi-robusta": "Cà phê phin giấy Drip 1 được chế biến 100% từ hạt mộc Culi Robusta rang xay nguyên bản, mang đến vị đắng đậm sâu lắng, mạnh mẽ đặc trưng chuẩn gu phin truyền thống cho người bận rộn.",`;

    const oldDrip2 = `"ca-phe-drip-2-robusta-arabica": "Dòng drip phối trộn hoàn mỹ giữa hạt Robusta đằm sâu và Arabica thơm thanh tao, mang lại tách cà phê phin giấy êm dịu thanh nhã cùng hương thơm tinh tế quyến rũ.",`;
    const newDrip2 = `"ca-phe-drip-2-robusta-arabica": "Cà phê phin giấy Drip 2 phối trộn hoàn mỹ từ các hạt mộc Robusta đằm sâu và Arabica thanh tao rang xay nguyên bản, mang lại tách cà phê êm dịu thanh nhã cùng hương thơm tinh tế quyến rũ.",`;

    const oldDrip4 = `"ca-phe-drip-4-premium-culi": "Dòng drip cao cấp chiết xuất từ hạt Culi Robusta tuyển chọn khắt khe, mang hương thơm nồng nàn nồng ấm và vị đắng đậm sâu lắng nồng nàn đánh thức mọi giác quan tức thì.",`;
    const newDrip4 = `"ca-phe-drip-4-premium-culi": "Cà phê phin giấy Drip 4 cao cấp chế biến từ hạt mộc Culi Robusta tuyển chọn khắt khe rang xay nguyên bản, mang hương thơm nồng nàn ấm áp và vị đắng đậm sâu đánh thức mọi giác quan tức thì.",`;

    const oldDrip5 = `"ca-phe-drip-5-culi-arabica": "Dòng drip vương giả chế biến từ hạt Culi Arabica hảo hạng, dậy lên vị chua thanh nhẹ nhàng quyến rũ cùng hương thơm ngát quý phái và hậu vị ngọt sâu lắng đầy thi vị.",`;
    const newDrip5 = `"ca-phe-drip-5-culi-arabica": "Cà phê phin giấy Drip 5 vương giả chế biến từ hạt mộc Culi Arabica hảo hạng rang xay nguyên bản, dậy lên vị chua thanh nhẹ nhàng quyến rũ cùng hương thơm ngát quý phái và hậu vị ngọt sâu đầy thi vị.",`;

    if (content.includes(oldDrip1)) content = content.replace(oldDrip1, newDrip1);
    if (content.includes(oldDrip2)) content = content.replace(oldDrip2, newDrip2);
    if (content.includes(oldDrip4)) content = content.replace(oldDrip4, newDrip4);
    if (content.includes(oldDrip5)) content = content.replace(oldDrip5, newDrip5);

    console.log("- Successfully updated individual Drip 1, 2, 4, 5 product descriptions to emphasize hạt mộc.");

    fs.writeFileSync(filePath, content, 'utf-8');
  });
}

async function main() {
  await updateDatabase();
  updateIndexHtmlFiles();
  console.log("\n=== COMPLETED ALL DRIP DESCRIPTION REPLACEMENTS ===");
}

main();
