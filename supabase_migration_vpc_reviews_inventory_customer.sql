-- VPC migration: reviews, inventory, customer enrichment
-- Chạy trong Supabase SQL Editor trước khi deploy code mới.

alter table if exists public.san_pham_merchandise
  add column if not exists ton_kho integer not null default 0;

alter table if exists public.san_pham_do_uong
  add column if not exists ton_kho integer;

alter table if exists public.thong_tin_khach_hang
  add column if not exists email text,
  add column if not exists mon_hay_order text,
  add column if not exists nhan_khuyen_mai_email boolean not null default false,
  add column if not exists tong_so_don integer not null default 0,
  add column if not exists tong_chi_tieu numeric not null default 0,
  add column if not exists lan_mua_gan_nhat timestamptz;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_code text not null,
  phone text,
  customer_name text,
  rating integer not null default 5 check (rating between 1 and 5),
  comment text not null,
  hien_thi boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_order_code on public.reviews(order_code);
create index if not exists idx_reviews_visible_created_at on public.reviews(hien_thi, created_at desc);

-- Nếu dùng RLS, nên quản lý quyền qua service role ở API route.
-- Không public insert trực tiếp từ frontend.
