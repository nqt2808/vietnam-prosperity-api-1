-- ══════════════════════════════════════════════════════════════════
-- MIGRATION: ĐỔI TÊN CỘT STOCK_QUANTITY THÀNH TON_KHO TRONG BẢNG PRODUCTS
-- Ngày tạo: 16/06/2026
-- ══════════════════════════════════════════════════════════════════

ALTER TABLE public.products RENAME COLUMN stock_quantity TO ton_kho;
