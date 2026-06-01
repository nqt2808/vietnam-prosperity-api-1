const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://dmhorzhlftjuvijdmxku.supabase.co";
const supabaseKey = "sb_publishable_KUqsOrcyCYRwSHCbSF_psg_zip3ze34"; // Public anon key

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("⚡ Testing anonymous insert into 'don_hang' table...");
  
  const testOrder = {
    ma_don_hang: 'DH_ANON_TEST_' + Math.floor(1000 + Math.random() * 9000),
    danh_sach_san_pham: 'Test Anon Product x1',
    tong_tien: 39000,
    phi_ship: 0,
    khoang_cach_km: 0,
    hinh_thuc_nhan_hang: 'den_lay_tai_quan',
    phuong_thuc_thanh_toan: 'thanh_toan_khi_nhan_hang',
    dia_chi_giao_hang: 'Nhận tại cửa hàng',
    ghi_chu: 'Test anon insert',
    trang_thai: 'da_dat_don'
  };

  const { data, error } = await supabase
    .from('don_hang')
    .insert(testOrder)
    .select();

  if (error) {
    console.error("❌ Anon insert failed:", error.message);
  } else {
    console.log("✅ Anon insert succeeded! Inserted Row:", data[0]);
  }
}

run();
