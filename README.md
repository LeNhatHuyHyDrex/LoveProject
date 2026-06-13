# Love Confession Website

Website tỏ tình/love confession dùng React + Vite + TypeScript + Tailwind CSS. Public site có intro modal, trang đồng ý, trang cần thêm thời gian, timeline có ảnh/video lazy load. Admin dùng Supabase Auth để chỉnh thư, timeline, media và settings. Upload ảnh/video dùng Cloudinary unsigned upload preset, không cần backend riêng.

## Cài đặt

```bash
npm install
```

## Chạy local

```bash
npm run dev
```

Nếu chưa cấu hình Supabase, public site vẫn chạy bằng fallback data trong `src/data/fallbackData.ts`. Admin sẽ báo Supabase chưa cấu hình.

## Environment variables

Tạo file `.env` từ `.env.example`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Không push `.env`. Không đưa `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET` hoặc bất kỳ secret key nào vào frontend.

## Supabase setup

1. Tạo Supabase project.
2. Vào SQL Editor và chạy file `supabase/schema.sql`.
3. Vào Authentication, tạo user admin bằng email/password.
4. Thêm user đó vào bảng `admin_users`:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'email-admin-cua-ban@example.com';
```

5. Dùng email/password đó đăng nhập tại `/admin/login`.

Schema chính:

- `letters`: thư `accept` và `gentle`.
- `timeline_items`: các mốc kỷ niệm.
- `media_files`: ảnh/video/YouTube, có thể gán vào timeline.
- `app_settings`: settings dạng key/value JSONB.
- `love_responses`: lưu lựa chọn `accept` hoặc `gentle`.
- `admin_users`: danh sách user có quyền admin.

RLS đã bật trong SQL. Public/anonymous chỉ được đọc dữ liệu public và insert vào `love_responses`; quyền thêm/sửa/xóa nội dung yêu cầu user có trong `admin_users`.

## Cloudinary setup

1. Tạo unsigned upload preset trong Cloudinary.
2. Giới hạn preset càng chặt càng tốt:
   - Folder gợi ý: `love-confession/images`, `love-confession/videos`, `love-confession/thumbnails`.
   - Allowed formats: chỉ bật các định dạng cần dùng như `jpg`, `jpeg`, `png`, `webp`, `mp4`, `mov`.
   - Max file size phù hợp cho mobile.
3. Điền `VITE_CLOUDINARY_CLOUD_NAME` và `VITE_CLOUDINARY_UPLOAD_PRESET` vào `.env`.

Frontend chỉ dùng unsigned preset, không dùng Cloudinary API secret. Video nên lưu trên Cloudinary hoặc YouTube unlisted, không nhét trực tiếp vào repo. Media URL được lưu trong Supabase.

## Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Deploy free

Có thể deploy lên Cloudflare Pages, Vercel hoặc GitHub Pages.

- Cloudflare Pages: build command `npm run build`, output directory `dist`. File `public/_redirects` đã hỗ trợ SPA fallback.
- Vercel: build command `npm run build`, output directory `dist`. File `vercel.json` đã rewrite route về app.
- GitHub Pages: nếu deploy dưới subpath repo, cần cấu hình thêm `base` trong `vite.config.ts`.

Nhớ cấu hình environment variables trên dashboard deploy.

## Routes

- `/`: intro page, luôn mở popup câu hỏi.
- `/accept`: thư cảm ơn, hiệu ứng nhẹ, timeline.
- `/gentle`: thư dịu dàng, nền đêm/trăng/sao.
- `/admin/login`: đăng nhập admin.
- `/admin`: dashboard.
- `/admin/letters`: sửa thư.
- `/admin/timeline`: CRUD timeline, gán media.
- `/admin/media`: upload/paste media, chỉnh metadata.
- `/admin/settings`: sửa tên, câu hỏi, nhạc, floating photos, theme.

## Ghi chú vận hành

- Nhạc nền không autoplay; người xem phải tự bấm nút bật nhạc.
- Video không preload hàng loạt; thumbnail hiển thị trước, click mới mở modal video.
- Floating photos giới hạn số lượng để tránh lag mobile.
- Nếu Supabase lỗi hoặc chưa có dữ liệu, public site dùng fallback data thay vì crash.
- Admin cần Supabase hoạt động vì mọi thao tác save/delete đều ghi vào database.
