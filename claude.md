# Love Confession Web - Project Notes

## Tong quan

Day la web to tinh/love confession cho Heli va be Quan. Project dung React + Vite + TypeScript + Tailwind CSS, co public site va admin dashboard. Public site chay duoc bang fallback data neu Supabase chua san sang, nhung khi da cau hinh Supabase thi noi dung se doc tu database.

Repo GitHub:

```text
https://github.com/LeNhatHuyHyDrex/LoveProject
```

## Stack

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger cho timeline reveal
- React Router
- Supabase cho database, auth, RLS va response
- Cloudinary unsigned upload preset cho anh/video
- Sonner cho toast
- Lucide React cho icon

## Routes

- `/`: intro modal hoi be Quan.
- `/accept`: thu accept, hero media, floating photos, timeline, loi hua nho, nut "Doc lai tu dau".
- `/gentle`: thu gentle, nen dem/trang/sao, nut quay lai doc lai tu dau.
- `/admin/login`: login admin bang Supabase Auth.
- `/admin`: dashboard.
- `/admin/letters`: sua thu accept/gentle.
- `/admin/timeline`: CRUD timeline, doi order, gan media.
- `/admin/media`: upload/paste media, tick floating/hero, gan timeline.
- `/admin/settings`: sua ten, cau hoi intro, music, floating photos, theme.

## File quan trong

- `src/App.tsx`: routes va lazy-load pages.
- `src/data/fallbackData.ts`: thu, timeline, settings mac dinh.
- `src/lib/supabase.ts`: Supabase client, chi dung anon/publishable key.
- `src/lib/cloudinary.ts`: Cloudinary unsigned upload, khong chua secret.
- `src/lib/youtube.ts`: parse YouTube ID, thumbnail, embed URL.
- `src/hooks/useAdminAuth.tsx`: auth context va check `admin_users`.
- `src/hooks/useFloatingMedia.ts`: doc anh `is_floating = true` tu `media_files`.
- `src/hooks/useHeroMedia.ts`: doc anh `is_hero = true` tu `media_files`.
- `src/components/FloatingPhotos.tsx`: anh bay xung quanh man hinh, da toi uu ca mobile.
- `src/components/HeroMediaBackdrop.tsx`: hien anh hero lam nen cinematic cho `/` va `/accept`.
- `src/components/LoveLetter.tsx`: card thu, icon accept la heart, gentle la notebook.
- `src/components/MusicToggle.tsx`: vinyl music player goc phai duoi, co play/pause va seek bar.
- `src/components/ParticleBackground.tsx`: doc theme va doi nen theo `luxury-romantic`, `night-healing`, `soft-pearl`.
- `src/components/Timeline.tsx` va `TimelineItem.tsx`: timeline scroll reveal, mobile co duong doc va dot.
- `src/pages/*`: cac page public va admin.
- `supabase/schema.sql`: schema, seed data, RLS policies.
- `.env.example`: cac bien moi truong can co.
- `README.md`: huong dan setup/deploy.

## Database

Bảng Supabase:

- `admin_users`: user admin, lien ket `auth.users`.
- `letters`: thu theo `type` la `accept` hoac `gentle`.
- `timeline_items`: moc timeline.
- `media_files`: anh/video/YouTube, co the gan `timeline_item_id`.
- `app_settings`: key/value JSONB.
- `love_responses`: luu lua chon `accept` hoac `gentle`.

RLS:

- Public doc `letters`, `app_settings`, `media_files`.
- Public doc `timeline_items` khi `is_published = true`.
- Public insert `love_responses`.
- Chi user co trong `admin_users` duoc insert/update/delete noi dung.

## Media behavior

- `Floating photo`: anh se hien trong floating photos neu `type = image` va `is_floating = true`.
- Floating photos khong can gan timeline nua.
- Floating photos da hien tren mobile, nhung nho, mo va sat mep de khong che chu.
- `Hero media`: anh se lam nen cinematic cho `/` va `/accept` neu `type = image` va `is_hero = true`.
- Neu co nhieu hero media, app lay anh co `order_index` nho nhat.
- Video khong preload hang loat. Timeline chi hien thumbnail, click moi mo modal.
- YouTube link duoc render bang embed modal, thumbnail lay tu YouTube ID.

## Music va theme

- Nhac nen dung setting `background_music_url` va `enable_music`.
- Admin Settings co nut upload nhac len Cloudinary. Upload xong URL tu dien vao `background_music_url` va tu bat `enable_music`; van can bam "Luu settings" de ghi Supabase.
- Cloudinary audio upload di vao folder `love-confession/music`.
- Public player la icon dia than o goc phai duoi. Click dia than se mo panel ngang, tu phat nhac neu browser cho phep, co nut play/pause va thanh tua.
- Dia than xoay khi nhac dang phat.
- Player hien ca o trang `/`, `/accept`, `/gentle`.
- App se tu goi `audio.play()` khi vao trang neu co `enable_music` va `background_music_url`. Neu browser chan autoplay co am thanh, player se doi lan cham/click/phim dau tien o bat ky dau tren trang roi tu phat lai.
- Theme trong Admin Settings hien da co tac dung that tren public pages:
  - `luxury-romantic`: hong/tim/vang luxury romantic.
  - `night-healing`: xanh dem/tim, cam giac chua lanh.
  - `soft-pearl`: hong ngoc trai mem hon.
- Theme duoc truyen vao `ParticleBackground` tren `/`, `/accept`, `/gentle`.

## Cac thay doi gan day

- Thay toan bo icon Sparkles bang icon phu hop hon theo ngu canh.
- Sua bug timeline bien mat sau khi Supabase load du lieu that: GSAP effect gio phu thuoc ID/order item, khong chi phu thuoc so luong.
- Them floating media hook doc truc tiep tu `media_files`.
- Them hero media hook va hero backdrop cho public pages.
- Doi icon thu gentle sang icon ghi chu `NotebookPen`.
- Them nut "Doc lai tu dau" o card "Loi hua nho cua Heli" trong `/accept`.
- Toi uu mobile:
  - Intro modal gon hon, dung `100svh`.
  - Love letter giam padding/font spacing tren mobile.
  - Floating photos hien tren mobile.
  - Timeline mobile co duong doc va dot.
  - Public pages giam padding/khoang cach de doc dep tren dien thoai.
  - Hero backdrop mobile giam opacity de khong lam kho doc.
- Them vinyl music player va upload nhac trong Admin Settings.
- Them autoplay best-effort cho nhac nen va fallback phat sau lan cham dau tien.
- Lam theme Admin Settings hoat dong that tren public pages.
- Da push len GitHub cac thay doi gan day; xem `git log --oneline` de biet commit moi nhat.

## Env can cau hinh

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Khong dua service role key hoac Cloudinary API secret vao frontend.

## Deploy

Khuyen dung Vercel hoac Cloudflare Pages.

Build settings:

```text
Build command: npm run build
Output directory: dist
Install command: npm install
```

Sau khi connect GitHub repo, moi lan sua code chi can:

```bash
git add .
git commit -m "message"
git push
```

Vercel/Cloudflare se tu build va deploy lai. Neu chi sua thu/timeline/media/settings trong admin thi khong can push code, vi du lieu nam o Supabase.

## Khi update them chuc nang

- Uu tien them data access trong `src/hooks` hoac `src/lib`.
- Public page nen co fallback/empty state, khong crash khi Supabase loi.
- Admin action nen co toast, loading state va confirm khi xoa.
- Khong upload video vao repo; dung Cloudinary hoac YouTube unlisted.
- Neu them table moi, cap nhat `supabase/schema.sql`, RLS policy va README.
- Neu them route moi, cap nhat `src/App.tsx`; admin route phai nam trong `ProtectedRoute`.
