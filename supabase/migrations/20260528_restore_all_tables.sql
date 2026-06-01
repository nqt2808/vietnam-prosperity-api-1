-- ══════════════════════════════════════════════════════════════════════
-- KHÔI PHỤC TOÀN BỘ SCHEMA + DATA CHO WEBSITE VIETNAM PROSPERITY COFFEE
-- Chạy file này trong Supabase SQL Editor để phục hồi đầy đủ 5 bảng chính
-- Ngày tạo: 2026-05-28
-- ══════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════
-- BẢNG 1: danh_muc_san_pham
-- Lưu trữ các danh mục sản phẩm (đồ uống + vật phẩm)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.danh_muc_san_pham (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_danh_muc     TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  mo_ta            TEXT,
  hinh_anh         TEXT,
  thu_tu_hien_thi  INT DEFAULT 0,
  hien_thi         BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Bật RLS
ALTER TABLE public.danh_muc_san_pham ENABLE ROW LEVEL SECURITY;

-- Policy: Đọc công khai
DROP POLICY IF EXISTS "Public read danh_muc_san_pham" ON public.danh_muc_san_pham;
CREATE POLICY "Public read danh_muc_san_pham"
  ON public.danh_muc_san_pham FOR SELECT USING (hien_thi = TRUE);

-- Policy: Admin toàn quyền
DROP POLICY IF EXISTS "Admin all danh_muc_san_pham" ON public.danh_muc_san_pham;
CREATE POLICY "Admin all danh_muc_san_pham"
  ON public.danh_muc_san_pham FOR ALL USING (TRUE);

-- ─── DỮ LIỆU: danh_muc_san_pham ────────────────────────────────────
INSERT INTO public.danh_muc_san_pham (ten_danh_muc, slug, mo_ta, thu_tu_hien_thi, hien_thi)
VALUES
  ('Cà phê phin',       'ca-phe-phin',       'Các dòng cà phê phin năng lượng truyền thống đặc trưng của Trung Nguyên Legend.', 1, TRUE),
  ('Cà phê máy',        'ca-phe-may',        'Các dòng cà phê máy espresso, latte, cappuccino, americano hiện đại.', 2, TRUE),
  ('Cà phê đặc biệt',   'ca-phe-dac-biet',   'Các dòng cà phê signature độc đáo: muối, cốt dừa, trứng...', 3, TRUE),
  ('Trà và Trà sữa',    'tra-va-tra-sua',     'Các dòng trà thảo mộc, trà sữa, trà hoa thanh nhiệt và giải khát.', 4, TRUE),
  ('Đá xay & Sinh tố',  'da-xay-sinh-to',    'Đá xay mát lạnh, sinh tố trái cây tươi nguyên chất.', 5, TRUE),
  ('Nước ép & Thanh nhiệt', 'nuoc-ep-thanh-nhiet', 'Các loại nước ép trái cây tươi và thức uống thanh nhiệt bổ dưỡng.', 6, TRUE),
  ('Bánh & Thực dưỡng', 'banh-thuc-duong',   'Bánh ngọt, bánh mặn và các món ăn thực dưỡng kết hợp cùng cà phê.', 7, TRUE),
  ('Vật phẩm',          'merchandise',       'Dụng cụ pha chế, ly tách lưu niệm và cà phê hạt/hộp đặc sản Trung Nguyên Legend.', 8, TRUE)
ON CONFLICT (slug) DO UPDATE SET
  ten_danh_muc = EXCLUDED.ten_danh_muc,
  mo_ta = EXCLUDED.mo_ta,
  thu_tu_hien_thi = EXCLUDED.thu_tu_hien_thi,
  hien_thi = EXCLUDED.hien_thi;


-- ════════════════════════════════════════════════════════════
-- BẢNG 2: san_pham_do_uong
-- Lưu trữ toàn bộ sản phẩm đồ uống tại quầy
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.san_pham_do_uong (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_san_pham TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  mo_ta        TEXT,
  gia_den      DECIMAL(12,2),   -- Giá đen đá
  gia_sua      DECIMAL(12,2),   -- Giá sữa đá
  danh_muc_id  UUID REFERENCES public.danh_muc_san_pham(id) ON DELETE SET NULL,
  hien_thi     BOOLEAN DEFAULT TRUE,
  la_noi_bat   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_do_uong_danh_muc ON public.san_pham_do_uong(danh_muc_id);
CREATE INDEX IF NOT EXISTS idx_do_uong_slug ON public.san_pham_do_uong(slug);

-- RLS
ALTER TABLE public.san_pham_do_uong ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read san_pham_do_uong" ON public.san_pham_do_uong;
CREATE POLICY "Public read san_pham_do_uong"
  ON public.san_pham_do_uong FOR SELECT USING (hien_thi = TRUE);

DROP POLICY IF EXISTS "Admin all san_pham_do_uong" ON public.san_pham_do_uong;
CREATE POLICY "Admin all san_pham_do_uong"
  ON public.san_pham_do_uong FOR ALL USING (TRUE);

-- ─── DỮ LIỆU: san_pham_do_uong ────────────────────────────────────
DO $$
DECLARE
  v_phin_id      UUID;
  v_may_id       UUID;
  v_dac_biet_id  UUID;
  v_tra_id       UUID;
  v_da_xay_id    UUID;
  v_nuoc_ep_id   UUID;
BEGIN
  SELECT id INTO v_phin_id      FROM public.danh_muc_san_pham WHERE slug = 'ca-phe-phin'       LIMIT 1;
  SELECT id INTO v_may_id       FROM public.danh_muc_san_pham WHERE slug = 'ca-phe-may'        LIMIT 1;
  SELECT id INTO v_dac_biet_id  FROM public.danh_muc_san_pham WHERE slug = 'ca-phe-dac-biet'  LIMIT 1;
  SELECT id INTO v_tra_id       FROM public.danh_muc_san_pham WHERE slug = 'tra-va-tra-sua'    LIMIT 1;
  SELECT id INTO v_da_xay_id    FROM public.danh_muc_san_pham WHERE slug = 'da-xay-sinh-to'   LIMIT 1;
  SELECT id INTO v_nuoc_ep_id   FROM public.danh_muc_san_pham WHERE slug = 'nuoc-ep-thanh-nhiet' LIMIT 1;

  -- == CÀ PHÊ PHIN ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Cà phê phin năng lượng tư duy', 'ca-phe-phin-nang-luong-tu-duy',
     'Cà phê phin đặc sánh đậm đà, được pha bằng hạt Robusta hảo hạng Trung Nguyên Legend.', 35000, 40000, v_phin_id, TRUE, TRUE),
    ('Success sữa đá / đá viên', 'success-sua-da',
     'Cà phê Success phin giấy hòa tan tiện lợi, thơm ngon đậm vị truyền thống.', 35000, 40000, v_phin_id, TRUE, FALSE),
    ('Cà phê bạc xỉu', 'ca-phe-bac-xiu',
     'Bạc xỉu – ít cà phê nhiều sữa tươi đường, dành cho người thích vị ngọt nhẹ nhàng.', 35000, 40000, v_phin_id, TRUE, FALSE),
    ('Cà phê đen nóng', 'ca-phe-den-nong',
     'Cà phê đen nguyên chất pha phin truyền thống, nóng ấm đậm đà hương vị cổ điển.', 30000, NULL, v_phin_id, TRUE, FALSE),
    ('Item test', 'item-test',
     'Sản phẩm test nhanh.', 1000, NULL, v_phin_id, TRUE, FALSE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    gia_sua = EXCLUDED.gia_sua,
    hien_thi = EXCLUDED.hien_thi;

  -- == CÀ PHÊ MÁY ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Espresso', 'espresso',
     'Espresso chuẩn vị Ý – cô đặc, đậm đà, crema vàng óng.', 45000, NULL, v_may_id, TRUE, FALSE),
    ('Americano', 'americano',
     'Espresso pha loãng với nước nóng, nhẹ hơn nhưng vẫn giữ trọn hương cà phê.', 50000, NULL, v_may_id, TRUE, FALSE),
    ('Latte', 'latte',
     'Espresso hòa quyện với sữa nóng foam mịn, vị béo nhẹ thanh lịch.', 55000, NULL, v_may_id, TRUE, FALSE),
    ('Cappuccino Yến Mạch', 'cappuccino-yen-mach',
     'Cappuccino kết hợp sữa yến mạch thơm béo bùi, lành mạnh và tinh tế.', 60000, NULL, v_may_id, TRUE, TRUE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    gia_sua = EXCLUDED.gia_sua,
    hien_thi = EXCLUDED.hien_thi;

  -- == CÀ PHÊ ĐẶC BIỆT (SIGNATURE) ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Cà phê muối Legend', 'ca-phe-muoi-legend',
     'Signature đặc trưng – kem muối béo ngậy phủ lên lớp cà phê đậm đà, vị lạ mà nghiện.', 55000, 60000, v_dac_biet_id, TRUE, TRUE),
    ('Cà phê cốt dừa', 'ca-phe-cot-dua',
     'Cà phê kết hợp cốt dừa tươi béo ngậy thơm lừng, vị nhiệt đới đặc sắc.', 55000, 60000, v_dac_biet_id, TRUE, TRUE),
    ('Cà phê trứng', 'ca-phe-trung',
     'Cà phê trứng truyền thống Hà Nội – lớp kem trứng mịn mượt ngọt ngào phủ lên nền cà phê đậm đà.', 55000, 60000, v_dac_biet_id, TRUE, FALSE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    gia_sua = EXCLUDED.gia_sua,
    hien_thi = EXCLUDED.hien_thi;

  -- == TRÀ & TRÀ SỮA ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Trà lá nếp sen vàng', 'tra-la-nep-sen-vang',
     'Trà lá nếp thơm bùi, hạt sen vàng bổ dưỡng – thức uống thanh mát đặc trưng.', 55000, NULL, v_tra_id, TRUE, TRUE),
    ('Trà đào cam sả', 'tra-dao-cam-sa',
     'Trà đào thơm ngọt, cam vàng chua dịu, sả gừng the mát – giải nhiệt hoàn hảo.', 55000, NULL, v_tra_id, TRUE, FALSE),
    ('Trà hoa cúc Chamomile', 'tra-hoa-cuc-chamomile',
     'Trà hoa cúc nhẹ nhàng thư giãn, hương thơm tinh tế, an thần tự nhiên.', 50000, NULL, v_tra_id, TRUE, FALSE),
    ('Trà xanh thạch cà phê', 'tra-xanh-thach-ca-phe',
     'Trà xanh mát lạnh kết hợp thạch cà phê đen giòn sần sật – vị tỉnh thức mới lạ.', 55000, NULL, v_tra_id, TRUE, FALSE),
    ('Trà vải hoa hồng', 'tra-vai-hoa-hong',
     'Trà vải ngọt thơm hòa quyện cùng hoa hồng tươi kiều diễm, vị nữ tính tinh tế.', 55000, NULL, v_tra_id, TRUE, FALSE),
    ('Chanh sả gừng hạt chia', 'chanh-sa-gung-hat-chia',
     'Chanh tươi chua dịu, sả gừng ấm nóng, hạt chia bổ dưỡng – giải nhiệt tốt nhất mùa hè.', 50000, NULL, v_tra_id, TRUE, FALSE),
    ('Hibiscus chanh dây hạt chia', 'hibiscus-chanh-day-hat-chia',
     'Hoa Hibiscus đỏ rực chua ngọt, chanh dây nhiệt đới và hạt chia thanh lọc cơ thể.', 55000, NULL, v_tra_id, TRUE, FALSE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    hien_thi = EXCLUDED.hien_thi;

  -- == ĐÁ XAY & SINH TỐ ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Trà xanh đá xay', 'tra-xanh-da-xay',
     'Trà xanh matcha xay nhuyễn mịn cùng đá bào, ngọt lạnh thơm mịn mát lạnh cực đã.', 60000, NULL, v_da_xay_id, TRUE, FALSE),
    ('Kim quất đá xay', 'kim-quat-da-xay',
     'Kim quất tươi chua ngọt sắc nét, xay cùng đá bào mát lạnh – giải khát đỉnh cao.', 60000, NULL, v_da_xay_id, TRUE, FALSE),
    ('Cà phê đá xay', 'ca-phe-da-xay',
     'Cà phê Trung Nguyên xay nhuyễn cùng đá bào kem sữa – mát lạnh mà vẫn đậm đà năng lượng.', 65000, NULL, v_da_xay_id, TRUE, FALSE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    hien_thi = EXCLUDED.hien_thi;

  -- == NƯỚC ÉP & THANH NHIỆT ==
  INSERT INTO public.san_pham_do_uong (ten_san_pham, slug, mo_ta, gia_den, gia_sua, danh_muc_id, hien_thi, la_noi_bat)
  VALUES
    ('Nước ép cam tươi', 'nuoc-ep-cam-tuoi',
     'Cam vàng tươi vắt nguyên chất, giàu vitamin C, ngọt chua tự nhiên thanh sảng.', 55000, NULL, v_nuoc_ep_id, TRUE, FALSE),
    ('Nước ép dưa hấu', 'nuoc-ep-dua-hau',
     'Dưa hấu đỏ tươi ép nguyên chất, ngọt mát tự nhiên, giải nhiệt mùa hè tức thì.', 50000, NULL, v_nuoc_ep_id, TRUE, FALSE),
    ('Soda chanh dây', 'soda-chanh-day',
     'Soda bong bóng sảng khoái hòa quyện với chanh dây nhiệt đới chua ngọt dễ chịu.', 50000, NULL, v_nuoc_ep_id, TRUE, FALSE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia_den = EXCLUDED.gia_den,
    hien_thi = EXCLUDED.hien_thi;

END $$;


-- ════════════════════════════════════════════════════════════
-- BẢNG 3: san_pham_merchandise
-- Lưu trữ vật phẩm, cà phê gói, dụng cụ pha chế, quà tặng
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.san_pham_merchandise (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_san_pham TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  mo_ta        TEXT,
  gia          DECIMAL(12,2) NOT NULL,
  danh_muc_id  UUID REFERENCES public.danh_muc_san_pham(id) ON DELETE SET NULL,
  hinh_anh     TEXT,
  hien_thi     BOOLEAN DEFAULT TRUE,
  la_noi_bat   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_merchandise_danh_muc ON public.san_pham_merchandise(danh_muc_id);
CREATE INDEX IF NOT EXISTS idx_merchandise_slug ON public.san_pham_merchandise(slug);

-- RLS
ALTER TABLE public.san_pham_merchandise ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read san_pham_merchandise" ON public.san_pham_merchandise;
CREATE POLICY "Public read san_pham_merchandise"
  ON public.san_pham_merchandise FOR SELECT USING (hien_thi = TRUE);

DROP POLICY IF EXISTS "Admin all san_pham_merchandise" ON public.san_pham_merchandise;
CREATE POLICY "Admin all san_pham_merchandise"
  ON public.san_pham_merchandise FOR ALL USING (TRUE);

-- ─── DỮ LIỆU: san_pham_merchandise ────────────────────────────────
DO $$
DECLARE
  v_merch_id UUID;
BEGIN
  SELECT id INTO v_merch_id FROM public.danh_muc_san_pham WHERE slug = 'merchandise' LIMIT 1;

  INSERT INTO public.san_pham_merchandise (ten_san_pham, slug, mo_ta, gia, danh_muc_id, hinh_anh, hien_thi)
  VALUES
    ('Sữa đặc có đường Brothers', 'sua-dac-co-duong-brothers',
     'Sữa đặc có đường Brothers thơm béo dẻo ngọt, chuyên dùng pha chế cà phê chuẩn vị.',
     29000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/Sua-dac-EC-2.png', TRUE),

    ('Khăn rằn', 'khan-ran',
     'Khăn rằn truyền thống Trung Nguyên Legend, biểu tượng của tinh thần dấn thân.',
     65000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/khan-LE.png', TRUE),

    ('Túi Vải Trung Nguyên Legend – Bộ Sưu Tập 3 Nền Văn Minh', 'tui-vai-3-nen-van-minh',
     'Túi vải Canvas cao cấp thiết kế theo Bộ sưu tập 3 Nền Văn Minh Cà Phê tinh hoa.',
     75000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/10/TNL_TUI-CANVAS-ROMAN-600x600.png', TRUE),

    ('Sổ tay Legend', 'so-tay-legend',
     'Sổ tay ghi chép Legend cao cấp in logo và các câu nói truyền cảm hứng sáng tạo.',
     125000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/So-tay-LE.png', TRUE),

    ('Ly Sứ Legend VIP Đen – 350ml', 'ly-su-legend-vip-den',
     'Ly sứ cao cấp màu đen bóng in logo Trung Nguyên Legend sắc sảo.',
     145000, v_merch_id, 'https://cafe.net.vn/media/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/6/0/6003796.jpg', TRUE),

    ('Bộ Tách Sứ Đen Trung Nguyên Legend – 300ml', 'bo-tach-su-den-300ml',
     'Bộ tách và đĩa sứ cao cấp màu đen Trung Nguyên Legend 300ml.',
     195000, v_merch_id, 'https://down-cvs-vn.img.susercontent.com/vn-11134517-7ras8-md45myo8th0cdd', TRUE),

    ('Ly Giữ Nhiệt VF214 – 350ml', 'ly-giu-nhiet-vf214-350ml',
     'Ly giữ nhiệt inox cao cấp 350ml màu đen nhám, nắp đậy chống tràn.',
     210000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/09/Ly-Giu-Nhiet-VF214-%E2%80%93-350ml-mau-den-2.png', TRUE),

    ('Bình Giữ Nhiệt Bao Da – 350ml', 'binh-giu-nhiet-bao-da-350ml',
     'Bình giữ nhiệt bọc bao da cao cấp 350ml, thiết kế sang trọng lịch lãm.',
     290000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2024/01/BGN-bao-da-LE.png', TRUE),

    ('Bình Giữ Nhiệt Màu Trắng', 'binh-giu-nhiet-mau-trang',
     'Bình giữ nhiệt kim loại màu trắng sang trọng, logo in sắc sảo, giữ nhiệt cực tốt.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Binh-giu-nhiet_WhiteCan-600x600.jpg', TRUE),

    ('Bình Giữ Nhiệt Màu Đen', 'binh-giu-nhiet-mau-den',
     'Bình giữ nhiệt kim loại màu đen nhám huyền bí, logo in mạnh mẽ, giữ nhiệt cực tốt.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2020/08/100758914_2825508094213680_4039200829587062784_n.jpg', TRUE),

    ('Bình Giữ Nhiệt Màu Xám', 'binh-giu-nhiet-mau-xam',
     'Bình giữ nhiệt kim loại màu xám tinh tế, logo in sắc sảo, giữ nhiệt cực tốt.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2021/11/Gray-600x600.jpg', TRUE),

    ('Bình Giữ Nhiệt – Thiền', 'binh-giu-nhiet-thien',
     'Bình giữ nhiệt phiên bản văn minh cà phê Thiền tĩnh lặng, mộc mạc.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-thien.png', TRUE),

    ('Bình Giữ Nhiệt – Roman', 'binh-giu-nhiet-roman',
     'Bình giữ nhiệt phiên bản văn minh cà phê Roman tinh xảo, hiện đại.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-roman.png', TRUE),

    ('Bình Giữ Nhiệt – Ottoman', 'binh-giu-nhiet-ottoman',
     'Bình giữ nhiệt phiên bản văn minh cà phê Ottoman độc đáo, huyền bí.',
     350000, v_merch_id, 'https://trungnguyenlegendcafe.net/wp-content/uploads/2025/04/TNL_BGN-Ottoman-1.png', TRUE)
  ON CONFLICT (slug) DO UPDATE SET
    ten_san_pham = EXCLUDED.ten_san_pham,
    mo_ta = EXCLUDED.mo_ta,
    gia = EXCLUDED.gia,
    hinh_anh = EXCLUDED.hinh_anh,
    hien_thi = EXCLUDED.hien_thi;
END $$;


-- ════════════════════════════════════════════════════════════
-- BẢNG 4: thong_tin_khach_hang
-- Lưu trữ thông tin khách hàng khi đặt đơn
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.thong_tin_khach_hang (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ho_ten         TEXT NOT NULL,
  so_dien_thoai  TEXT NOT NULL,
  email          TEXT,
  dia_chi        TEXT,
  ghi_chu        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_khach_hang_sdt ON public.thong_tin_khach_hang(so_dien_thoai);

-- RLS
ALTER TABLE public.thong_tin_khach_hang ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all thong_tin_khach_hang" ON public.thong_tin_khach_hang;
CREATE POLICY "Admin all thong_tin_khach_hang"
  ON public.thong_tin_khach_hang FOR ALL USING (TRUE);


-- ════════════════════════════════════════════════════════════
-- BẢNG 5: don_hang
-- Lưu trữ toàn bộ đơn hàng của khách
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.don_hang (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  khach_hang_id         UUID REFERENCES public.thong_tin_khach_hang(id) ON DELETE SET NULL,
  ma_don_hang           TEXT UNIQUE NOT NULL,
  danh_sach_san_pham    TEXT,         -- Chuỗi: "Cà phê muối x2 - 90000; Trà đào x1 - 55000"
  tong_tien             DECIMAL(12,2) NOT NULL,
  phi_ship              DECIMAL(12,2) DEFAULT 0,
  khoang_cach_km        DECIMAL(5,2)  DEFAULT 0,
  hinh_thuc_nhan_hang   TEXT DEFAULT 'delivery' CHECK (hinh_thuc_nhan_hang IN ('delivery', 'pickup')),
  phuong_thuc_thanh_toan TEXT DEFAULT 'tien_mat' CHECK (phuong_thuc_thanh_toan IN ('chuyen_khoan', 'tien_mat')),
  dia_chi_giao_hang     JSONB,        -- JSON: {name, phone, email, address, distance, delivery_type}
  ghi_chu               TEXT,
  trang_thai            TEXT DEFAULT 'da_dat_don',
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_don_hang_ma ON public.don_hang(ma_don_hang);
CREATE INDEX IF NOT EXISTS idx_don_hang_khach ON public.don_hang(khach_hang_id);
CREATE INDEX IF NOT EXISTS idx_don_hang_trang_thai ON public.don_hang(trang_thai);

-- RLS
ALTER TABLE public.don_hang ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin all don_hang" ON public.don_hang;
CREATE POLICY "Admin all don_hang"
  ON public.don_hang FOR ALL USING (TRUE);

-- Realtime: bật realtime cho bảng don_hang (cần cho payment listener)
ALTER PUBLICATION supabase_realtime ADD TABLE public.don_hang;

-- ════════════════════════════════════════════════════════════
-- KIỂM TRA KẾT QUẢ
-- ════════════════════════════════════════════════════════════
SELECT
  'danh_muc_san_pham'   AS bang, COUNT(*) AS so_ban_ghi FROM public.danh_muc_san_pham
UNION ALL SELECT 'san_pham_do_uong',  COUNT(*) FROM public.san_pham_do_uong
UNION ALL SELECT 'san_pham_merchandise', COUNT(*) FROM public.san_pham_merchandise
UNION ALL SELECT 'thong_tin_khach_hang', COUNT(*) FROM public.thong_tin_khach_hang
UNION ALL SELECT 'don_hang',           COUNT(*) FROM public.don_hang;
