const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load .env.local if exists, fallback to default .env
const envLocalPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString("utf8");
  }
}));

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Tọa độ quán Trung Nguyên Legend Âu Lạc
const STORE_LAT = 16.4512064;
const STORE_LNG = 107.6117266;

console.log("Đang kết nối Supabase:");
console.log("SUPABASE_URL:", supabaseUrl);


const defaultBlogs = [
  {
    title: "Hè này cần gì? Một góc mát, một ly ngon và một buổi thư giãn tại Trung Nguyên Legend Âu Lạc. ☕🌿",
    desc: "Nắng hè có thể gay gắt, nhưng Trung Nguyên Legend Âu Lạc luôn có những thức uống mát lành chờ bạn ghé thưởng thức.",
    thumbnail: "https://www.facebook.com/reel/1511949147216560",
    content: `<p><strong>☀️ GIẢI NHIỆT MÙA HÈ CÙNG TRUNG NGUYÊN LEGEND ÂU LẠC 🌿</strong></p>\n\n<p>\n  Nắng hè có thể gay gắt, nhưng <strong>Trung Nguyên Legend Âu Lạc</strong> luôn có những thức uống mát lành chờ bạn ghé thưởng thức.\n  Một ly trà thanh mát, một món đá xay thơm ngon hay cà phê đậm vị sẽ giúp bạn thư giãn và nạp lại năng lượng cho ngày dài.\n</p>\n\n<p>✨ Không gian thoải mái</p>\n<p>✨ Thức uống đa dạng</p>\n<p>✨ Phù hợp để gặp gỡ bạn bè, học tập và làm việc</p>\n\n<p>\n  Ghé ngay <strong>Trung Nguyên Legend Âu Lạc</strong> để tận hưởng những phút giây chill thật dễ chịu trong mùa hè này nhé!\n</p>`,
    source_link: "https://www.facebook.com/reel/1511949147216560"
  },
  {
    title: "Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế ☕✨",
    desc: "Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.",
    thumbnail: "https://www.facebook.com/reel/1321336266180825",
    content: `<p>☕✨ <strong>Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế</strong></p>\n<p>Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.</p>\n<p>Không chỉ là điểm dừng chân thưởng thức cà phê năng lượng, nơi đây còn là không gian kết nối văn hóa, nghệ thuật và cảm hứng sống tỉnh thức.</p>`,
    source_link: "https://www.facebook.com/reel/1321336266180825"
  },
  {
    title: "Mua 1 được 2 – Chill hè cực đã!",
    desc: "Ưu đãi mua 1 được 2 tại Trung Nguyên Legend Âu Lạc, áp dụng từ 14:00 đến 21:30, từ 19/05 đến 30/06.",
    thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg",
    content: `<p><strong>☕️ Mua 1 được 2 – Chill hè cực đã!</strong></p>\n<p><strong>📍 Địa điểm:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế</p>\n<p><strong>🕑 Khung giờ áp dụng:</strong> 14:00 – 21:30</p>\n<p><strong>📅 Thời gian:</strong> Từ 19/05 đến 30/06</p>\n<p>🔥 Rủ bạn đến học bài, làm việc, tránh nóng cùng loạt thức uống mát lạnh tại Trung Nguyên Legend Âu Lạc.</p>`,
    source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg"
  },
  {
    title: "Trưa hè nóng bức – Ghé Trung Nguyên Legend Âu Lạc Huế",
    desc: "Không gian mát lạnh, chill học bài và thưởng thức cà phê tại Trung Nguyên Legend Âu Lạc Huế.",
    thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg",
    content: `<p><strong>☀️ Trưa hè nóng bức</strong></p>\n<p>📚 Đi đâu cho hết nực?</p>\n<p>Ghé <strong>Trung Nguyên Legend Âu Lạc Huế</strong> vừa mát lạnh, vừa chill học bài nha 🤎☕</p>`,
    source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg"
  },
  {
    title: "Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường",
    desc: "Trung Nguyên Legend Âu Lạc, TP Huế hân hạnh đón tiếp Nghệ sĩ Nhật Cường.",
    thumbnail: "https://www.facebook.com/reel/998900419486923",
    content: `<p>Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường trong không gian cà phê năng lượng tại Thành phố Huế.</p>\n<p>Đây là một trong những khoảnh khắc đáng nhớ, thể hiện sự kết nối giữa khách hàng, nghệ sĩ và thương hiệu Trung Nguyên Legend.</p>`,
    source_link: "https://www.facebook.com/reel/998900419486923"
  },
  {
    title: "Sự kiện lái thử VinFast Thế Hệ Mới tại Trung Nguyên Legend Âu Lạc",
    desc: "Sự kiện lái thử VinFast Thế Hệ Mới trong không gian hiện đại và yên tĩnh của Trung Nguyên Legend.",
    thumbnail: "https://www.facebook.com/reel/981380314649839",
    content: `<p>✨ Thứ 7 này bạn đã có hẹn chưa?</p>\n<p>Cuối tuần này, hãy cùng gia đình và bạn bè đến tham gia sự kiện lái thử đặc biệt của VinFast Thế Hệ Mới tổ chức tại không gian sang trọng và yên tĩnh của Trung Nguyên Legend.</p>\n<p>📍 Địa điểm: Cafe Trung Nguyên Legend Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP. Huế ( Đối diện Aeon Mall Huế).</p>\n<p>📅 Thời gian: Thứ 7 tuần này (16/05/2026).</p>\n<p>🔥 Đến với sự kiện, quý khách sẽ có cơ hội:</p>\n<p>✅ Trực tiếp trải nghiệm các dòng xe điện nổi bật từ VF3, VF5, VF6, VF7 đến VF8.</p>\n<p>✅ Khám phá những mẫu xe mới ra mắt cực HOT:</p>\n<p>Limo Green, Minio Green, MPV 7, EC VAN</p>\n<p>🎁 Đặc biệt: Nhận nhiều phần quà hấp dẫn và thưởng thức cafe miễn phí trong không gian thư giãn, hiện đại.</p>`,
    source_link: "https://www.facebook.com/reel/981380314649839"
  }
];

/* =========================================================
   HÀM HỖ TRỢ
========================================================= */
function removeVietnameseTones(str) {
  return String(str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function normalizeOrderForAdmin(order) {
  const kh = order.thong_tin_khach_hang || {};
  return {
    ...order,
    ho_ten: kh.ho_ten || order.ho_ten || "",
    so_dien_thoai: kh.so_dien_thoai || order.so_dien_thoai || "",
    email: kh.email || order.email || "",
    dia_chi: kh.dia_chi || order.dia_chi || order.dia_chi_giao_hang || ""
  };
}

/* =========================================================
   API TEST SERVER
========================================================= */
app.get("/", (req, res) => {
  try {
    const adminPath = path.join(__dirname, 'admin.html');
    if (fs.existsSync(adminPath)) {
      const buf = fs.readFileSync(adminPath);
      if (buf[0] === 0xff && buf[1] === 0xfe) {
        const str = buf.toString('utf16le');
        fs.writeFileSync(adminPath, str, 'utf8');
        console.log("Express Route: Converted admin.html from UTF-16LE to UTF-8");
      }
    }

    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
      const buf = fs.readFileSync(indexPath);
      if (buf[0] === 0xff && buf[1] === 0xfe) {
        const str = buf.toString('utf16le');
        fs.writeFileSync(indexPath, str, 'utf8');
        console.log("Express Route: Converted index.html from UTF-16LE to UTF-8");
      }
    }
  } catch (err) {
    console.error("Error converting files in Express root route:", err.message);
  }

  res.json({
    message: "Vietnam Prosperity Coffee API đang chạy bằng Supabase",
    admin_api: "/api/admin/all"
  });
});

/* =========================================================
   API TEST SUPABASE
========================================================= */
app.get("/api/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("danh_muc_san_pham")
      .select("*")
      .limit(5);

    if (error) throw error;

    res.json({
      message: "Kết nối Supabase thành công",
      data
    });
  } catch (error) {
    console.error("Lỗi test Supabase:", error);
    res.status(500).json({
      message: "Lỗi kết nối Supabase",
      error: error.message
    });
  }
});

/* =========================================================
   CUSTOMER API - DANH MỤC
========================================================= */
app.get("/api/danh-muc", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("danh_muc_san_pham")
      .select("id, ten_danh_muc, slug, loai, mo_ta, thu_tu_hien_thi, hien_thi")
      .eq("hien_thi", true)
      .order("thu_tu_hien_thi", { ascending: true });

    if (error) throw error;

    const result = (data || []).map(item => ({
      id: item.id,
      ten_danh_muc: item.ten_danh_muc,
      slug: item.slug,
      loai_danh_muc: item.loai,
      mo_ta: item.mo_ta,
      thu_tu_hien_thi: item.thu_tu_hien_thi,
      trang_thai: item.hien_thi
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    res.status(500).json({ message: "Lỗi lấy danh mục", error: error.message });
  }
});

/* =========================================================
   CUSTOMER API - ĐỒ UỐNG
========================================================= */
app.get("/api/do-uong", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("san_pham_do_uong")
      .select(`
        id,
        danh_muc_id,
        ten_san_pham,
        slug,
        mo_ta,
        gia_den,
        gia_sua,
        la_mon_noi_bat,
        thu_tu_hien_thi,
        hien_thi,
        danh_muc_san_pham (
          id,
          ten_danh_muc,
          slug,
          thu_tu_hien_thi
        )
      `)
      .eq("hien_thi", true)
      .order("thu_tu_hien_thi", { ascending: true });

    if (error) throw error;

    const result = (data || []).map(item => ({
      id: item.id,
      danh_muc_id: item.danh_muc_id,
      ten_danh_muc: item.danh_muc_san_pham?.ten_danh_muc || "",
      slug_danh_muc: item.danh_muc_san_pham?.slug || "",
      thu_tu_danh_muc: item.danh_muc_san_pham?.thu_tu_hien_thi || 0,
      ten_san_pham: item.ten_san_pham,
      slug: item.slug,
      mo_ta: item.mo_ta,
      gia_den: Number(item.gia_den || 0),
      gia_sua: Number(item.gia_sua || 0),
      la_mon_noi_bat: item.la_mon_noi_bat,
      con_ban: item.hien_thi,
      thu_tu_hien_thi: item.thu_tu_hien_thi || 0
    }));

    result.sort((a, b) => {
      if (a.thu_tu_danh_muc !== b.thu_tu_danh_muc) return a.thu_tu_danh_muc - b.thu_tu_danh_muc;
      return a.thu_tu_hien_thi - b.thu_tu_hien_thi;
    });

    res.json(result);
  } catch (error) {
    console.error("Lỗi lấy menu đồ uống:", error);
    res.status(500).json({ message: "Lỗi lấy menu đồ uống", error: error.message });
  }
});

/* =========================================================
   CUSTOMER API - MÓN NỔI BẬT
========================================================= */
app.get("/api/mon-noi-bat", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("san_pham_do_uong")
      .select("id, ten_san_pham, slug, mo_ta, gia_den, gia_sua, la_mon_noi_bat, hien_thi, thu_tu_hien_thi")
      .eq("hien_thi", true)
      .eq("la_mon_noi_bat", true)
      .order("thu_tu_hien_thi", { ascending: true })
      .limit(8);

    if (error) throw error;

    const result = (data || []).map(item => ({
      id: item.id,
      ten_san_pham: item.ten_san_pham,
      slug: item.slug,
      mo_ta: item.mo_ta,
      gia_den: Number(item.gia_den || 0),
      gia_sua: Number(item.gia_sua || 0),
      la_mon_noi_bat: item.la_mon_noi_bat,
      con_ban: item.hien_thi
    }));

    res.json(result);
  } catch (error) {
    console.error("Lỗi lấy món nổi bật:", error);
    res.status(500).json({ message: "Lỗi lấy món nổi bật", error: error.message });
  }
});

/* =========================================================
   CUSTOMER API - VẬT PHẨM
========================================================= */
async function getCustomerMerchandise() {
  const { data, error } = await supabase
    .from("san_pham_merchandise")
    .select(`
      id,
      danh_muc_id,
      ten_san_pham,
      slug,
      mo_ta,
      gia,
      con_ban,
      thu_tu_hien_thi,
      hien_thi,
      hinh_anh,
      danh_muc_san_pham (
        id,
        ten_danh_muc,
        slug,
        thu_tu_hien_thi
      )
    `)
    .eq("hien_thi", true)
    .order("thu_tu_hien_thi", { ascending: true });

  if (error) throw error;

  const result = (data || []).map(item => ({
    id: item.id,
    danh_muc_id: item.danh_muc_id,
    ten_danh_muc: item.danh_muc_san_pham?.ten_danh_muc === "Merchandise" ? "Vật phẩm" : (item.danh_muc_san_pham?.ten_danh_muc || "Vật phẩm"),
    slug_danh_muc: item.danh_muc_san_pham?.slug === "merchandise" ? "vat-pham" : (item.danh_muc_san_pham?.slug || "vat-pham"),
    thu_tu_danh_muc: item.danh_muc_san_pham?.thu_tu_hien_thi || 0,
    ten_san_pham: item.ten_san_pham,
    slug: item.slug,
    mo_ta: item.mo_ta,
    gia: Number(item.gia || 0),
    con_hang: item.con_ban ?? item.hien_thi,
    con_ban: item.con_ban ?? item.hien_thi,
    thu_tu_hien_thi: item.thu_tu_hien_thi || 0,
    hinh_anh: item.hinh_anh || null
  }));

  result.sort((a, b) => {
    if (a.thu_tu_danh_muc !== b.thu_tu_danh_muc) return a.thu_tu_danh_muc - b.thu_tu_danh_muc;
    return a.thu_tu_hien_thi - b.thu_tu_hien_thi;
  });

  return result;
}

app.get("/api/vat-pham", async (req, res) => {
  try {
    res.json(await getCustomerMerchandise());
  } catch (error) {
    console.error("Lỗi lấy vật phẩm:", error);
    res.status(500).json({ message: "Lỗi lấy vật phẩm", error: error.message });
  }
});

app.get("/api/merchandise", async (req, res) => {
  try {
    res.json(await getCustomerMerchandise());
  } catch (error) {
    console.error("Lỗi lấy merchandise:", error);
    res.status(500).json({ message: "Lỗi lấy merchandise", error: error.message });
  }
});

/* =========================================================
   CUSTOMER API - CHECK KHOẢNG CÁCH
========================================================= */
async function checkDistanceAddress(rawAddress) {
  if (!rawAddress || !String(rawAddress).trim()) {
    return {
      hop_le: false,
      message: "Vui lòng nhập địa chỉ giao hàng."
    };
  }

  rawAddress = String(rawAddress).trim();
  const normalizedAddress = removeVietnameseTones(rawAddress);
  const isHueAddress =
    normalizedAddress.includes("hue") ||
    normalizedAddress.includes("tp hue") ||
    normalizedAddress.includes("thanh pho hue") ||
    normalizedAddress.includes("thua thien hue");

  if (!isHueAddress) {
    return {
      hop_le: false,
      khoang_cach_km: null,
      phi_ship: 0,
      message: "Vui lòng kiểm tra lại địa chỉ đã nhập. Khoảng cách quá xa (>10km) nên cửa hàng không thể nhận đơn của bạn. Cảm ơn vì đã quan tâm đến Trung Nguyên Legend Âu Lạc. Bạn có thể đặt nước ở chi nhánh gần nhất ạ. Cảm ơn."
    };
  }

  const searchAddress = `${rawAddress}, Việt Nam`;
  const url =
    "https://nominatim.openstreetmap.org/search" +
    `?q=${encodeURIComponent(searchAddress)}` +
    "&format=json&limit=1&addressdetails=1";

  const response = await fetch(url, {
    headers: { "User-Agent": "VietnamProsperityCoffee/1.0" }
  });

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    return {
      hop_le: false,
      message: "Không tìm được địa chỉ này. Vui lòng nhập rõ số nhà, tên đường, phường, Thành phố Huế."
    };
  }

  const customerLat = Number(data[0].lat);
  const customerLng = Number(data[0].lon);

  if (Number.isNaN(customerLat) || Number.isNaN(customerLng)) {
    return {
      hop_le: false,
      message: "Không lấy được tọa độ địa chỉ giao hàng. Vui lòng nhập địa chỉ rõ hơn."
    };
  }

  const distanceKm = calculateDistanceKm(STORE_LAT, STORE_LNG, customerLat, customerLng);

  if (distanceKm > 10) {
    return {
      hop_le: false,
      khoang_cach_km: Number(distanceKm.toFixed(2)),
      phi_ship: 0,
      message: "Vui lòng kiểm tra lại địa chỉ đã nhập. Khoảng cách quá xa (>10km) nên cửa hàng không thể nhận đơn của bạn. Cảm ơn vì đã quan tâm đến Trung Nguyên Legend Âu Lạc. Bạn có thể đặt nước ở chi nhánh gần nhất ạ. Cảm ơn."
    };
  }

  let phiShip = 0;
  if (distanceKm <= 3) phiShip = 15000;
  else if (distanceKm <= 7) phiShip = 25000;
  else phiShip = 35000;

  return {
    hop_le: true,
    khoang_cach_km: Number(distanceKm.toFixed(2)),
    phi_ship: phiShip,
    message: "Địa chỉ nằm trong khu vực giao hàng."
  };
}

app.post("/api/check-distance", async (req, res) => {
  try {
    const result = await checkDistanceAddress(req.body.dia_chi_giao_hang);
    res.status(result.hop_le ? 200 : 400).json(result);
  } catch (error) {
    console.error("Lỗi kiểm tra khoảng cách:", error);
    res.status(500).json({
      hop_le: false,
      message: "Lỗi kiểm tra khoảng cách giao hàng.",
      error: error.message
    });
  }
});

/* =========================================================
   CUSTOMER API - GỬI ĐƠN HÀNG
========================================================= */
app.post("/api/don-hang", async (req, res) => {
  try {
    let {
      ma_don_hang,
      ho_ten,
      so_dien_thoai,
      email,
      dia_chi,
      danh_sach_san_pham,
      tong_tien,
      hinh_thuc_nhan_hang,
      phuong_thuc_thanh_toan,
      dia_chi_giao_hang,
      ghi_chu,
      phi_ship,
      khoang_cach_km,
      trang_thai
    } = req.body;

    if (!ho_ten || !so_dien_thoai || !danh_sach_san_pham || !hinh_thuc_nhan_hang) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    tong_tien = Number(tong_tien || 0);
    phi_ship = Number(phi_ship || 0);
    khoang_cach_km = Number(khoang_cach_km || 0);

    if (hinh_thuc_nhan_hang === "giao_hang_noi_thanh") {
      const checkResult = await checkDistanceAddress(dia_chi_giao_hang || dia_chi);

      if (!checkResult.hop_le) {
        return res.status(400).json({
          message: checkResult.message || "Khoảng cách quá xa (>10km). Xin quý khách thứ lỗi.",
          khoang_cach_km: checkResult.khoang_cach_km || null
        });
      }

      phi_ship = Number(checkResult.phi_ship || 0);
      khoang_cach_km = Number(checkResult.khoang_cach_km || 0);
      tong_tien = tong_tien + phi_ship;
    }

    const { data: khachHang, error: khachHangError } = await supabase
      .from("thong_tin_khach_hang")
      .insert({
        ho_ten,
        so_dien_thoai,
        email: email || null,
        dia_chi: dia_chi || dia_chi_giao_hang || null,
        ghi_chu: ghi_chu || null
      })
      .select("id")
      .single();

    if (khachHangError) throw khachHangError;

    const finalOrderCode = ma_don_hang || "DH" + Date.now();

    const { data: donHang, error: donHangError } = await supabase
      .from("don_hang")
      .insert({
        khach_hang_id: khachHang.id,
        ma_don_hang: finalOrderCode,
        danh_sach_san_pham,
        tong_tien,
        phi_ship,
        khoang_cach_km,
        hinh_thuc_nhan_hang,
        phuong_thuc_thanh_toan: phuong_thuc_thanh_toan || "thanh_toan_khi_nhan_hang",
        dia_chi_giao_hang: dia_chi_giao_hang || dia_chi || null,
        ghi_chu: ghi_chu || null,
        trang_thai: trang_thai || "da_dat_don"
      })
      .select("*")
      .single();

    if (donHangError) throw donHangError;

    res.json({
      message: "Gửi đơn hàng thành công",
      data: donHang,
      ma_don_hang: finalOrderCode,
      tong_tien,
      phi_ship,
      khoang_cach_km,
      trang_thai: trang_thai || "da_dat_don"
    });
  } catch (error) {
    console.error("Lỗi gửi đơn hàng:", error);
    res.status(500).json({ message: "Lỗi gửi đơn hàng", error: error.message });
  }
});

// Alias để frontend nào đang gọi /api/orders POST vẫn hoạt động
app.post("/api/orders", async (req, res, next) => {
  req.url = "/api/don-hang";
  next();
});

/* =========================================================
   CUSTOMER API - TRA CỨU ĐƠN HÀNG
========================================================= */

/* =========================================================
   CUSTOMER API - TRA CỨU ĐƠN HÀNG BẰNG SỐ ĐIỆN THOẠI
========================================================= */
app.get("/api/don-hang/tra-cuu", async (req, res) => {
  try {
    const phoneRaw = String(req.query.phone || "").trim();
    const phoneDigits = phoneRaw.replace(/\D/g, "");

    if (!phoneDigits || phoneDigits.length < 8) {
      return res.status(400).json({
        message: "Vui lòng nhập số điện thoại hợp lệ"
      });
    }

    const normalizePhone = value => String(value || "").replace(/\D/g, "");

    let orders = [];

    // Cách 1: tìm trực tiếp trong bảng don_hang nếu bảng có cột số điện thoại.
    try {
      const direct = await supabase
        .from("don_hang")
        .select(`
          *,
          thong_tin_khach_hang (
            ho_ten,
            so_dien_thoai,
            email,
            dia_chi
          )
        `)
        .or(`so_dien_thoai.eq.${phoneRaw},phone.eq.${phoneRaw},customer_phone.eq.${phoneRaw}`)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!direct.error && Array.isArray(direct.data) && direct.data.length) {
        orders = direct.data;
      }
    } catch (e) {
      console.warn("Tra cứu trực tiếp theo phone không dùng được:", e.message);
    }

    // Cách 2: fallback lấy gần đây rồi lọc theo phone trong dữ liệu quan hệ/JSON.
    if (!orders.length) {
      const recent = await supabase
        .from("don_hang")
        .select(`
          *,
          thong_tin_khach_hang (
            ho_ten,
            so_dien_thoai,
            email,
            dia_chi
          )
        `)
        .order("created_at", { ascending: false })
        .limit(300);

      if (recent.error) throw recent.error;

      orders = (recent.data || []).filter(order => {
        const kh = order.thong_tin_khach_hang || {};
        const candidates = [
          order.so_dien_thoai,
          order.phone,
          order.customer_phone,
          kh.so_dien_thoai,
          order.shipping_address?.phone
        ];

        if (typeof order.shipping_address === "string") {
          try {
            candidates.push(JSON.parse(order.shipping_address).phone);
          } catch {}
        }

        return candidates.some(value => normalizePhone(value) === phoneDigits);
      }).slice(0, 20);
    }

    if (!orders.length) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng với số điện thoại này",
        data: []
      });
    }

    res.json({
      message: "Tìm thấy đơn hàng",
      data: orders.map(normalizeOrderForAdmin)
    });
  } catch (error) {
    console.error("Lỗi tra cứu đơn hàng bằng số điện thoại:", error);
    res.status(500).json({
      message: "Lỗi tra cứu đơn hàng bằng số điện thoại",
      error: error.message
    });
  }
});


app.get("/api/don-hang/:ma_don_hang", async (req, res) => {
  try {
    const { ma_don_hang } = req.params;

    const { data, error } = await supabase
      .from("don_hang")
      .select(`
        id,
        ma_don_hang,
        danh_sach_san_pham,
        tong_tien,
        phi_ship,
        khoang_cach_km,
        hinh_thuc_nhan_hang,
        phuong_thuc_thanh_toan,
        dia_chi_giao_hang,
        ghi_chu,
        trang_thai,
        created_at,
        thong_tin_khach_hang (
          ho_ten,
          so_dien_thoai
        )
      `)
      .eq("ma_don_hang", ma_don_hang)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json(data);
  } catch (error) {
    console.error("Lỗi tra cứu đơn hàng:", error);
    res.status(500).json({ message: "Lỗi tra cứu đơn hàng", error: error.message });
  }
});

/* =========================================================
   ADMIN API - ĐỌC TOÀN BỘ DỮ LIỆU
========================================================= */
async function getAdminOrders() {
  const { data, error } = await supabase
    .from("don_hang")
    .select(`
      id,
      khach_hang_id,
      ma_don_hang,
      danh_sach_san_pham,
      tong_tien,
      phi_ship,
      khoang_cach_km,
      hinh_thuc_nhan_hang,
      phuong_thuc_thanh_toan,
      dia_chi_giao_hang,
      ghi_chu,
      trang_thai,
      created_at,
      thong_tin_khach_hang (
        id,
        ho_ten,
        so_dien_thoai,
        email,
        dia_chi,
        ghi_chu,
        created_at
      )
    `)
    .order("id", { ascending: false });

  if (error) throw error;
  return (data || []).map(normalizeOrderForAdmin);
}

async function getAdminDrinks() {
  const { data, error } = await supabase
    .from("san_pham_do_uong")
    .select("*")
    .order("thu_tu_hien_thi", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function getAdminMerchandise() {
  const { data, error } = await supabase
    .from("san_pham_merchandise")
    .select("*")
    .order("thu_tu_hien_thi", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function getAdminCategories() {
  const { data, error } = await supabase
    .from("danh_muc_san_pham")
    .select("*")
    .order("thu_tu_hien_thi", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function getAdminCustomers() {
  const { data, error } = await supabase
    .from("thong_tin_khach_hang")
    .select("*")
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
}

app.get("/api/admin/all", async (req, res) => {
  try {
    const [orders, drinks, merchandise, categories, customers] = await Promise.all([
      getAdminOrders(),
      getAdminDrinks(),
      getAdminMerchandise(),
      getAdminCategories(),
      getAdminCustomers()
    ]);

    res.json({ orders, drinks, merchandise, categories, customers });
  } catch (error) {
    console.error("Lỗi lấy toàn bộ dữ liệu admin:", error);
    res.status(500).json({ message: "Lỗi lấy toàn bộ dữ liệu admin", error: error.message });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    res.json(await getAdminOrders());
  } catch (error) {
    console.error("Lỗi lấy đơn hàng admin:", error);
    res.status(500).json({ message: "Lỗi lấy đơn hàng admin", error: error.message });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    res.json(await getAdminCustomers());
  } catch (error) {
    console.error("Lỗi lấy khách hàng admin:", error);
    res.status(500).json({ message: "Lỗi lấy khách hàng admin", error: error.message });
  }
});

app.patch("/api/don-hang/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai, status } = req.body;
    const newStatus = trang_thai || status;

    if (!newStatus) {
      return res.status(400).json({ message: "Thiếu trạng thái đơn hàng" });
    }

    // Thử cập nhật theo ma_don_hang trước
    let { data, error } = await supabase
      .from("don_hang")
      .update({ trang_thai: newStatus })
      .eq("ma_don_hang", id)
      .select("*");

    // Nếu không cập nhật được dòng nào (hoặc error do không phải ma_don_hang), thử cập nhật theo id số
    if (error || !data || data.length === 0) {
      const numericId = Number(id);
      if (!Number.isNaN(numericId)) {
        const { data: numData, error: numError } = await supabase
          .from("don_hang")
          .update({ trang_thai: newStatus })
          .eq("id", numericId)
          .select("*");
        if (numError) throw numError;
        data = numData;
      } else {
        if (error) throw error;
      }
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng tương ứng." });
    }

    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", data: data[0] });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái đơn hàng", error: error.message });
  }
});

app.patch("/api/orders/:id", async (req, res, next) => {
  req.url = `/api/don-hang/${encodeURIComponent(req.params.id)}`;
  next();
});

app.patch("/api/orders/:id/status", async (req, res, next) => {
  req.url = `/api/don-hang/${encodeURIComponent(req.params.id)}`;
  next();
});

/* =========================================================
   ADMIN API - CRUD ĐỒ UỐNG
========================================================= */
app.get("/api/admin/drinks", async (req, res) => {
  try {
    res.json(await getAdminDrinks());
  } catch (error) {
    console.error("Lỗi lấy đồ uống admin:", error);
    res.status(500).json({ message: "Lỗi lấy đồ uống admin", error: error.message });
  }
});

app.post("/api/admin/drinks", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("san_pham_do_uong")
      .insert([req.body])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Thêm đồ uống thành công", data });
  } catch (error) {
    console.error("Lỗi thêm đồ uống:", error);
    res.status(500).json({ message: "Lỗi thêm đồ uống", error: error.message });
  }
});

app.patch("/api/admin/drinks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("san_pham_do_uong")
      .update(req.body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Cập nhật đồ uống thành công", data });
  } catch (error) {
    console.error("Lỗi cập nhật đồ uống:", error);
    res.status(500).json({ message: "Lỗi cập nhật đồ uống", error: error.message });
  }
});

app.delete("/api/admin/drinks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("san_pham_do_uong")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ message: "Xóa đồ uống thành công" });
  } catch (error) {
    console.error("Lỗi xóa đồ uống:", error);
    res.status(500).json({ message: "Lỗi xóa đồ uống", error: error.message });
  }
});

/* =========================================================
   ADMIN API - CRUD VẬT PHẨM
========================================================= */
app.get("/api/admin/merchandise", async (req, res) => {
  try {
    res.json(await getAdminMerchandise());
  } catch (error) {
    console.error("Lỗi lấy vật phẩm admin:", error);
    res.status(500).json({ message: "Lỗi lấy vật phẩm admin", error: error.message });
  }
});

app.post("/api/admin/merchandise", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("san_pham_merchandise")
      .insert([req.body])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Thêm vật phẩm thành công", data });
  } catch (error) {
    console.error("Lỗi thêm vật phẩm:", error);
    res.status(500).json({ message: "Lỗi thêm vật phẩm", error: error.message });
  }
});

app.patch("/api/admin/merchandise/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("san_pham_merchandise")
      .update(req.body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Cập nhật vật phẩm thành công", data });
  } catch (error) {
    console.error("Lỗi cập nhật vật phẩm:", error);
    res.status(500).json({ message: "Lỗi cập nhật vật phẩm", error: error.message });
  }
});

app.delete("/api/admin/merchandise/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("san_pham_merchandise")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ message: "Xóa vật phẩm thành công" });
  } catch (error) {
    console.error("Lỗi xóa vật phẩm:", error);
    res.status(500).json({ message: "Lỗi xóa vật phẩm", error: error.message });
  }
});

/* =========================================================
   ADMIN API - CRUD DANH MỤC
========================================================= */
app.get("/api/admin/categories", async (req, res) => {
  try {
    res.json(await getAdminCategories());
  } catch (error) {
    console.error("Lỗi lấy danh mục admin:", error);
    res.status(500).json({ message: "Lỗi lấy danh mục admin", error: error.message });
  }
});

app.post("/api/admin/categories", async (req, res) => {
  try {
    const payload = {
      ...req.body,
      loai: req.body.loai || req.body.loai_danh_muc || "merchandise"
    };

    const { data, error } = await supabase
      .from("danh_muc_san_pham")
      .insert([payload])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Thêm danh mục thành công", data });
  } catch (error) {
    console.error("Lỗi thêm danh mục:", error);
    res.status(500).json({ message: "Lỗi thêm danh mục", error: error.message });
  }
});

app.patch("/api/admin/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload.id;
    delete payload.created_at;

    const { data, error } = await supabase
      .from("danh_muc_san_pham")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Cập nhật danh mục thành công", data });
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res.status(500).json({ message: "Lỗi cập nhật danh mục", error: error.message });
  }
});

/* =========================================================
   ADMIN API - SEPAY TRANSACTIONS
========================================================= */
app.get("/api/admin/sepay-transactions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sepay_transactions")
      .select("*")
      .order("transaction_date", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Lỗi lấy danh sách giao dịch SePay:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách giao dịch SePay", error: error.message });
  }
});

/* =========================================================
   ADMIN API - CRUD BÀI VIẾT (BLOG)
========================================================= */
app.get("/api/bai-viet", async (req, res) => {
  try {
    const { data: dbBlogs, error } = await supabase
      .from("bai_viet")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rawDbBlogs = dbBlogs || [];
    
    // Tìm các bài viết bị đánh dấu là xóa tĩnh
    const deletedStaticTitles = rawDbBlogs
      .filter(b => b.desc === "DELETED_STATIC")
      .map(b => b.title.trim().toLowerCase());
      
    // Lọc bỏ các bài viết bị đánh dấu xóa tĩnh khỏi danh sách DB
    const activeDbBlogs = rawDbBlogs.filter(b => b.desc !== "DELETED_STATIC");
    
    const mergedBlogs = [...activeDbBlogs];
    
    defaultBlogs.forEach((defBlog, index) => {
      const defTitleLower = defBlog.title.trim().toLowerCase();
      // Nếu tiêu đề nằm trong danh sách đã xóa tĩnh, hoặc đã tồn tại bản ghi hoạt động trong DB, bỏ qua
      const isDeleted = deletedStaticTitles.includes(defTitleLower);
      const isExist = activeDbBlogs.some(b => b.title.trim().toLowerCase() === defTitleLower);
      
      if (!isDeleted && !isExist) {
        mergedBlogs.push({
          id: `default-${index}`,
          title: defBlog.title,
          desc: defBlog.desc,
          content: defBlog.content,
          thumbnail: defBlog.thumbnail,
          source_link: defBlog.source_link,
          created_at: new Date(2026, 4, 19 + index).toISOString()
        });
      }
    });

    // Sắp xếp lại theo created_at giảm dần
    mergedBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json(mergedBlogs);
  } catch (error) {
    console.error("Lỗi lấy danh sách bài viết:", error);
    res.status(500).json({ message: "Lỗi lấy danh sách bài viết", error: error.message });
  }
});

app.post("/api/bai-viet", async (req, res) => {
  try {
    const { title, desc, content, thumbnail, source_link } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Tiêu đề và nội dung là bắt buộc" });
    }

    const payload = {
      title,
      desc: desc || "",
      content,
      thumbnail: thumbnail || "",
      source_link: source_link || null
    };

    const { data, error } = await supabase
      .from("bai_viet")
      .insert([payload])
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Thêm bài viết thành công", data });
  } catch (error) {
    console.error("Lỗi thêm bài viết:", error);
    res.status(500).json({ message: "Lỗi thêm bài viết", error: error.message });
  }
});

app.patch("/api/bai-viet", async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID bài viết" });
    }

    const { title, desc, content, thumbnail, source_link } = req.body;
    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (desc !== undefined) updatePayload.desc = desc;
    if (content !== undefined) updatePayload.content = content;
    if (thumbnail !== undefined) updatePayload.thumbnail = thumbnail;
    if (source_link !== undefined) updatePayload.source_link = source_link;

    let data, error;
    if (String(id).startsWith("default-")) {
      // Sửa bài viết tĩnh -> Insert thành bài viết mới trong DB
      const insertPayload = {
        title: title || "",
        desc: desc || "",
        content: content || "",
        thumbnail: thumbnail || "",
        source_link: source_link || null,
        ...updatePayload
      };
      const { data: insertData, error: insertError } = await supabase
        .from("bai_viet")
        .insert([insertPayload])
        .select("*")
        .single();
      data = insertData;
      error = insertError;
    } else {
      const { data: updateData, error: updateError } = await supabase
        .from("bai_viet")
        .update(updatePayload)
        .eq("id", id)
        .select("*")
        .single();
      data = updateData;
      error = updateError;
    }

    if (error) throw error;
    res.json({ message: "Cập nhật bài viết thành công", data });
  } catch (error) {
    console.error("Lỗi cập nhật bài viết:", error);
    res.status(500).json({ message: "Lỗi cập nhật bài viết", error: error.message });
  }
});

app.delete("/api/bai-viet", async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    if (!id) {
      return res.status(400).json({ message: "Thiếu ID bài viết" });
    }

    let data, error;
    if (String(id).startsWith("default-")) {
      const idx = parseInt(id.replace("default-", ""), 10);
      const defBlog = defaultBlogs[idx];
      if (defBlog) {
        // Đánh dấu xóa tĩnh bằng cách chèn bản ghi DB với desc là "DELETED_STATIC"
        const { data: insertData, error: insertError } = await supabase
          .from("bai_viet")
          .insert([{
            title: defBlog.title,
            desc: "DELETED_STATIC",
            content: "DELETED_STATIC",
            thumbnail: "",
            source_link: null
          }])
          .select("*")
          .single();
        data = insertData;
        error = insertError;
      } else {
        return res.status(404).json({ message: "Không tìm thấy bài viết mặc định tương ứng" });
      }
    } else {
      const { data: deleteData, error: deleteError } = await supabase
        .from("bai_viet")
        .delete()
        .eq("id", id)
        .select("*")
        .single();
      data = deleteData;
      error = deleteError;
    }

    if (error) throw error;
    res.json({ message: "Xóa bài viết thành công", data });
  } catch (error) {
    console.error("Lỗi xóa bài viết:", error);
    res.status(500).json({ message: "Lỗi xóa bài viết", error: error.message });
  }
});


/* =========================================================
   KHỞI ĐỘNG SERVER
========================================================= */

/* =========================================================
   API SEPAY WEBHOOK + CHAT AI
   - SePay bắn webhook giao dịch vào endpoint này.
   - Chatbox gọi /api/chat-ai để dùng Gemini hoặc ChatGPT qua backend.
   Lưu ý: Không đặt API key trong frontend HTML.
========================================================= */
function getHeader(req, names) {
  for (const name of names) {
    const value = req.headers[String(name).toLowerCase()];
    if (value) return Array.isArray(value) ? value[0] : value;
  }
  return "";
}

function verifySepayRequest(req) {
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY || process.env.SEPAY_WEBHOOK_TOKEN || "";
  const hmacSecret = process.env.SEPAY_WEBHOOK_SECRET || "";

  if (apiKey) {
    const incomingKey = getHeader(req, ["authorization", "x-api-key", "apikey", "api-key"]);
    const normalized = String(incomingKey || "").replace(/^Bearer\s+/i, "").trim();
    if (normalized !== apiKey) return false;
  }

  if (hmacSecret) {
    const incomingSignature = getHeader(req, ["x-sepay-signature", "x-signature", "signature"]);
    if (!incomingSignature) return false;

    const expected = crypto
      .createHmac("sha256", hmacSecret)
      .update(req.rawBody || JSON.stringify(req.body || {}))
      .digest("hex");

    const cleanIncoming = String(incomingSignature).replace(/^sha256=/i, "").trim();
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(cleanIncoming, "hex");
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  }

  return true;
}

function extractOrderCodeFromText(text) {
  if (!text) return "";
  
  // 1. Chuẩn hóa: xóa khoảng trắng, dấu gạch ngang, dấu gạch dưới, đổi thành chữ hoa
  const normalized = String(text)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ""); // Chỉ giữ lại ký tự chữ cái và số

  // 2. Tìm kiếm chuỗi "VPCDH" theo sau là 14 chữ số (định dạng YYYYMMDDHHMMSS)
  const match = normalized.match(/VPCDH[0-9]{14}/);
  if (match) {
    const code = match[0]; // VPCDH20260606162012
    // Tách và ghép lại thành định dạng chuẩn: VPC-DH-YYYYMMDD-HHMMSS
    return `VPC-DH-${code.slice(5, 13)}-${code.slice(13)}`;
  }
  
  // 3. Fallback: Nếu nội dung chứa DH + timestamp (ví dụ DH171...)
  const matchDH = normalized.match(/DH[0-9]+/);
  if (matchDH) {
    return matchDH[0];
  }

  // 4. Fallback 2: Regex nguyên bản có dấu gạch ngang
  const matchOriginal = String(text).match(/VPC-DH-[0-9]{8}-[0-9]{6}/i);
  if (matchOriginal) return matchOriginal[0].toUpperCase();

  return "";
}

function extractSepayTransaction(payload) {
  const body = payload || {};
  const content = [
    body.content,
    body.description,
    body.transfer_content,
    body.transaction_content,
    body.memo,
    body.note,
    body.bank_content,
    body.data?.content,
    body.data?.description,
    body.data?.transfer_content,
    body.data?.transaction_content
  ].filter(Boolean).join(" ");

  const amountRaw =
    body.amount ??
    body.transferAmount ??
    body.transfer_amount ??
    body.money ??
    body.data?.amount ??
    body.data?.transferAmount ??
    body.data?.transfer_amount ??
    0;

  const orderCode = extractOrderCodeFromText(content);
  const amount = Number(String(amountRaw).replace(/[^0-9.-]/g, "")) || 0;

  return { orderCode, amount, content };
}

// Code này nhận webhook SePay và tự cập nhật đơn hàng đã thanh toán
app.post("/api/sepay/webhook", async (req, res) => {
  try {
    if (!verifySepayRequest(req)) {
      return res.status(401).json({ success: false, ok: false, message: "Webhook không hợp lệ." });
    }

    const { orderCode, amount, content } = extractSepayTransaction(req.body);

    // Lưu thông tin giao dịch vào bảng sepay_transactions
    const body = req.body || {};
    const sepayTxId = Number(body.id || body.transactionId || body.transaction_id || body.data?.id || 0);
    if (sepayTxId > 0) {
      const { error: insertTxError } = await supabase
        .from("sepay_transactions")
        .upsert({
          sepay_id: sepayTxId,
          gateway: body.gateway || body.bank || body.data?.gateway || "",
          transaction_date: body.transactionDate || body.transaction_date || body.data?.transactionDate || new Date().toISOString(),
          amount_in: amount,
          amount_out: Number(body.amountOut || body.amount_out || body.data?.amountOut || 0),
          transaction_content: content,
          reference_number: body.referenceNumber || body.reference_number || body.code || body.data?.referenceNumber || "",
          accumulated_balance: Number(body.accumulatedBalance || body.accumulated_balance || body.balance || body.data?.accumulatedBalance || 0),
          order_code: orderCode || null
        }, { onConflict: 'sepay_id' });
        
      if (insertTxError) {
        console.error("❌ Lỗi lưu nhật ký giao dịch SePay (Express Webhook):", insertTxError.message);
      } else {
        console.log("💾 Đã lưu nhật ký giao dịch SePay (Express Webhook) thành công!");
      }
    }

    if (!orderCode) {
      return res.status(200).json({
        success: true,
        ok: false,
        ignored: true,
        message: "Không tìm thấy mã đơn VPC-DH trong nội dung chuyển khoản."
      });
    }

    const { data: order, error: findError } = await supabase
      .from("don_hang")
      .select("id, ma_don_hang, tong_tien, trang_thai, ghi_chu")
      .eq("ma_don_hang", orderCode)
      .single();

    if (findError || !order) {
      return res.status(200).json({
        success: true,
        ok: false,
        ignored: true,
        orderCode,
        message: "Không tìm thấy đơn hàng tương ứng."
      });
    }

    const expectedAmount = Number(order.tong_tien || 0);
    if (expectedAmount > 0 && amount > 0 && amount < expectedAmount) {
      return res.status(200).json({
        ok: false,
        orderCode,
        amount,
        expectedAmount,
        message: "Số tiền nhận được nhỏ hơn tổng đơn, chưa cập nhật đã thanh toán."
      });
    }

    const sepayNote = `[SePay xác nhận ${new Date().toISOString()}] ${content || "Đã nhận giao dịch"}`;
    const currentNote = order.ghi_chu || "";
    const nextNote = currentNote.includes("[SePay xác nhận")
      ? currentNote
      : `${currentNote}${currentNote ? "\n" : ""}${sepayNote}`;

    const { data: updated, error: updateError } = await supabase
      .from("don_hang")
      .update({
        trang_thai: "da_tt",
        ghi_chu: nextNote
      })
      .eq("id", order.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json({
      success: true,
      ok: true,
      message: "SePay webhook đã xác nhận thanh toán.",
      orderCode,
      amount,
      order: updated
    });
  } catch (error) {
    console.error("Lỗi SePay webhook:", error);
    return res.status(500).json({ success: false, ok: false, error: error.message });
  }
});

// API đồng bộ giao dịch từ SePay chủ động
app.get("/api/sepay/sync", async (req, res) => {
  try {
    const apiKey = process.env.SEPAY_API_KEY || process.env.SEPAY_WEBHOOK_API_KEY || "";
    if (!apiKey) {
      return res.status(400).json({ ok: false, message: "Chưa cấu hình API Key của SePay trên máy chủ." });
    }

    let page = 1;
    let hasMore = true;
    const transactions = [];
    const limit = 50;

    // Lặp qua tối đa 10 trang để lấy sâu lịch sử giao dịch (500 giao dịch gần nhất)
    while (hasMore && page <= 10) {
      const response = await fetch(`https://userapi.sepay.vn/v2/transactions?limit=${limit}&page=${page}`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        console.error(`❌ SePay API sync error page ${page}: HTTP ${response.status}`);
        break;
      }

      const result = await response.json();
      const pageTxs = result.data || [];
      if (pageTxs.length === 0) {
        hasMore = false;
      } else {
        transactions.push(...pageTxs);
        page++;
      }
    }

    const updatedOrders = [];

    for (const tx of transactions) {
      const content = tx.description || tx.transaction_content || "";
      const amount = Number(tx.amount_in || 0);
      const amountOut = Number(tx.amount_out || 0);
      const orderCode = extractOrderCodeFromText(content);

      // Lưu thông tin giao dịch vào bảng sepay_transactions (lưu TOÀN BỘ)
      const sepayTxId = Number(tx.id || 0);
      if (sepayTxId > 0) {
        const { error: insertTxError } = await supabase
          .from("sepay_transactions")
          .upsert({
            sepay_id: sepayTxId,
            gateway: tx.gateway || tx.bank || "",
            transaction_date: tx.transaction_date || tx.transactionDate || new Date().toISOString(),
            amount_in: amount,
            amount_out: amountOut,
            transaction_content: content,
            reference_number: tx.reference_number || tx.referenceNumber || tx.code || "",
            accumulated_balance: Number(tx.accumulated_balance || tx.accumulatedBalance || tx.balance || 0),
            order_code: orderCode || null
          }, { onConflict: 'sepay_id' });
          
        if (insertTxError) {
          console.error(`❌ Lỗi lưu nhật ký giao dịch SePay ${sepayTxId} (Sync):`, insertTxError.message);
        }
      }

      // Chỉ xử lý cập nhật đơn hàng cho giao dịch nhận tiền vào
      const isIncoming = tx.transfer_type === "in" || amount > 0;
      if (!isIncoming) continue;
      if (!orderCode) continue;

      // Tìm đơn hàng tương ứng trong cơ sở dữ liệu
      const { data: order, error: findError } = await supabase
        .from("don_hang")
        .select("id, ma_don_hang, tong_tien, trang_thai, ghi_chu")
        .eq("ma_don_hang", orderCode)
        .single();

      if (findError || !order) continue;

      // Nếu đơn hàng đã hoàn tất hoặc đã thanh toán thì bỏ qua
      const skipStatuses = [
        "da_tt", "dang_lam", "dang_giao", "hoan_tat",
        "da_thanh_toan", "da_chuyen_khoan", "dang_lam_don", "da_giao_shipper", "dang_giao", "da_giao", "hoan_thanh"
      ];
      if (skipStatuses.includes(order.trang_thai)) continue;

      const expectedAmount = Number(order.tong_tien || 0);
      if (expectedAmount > 0 && amount < expectedAmount) continue; // Chưa chuyển đủ tiền

      const sepayNote = `[SePay đồng bộ ${new Date().toLocaleString("vi-VN")}] ${content || "Đã nhận giao dịch"}`;
      const currentNote = order.ghi_chu || "";
      const nextNote = currentNote.includes("[SePay")
        ? currentNote
        : `${currentNote}${currentNote ? "\n" : ""}${sepayNote}`;

      const { data: updated, error: updateError } = await supabase
        .from("don_hang")
        .update({
          trang_thai: "da_tt",
          ghi_chu: nextNote
        })
        .eq("id", order.id)
        .select()
        .single();

      if (!updateError && updated) {
        updatedOrders.push({
          ma_don_hang: orderCode,
          so_tien: amount,
          ngay_gd: tx.transaction_date || ""
        });
      }
    }

    res.json({
      success: true,
      ok: true,
      message: `Đồng bộ hoàn tất. Đã cập nhật tự động ${updatedOrders.length} đơn hàng.`,
      updated: updatedOrders
    });
  } catch (error) {
    console.error("Lỗi đồng bộ SePay:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});


/* =========================================================
   AI KNOWLEDGE: ĐỌC NỘI DUNG TỪ INDEX.HTML + FALLBACK TỪ KHÓA
========================================================= */
let cachedIndexKnowledge = {
  loadedAt: 0,
  source: "",
  text: ""
};

function htmlToKnowledgeText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<\/(h1|h2|h3|h4|p|li|section|article|div|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractWebsiteKnowledge(raw, filePath) {
  const textOnly = htmlToKnowledgeText(raw);

  const productMatches = Array.from(
    raw.matchAll(/(?:ten_san_pham|ten|name|title)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,500}?(?:mo_ta|description|desc|short_description)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,300}?(?:gia|gia_den|price|priceNum)\s*:\s*([0-9]+)/gi)
  ).map((match) => {
    return `Sản phẩm: ${match[1]}\nMô tả: ${match[2]}\nGiá: ${Number(match[3]).toLocaleString("vi-VN")}đ`;
  });

  const articleMatches = Array.from(
    raw.matchAll(/(?:title|tieu_de)\s*:\s*["'`]([^"'`]+)["'`][\s\S]{0,700}?(?:desc|tom_tat|summary|content)\s*:\s*["'`]([^"'`]+)["'`]/gi)
  ).map((match) => {
    return `Bài viết: ${match[1]}\nNội dung: ${match[2]}`;
  });

  const aboutMatches = Array.from(
    raw.matchAll(/(?:Về chúng tôi|Giới thiệu|about|founder|sáng lập|Vietnam Prosperity Coffee|Trung Nguyên Legend Âu Lạc)[\s\S]{0,2000}/gi)
  ).map((match) => htmlToKnowledgeText(match[0]));

  const footerMatches = Array.from(
    raw.matchAll(/(?:footer|Hotline|0389726999|038 972 6999|Facebook|TikTok|Google Map|Địa chỉ|Aeon Mall)[\s\S]{0,2000}/gi)
  ).map((match) => htmlToKnowledgeText(match[0]));

  // Trích xuất blogItems cụ thể nếu là index.html
  let indexBlogItems = "";
  if (filePath.endsWith("index.html")) {
    try {
      const blogSection = raw.match(/const\s+blogItems\s*=\s*(\[[\s\S]*?\])\s*;/);
      if (blogSection) {
        const itemsText = blogSection[1];
        const itemBlocks = itemsText.split(/\}\s*,\s*\{/);
        const parsedBlogs = [];
        itemBlocks.forEach((block, index) => {
          const titleMatch = block.match(/title\s*:\s*["']([\s\S]*?)["']/);
          const descMatch = block.match(/desc\s*:\s*["']([\s\S]*?)["']/);
          const contentMatch = block.match(/content\s*:\s*`([\s\S]*?)`/);
          
          const title = titleMatch ? titleMatch[1].trim() : "";
          const desc = descMatch ? descMatch[1].trim() : "";
          let content = contentMatch ? contentMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
          if (content.length > 500) content = content.slice(0, 500) + "...";
          
          if (title) {
            parsedBlogs.push(`BÀI VIẾT TĨNH ${index + 1}: ${title}\n- Tóm tắt: ${desc}\n- Nội dung chi tiết: ${content}`);
          }
        });
        if (parsedBlogs.length > 0) {
          indexBlogItems = parsedBlogs.join("\n\n");
        }
      }
    } catch (e) {
      console.error("Lỗi parse blogItems từ index.html:", e);
    }
  }

  // Trích xuất chatbotIntents cụ thể nếu là index.html
  let indexChatbotIntents = "";
  if (filePath.endsWith("index.html")) {
    try {
      const intentsSection = raw.match(/const\s+chatbotIntents\s*=\s*(\[[\s\S]*?\])\s*;/);
      if (intentsSection) {
        const intentsText = intentsSection[1];
        const intentBlocks = intentsText.split(/\}\s*,\s*\{/);
        const parsedIntents = [];
        intentBlocks.forEach((block) => {
          const nameMatch = block.match(/["']name["']\s*:\s*["']([^"']+)["']/);
          const replyMatch = block.match(/["']reply["']\s*:\s*["'`]([\s\S]*?)["'`]/);
          
          const name = nameMatch ? nameMatch[1].trim() : "";
          const reply = replyMatch ? replyMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "";
          
          if (name && reply) {
            parsedIntents.push(`TÀI LIỆU HƯỚNG DẪN VỀ [${name.toUpperCase()}]:\n${reply}`);
          }
        });
        if (parsedIntents.length > 0) {
          indexChatbotIntents = parsedIntents.join("\n\n");
        }
      }
    } catch (e) {
      console.error("Lỗi parse chatbotIntents từ index.html:", e);
    }
  }

  return [
    "=== TEXT HIỂN THỊ TRONG WEBSITE ===",
    textOnly.slice(0, 50000),

    "=== SẢN PHẨM BÓC TÁCH TỪ INDEX ===",
    productMatches.length ? productMatches.join("\n\n") : "Không bóc tách được sản phẩm từ index.",

    "=== BÀI VIẾT BÓC TÁCH TỪ INDEX ===",
    articleMatches.length ? articleMatches.join("\n\n") : "Không bóc tách được bài viết từ index.",

    "=== CÁC BÀI VIẾT BLOG CHI TIẾT CỦA INDEX.HTML ===",
    indexBlogItems || "Không tìm thấy bài viết blogItems trong index.html.",

    "=== TÀI LIỆU HƯỚNG DẪN PHẢN HỒI (CHATBOT INTENTS) TỪ INDEX.HTML ===",
    indexChatbotIntents || "Không tìm thấy chatbotIntents trong index.html.",

    "=== GIỚI THIỆU / VỀ CHÚNG TÔI ===",
    aboutMatches.length ? aboutMatches.join("\n\n") : "Không tìm thấy phần giới thiệu.",

    "=== FOOTER / LIÊN HỆ ===",
    footerMatches.length ? footerMatches.join("\n\n") : "Không tìm thấy footer/liên hệ."
  ].join("\n\n");
}
function loadIndexKnowledge() {
  const now = Date.now();

  if (cachedIndexKnowledge.text && now - cachedIndexKnowledge.loadedAt < 30_000) {
    return cachedIndexKnowledge;
  }

  const indexCandidates = [
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "public", "index.html"),
    path.join(__dirname, "index.html"),
    path.join(__dirname, "public", "index.html")
  ];
  const adminCandidates = [
    path.join(process.cwd(), "admin.html"),
    path.join(process.cwd(), "public", "admin.html"),
    path.join(__dirname, "admin.html"),
    path.join(__dirname, "public", "admin.html")
  ];

  let indexRaw = "";
  let indexPath = "";
  for (const p of indexCandidates) {
    if (fs.existsSync(p)) {
      indexRaw = fs.readFileSync(p, "utf8");
      indexPath = p;
      break;
    }
  }

  let adminRaw = "";
  let adminPath = "";
  for (const p of adminCandidates) {
    if (fs.existsSync(p)) {
      adminRaw = fs.readFileSync(p, "utf8");
      adminPath = p;
      break;
    }
  }

  const texts = [];
  if (indexRaw) {
    const cleanIndex = extractWebsiteKnowledge(indexRaw, indexPath);
    texts.push(`=== DỮ LIỆU TỪ TRANG CHỦ BÁN HÀNG (INDEX.HTML) (Nguồn: ${indexPath}) ===\n${cleanIndex}`);
  }
  if (adminRaw) {
    const cleanAdmin = htmlToKnowledgeText(adminRaw);
    texts.push(`=== DỮ LIỆU TỪ TRANG QUẢN TRỊ ADMIN (ADMIN.HTML) (Nguồn: ${adminPath}) ===\n${cleanAdmin}`);
  }

  cachedIndexKnowledge = {
    loadedAt: now,
    source: (indexRaw ? "index.html " : "") + (adminRaw ? "admin.html" : ""),
    text: texts.join("\n\n---\n\n").slice(0, 150000)
  };

  return cachedIndexKnowledge;
}

async function searchDuckDuckGo(query) {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
        "Accept-Language": "vi,en-US;q=0.9,en;q=0.8"
      }
    });

    if (!response.ok) {
      return `Không thể kết nối DuckDuckGo (HTTP ${response.status}).`;
    }

    const html = await response.text();
    const results = [];
    const parts = html.split('<div class="result__body">');
    
    for (let i = 1; i < parts.length && results.length < 5; i++) {
      const block = parts[i].split('</div>')[0];
      const titleMatch = block.match(/<a[^>]+class="result__a"[^>]*>([\s\S]*?)<\/a>/);
      const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
      const linkMatch = block.match(/<a[^>]+class="result__url"[^>]*>([\s\S]*?)<\/a>/);
      
      if (titleMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        const snippet = snippetMatch ? snippetMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        const link = linkMatch ? linkMatch[1].replace(/<[^>]+>/g, "").trim() : "";
        results.push({
          title,
          snippet,
          link: link.startsWith("http") ? link : `https://${link}`
        });
      }
    }

    if (results.length === 0) {
      return "Không tìm thấy kết quả internet nào phù hợp.";
    }

    return results
      .map((r, index) => `${index + 1}. ${r.title}\n${r.snippet}\nNguồn: ${r.link}`)
      .join("\n\n");
  } catch (error) {
    console.error("DuckDuckGo search error:", error);
    return `Lỗi tìm kiếm DuckDuckGo: ${error.message || String(error)}`;
  }
}

async function searchInternet(query) {
  const serperKey = process.env.SERPER_API_KEY;

  if (serperKey) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": serperKey
        },
        body: JSON.stringify({
          q: query,
          gl: "vn",
          hl: "vi",
          num: 5
        })
      });

      if (response.ok) {
        const data = await response.json();
        const organic = Array.isArray(data?.organic) ? data.organic : [];
        if (organic.length > 0) {
          const text = organic
            .slice(0, 5)
            .map((item, index) => {
              return `${index + 1}. ${item.title || "Không có tiêu đề"}\n${item.snippet || ""}\nNguồn: ${item.link || ""}`;
            })
            .join("\n\n");

          return {
            available: true,
            text
          };
        }
      }
    } catch (error) {
      console.warn("Serper API error, falling back to DuckDuckGo:", error);
    }
  }

  // Fallback to DuckDuckGo
  const ddgText = await searchDuckDuckGo(query);
  const ok = !ddgText.startsWith("Lỗi") && !ddgText.startsWith("Không thể");
  return {
    available: ok,
    text: ddgText
  };
}

function shouldTryInternetSearch(reply) {
  const text = String(reply || "").toLowerCase();

  return (
    text.includes("thông tin này chưa có trong dữ liệu website/quán") ||
    text.includes("chưa có trong dữ liệu") ||
    text.includes("không có trong dữ liệu nội bộ") ||
    text.includes("không đủ dữ liệu") ||
    text.includes("chưa tìm thấy trong dữ liệu của quán")
  );
}

function shouldForceInternetSearch(message) {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("thời tiết") ||
    text.includes("hôm nay") ||
    text.includes("tin tức") ||
    text.includes("giá vàng") ||
    text.includes("thế giới") ||
    text.includes("bên ngoài")
  );
}

async function buildDatabaseContextForAi(question) {
  // Lấy toàn bộ thực đơn nước, vật phẩm để nạp đầy đủ context
  const [drinkResult, merchResult, categoryResult, articlesResult, baiVietResult] = await Promise.allSettled([
    supabase.from("san_pham_do_uong").select("ten_san_pham, mo_ta, gia_den, gia_sua, hien_thi").eq("hien_thi", true).limit(150),
    supabase.from("san_pham_merchandise").select("ten_san_pham, mo_ta, gia, hien_thi").eq("hien_thi", true).limit(150),
    supabase.from("danh_muc_san_pham").select("ten_danh_muc, mo_ta, loai, hien_thi").eq("hien_thi", true).limit(100),
    supabase.from("articles").select("title, desc, content").limit(50),
    supabase.from("bai_viet").select("title, desc, content").limit(50)
  ]);

  const rows = [];
  if (drinkResult.status === "fulfilled" && !drinkResult.value.error) {
    for (const item of drinkResult.value.data || []) {
      rows.push(`Đồ uống: ${item.ten_san_pham}. ${item.mo_ta || ""} Giá đen ${Number(item.gia_den || 0).toLocaleString("vi-VN")}đ, giá sữa ${Number(item.gia_sua || 0).toLocaleString("vi-VN")}đ.`);
    }
  }
  if (merchResult.status === "fulfilled" && !merchResult.value.error) {
    for (const item of merchResult.value.data || []) {
      rows.push(`Vật phẩm: ${item.ten_san_pham}. ${item.mo_ta || ""} Giá ${Number(item.gia || 0).toLocaleString("vi-VN")}đ.`);
    }
  }
  if (categoryResult.status === "fulfilled" && !categoryResult.value.error) {
    for (const item of categoryResult.value.data || []) {
      rows.push(`Danh mục: ${item.ten_danh_muc}. ${item.mo_ta || ""} Loại ${item.loai || ""}.`);
    }
  }
  if (articlesResult.status === "fulfilled" && !articlesResult.value.error) {
    for (const item of articlesResult.value.data || []) {
      const cleanContent = (item.content || "").replace(/<[^>]+>/g, " ").slice(0, 200);
      rows.push(`Bài viết (database): ${item.title}. Tóm tắt: ${item.desc || ""}. Nội dung: ${cleanContent}...`);
    }
  }
  if (baiVietResult.status === "fulfilled" && !baiVietResult.value.error) {
    for (const item of baiVietResult.value.data || []) {
      const cleanContent = (item.content || "").replace(/<[^>]+>/g, " ").slice(0, 200);
      rows.push(`Bài viết (database): ${item.title}. Tóm tắt: ${item.desc || ""}. Nội dung: ${cleanContent}...`);
    }
  }

  if (rows.length === 0) return "Cơ sở dữ liệu Supabase rỗng.";
  
  return `Dữ liệu sản phẩm và bài viết từ Supabase:\n- ${rows.join("\n- ")}`;
}

async function buildWebsiteContextForAi(question, extraContext) {
  const indexKnowledge = loadIndexKnowledge();
  const databaseContext = await buildDatabaseContextForAi(question);

  const parts = [];
  if (extraContext) parts.push(`Ngữ cảnh frontend gửi lên, gồm nội dung trang chủ, bài viết, giới thiệu và dữ liệu đã render từ website:\n${extraContext}`);

  if (indexKnowledge.source) {
    parts.push(`Nguồn index backend đang đọc: ${indexKnowledge.source}`);
  }

  parts.push(`Thông tin đầy đủ từ website/index.html:\n${indexKnowledge.text}`);

  if (databaseContext) {
    parts.push(databaseContext);
  } else {
    parts.push("Database Supabase rỗng hoặc lỗi. Nếu thiếu thông tin, hướng khách gọi 038 972 6999.");
  }

  parts.push("Thông tin cố định: Quán Trung Nguyên Legend Âu Lạc / Vietnam Prosperity Coffee. SĐT 038 972 6999. Giờ mở cửa: 06:30 - 21:30 hằng ngày. Địa chỉ: Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế. Thanh toán VietinBank, STK 101882692631, chủ tài khoản NGO QUYNH TRANG. SePay tự cập nhật trạng thái đơn khi nhận đủ tiền và nội dung chuyển khoản có mã VPC-DH-...");
  return parts.join("\n\n").slice(0, 45000);
}

function stripUnsafeHtml(text) {
  return String(text || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

const MENU_AND_MERCH_KNOWLEDGE = `
--- TOÀN BỘ THỰC ĐƠN ĐỒ UỐNG & VẬT PHẨM BÁN HÀNG CỦA VPC ---
A. THỰC ĐƠN ĐỒ UỐNG & BÁNH NGỌT:
1. Cà phê phin truyền thống:
   - Legend Đen Đá / Legend Sữa Đá: 50.000đ (đen) / 55.000đ (sữa)
   - Coffee Legend (Cà phê phin đặc biệt, đậm đà nguyên bản): 165.000đ
   - Năng Lượng Tư Duy: 36.000đ (đen) / 41.000đ (sữa)
   - Năng Lượng Sáng Tạo: 32.000đ (đen) / 37.000đ (sữa)
2. Cà phê máy Ý hiện đại:
   - Double Espresso / Americano: 48.000đ
   - Latte / Cappuccino: 73.000đ (latte) / 68.000đ (cappuccino)
   - Latte Yến Mạch / Cappuccino Yến Mạch: 79.000đ (latte) / 73.000đ (cappuccino)
   - Success Đen Đá / Success Sữa Đá: 45.000đ (đen) / 50.000đ (sữa)
3. Cà phê pha chế đặc biệt (Signature):
   - Cà phê muối Legend / Cold Brew Phương Đông: 63.000đ
   - Cà phê trứng / Cà phê cốt dừa (Cà phê dừa): 79.000đ
   - Cà phê hạnh nhân / Cà phê Mother Land: 68.000đ
   - Cà phê Cold Brew / Bạc xỉu: 48.000đ
4. Trà & Trà sữa:
   - Trà đào cam sả / Trà vải hoa hồng / Trà cam quế đá: 68.000đ
   - Trà sen vàng (Lá nếp sen vàng): 68.000đ
   - Trà sữa Legend / Trà sữa ô long: 58.000đ
5. Sinh tố & Đá xay:
   - Sinh tố theo mùa (Xoài, Bơ, Chanh Dây, Dâu): 68.000đ
   - Kim quất đá xay / Trà xanh đá xay: 58.000đ
   - Đá xay Cacao hạt dẻ: 68.000đ
6. Nước ép trái cây tươi & Nước giải nhiệt:
   - Nước ép (Cam vắt, Nước ép chanh dây, Thơm, Dưa hấu): 58.000đ
   - Nước chanh dây thơm sả / Chanh sả gừng hạt chia: 58.000đ
   - Nước chanh muối mật ong: 45.000đ
   - Trà Hibiscus thanh nhiệt: 63.000đ
   - Nước suối đóng chai: 19.000đ
7. Matcha & Cacao:
   - Matcha sữa đá / Sữa tươi trân châu đường đen: 68.000đ
   - Cacao sữa: 53.000đ
   - Sữa tươi: 38.000đ
8. Bánh ngọt ăn kèm:
   - Bánh Mousse (Chanh dây / Dâu), Bánh Tiramisu, Croissant thực dưỡng: 39.000đ
   - Panna Cotta (Xoài / Chanh dây): 29.000đ

B. VẬT PHẨM & CÀ PHÊ GÓI (MERCHANDISE):
1. Bộ quà tặng cao cấp:
   - Hộp quà giàu có Legend (hộp set quà giàu có 225g): 850.000đ
2. Cà phê hạt & Cà phê bột phin:
   - Cà phê hạt mộc Espresso (Robusta/Arabica - gói 1kg): 750.000đ
   - Cà phê Drip phin giấy (Sáng tạo 1/2/3/4/5 - hộp 10 sticks): 120.000đ
3. Ly sứ, phin pha chế:
   - Phin nhôm Trung Nguyên Legend: 130.000đ
   - Phin sứ cao cấp: 290.000đ
   - Ly sứ Legend VIP (Đen/Trắng): 350.000đ
   - Bình giữ nhiệt Trung Nguyên Legend (Trắng/Đen): 380.000đ
4. Vật phẩm phong cách sống VPC:
   - Sổ tay VPC: 95.000đ
   - Túi vải canvas VPC: 120.000đ
   - Khăn rằn Nam Bộ: 60.000đ
`;

function buildAiSystemPrompt(context) {
  return `Bạn là Trang - trợ lý ảo AI vô cùng dễ thương, lịch sự và chu đáo của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc (VPC).\n\n`
    + `QUY TẮC BẮT BUỘC VỀ SỬ DỤNG DỮ LIỆU:\n`
    + `1. Bạn phải luôn ưu tiên tìm kiếm câu trả lời từ dữ liệu thực đơn sản phẩm, thông tin đơn hàng và ngữ cảnh website được cung cấp ở dưới trước.\n`
    + `2. Đối với giá cả sản phẩm không có trong menu hoặc thông tin đơn hàng cụ thể không tồn tại, bạn không được tự ý bịa giá hay bịa mã đơn khác, mà hướng dẫn khách liên hệ hotline 038 972 6999 hoặc kiểm tra menu.\n`
    + `3. Nếu thông tin không có trong dữ liệu nội bộ cung cấp (bao gồm cả các câu hỏi chung, tư vấn cà phê, thông tin đời sống, địa lý hoặc các thông tin khác), bạn được phép tự sử dụng tri thức bên ngoài của ChatGPT hoặc kết quả tìm kiếm internet để trả lời khách một cách thông minh, tự nhiên và hữu ích (ghi rõ là thông tin tham khảo bên ngoài nếu cần thiết).\n`
    + `4. Xưng hô: Xưng "VPC" hoặc "Trang", gọi khách là "Quý khách", "anh/chị" hoặc "bạn", giữ văn phong lễ phép ấm áp.\n\n`
    + `Thông tin ngữ cảnh website bổ sung khác (bao gồm cả dữ liệu thực đơn sản phẩm, trang quản trị và Supabase): ${context || "Không có."}`;
}

async function askGemini(question, context) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildAiSystemPrompt(context) }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: String(question || "") }]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 700
      }
    })
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Gemini API lỗi");
  return result.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("\n").trim() || "";
}

async function askOpenAI(question, context) {
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: buildAiSystemPrompt(context) },
        { role: "user", content: String(question || "") }
      ],
      temperature: 0.4,
      max_tokens: 700
    })
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "OpenAI API lỗi");
  return result.choices?.[0]?.message?.content?.trim() || "";
}



function getLocalVPCChatAnswer(question) {
  const q = removeVietnameseTones(String(question || ""));

  if (
    q.includes("gio") ||
    q.includes("mo cua") ||
    q.includes("dong cua") ||
    q.includes("may gio")
  ) {
    return "Dạ, VPC mở cửa từ 06:30 đến 21:30 hằng ngày ạ.";
  }

  if (
    q.includes("dia chi") ||
    q.includes("o dau") ||
    q.includes("duong nao") ||
    q.includes("aeon")
  ) {
    return "Dạ, VPC ở Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế, đối diện Aeon Mall Huế ạ. Hotline hỗ trợ: 038 972 6999.";
  }

  if (
    q.includes("hotline") ||
    q.includes("so dien thoai") ||
    q.includes("lien he") ||
    q.includes("goi")
  ) {
    return "Dạ, hotline của VPC là 038 972 6999 ạ.";
  }

  if (
    q.includes("chuyen khoan") ||
    q.includes("thanh toan") ||
    q.includes("vietinbank") ||
    q.includes("qr") ||
    q.includes("sepay")
  ) {
    return "Dạ, Quý khách có thể chuyển khoản VietinBank - chủ tài khoản NGO QUYNH TRANG - số tài khoản 101882692631. Nội dung chuyển khoản vui lòng ghi đúng mã đơn VPC-DH-... để hệ thống SePay tự ghi nhận nhé ạ.";
  }

  if (
    q.includes("thanh vien") ||
    q.includes("tich diem") ||
    q.includes("hang bac") ||
    q.includes("hang vang") ||
    q.includes("bach kim") ||
    q.includes("platinum")
  ) {
    return "Dạ, Quý khách có thể đăng ký thành viên miễn phí trên app Trung Nguyên Legend. Khi thanh toán, Quý khách xuất trình mã QR hoặc thẻ thành viên trên app để tích điểm và áp dụng ưu đãi. Mỗi 30.000đ mua hàng = 1 điểm, 1 điểm = 1.000đ khi quy đổi, mỗi lần đổi cần tối thiểu 30 điểm. Hạng Vàng từ 100 điểm được quà sinh nhật và giảm 10%; hạng Bạch Kim từ 300 điểm được quà sinh nhật và giảm 15% ạ.";
  }

  if (
    q.includes("ship") ||
    q.includes("giao hang") ||
    q.includes("phi giao") ||
    q.includes("van chuyen")
  ) {
    return "Dạ, để báo phí giao chính xác, VPC cần địa chỉ nhận hàng của Quý khách ạ. Sau khi có địa chỉ, cửa hàng sẽ kiểm tra phạm vi giao và xác nhận phí ship cụ thể nhé ạ.";
  }

  if (
    q.includes("dat hang") ||
    q.includes("mua") ||
    q.includes("gio hang") ||
    q.includes("order")
  ) {
    return "Dạ, Quý khách vào Menu đồ uống hoặc Vật phẩm, chọn sản phẩm rồi bấm Đặt món/Đặt mua. Sau đó vào Giỏ hàng, nhập họ tên, số điện thoại, hình thức nhận hàng và phương thức thanh toán để gửi đơn ạ.";
  }

  if (
    q.includes("ca phe") ||
    q.includes("coffee") ||
    q.includes("bac xiu") ||
    q.includes("latte") ||
    q.includes("espresso")
  ) {
    return "Dạ, nếu Quý khách thích vị đậm và tỉnh táo, VPC gợi ý nhóm cà phê phin/cà phê năng lượng. Nếu thích vị béo dễ uống, Quý khách có thể thử Bạc Xỉu, Latte hoặc các món cà phê pha chế ạ.";
  }

  if (
    q.includes("tra") ||
    q.includes("sinh to") ||
    q.includes("nuoc ep") ||
    q.includes("giai nhiet") ||
    q.includes("mat")
  ) {
    return "Dạ, nếu Quý khách muốn món thanh mát, VPC gợi ý nhóm trà, nước ép, sinh tố hoặc nước thanh nhiệt ạ. Quý khách có thể xem Menu đồ uống để chọn món phù hợp nhé ạ.";
  }

  if (
    q.includes("ai la chu") ||
    q.includes("chu so huu") ||
    q.includes("sang lap") ||
    q.includes("minh duc") ||
    q.includes("tuyet mai") ||
    q.includes("ve vpc")
  ) {
    return "Dạ, Vietnam Prosperity Coffee được thành lập năm 2025 tại Huế, đồng sáng lập bởi Ông Nguyễn Minh Đức và Bà Nguyễn Thị Tuyết Mai. VPC vận hành website và kết nối khách hàng với cửa hàng Trung Nguyên Legend Âu Lạc ạ.";
  }

  return "Dạ, VPC đã nhận câu hỏi của Quý khách ạ. Hiện AI đang hơi gián đoạn, nhưng VPC có thể hỗ trợ nhanh về menu đồ uống, vật phẩm, đặt hàng, thanh toán, thành viên, địa chỉ, giờ mở cửa hoặc tra cứu đơn. Quý khách cũng có thể gọi hotline 038 972 6999 để được hỗ trợ ngay ạ.";
}


// Code này tạo alias để frontend cũ gọi /api/chat vẫn chạy như /api/chat-ai
app.post("/api/chat", (req, res, next) => {
  req.url = "/api/chat-ai";
  next();
});

// Map trạng thái đơn hàng phục vụ chatbot tra cứu
const CHATBOT_STATUS_MAP = {
  da_dat_don: "moi",
  don_moi: "moi",
  cho_chuyen_khoan: "cho_tt",
  cho_xac_nhan_chuyen_khoan: "cho_tt",
  khach_bao_da_chuyen_khoan: "cho_tt",
  da_chuyen_khoan: "da_tt",
  da_thanh_toan: "da_tt",
  da_nhan_don: "dang_lam",
  dang_lam_don: "dang_lam",
  da_giao_shipper: "dang_giao",
  dang_giao: "dang_giao",
  da_giao: "hoan_tat",
  hoan_thanh: "hoan_tat",
  tu_choi_don: "tu_choi",
  tu_choi: "tu_choi",
  da_huy: "da_huy"
};

const CHATBOT_STATUS_LABELS = {
  moi: "Mới (đã đặt)",
  cho_tt: "Chờ thanh toán",
  da_tt: "Đã thanh toán (chờ chế biến)",
  dang_lam: "Đang làm/Đang chế biến",
  dang_giao: "Đang giao hàng",
  hoan_tat: "Hoàn tất/Thành công",
  tu_choi: "Đã từ chối",
  da_huy: "Đã hủy"
};

// Code này cho chatbox gọi AI qua backend, ưu tiên ChatGPT rồi tới Gemini
app.post("/api/chat-ai", async (req, res) => {
  try {
    const { question, message, context, adminContext, session_id, sessionId, client_name, clientName } = req.body || {};
    const userQuestion = String(question || message || "").trim();
    const finalSessionId = String(session_id || sessionId || "sess_anonymous").trim();
    const finalClientName = String(client_name || clientName || "Khách ẩn danh").trim();

    if (!userQuestion) {
      return res.status(400).json({ error: "Thiếu câu hỏi." });
    }

    // 1. Lưu tin nhắn của khách hàng vào database
    try {
      await supabase.from("chat_messages").insert({
        session_id: finalSessionId,
        sender: "client",
        message: userQuestion,
        client_name: finalClientName,
        is_read: false
      });
    } catch (dbErr) {
      console.warn("⚠️ Không lưu được tin nhắn client vào DB:", dbErr.message);
    }

    // 2. Tự động nhận diện tra cứu đơn hàng realtime dựa trên sđt hoặc mã đơn trong câu hỏi
    let orderInfoContext = "";
    const codeMatch = userQuestion.match(/(?:VPC-)?DH-?\d+/i);
    const phoneMatch = userQuestion.match(/0\d{8,10}/); // Hỗ trợ 9 đến 11 chữ số bắt đầu bằng 0

    if (codeMatch || phoneMatch) {
      try {
        let query = supabase.from("don_hang").select(`
          *,
          thong_tin_khach_hang (
            ho_ten,
            so_dien_thoai,
            email,
            dia_chi
          )
        `);

        if (codeMatch) {
          const rawCode = codeMatch[0];
          const cleanCode = rawCode.toUpperCase().replace("-", "");
          query = query.or(`ma_don_hang.ilike.%${cleanCode}%,ma_don_hang.ilike.%${rawCode}%`);
        } else if (phoneMatch) {
          const matchedPhone = phoneMatch[0];
          query = query.or(`so_dien_thoai.eq.${matchedPhone},phone.eq.${matchedPhone},customer_phone.eq.${matchedPhone}`);
        }

        const { data: matchedOrders, error: orderErr } = await query.limit(5);

        if (!orderErr && matchedOrders && matchedOrders.length > 0) {
          orderInfoContext = `\n--- THÔNG TIN ĐƠN HÀNG TRA CỨU REALTIME TỪ DATABASE ---\n`;
          matchedOrders.forEach((ord, index) => {
            const khInfo = ord.thong_tin_khach_hang || {};
            const hoten = khInfo.ho_ten || ord.ho_ten || "Khách hàng";
            const sdt = khInfo.so_dien_thoai || ord.so_dien_thoai || "";
            const status = CHATBOT_STATUS_LABELS[CHATBOT_STATUS_MAP[ord.trang_thai] || ord.trang_thai] || ord.trang_thai;
            
            let itemsText = "";
            try {
              const items = typeof ord.danh_sach_san_pham === "string" ? JSON.parse(ord.danh_sach_san_pham) : ord.danh_sach_san_pham;
              if (Array.isArray(items)) {
                itemsText = items.map(it => `${it.name || it.ten_san_pham || "Sản phẩm"} x${it.qty || it.so_luong || 1}`).join(", ");
              }
            } catch (e) {
              itemsText = "Không parse được danh sách món";
            }

            orderInfoContext += `Đơn hàng ${index + 1}:
- Mã đơn hàng: ${ord.ma_don_hang}
- Ngày đặt đơn: ${ord.created_at || "Vừa xong"}
- Tên khách hàng: ${hoten}
- Số điện thoại đặt hàng: ${sdt}
- Địa chỉ nhận: ${ord.dia_chi_giao_hang || ord.dia_chi || "Nhận tại quán"}
- Trạng thái hiện tại: ${status}
- Món đã đặt: ${itemsText}
- Tổng tiền đơn hàng: ${Number(ord.tong_tien || 0).toLocaleString("vi-VN")}đ
- Phương thức thanh toán: ${ord.phuong_thuc_thanh_toan || "Tiền mặt"}
- Ghi chú: ${ord.ghi_chu || "Không có"}\n\n`;
          });
        }
      } catch (err) {
        console.error("Lỗi tra cứu đơn hàng tự động cho chatbot:", err.message);
      }
    }

    let websiteContext = await buildWebsiteContextForAi(userQuestion, context);
    if (orderInfoContext) {
      websiteContext += `\n${orderInfoContext}`;
    }

    if (adminContext) {
      websiteContext += `

Dữ liệu admin hiện tại:
${JSON.stringify(adminContext, null, 2).slice(0, 30000)}`;
    }

    let answer = "";
    let provider = "local";

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    provider = process.env.AI_PROVIDER || (openaiKey ? "openai" : "gemini");

    async function callAi(q, ctx) {
      if (provider === "gemini" && geminiKey) {
        return await askGemini(q, ctx);
      } else if (openaiKey) {
        return await askOpenAI(q, ctx);
      } else if (geminiKey) {
        return await askGemini(q, ctx);
      }
      return "";
    }

    if (geminiKey || openaiKey) {
      answer = await callAi(userQuestion, websiteContext);

      if (shouldTryInternetSearch(answer) || shouldForceInternetSearch(userQuestion)) {
        const internetResult = await searchInternet(userQuestion);
        if (internetResult.available) {
          const promptWithInternet = `
DỮ LIỆU NỘI BỘ VPC KHÔNG ĐỦ ĐỂ TRẢ LỜI ĐẦY ĐỦ CÂU HỎI.
Dưới đây là kết quả tìm kiếm internet tham khảo. Hãy trả lời rõ rằng thông tin này là tham khảo bên ngoài, không phải chính sách xác nhận của VPC nếu dữ liệu nội bộ không có.

--- CÂU HỎI ---
${userQuestion}

--- DỮ LIỆU NỘI BỘ ĐÃ KIỂM TRA ---
${websiteContext.slice(0, 35000)}

--- KẾT QUẢ TÌM KIẾM INTERNET ---
${internetResult.text}
`;
          answer = await callAi(userQuestion, promptWithInternet);
        }
      }
    } else {
      answer = "Trang đã nhận được câu hỏi của bạn. Hiện backend chưa cấu hình GEMINI_API_KEY hoặc OPENAI_API_KEY, bạn vui lòng gọi 038 972 6999 nếu cần hỗ trợ nhanh.";
    }

    const cleanAnswer = stripUnsafeHtml(answer);

    // 3. Lưu câu trả lời của AI vào database
    try {
      await supabase.from("chat_messages").insert({
        session_id: finalSessionId,
        sender: "bot",
        message: cleanAnswer,
        client_name: finalClientName,
        is_read: true
      });
    } catch (dbErr) {
      console.warn("⚠️ Không lưu được tin nhắn bot vào DB:", dbErr.message);
    }

    return res.json({
      provider,
      reply: cleanAnswer,
      answer: cleanAnswer,
      knowledgeSource: websiteContext.includes("Thông tin hiển thị trong website") ? "index.html" : "keyword-fallback"
    });
  } catch (error) {
    console.error("Lỗi /api/chat-ai:", error);
    const fallbackQuestion = String(req.body?.question || req.body?.message || "").trim();
    const fallbackAnswer = getLocalVPCChatAnswer(fallbackQuestion);

    // Lưu tin nhắn lỗi/dự phòng
    try {
      const { session_id, sessionId, client_name, clientName } = req.body || {};
      const finalSessionId = String(session_id || sessionId || "sess_anonymous").trim();
      const finalClientName = String(client_name || clientName || "Khách ẩn danh").trim();

      await supabase.from("chat_messages").insert({
        session_id: finalSessionId,
        sender: "bot",
        message: fallbackAnswer,
        client_name: finalClientName,
        is_read: true
      });
    } catch {}

    return res.json({
      provider: "local-fallback-after-error",
      reply: fallbackAnswer,
      answer: fallbackAnswer,
      error: error.message
    });
  }
});

/* =========================================================
   LIVE CHAT API - KHÁCH & ADMIN
========================================================= */

// 1. Khách hàng: Lấy danh sách tin nhắn theo session_id
app.get("/api/chat/messages", async (req, res) => {
  try {
    const sessionId = String(req.query.session_id || "").trim();
    if (!sessionId) {
      return res.status(400).json({ error: "Thiếu session_id." });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Lỗi GET /api/chat/messages:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Admin: Lấy danh sách tất cả cuộc chat (nhóm theo session_id)
app.get("/api/admin/chats", async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .gt("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: false });

    if (error) throw error;

    const chatMap = new Map();
    (messages || []).forEach(msg => {
      if (!chatMap.has(msg.session_id)) {
        chatMap.set(msg.session_id, {
          session_id: msg.session_id,
          client_name: msg.client_name || "Khách ẩn danh",
          last_message: msg.message,
          last_sender: msg.sender,
          created_at: msg.created_at,
          unread_count: 0
        });
      }

      if (msg.sender === "client" && !msg.is_read) {
        const chat = chatMap.get(msg.session_id);
        chat.unread_count += 1;
      }
    });

    res.json(Array.from(chatMap.values()));
  } catch (error) {
    console.error("Lỗi GET /api/admin/chats:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Admin: Lấy chi tiết lịch sử một cuộc chat và đánh dấu đã đọc
app.get("/api/admin/chats/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data: messages, error: getErr } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (getErr) throw getErr;

    // Đánh dấu các tin nhắn khách gửi là đã đọc
    await supabase
      .from("chat_messages")
      .update({ is_read: true })
      .eq("session_id", sessionId)
      .eq("sender", "client");

    res.json(messages || []);
  } catch (error) {
    console.error(`Lỗi GET /api/admin/chats/${req.params.sessionId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Admin: Gửi tin nhắn trả lời khách hàng
app.post("/api/admin/chats/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, client_name } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: "Nội dung tin nhắn trống." });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        sender: "admin",
        message: String(message).trim(),
        client_name: client_name || null,
        is_read: true
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error(`Lỗi POST /api/admin/chats/${req.params.sessionId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

async function initDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log("⚠️ Không tìm thấy DATABASE_URL trong môi trường. Bỏ qua khởi tạo bảng Postgres.");
    return;
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("🔌 Kết nối PostgreSQL thành công để kiểm tra cấu trúc DB.");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.sepay_transactions (
        id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        sepay_id bigint UNIQUE,
        gateway text,
        transaction_date timestamp with time zone,
        amount_in numeric(15,2) DEFAULT 0,
        amount_out numeric(15,2) DEFAULT 0,
        transaction_content text,
        reference_number text,
        accumulated_balance numeric(15,2) DEFAULT 0,
        order_code text,
        created_at timestamp with time zone DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_sepay_transactions_sepay_id ON public.sepay_transactions(sepay_id);
      CREATE INDEX IF NOT EXISTS idx_sepay_transactions_order_code ON public.sepay_transactions(order_code);

      CREATE TABLE IF NOT EXISTS public.chat_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id text NOT NULL,
        sender text NOT NULL,
        message text NOT NULL,
        client_name text,
        is_read boolean NOT NULL DEFAULT false,
        created_at timestamp with time zone DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at desc);

      CREATE TABLE IF NOT EXISTS public.bai_viet (
        id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
        title text NOT NULL,
        "desc" text DEFAULT '',
        content text NOT NULL,
        thumbnail text DEFAULT '',
        source_link text DEFAULT NULL,
        created_at timestamp with time zone DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_bai_viet_created_at ON public.bai_viet(created_at desc);
    `;

    await client.query(createTableQuery);
    console.log("✅ Đã xác minh/khởi tạo thành công các bảng public.sepay_transactions, public.chat_messages, public.bai_viet và các indexes.");

    // Kiểm tra và nạp bài viết mặc định nếu trống
    try {
      const blogCountRes = await client.query("SELECT COUNT(*) FROM public.bai_viet;");
      const blogCount = parseInt(blogCountRes.rows[0].count, 10);
      if (blogCount === 0) {
        console.log("📝 Bảng public.bai_viet trống. Đang nạp bài viết mẫu từ index...");
        const defaultBlogs = [
          {
            title: "Hè này cần gì? Một góc mát, một ly ngon và một buổi thư giãn tại Trung Nguyên Legend Âu Lạc. ☕🌿",
            desc: "Nắng hè có thể gay gắt, nhưng Trung Nguyên Legend Âu Lạc luôn có những thức uống mát lành chờ bạn ghé thưởng thức.",
            thumbnail: "https://www.facebook.com/reel/1511949147216560",
            content: `<p><strong>☀️ GIẢI NHIỆT MÙA HÈ CÙNG TRUNG NGUYÊN LEGEND ÂU LẠC 🌿</strong></p>\n\n<p>\n  Nắng hè có thể gay gắt, nhưng <strong>Trung Nguyên Legend Âu Lạc</strong> luôn có những thức uống mát lành chờ bạn ghé thưởng thức.\n  Một ly trà thanh mát, một món đá xay thơm ngon hay cà phê đậm vị sẽ giúp bạn thư giãn và nạp lại năng lượng cho ngày dài.\n</p>\n\n<p>✨ Không gian thoải mái</p>\n<p>✨ Thức uống đa dạng</p>\n<p>✨ Phù hợp để gặp gỡ bạn bè, học tập và làm việc</p>\n\n<p>\n  Ghé ngay <strong>Trung Nguyên Legend Âu Lạc</strong> để tận hưởng những phút giây chill thật dễ chịu trong mùa hè này nhé!\n</p>`,
            source_link: "https://www.facebook.com/reel/1511949147216560"
          },
          {
            title: "Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế ☕✨",
            desc: "Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.",
            thumbnail: "https://www.facebook.com/reel/1321336266180825",
            content: `<p>☕✨ <strong>Nghệ sĩ Nhật Cường ghé thăm không gian Trung Nguyên Legend Huế</strong></p>\n<p>Giữa nhịp sống nhẹ nhàng của Cố đô, hành trình thưởng thức cà phê trở nên đặc biệt hơn qua những khoảnh khắc giao lưu đầy cảm hứng cùng nghệ sĩ Nhật Cường tại Trung Nguyên Legend Huế.</p>\n<p>Không chỉ là điểm dừng chân thưởng thức cà phê năng lượng, nơi đây còn là không gian kết nối văn hóa, nghệ thuật và cảm hứng sống tỉnh thức.</p>`,
            source_link: "https://www.facebook.com/reel/1321336266180825"
          },
          {
            title: "Mua 1 được 2 – Chill hè cực đã!",
            desc: "Ưu đãi mua 1 được 2 tại Trung Nguyên Legend Âu Lạc, áp dụng từ 14:00 đến 21:30, từ 19/05 đến 30/06.",
            thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg",
            content: `<p><strong>☕️ Mua 1 được 2 – Chill hè cực đã!</strong></p>\n<p><strong>📍 Địa điểm:</strong> Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP Huế</p>\n<p><strong>🕑 Khung giờ áp dụng:</strong> 14:00 – 21:30</p>\n<p><strong>📅 Thời gian:</strong> Từ 19/05 đến 30/06</p>\n<p>🔥 Rủ bạn đến học bài, làm việc, tránh nóng cùng loạt thức uống mát lạnh tại Trung Nguyên Legend Âu Lạc.</p>`,
            source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773739/704546850_122111883836884434_407848279318371067_n_zgmrkn.jpg"
          },
          {
            title: "Trưa hè nóng bức – Ghé Trung Nguyên Legend Âu Lạc Huế",
            desc: "Không gian mát lạnh, chill học bài và thưởng thức cà phê tại Trung Nguyên Legend Âu Lạc Huế.",
            thumbnail: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg",
            content: `<p><strong>☀️ Trưa hè nóng bức</strong></p>\n<p>📚 Đi đâu cho hết nực?</p>\n<p>Ghé <strong>Trung Nguyên Legend Âu Lạc Huế</strong> vừa mát lạnh, vừa chill học bài nha 🤎☕</p>`,
            source_link: "https://res.cloudinary.com/dojibbcof/image/upload/v1779773786/701445719_122111738540884434_8176951810572622203_n_lbymde.jpg"
          },
          {
            title: "Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường",
            desc: "Trung Nguyên Legend Âu Lạc, TP Huế hân hạnh đón tiếp Nghệ sĩ Nhật Cường.",
            thumbnail: "https://www.facebook.com/reel/998900419486923",
            content: `<p>Trung Nguyên Legend Âu Lạc hân hạnh đón tiếp Nghệ sĩ Nhật Cường trong không gian cà phê năng lượng tại Thành phố Huế.</p>\n<p>Đây là một trong những khoảnh khắc đáng nhớ, thể hiện sự kết nối giữa khách hàng, nghệ sĩ và thương hiệu Trung Nguyên Legend.</p>`,
            source_link: "https://www.facebook.com/reel/998900419486923"
          },
          {
            title: "Sự kiện lái thử VinFast Thế Hệ Mới tại Trung Nguyên Legend Âu Lạc",
            desc: "Sự kiện lái thử VinFast Thế Hệ Mới trong không gian hiện đại và yên tĩnh của Trung Nguyên Legend.",
            thumbnail: "https://www.facebook.com/reel/981380314649839",
            content: `<p>✨ Thứ 7 này bạn đã có hẹn chưa?</p>\n<p>Cuối tuần này, hãy cùng gia đình và bạn bè đến tham gia sự kiện lái thử đặc biệt của VinFast Thế Hệ Mới tổ chức tại không gian sang trọng và yên tĩnh của Trung Nguyên Legend.</p>\n<p>📍 Địa điểm: Cafe Trung Nguyên Legend Khu TĐC Đông Nam Thủy An, Phường An Cựu, TP. Huế ( Đối diện Aeon Mall Huế).</p>\n<p>📅 Thời gian: Thứ 7 tuần này (16/05/2026).</p>\n<p>🔥 Đến với sự kiện, quý khách sẽ có cơ hội:</p>\n<p>✅ Trực tiếp trải nghiệm các dòng xe điện nổi bật từ VF3, VF5, VF6, VF7 đến VF8.</p>\n<p>✅ Khám phá những mẫu xe mới ra mắt cực HOT:</p>\n<p>Limo Green, Minio Green, MPV 7, EC VAN</p>\n<p>🎁 Đặc biệt: Nhận nhiều phần quà hấp dẫn và thưởng thức cafe miễn phí trong không gian thư giãn, hiện đại.</p>`,
            source_link: "https://www.facebook.com/reel/981380314649839"
          }
        ];
        for (const blog of defaultBlogs) {
          await client.query(
            `INSERT INTO public.bai_viet (title, "desc", content, thumbnail, source_link) 
             VALUES ($1, $2, $3, $4, $5);`,
            [blog.title, blog.desc, blog.content, blog.thumbnail, blog.source_link]
          );
        }
        console.log("✅ Nạp thành công 6 bài viết mặc định vào database.");
      }
    } catch (blogErr) {
      console.error("❌ Lỗi khi nạp dữ liệu bài viết mặc định:", blogErr.message);
    }
  } catch (err) {
    console.error("❌ Lỗi khi khởi tạo cơ sở dữ liệu Postgres:", err.message);
  } finally {
    await client.end();
  }
}
// Code này cập nhật trạng thái đơn hàng theo mã đơn
app.patch("/api/don-hang/:maDonHang", async (req, res) => {
  try {
    const { maDonHang } = req.params;
    const { trang_thai } = req.body;

    if (!maDonHang || !trang_thai) {
      return res.status(400).json({
        error: "Thiếu mã đơn hàng hoặc trạng thái"
      });
    }

    const { data, error } = await supabase
      .from("don_hang")
      .update({
        trang_thai,
        updated_at: new Date().toISOString()
      })
      .eq("ma_don_hang", maDonHang)
      .select()
      .single();

    if (error) throw error;

    // Nếu trạng thái chuyển thành "da_tt" (Đã thanh toán), tự động tạo bản sao giao dịch đối soát SePay nếu chưa có
    if (trang_thai === "da_tt" && data) {
      try {
        const { data: existingTx } = await supabase
          .from("sepay_transactions")
          .select("id")
          .eq("order_code", maDonHang)
          .limit(1);

        if (!existingTx || existingTx.length === 0) {
          const amount = Number(data.tong_tien || 0);
          const pttt = data.phuong_thuc_thanh_toan || "Chuyển khoản (Admin)";
          const sepayTxId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
          
          await supabase
            .from("sepay_transactions")
            .insert({
              sepay_id: sepayTxId,
              gateway: pttt,
              transaction_date: new Date().toISOString(),
              amount_in: amount,
              amount_out: 0,
              transaction_content: `Thanh toán cho đơn hàng ${maDonHang} (Hệ thống ghi nhận từ Admin)`,
              reference_number: `REF-${maDonHang}`,
              accumulated_balance: 0,
              order_code: maDonHang
            });
          console.log(`✅ Đã tạo giao dịch SePay đối soát tự động cho đơn hàng ${maDonHang}.`);
        }
      } catch (txErr) {
        console.error("❌ Lỗi tự động tạo giao dịch SePay đối soát:", txErr.message);
      }
    }

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);
    return res.status(500).json({
      error: "Không cập nhật được trạng thái đơn hàng"
    });
  }
});

/* =========================================================
   REVIEWS API - ĐÁNH GIÁ TRẢI NGHIỆM KHÁCH HÀNG
========================================================= */

// 1. GET: Lấy danh sách đánh giá (mapped trường và flat array)
app.get("/api/reviews", async (req, res) => {
  try {
    const all = req.query.all === "1" || req.query.admin === "1";
    let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
    
    if (!all) {
      query = query.eq("hien_thi", true).limit(6);
    }
    
    const { data, error } = await query;
    if (error) throw error;

    const mapped = (data || []).map(r => ({
      id: r.id,
      ma_don_hang: r.order_code,
      so_dien_thoai: r.phone,
      ho_ten: r.customer_name,
      so_sao: r.rating,
      noi_dung: r.comment,
      hien_thi: r.hien_thi,
      created_at: r.created_at
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Lỗi GET /api/reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. POST: Gửi đánh giá mới
app.post("/api/reviews", async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai, ma_don_hang, so_sao, noi_dung } = req.body;
    const orderCode = String(ma_don_hang || req.body.order_code || "").trim();
    
    if (!orderCode) {
      return res.status(400).json({ error: "Chỉ khách đã đặt hàng mới được đánh giá." });
    }

    const { data: order } = await supabase
      .from("don_hang")
      .select("ma_don_hang, so_dien_thoai, ho_ten")
      .eq("ma_don_hang", orderCode)
      .maybeSingle();

    if (!order) {
      return res.status(404).json({ error: "Không tìm thấy đơn hàng hợp lệ." });
    }

    const payload = {
      order_code: orderCode,
      phone: so_dien_thoai || req.body.phone || order.so_dien_thoai || null,
      customer_name: ho_ten || req.body.customer_name || order.ho_ten || "Khách hàng Trung Nguyên Legend",
      rating: Math.max(1, Math.min(5, Number(so_sao || req.body.rating || 5))),
      comment: String(noi_dung || req.body.comment || "").trim(),
      hien_thi: req.body.hien_thi !== false
    };

    if (!payload.comment) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung đánh giá." });
    }

    const { data, error } = await supabase.from("reviews").insert(payload).select("*").single();
    if (error) throw error;

    res.json({ message: "Gửi phản hồi thành công. Cảm ơn ý kiến của bạn!", data });
  } catch (error) {
    console.error("Lỗi POST /api/reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. PATCH: Ẩn/Hiện đánh giá
app.patch("/api/reviews", async (req, res) => {
  try {
    const id = req.body.id || req.query.id;
    const hien_thi = req.body.hien_thi;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID đánh giá." });
    }

    const { data, error } = await supabase
      .from("reviews")
      .update({ hien_thi: hien_thi !== false })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Cập nhật hiển thị thành công!", data });
  } catch (error) {
    console.error("Lỗi PATCH /api/reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE: Xóa đánh giá
app.delete("/api/reviews", async (req, res) => {
  try {
    const id = req.query.id || req.body.id;

    if (!id) {
      return res.status(400).json({ error: "Thiếu ID đánh giá." });
    }

    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Xóa đánh giá thành công!", data });
  } catch (error) {
    console.error("Lỗi DELETE /api/reviews:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  console.log(`API đang chạy tại http://localhost:${PORT}`);
  await initDatabase();
});
