-- ══════════════════════════════════════════════════════════════════════
-- KHÔI PHỤC CÁC BẢNG PHỤ (AUXILIARY TABLES)
-- Chỉ restore các bảng phụ - KHÔNG đụng tới 5 bảng chính
-- Bảng chính vẫn còn: danh_muc_san_pham, san_pham_do_uong,
--   san_pham_merchandise, don_hang, thong_tin_khach_hang
-- Ngày tạo: 2026-05-28
-- ══════════════════════════════════════════════════════════════════════

-- ════════════════════════════════════════════════════════════
-- 1. profiles (mở rộng từ auth.users)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  address     TEXT,
  city        TEXT,
  district    TEXT,
  role        TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for profiles" ON public.profiles;
CREATE POLICY "Allow public read for profiles"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users to update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ════════════════════════════════════════════════════════════
-- 2. categories (bảng danh mục cũ - giữ để tương thích fallback)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for active categories" ON public.categories;
CREATE POLICY "Allow public read for active categories"
  ON public.categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow admin all access on categories" ON public.categories;
CREATE POLICY "Allow admin all access on categories"
  ON public.categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ════════════════════════════════════════════════════════════
-- 3. products (bảng sản phẩm cũ - giữ để tương thích fallback)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  short_description TEXT,
  price             DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price  DECIMAL(12,2),
  stock_quantity    INT DEFAULT 0,
  category_id       UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),
  is_featured       BOOLEAN DEFAULT FALSE,
  tags              TEXT[],
  metadata          JSONB DEFAULT '{}',
  avg_rating        DECIMAL(2,1) DEFAULT 0,
  review_count      INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status   ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for active products" ON public.products;
CREATE POLICY "Allow public read for active products"
  ON public.products FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Allow admin all access on products" ON public.products;
CREATE POLICY "Allow admin all access on products"
  ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ════════════════════════════════════════════════════════════
-- 4. product_images
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for product images" ON public.product_images;
CREATE POLICY "Allow public read for product images"
  ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin all access on product images" ON public.product_images;
CREATE POLICY "Allow admin all access on product images"
  ON public.product_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ════════════════════════════════════════════════════════════
-- 5. orders (bảng đơn hàng cũ - giữ cho fallback tra cứu)
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES auth.users(id),
  order_number     TEXT UNIQUE NOT NULL,
  status           TEXT DEFAULT 'pending',
  subtotal         DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_fee     DECIMAL(12,2) DEFAULT 0,
  discount_amount  DECIMAL(12,2) DEFAULT 0,
  total            DECIMAL(12,2) NOT NULL DEFAULT 0,
  payment_method   TEXT,
  payment_status   TEXT DEFAULT 'unpaid',
  shipping_address JSONB,
  note             TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user   ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin all access on orders" ON public.orders;
CREATE POLICY "Allow admin all access on orders"
  ON public.orders FOR ALL USING (TRUE);

-- ════════════════════════════════════════════════════════════
-- 6. order_items
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name      TEXT NOT NULL,
  price_at_purchase DECIMAL(12,2) NOT NULL,
  quantity          INT NOT NULL CHECK (quantity > 0),
  image_url         TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow admin all access on order items" ON public.order_items;
CREATE POLICY "Allow admin all access on order items"
  ON public.order_items FOR ALL USING (TRUE);

-- ════════════════════════════════════════════════════════════
-- 7. reviews
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read for approved reviews" ON public.reviews;
CREATE POLICY "Allow public read for approved reviews"
  ON public.reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Allow logged-in users to create reviews" ON public.reviews;
CREATE POLICY "Allow logged-in users to create reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admin all access on reviews" ON public.reviews;
CREATE POLICY "Allow admin all access on reviews"
  ON public.reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ════════════════════════════════════════════════════════════
-- 8. wishlist_items
-- ════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow users to view own wishlist" ON public.wishlist_items;
CREATE POLICY "Allow users to view own wishlist"
  ON public.wishlist_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to manage own wishlist" ON public.wishlist_items;
CREATE POLICY "Allow users to manage own wishlist"
  ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════
-- 9. Trigger tự động tạo profile khi có user mới đăng ký
-- ════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ════════════════════════════════════════════════════════════
-- KIỂM TRA KẾT QUẢ
-- ════════════════════════════════════════════════════════════
SELECT table_name, 'restored' AS status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'profiles', 'categories', 'products', 'product_images',
    'orders', 'order_items', 'reviews', 'wishlist_items'
  )
ORDER BY table_name;
