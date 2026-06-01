-- ══════════════════════════════════════════════════════════
-- MIGRATION: ĐỒNG BỘ MERCHANDISE THÀNH VẬT PHẨM TRONG SUPABASE
-- ══════════════════════════════════════════════════════════

-- 1. Đổi tên bảng lưu trữ vật phẩm (nếu bảng cũ đang tồn tại và bảng mới chưa có)
ALTER TABLE IF EXISTS public.san_pham_merchandise RENAME TO san_pham_vat_pham;

-- 2. Cập nhật danh mục trong bảng danh_muc_san_pham
-- Thay thế danh mục có slug 'merchandise' thành tên 'Vật phẩm' và slug 'vat-pham'
UPDATE public.danh_muc_san_pham
SET ten_danh_muc = 'Vật phẩm', slug = 'vat-pham'
WHERE slug = 'merchandise';
