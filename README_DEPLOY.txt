CÁCH COPY VÀ DEPLOY

1) Chạy SQL trước trong Supabase SQL Editor:
   supabase_migration_vpc_reviews_inventory_customer.sql

2) Copy file frontend:
   index.html -> đè vào index.html hiện tại
   admin.html -> đè vào admin.html hiện tại

3) Copy API routes:
   src/app/api/chat/route.ts
   src/app/api/reviews/route.ts
   src/app/api/reviews/[id]/route.ts
   src/app/api/admin/reports/daily/route.ts
   src/app/api/vat-pham/[id]/route.ts
   src/app/api/do-uong/[id]/route.ts

4) Kiểm tra env trên Vercel:
   OPENAI_API_KEY=...
   OPENAI_MODEL=gpt-4o-mini
   SERPER_API_KEY=...   (chỉ dùng khi knowledge + Supabase không có dữ liệu)

5) Build/deploy:
   cd D:\du-an\website-vpc
   npm.cmd run build
   git add index.html admin.html src/app/api/chat/route.ts src/app/api/reviews src/app/api/admin/reports src/app/api/vat-pham src/app/api/do-uong
   git commit -m "add reviews inventory admin ai reports black white theme"
   git push origin main

6) Test nhanh:
   - Đặt đơn COD -> popup đánh giá hiện lên.
   - Admin -> Vật phẩm/Menu nước thấy cột Tồn kho.
   - Vật phẩm tồn kho 0 -> web bán hàng hiện Hết hàng và khóa nút đặt.
   - Chatbot /api/chat?debug=1 thấy sourceOrder: knowledge.ts, supabase, openai, serper-if-needed.
