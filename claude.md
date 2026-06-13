# Love Confession Web - Project Notes

## Đã làm được

Đây là một web tỏ tình/love confession hoàn chỉnh dùng React + Vite + TypeScript + Tailwind CSS. Public site có intro modal hỏi bé Quắn, lưu lựa chọn vào Supabase nếu đã cấu hình, rồi chuyển sang `/accept` hoặc `/gentle`. Trang `/accept` có thư cảm ơn, confetti nhẹ, timeline kỷ niệm, ảnh/video lazy load và modal video. Trang `/gentle` có thư nhẹ nhàng, nền đêm/sao/trăng và nút quay lại.

Admin đã có Supabase Auth email/password và kiểm tra quyền bằng bảng `admin_users`. Các route admin gồm dashboard, letters, timeline, media và settings. Admin có thể sửa thư, thêm/sửa/xóa timeline, đổi thứ tự timeline, gán media vào mốc, upload ảnh/video lên Cloudinary bằng unsigned preset, paste URL/YouTube, xóa media record và chỉnh settings cơ bản.

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger cho timeline reveal
- React Router
- Supabase cho database, auth, RLS và lưu response
- Cloudinary unsigned upload preset cho ảnh/video
- Sonner cho toast
- Lucide React cho icon

## File quan trọng

- `src/App.tsx`: khai báo routes và lazy-load page.
- `src/data/fallbackData.ts`: thư, timeline và settings mặc định để web vẫn chạy khi chưa có Supabase.
- `src/lib/supabase.ts`: Supabase client, chỉ dùng anon key.
- `src/lib/cloudinary.ts`: upload Cloudinary unsigned, không chứa secret.
- `src/lib/youtube.ts`: parse YouTube ID, thumbnail, embed URL.
- `src/hooks/useAdminAuth.tsx`: auth context và kiểm tra `admin_users`.
- `src/components/*`: intro modal, letter, timeline, gallery, video modal, layout admin.
- `src/pages/*`: public pages và admin pages.
- `supabase/schema.sql`: database schema, seed data, RLS policies.
- `.env.example`: biến môi trường cần có.
- `README.md`: hướng dẫn setup/deploy.

## Routes

- `/`: intro modal.
- `/accept`: thư accept + timeline.
- `/gentle`: thư gentle.
- `/admin/login`: login admin.
- `/admin`: dashboard.
- `/admin/letters`: sửa thư accept/gentle.
- `/admin/timeline`: CRUD timeline và gán media.
- `/admin/media`: upload/paste media.
- `/admin/settings`: chỉnh tên, câu hỏi intro, nhạc, floating photos, theme.

## Database

Bảng Supabase:

- `admin_users`: user admin, liên kết `auth.users`.
- `letters`: thư theo `type` là `accept` hoặc `gentle`.
- `timeline_items`: mốc timeline.
- `media_files`: ảnh/video/YouTube, có thể gán `timeline_item_id`.
- `app_settings`: key/value JSONB.
- `love_responses`: lưu lựa chọn `accept` hoặc `gentle`.

RLS:

- Public đọc `letters`, `app_settings`, `media_files`.
- Public đọc `timeline_items` khi `is_published = true`.
- Public insert `love_responses`.
- Chỉ user có trong `admin_users` được insert/update/delete nội dung.

## Env cần cấu hình

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Không dùng service role key hay Cloudinary API secret trong frontend.

## Khi update thêm chức năng

Ưu tiên giữ data access trong `src/hooks` hoặc `src/lib`, không gọi Supabase lộn xộn trong component nếu logic dùng lại được. Public page nên luôn có fallback hoặc empty state để không crash khi Supabase lỗi. Admin action nên có toast, loading state và confirm khi xóa. Video phải tiếp tục lazy-load: chỉ thumbnail trước, click mới render iframe/video.

Nếu thêm bảng mới, cập nhật `supabase/schema.sql`, RLS policy và README. Nếu thêm route mới, cập nhật `src/App.tsx` và nếu là admin route thì đặt trong `ProtectedRoute`.
