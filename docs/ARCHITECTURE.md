# 🏗️ ARCHITECTURE — Website VPC

> **Stack**: Next.js 16 · Supabase · React 19.2 · TypeScript · Tailwind CSS v4
> **Kiểu dự án**: Website quảng bá / Thương mại điện tử
> **Cập nhật**: 2026-05-22

---

## 1. Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│  React 19.2 │ View Transitions │ Zustand (Cart/UI State)   │
└──────────────────────────┬──────────────────────────────────┘
                           │ SSR / RSC / Server Actions
┌──────────────────────────▼──────────────────────────────────┐
│                    NEXT.JS 16 SERVER                        │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  proxy.ts   │  │   Server     │  │   Server Actions  │  │
│  │ (Auth Guard)│  │  Components  │  │   (Mutations)     │  │
│  └──────┬──────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                │                    │             │
│         ▼                ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            @supabase/ssr (Cookie Sessions)          │   │
│  └─────────────────────────┬───────────────────────────┘   │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                     SUPABASE (Free Tier)                    │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌────────────┐  │
│  │   Auth   │  │ Postgres │  │ Storage │  │   Edge     │  │
│  │  (JWT)   │  │  (500MB) │  │  (1GB)  │  │ Functions  │  │
│  └──────────┘  └──────────┘  └─────────┘  └────────────┘  │
│                     ▲                                       │
│                     │ RLS (Row Level Security)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Core

| Layer | Công nghệ | Phiên bản | Lý do chọn |
|-------|-----------|-----------|-------------|
| Framework | **Next.js** | 16.x | App Router, RSC, Turbopack, `use cache`, `proxy.ts` |
| UI Library | **React** | 19.2 | View Transitions, Activity, React Compiler |
| Language | **TypeScript** | 5.x | Type-safe toàn bộ codebase |
| Bundler | **Turbopack** | Built-in | 2-5x faster builds, 10x faster HMR |

### Backend & Data

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|-------------|
| Database | **Supabase (PostgreSQL)** | Free tier, RLS, realtime, auth tích hợp |
| Auth | **Supabase Auth** | Email/password + OAuth (Google, Facebook) |
| Storage | **Supabase Storage** | Product images, avatars |
| SSR Integration | **@supabase/ssr** | Cookie-based session cho Next.js |

### Frontend

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|-------------|
| Styling | **Tailwind CSS v4** | Utility-first, responsive, dark mode |
| Components | **shadcn/ui** | Headless, accessible, customizable |
| Icons | **Lucide React** | Lightweight, consistent icon set |
| Animations | **Framer Motion** | Micro-interactions, page transitions |
| Fonts | **next/font** | Self-hosted, zero layout shift |

### State & Validation

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|-------------|
| Client State | **Zustand** | Lightweight, persist middleware (cart) |
| URL State | **nuqs** | Type-safe URL search params (filters) |
| Validation | **Zod** | Runtime validation cho forms & Server Actions |

### DevOps

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|-------------|
| Hosting | **Vercel** (Free) | Native Next.js support, edge network |
| CI/CD | **Vercel Git Integration** | Auto deploy on push |
| Linting | **ESLint + Prettier** | Code quality & consistency |
| Git Hooks | **Husky + lint-staged** | Pre-commit quality gates |

---

## 3. Cấu Trúc Thư Mục

```
website-vpc/
│
├── 📁 public/                     # Static assets (favicon, robots.txt)
│
├── 📁 src/
│   ├── 📁 app/                    # ═══ ROUTES (App Router) ═══
│   │   ├── layout.tsx             # Root: providers, fonts, <html>
│   │   ├── page.tsx               # "/" — Landing page
│   │   ├── loading.tsx            # Global Suspense fallback
│   │   ├── error.tsx              # Global error boundary
│   │   ├── not-found.tsx          # 404
│   │   │
│   │   ├── 📁 (marketing)/       # Trang tĩnh quảng bá
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── blog/[slug]/
│   │   │
│   │   ├── 📁 (shop)/            # Cửa hàng
│   │   │   ├── products/
│   │   │   ├── categories/[slug]/
│   │   │   ├── cart/
│   │   │   └── checkout/
│   │   │
│   │   ├── 📁 (auth)/            # Đăng nhập/Đăng ký
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── callback/route.ts
│   │   │
│   │   ├── 📁 (account)/         # Tài khoản khách hàng
│   │   │   ├── profile/
│   │   │   ├── orders/[id]/
│   │   │   └── wishlist/
│   │   │
│   │   ├── 📁 admin/             # Admin dashboard
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   └── customers/
│   │   │
│   │   └── 📁 api/               # Route Handlers
│   │
│   ├── 📁 components/            # ═══ UI COMPONENTS ═══
│   │   ├── 📁 ui/                # shadcn/ui primitives
│   │   ├── 📁 layout/            # Header, Footer, Sidebar
│   │   └── 📁 shared/            # ProductCard, CartDrawer, SearchBar
│   │
│   ├── 📁 features/              # ═══ BUSINESS FEATURES ═══
│   │   ├── 📁 cart/              # Store, actions, components
│   │   ├── 📁 products/          # Queries, filters, components
│   │   ├── 📁 checkout/          # Form, payment, summary
│   │   ├── 📁 auth/              # Login, register, social
│   │   └── 📁 admin/             # Dashboard, CRUD, tables
│   │
│   ├── 📁 lib/                   # ═══ INFRASTRUCTURE ═══
│   │   ├── 📁 supabase/          # client.ts, server.ts, admin.ts
│   │   ├── utils.ts              # Helpers (cn, format, etc.)
│   │   ├── constants.ts          # App-wide constants
│   │   └── validations.ts        # Shared Zod schemas
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   ├── 📁 services/              # Business logic layer
│   ├── 📁 types/                 # TypeScript types
│   └── 📁 styles/                # globals.css
│
├── 📁 supabase/                   # ═══ DATABASE ═══
│   ├── 📁 migrations/            # SQL migrations (versioned)
│   ├── seed.sql                   # Seed data
│   └── config.toml                # Local dev config
│
├── .env.local                     # Secrets (gitignored)
├── .env.example                   # Template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── ARCHITECTURE.md                # 📌 BẠN ĐANG ĐỌC FILE NÀY
```

### Quy Tắc Tổ Chức Code

| Quy tắc | Mô tả |
|---------|-------|
| **Route Groups** | Dùng `(parentheses)` để nhóm routes theo domain, không ảnh hưởng URL |
| **Feature-first** | Mỗi feature (cart, checkout, auth) có folder riêng chứa actions, types, components |
| **Colocation** | File chỉ dùng cho 1 route → đặt trong route folder. File dùng chung → `components/shared/` |
| **Thin Actions** | Server Actions chỉ validate + gọi service. Business logic nằm trong `services/` |
| **Server-first** | Mặc định dùng Server Components. Chỉ thêm `'use client'` khi cần interactivity |

---

## 4. Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│  categories  │──1:N──│     products     │──1:N──│product_images│
└──────────────┘       └──────────────────┘       └──────────────┘
                              │    │
                              │    └──1:N──┐
                              │            ▼
┌──────────────┐         ┌────┘     ┌──────────────┐
│   profiles   │──1:N──┐ │         │   reviews    │
└──────────────┘       │ │         └──────────────┘
       │               ▼ ▼
       │         ┌──────────────┐
       ├──1:N───│    orders    │──1:N──┌──────────────┐
       │         └──────────────┘       │ order_items  │
       │                                └──────────────┘
       │
       └──1:N──┌──────────────┐
               │wishlist_items│
               └──────────────┘
```

### Bảng Chi Tiết

#### `profiles` — Thông tin khách hàng (extends auth.users)
```sql
CREATE TABLE profiles (
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
```

#### `categories` — Danh mục sản phẩm
```sql
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### `products` — Sản phẩm
```sql
CREATE TABLE products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  description       TEXT,
  short_description TEXT,
  price             DECIMAL(12,2) NOT NULL CHECK (price >= 0),
  compare_at_price  DECIMAL(12,2),          -- Giá gốc (hiển thị gạch ngang)
  stock_quantity    INT DEFAULT 0,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  status            TEXT DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),
  is_featured       BOOLEAN DEFAULT FALSE,
  tags              TEXT[],
  metadata          JSONB DEFAULT '{}',      -- SEO title, description, specs
  avg_rating        DECIMAL(2,1) DEFAULT 0,
  review_count      INT DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
```

#### `product_images` — Ảnh sản phẩm
```sql
CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
```

#### `orders` — Đơn hàng
```sql
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id),
  order_number     TEXT UNIQUE NOT NULL,     -- VPC-20260001
  status           TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled')),
  subtotal         DECIMAL(12,2) NOT NULL,
  shipping_fee     DECIMAL(12,2) DEFAULT 0,
  discount_amount  DECIMAL(12,2) DEFAULT 0,
  total            DECIMAL(12,2) NOT NULL,
  payment_method   TEXT,                      -- cod, bank_transfer, momo, vnpay
  payment_status   TEXT DEFAULT 'unpaid'
                   CHECK (payment_status IN ('unpaid','paid','refunded')),
  shipping_address JSONB NOT NULL,            -- {name, phone, address, city, district}
  note             TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);
```

#### `order_items` — Chi tiết đơn hàng
```sql
CREATE TABLE order_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id        UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name      TEXT NOT NULL,            -- Snapshot tại thời điểm mua
  price_at_purchase DECIMAL(12,2) NOT NULL,
  quantity          INT NOT NULL CHECK (quantity > 0),
  image_url         TEXT                      -- Snapshot ảnh
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
```

#### `reviews` — Đánh giá sản phẩm
```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)               -- Mỗi user chỉ review 1 lần/SP
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
```

#### `wishlist_items` — Sản phẩm yêu thích
```sql
CREATE TABLE wishlist_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

---

## 5. Security — Row Level Security (RLS)

> **Nguyên tắc**: Mọi table đều BẬT RLS. Không có table nào public writable.

### Policy Matrix

| Table | anon (SELECT) | authenticated (SELECT) | authenticated (INSERT) | authenticated (UPDATE) | authenticated (DELETE) |
|-------|:---:|:---:|:---:|:---:|:---:|
| categories | ✅ active only | ✅ active only | ❌ admin only | ❌ admin only | ❌ admin only |
| products | ✅ active only | ✅ active only | ❌ admin only | ❌ admin only | ❌ admin only |
| product_images | ✅ | ✅ | ❌ admin only | ❌ admin only | ❌ admin only |
| profiles | ❌ | ✅ own only | ✅ own only | ✅ own only | ❌ |
| orders | ❌ | ✅ own only | ✅ own only | ❌ | ❌ |
| order_items | ❌ | ✅ own order | ❌ via order | ❌ | ❌ |
| reviews | ✅ approved | ✅ approved | ✅ own only | ✅ own only | ✅ own only |
| wishlist_items | ❌ | ✅ own only | ✅ own only | ❌ | ✅ own only |

---

## 6. Rendering & Caching Strategy

### Next.js 16 Rendering Modes

```
                    ┌─────────────────────────────┐
                    │     Rendering Decision      │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │   Có dữ liệu user-specific? │
                    └─────────────┬───────────────┘
                         NO ──────┼────── YES
                         │                  │
                ┌────────▼──────┐  ┌────────▼────────┐
                │  use cache    │  │    Dynamic       │
                │  (Static +    │  │   (Server-side   │
                │   Revalidate) │  │    per request)  │
                └───────────────┘  └─────────────────┘
```

| Trang | Rendering | Cache | Revalidation |
|-------|-----------|-------|-------------|
| `/` (Landing) | Static | `use cache` | `revalidateTag('homepage')` — 1 giờ |
| `/products` | Static | `use cache` | `revalidateTag('products')` — on mutation |
| `/products/[slug]` | Static (generateStaticParams) | `use cache` | On product update |
| `/about`, `/contact` | Static | `use cache` | Manual |
| `/blog/[slug]` | Static | `use cache` | On publish |
| `/cart` | Client-only | None | Zustand localStorage |
| `/checkout` | Dynamic | None | Per request |
| `/account/*` | Dynamic | None | Per request (auth required) |
| `/admin/*` | Dynamic | None | Per request (admin required) |

---

## 7. Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                    │
└──────────────────────────────────────────────────────────┘

1. LOGIN (Email/Password)
   Browser → POST /login (Server Action)
     → supabase.auth.signInWithPassword()
     → Set cookies via @supabase/ssr
     → Redirect to /

2. LOGIN (OAuth — Google/Facebook)
   Browser → supabase.auth.signInWithOAuth()
     → Redirect to Provider
     → Callback to /auth/callback
     → Exchange code for session
     → Set cookies → Redirect to /

3. PROTECTED ROUTES
   Browser → Request /account/profile
     → proxy.ts intercepts
     → Read session from cookies
     → supabase.auth.getUser()
     → Valid? → Forward to page
     → Invalid? → Redirect to /login

4. AUTO PROFILE CREATION
   Supabase Trigger: on auth.users INSERT
     → INSERT INTO profiles (id, full_name, avatar_url)
     → VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', ...)
```

---

## 8. Supabase Client Setup

### Server Client (RSC, Server Actions)
```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  )
}
```

### Browser Client (Client Components)
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
```

---

## 9. Giới Hạn Free Tier & Chiến Lược

| Tài nguyên | Limit | Chiến lược |
|-----------|-------|-----------|
| Database | 500 MB | Chỉ lưu URL ảnh. Normalize. Archive đơn hàng cũ. |
| Storage | 1 GB | Compress WebP ≤500KB/ảnh. Resize trước upload. |
| Bandwidth | 5 GB/th | `next/image` optimization + Vercel CDN. |
| Auth MAU | 50,000 | Đủ cho MVP. Monitor usage. |
| Auto-pause | 7 ngày | Cron keep-alive (UptimeRobot / GitHub Actions). |
| Backup | Không có | Tự chạy `pg_dump` weekly qua GitHub Actions. |

---

## 10. Environment Variables

```bash
# .env.example

# ══════════════════════════════
# SUPABASE
# ══════════════════════════════
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx     # ⚠️ Server-only, NEVER expose

# ══════════════════════════════
# APP
# ══════════════════════════════
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME="VPC Store"

# ══════════════════════════════
# OPTIONAL: Payment
# ══════════════════════════════
# VNPAY_TMN_CODE=
# VNPAY_HASH_SECRET=
# MOMO_PARTNER_CODE=
```

---

## 11. Coding Conventions

| Rule | Convention |
|------|-----------|
| **File naming** | `kebab-case.tsx` cho components, `camelCase.ts` cho utils |
| **Component naming** | `PascalCase` — `ProductCard`, `CartDrawer` |
| **Server Action** | File suffix `*-actions.ts` — `cart-actions.ts` |
| **Query functions** | File suffix `*-queries.ts` — `product-queries.ts` |
| **Types** | File suffix `*-types.ts` hoặc trong `types/` |
| **Imports** | Dùng `@/` alias cho `src/` — `import { cn } from '@/lib/utils'` |
| **Components** | Server Component mặc định. Thêm `'use client'` chỉ khi cần |
| **Error handling** | Server Actions return `{ success, data?, error? }` pattern |
| **Validation** | Zod schema cho mọi form input và Server Action |

---

*File này là tài liệu sống — cập nhật khi kiến trúc thay đổi.*
