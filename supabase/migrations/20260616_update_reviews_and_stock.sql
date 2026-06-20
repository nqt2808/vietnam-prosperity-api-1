-- ══════════════════════════════════════════════════════════════════
-- MIGRATION: THÊM CỘT TỒN KHO VÀ TẠO BẢNG ĐÁNH GIÁ KHÁCH HÀNG (REVIEWS)
-- Ngày tạo: 16/06/2026
-- ══════════════════════════════════════════════════════════════════

-- 1. Thêm cột ton_kho vào bảng san_pham_merchandise nếu chưa tồn tại
ALTER TABLE public.san_pham_merchandise ADD COLUMN IF NOT EXISTS ton_kho INT DEFAULT 10;

-- 2. Tạo bảng danh_gia lưu phản hồi/đánh giá của khách hàng về VPC
CREATE TABLE IF NOT EXISTS public.danh_gia (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ho_ten         TEXT NOT NULL,
  so_dien_thoai  TEXT NOT NULL,
  ma_don_hang    TEXT NOT NULL,
  so_sao         INT NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
  noi_dung       TEXT,
  hien_thi       BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bật bảo mật Row-Level Security (RLS) cho bảng danh_gia
ALTER TABLE public.danh_gia ENABLE ROW LEVEL SECURITY;

-- 4. Tạo các chính sách bảo mật (Policies) cho bảng danh_gia
-- Policy: Cho phép mọi người xem đánh giá được hiển thị
DROP POLICY IF EXISTS "Public read reviews" ON public.danh_gia;
CREATE POLICY "Public read reviews" 
  ON public.danh_gia FOR SELECT USING (hien_thi = TRUE);

-- Policy: Cho phép khách hàng nặc danh gửi đánh giá lên hệ thống
DROP POLICY IF EXISTS "Anon insert reviews" ON public.danh_gia;
CREATE POLICY "Anon insert reviews" 
  ON public.danh_gia FOR INSERT WITH CHECK (TRUE);

-- Policy: Cho phép admin toàn quyền thao tác (Select, Insert, Update, Delete)
DROP POLICY IF EXISTS "Admin manage reviews" ON public.danh_gia;
CREATE POLICY "Admin manage reviews" 
  ON public.danh_gia FOR ALL USING (TRUE);
