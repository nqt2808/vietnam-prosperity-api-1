require("dotenv").config();

const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString("utf8");
  }
}));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Tọa độ quán Trung Nguyên Legend Âu Lạc
const STORE_LAT = 16.4512064;
const STORE_LNG = 107.6117266;

console.log("Đang kết nối Supabase:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);

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

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { trang_thai } = req.body;

    if (!trang_thai) {
      return res.status(400).json({ message: "Thiếu trạng thái đơn hàng" });
    }

    const { data, error } = await supabase
      .from("don_hang")
      .update({ trang_thai })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", data });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Lỗi cập nhật trạng thái đơn hàng", error: error.message });
  }
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
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY || "";
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
  const match = String(text || "").match(/VPC-DH-[0-9]{8}-[0-9]{6}/i);
  return match ? match[0].toUpperCase() : "";
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
      return res.status(401).json({ ok: false, message: "Webhook không hợp lệ." });
    }

    const { orderCode, amount, content } = extractSepayTransaction(req.body);

    if (!orderCode) {
      return res.status(200).json({
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
        trang_thai: "da_chuyen_khoan",
        ghi_chu: nextNote
      })
      .eq("id", order.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return res.json({
      ok: true,
      message: "SePay webhook đã xác nhận thanh toán.",
      orderCode,
      amount,
      order: updated
    });
  } catch (error) {
    console.error("Lỗi SePay webhook:", error);
    return res.status(500).json({ ok: false, error: error.message });
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
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function loadIndexKnowledge() {
  const now = Date.now();
  if (cachedIndexKnowledge.text && now - cachedIndexKnowledge.loadedAt < 60_000) {
    return cachedIndexKnowledge;
  }

  const candidates = [
    path.join(process.cwd(), "index.html"),
    path.join(process.cwd(), "public", "index.html"),
    path.join(__dirname, "index.html"),
    path.join(__dirname, "public", "index.html")
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, "utf8");
      cachedIndexKnowledge = {
        loadedAt: now,
        source: filePath,
        text: htmlToKnowledgeText(html).slice(0, 50000)
      };
      return cachedIndexKnowledge;
    }
  }

  cachedIndexKnowledge = { loadedAt: now, source: "", text: "" };
  return cachedIndexKnowledge;
}

function buildKeywords(question) {
  const stopWords = new Set([
    "toi", "minh", "ban", "may", "tao", "cho", "hoi", "co", "khong", "la", "gi", "nao", "nhung", "cac", "mot", "cua", "ve", "va", "o", "tai", "tu", "duoc", "khach", "hang", "xin", "chao"
  ]);

  return removeVietnameseTones(question)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 3 && !stopWords.has(s))
    .slice(0, 12);
}

function findIndexSnippets(question, indexText) {
  const keywords = buildKeywords(question);
  if (!indexText || !keywords.length) return [];

  const rawSentences = String(indexText)
    .split(/(?<=[.!?。！？])\s+|\s{2,}/)
    .map(s => s.trim())
    .filter(s => s.length >= 25 && s.length <= 500);

  const scored = rawSentences.map(sentence => {
    const normalized = removeVietnameseTones(sentence);
    let score = 0;
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) score += 1;
    }
    return { sentence, score };
  }).filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score || a.sentence.length - b.sentence.length);
  return scored.slice(0, 8).map(item => item.sentence);
}

async function buildKeywordFallbackContext(question) {
  const keywords = buildKeywords(question);
  if (!keywords.length) return "";

  const [drinkResult, merchResult, categoryResult] = await Promise.allSettled([
    supabase.from("san_pham_do_uong").select("ten_san_pham, mo_ta, gia_den, gia_sua, hien_thi").eq("hien_thi", true).limit(100),
    supabase.from("san_pham_merchandise").select("ten_san_pham, mo_ta, gia, hien_thi").eq("hien_thi", true).limit(100),
    supabase.from("danh_muc_san_pham").select("ten_danh_muc, mo_ta, loai, hien_thi").eq("hien_thi", true).limit(100)
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

  const matched = rows.filter(row => {
    const normalized = removeVietnameseTones(row);
    return keywords.some(keyword => normalized.includes(keyword));
  }).slice(0, 12);

  if (!matched.length) return "";
  return `Không tìm thấy thông tin rõ trong index.html. Dữ liệu tìm theo từ khóa trong Supabase:\n- ${matched.join("\n- ")}`;
}

async function buildWebsiteContextForAi(question, extraContext) {
  const indexKnowledge = loadIndexKnowledge();
  const snippets = findIndexSnippets(question, indexKnowledge.text);

  const parts = [];
  if (extraContext) parts.push(`Ngữ cảnh frontend gửi lên: ${extraContext}`);

  if (indexKnowledge.source) {
    parts.push(`Nguồn index đang đọc: ${indexKnowledge.source}`);
  }

  if (snippets.length) {
    parts.push(`Thông tin tìm thấy trong index.html:\n- ${snippets.join("\n- ")}`);
  } else {
    const fallback = await buildKeywordFallbackContext(question);
    if (fallback) parts.push(fallback);
    else parts.push("Không tìm thấy thông tin phù hợp trong index.html hoặc dữ liệu từ khóa. Hãy trả lời an toàn, không bịa; nếu cần thì hướng khách gọi 038 972 6999.");
  }

  parts.push("Thông tin cố định: Quán Trung Nguyên Legend Âu Lạc / Vietnam Prosperity Coffee. SĐT 038 972 6999. Thanh toán VietinBank, STK 101882692631, chủ tài khoản NGO QUYNH TRANG.");
  return parts.join("\n\n").slice(0, 14000);
}

function stripUnsafeHtml(text) {
  return String(text || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

function buildAiSystemPrompt(context) {
  return `Bạn là Trang, trợ lý tư vấn khách hàng của Vietnam Prosperity Coffee / Trung Nguyên Legend Âu Lạc.\n`
    + `Trả lời bằng tiếng Việt, thân thiện, ngắn gọn, ưu tiên tư vấn món, đặt hàng, thanh toán SePay/VietinBank, tra cứu đơn, địa chỉ và khuyến mãi.\n`
    + `Không bịa thông tin ngoài ngữ cảnh. Nếu không chắc, hướng khách gọi 038 972 6999.\n`
    + `Thông tin website: ${context || "Không có ngữ cảnh bổ sung."}`;
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
  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: buildAiSystemPrompt(context) },
        { role: "user", content: String(question || "") }
      ],
      temperature: 0.4,
      max_output_tokens: 700
    })
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "OpenAI API lỗi");
  return result.output_text || result.output?.flatMap(o => o.content || []).map(c => c.text || "").join("\n").trim() || "";
}


// Code này tạo alias để frontend cũ gọi /api/chat vẫn chạy như /api/chat-ai
app.post("/api/chat", (req, res, next) => {
  req.url = "/api/chat-ai";
  next();
});

// Code này cho chatbox gọi AI qua backend, ưu tiên Gemini rồi tới ChatGPT
app.post("/api/chat-ai", async (req, res) => {
  try {
    const { question, message, context } = req.body || {};
    const userQuestion = String(question || message || "").trim();

    if (!userQuestion) {
      return res.status(400).json({ error: "Thiếu câu hỏi." });
    }

    const websiteContext = await buildWebsiteContextForAi(userQuestion, context);

    let answer = "";
    let provider = "local";

    if (process.env.AI_PROVIDER === "openai" && process.env.OPENAI_API_KEY) {
      provider = "openai";
      answer = await askOpenAI(userQuestion, websiteContext);
    } else if (process.env.GEMINI_API_KEY) {
      provider = "gemini";
      answer = await askGemini(userQuestion, websiteContext);
    } else if (process.env.OPENAI_API_KEY) {
      provider = "openai";
      answer = await askOpenAI(userQuestion, websiteContext);
    } else {
      answer = "Trang đã nhận được câu hỏi của bạn. Hiện backend chưa cấu hình GEMINI_API_KEY hoặc OPENAI_API_KEY, bạn vui lòng gọi 038 972 6999 nếu cần hỗ trợ nhanh.";
    }

    return res.json({
      provider,
      reply: stripUnsafeHtml(answer),
      knowledgeSource: websiteContext.includes("Thông tin tìm thấy trong index.html") ? "index.html" : "keyword-fallback"
    });
  } catch (error) {
    console.error("Lỗi /api/chat-ai:", error);
    return res.status(500).json({
      provider: "error",
      reply: "Trang chưa kết nối được AI lúc này. Bạn thử lại sau hoặc gọi 038 972 6999 nhé.",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`API đang chạy tại http://localhost:${PORT}`);
});
