-- ══════════════════════════════════════════════════════════════════
-- MIGRATION: THÊM CỘT TỒN KHO VÀO BẢNG SAN_PHAM_DO_UONG
-- Ngày tạo: 19/06/2026
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE public.san_pham_do_uong ADD COLUMN IF NOT EXISTS ton_kho INT DEFAULT 99;
