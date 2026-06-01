<!-- BEGIN:nextjs-agent-rules -->
# ⚠️ Next.js 16 & Tech Stack - Agent Guidelines ⚠️

LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT, nhưng tài liệu thì có thể song ngữ ANH VIỆT. Ưu tiên ANH VIỆT khi trình bày code cho user.


This version of Next.js 16, React 19, and Tailwind CSS v4 contains breaking changes that differ significantly from standard training data. You **MUST** adhere to the following rules when working on this codebase.

## 1. Next.js 16 App Router Conventions
*   **Awaited Route Params**: `params` and `searchParams` passed to pages, layouts, and metadata generators are **Promises** and **MUST** be awaited before reading properties.
    ```typescript
    // CORRECT:
    interface PageProps {
      params: Promise<{ slug: string }>;
      searchParams: Promise<{ [key: string]: string | undefined }>;
    }
    export default async function Page({ params, searchParams }: PageProps) {
      const { slug } = await params;
      const { query } = await searchParams;
    }
    ```
*   **Routing Interceptor (`proxy.ts`)**: `middleware.ts` is deprecated. Navigation intercepts and route guards are handled in `src/proxy.ts` running on the full Node.js runtime.
*   **RSC & Hydration**: Always ensure that global layout states (e.g., cart counts or user profiles loaded from local storage) are hydrated inside `useEffect` or wrapped in `<AnimatePresence>` to prevent hydration mismatch errors.

## 2. Tailwind CSS v4 Theme System
*   **No tailwind.config.ts**: The theme is declared entirely using the `@theme` directive in [globals.css](file:///d:/Du-an/website-vpc/src/app/globals.css).
*   **Defining Colors**: Custom colors are added as CSS custom properties starting with `--color-` inside the `@theme` block.
*   **Glassmorphism & Utilities**: Custom utility classes like `.glass` are defined in the CSS file. Do not rewrite ad-hoc styling grids when standard classes are available.

## 3. Supabase SSR Integration
*   **Client Components**: Import `createClient` from `@/lib/supabase/client` (non-async).
*   **Server Components & Actions**: Import `createClient` from `@/lib/supabase/server` (async - **MUST** be awaited).
    ```typescript
    import { createClient } from '@/lib/supabase/server'
    const supabase = await createClient()
    ```
*   **Row-Level Security (RLS)**: Public tables (`products`, `categories`) can be read anonymously. Protected actions (e.g. creating orders, managing reviews) require matching `auth.uid() = user_id`. Admin operations require verification of the role `admin` inside `profiles` table.

## 4. Local Execution on Windows
*   PowerShell script execution policy is disabled on this machine.
*   **CRITICAL**: When calling terminal commands, **ALWAYS** use `.cmd` commands (e.g., use `npm.cmd run build` or `npx.cmd vercel` instead of standard `npm` or `npx`) to prevent Shell Security Errors.

## 5. Global Cart State
*   Managed via **Zustand** inside `@/features/cart/cart-store.ts`.
*   Auto-persisted in `localStorage` under key `vpc-cart-storage`.
<!-- END:nextjs-agent-rules -->
