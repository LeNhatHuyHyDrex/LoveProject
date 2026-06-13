create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('accept', 'gentle')),
  title text not null,
  content text not null,
  updated_at timestamptz default now(),
  unique (type)
);

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  display_date text,
  actual_date date null,
  description text,
  mood text null,
  is_highlight boolean default false,
  is_published boolean default true,
  order_index int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  timeline_item_id uuid null references public.timeline_items(id) on delete cascade,
  type text not null check (type in ('image', 'video', 'youtube')),
  url text not null,
  thumbnail_url text null,
  public_id text null,
  caption text null,
  alt text null,
  is_floating boolean default false,
  is_hero boolean default false,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

create table if not exists public.love_responses (
  id uuid primary key default gen_random_uuid(),
  choice text not null check (choice in ('accept', 'gentle')),
  created_at timestamptz default now(),
  user_agent text null,
  note text null
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists letters_set_updated_at on public.letters;
create trigger letters_set_updated_at
before update on public.letters
for each row execute function public.set_updated_at();

drop trigger if exists timeline_items_set_updated_at on public.timeline_items;
create trigger timeline_items_set_updated_at
before update on public.timeline_items
for each row execute function public.set_updated_at();

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
before update on public.app_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.letters enable row level security;
alter table public.timeline_items enable row level security;
alter table public.media_files enable row level security;
alter table public.app_settings enable row level security;
alter table public.love_responses enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can manage admin users" on public.admin_users;
create policy "Admins can manage admin users"
on public.admin_users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read letters" on public.letters;
create policy "Public can read letters"
on public.letters
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage letters" on public.letters;
create policy "Admins can manage letters"
on public.letters
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published timeline" on public.timeline_items;
create policy "Public can read published timeline"
on public.timeline_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Admins can manage timeline" on public.timeline_items;
create policy "Admins can manage timeline"
on public.timeline_items
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read media files" on public.media_files;
create policy "Public can read media files"
on public.media_files
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage media files" on public.media_files;
create policy "Admins can manage media files"
on public.media_files
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read app settings" on public.app_settings;
create policy "Public can read app settings"
on public.app_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage app settings" on public.app_settings;
create policy "Admins can manage app settings"
on public.app_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can insert love responses" on public.love_responses;
create policy "Public can insert love responses"
on public.love_responses
for insert
to anon, authenticated
with check (choice in ('accept', 'gentle'));

drop policy if exists "Admins can read love responses" on public.love_responses;
create policy "Admins can read love responses"
on public.love_responses
for select
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.letters, public.timeline_items, public.media_files, public.app_settings to anon, authenticated;
grant insert on public.love_responses to anon, authenticated;
grant all on public.admin_users, public.letters, public.timeline_items, public.media_files, public.app_settings, public.love_responses to authenticated;

insert into public.letters (type, title, content)
values
(
  'accept',
  'Cảm ơn bé đã chọn Heli 💖',
  $$Cảm ơn bé đã đến bên anh.

Nếu em thấy được những dòng này, có nghĩa là em đã đồng ý rồi. Lúc này chắc anh đang vui lắm, vui theo cái cách mà anh không biết phải diễn tả sao cho đủ.

Anh biết để có được ngày hôm nay không hề dễ dàng. Cảm ơn bé vì đã cho anh cơ hội được bước gần hơn vào thế giới của bé, được yêu thương bé một cách chính thức hơn, được chăm sóc, dỗ dành và ở cạnh bé nhiều hơn.

Anh không dám hứa rằng anh sẽ luôn hoàn hảo, nhưng anh hứa sẽ luôn cố gắng. Cố gắng lắng nghe bé hơn, hiểu bé hơn, thương bé đúng cách hơn, và không để bé phải cảm thấy mình không được trân trọng.

Anh mong rằng từ hôm nay, ngày em trở thành người yêu của anh, sẽ là một ngày thật đặc biệt. Một ngày mà bé được yêu, được thương, được chiều chuộng và được đặt ở một vị trí thật dịu dàng trong tim anh.

Anh sẽ nỗ lực để không đánh mất điều quý giá này.

Yêu bé Quắn nhiều lắm.

— Heli <33$$
),
(
  'gentle',
  'Cảm ơn bé vì đã thật lòng với Heli 🌙',
  $$Cảm ơn bé đã nhận bó hoa và lắng nghe lời tỏ tình của Heli.

Nếu bé đang đọc những dòng này, có lẽ câu trả lời của bé chưa phải là điều Heli mong nhất. Nhưng bé đừng cảm thấy mình có lỗi nha. Việc bé trả lời thật lòng với Heli đã là điều Heli rất trân trọng rồi.

Có thể Heli vẫn chưa đủ để bé hoàn toàn tin tưởng, hoặc có thể bé cần thêm thời gian để chắc chắn với cảm xúc của mình. Không sao cả. Heli hiểu mà.

Heli sẽ buồn một chút, chắc chắn là có. Nhưng Heli không muốn bé vì vậy mà phải nặng lòng hay khó xử. Heli đã chuẩn bị tinh thần cho mọi khả năng trước khi nói ra điều này, vì Heli muốn thành thật với tình cảm của mình.

Nếu bé vẫn cho phép, Heli vẫn muốn được quan tâm bé theo cách nhẹ nhàng nhất, không làm bé áp lực, không làm bé phải né tránh. Heli sẽ tiếp tục cố gắng hơn, trưởng thành hơn, để một ngày nào đó bé có thể nhìn thấy Heli là một người đáng tin, đáng thương và đáng để bé gửi gắm tình cảm.

Sau khi đọc tới đây rồi, mong bé đừng nghĩ nhiều nha. Bé chỉ cần là bé thôi. Còn Heli vẫn ở đây, vẫn thương bé, vẫn dịu dàng với bé như vậy.

Yêu bé.

— Heli <3$$
)
on conflict (type) do update set
  title = excluded.title,
  content = excluded.content;

insert into public.app_settings (key, value)
values
  ('site_title', to_jsonb('Heli & bé Quắn'::text)),
  ('heli_name', to_jsonb('Heli'::text)),
  ('lover_name', to_jsonb('bé Quắn'::text)),
  ('background_music_url', to_jsonb(''::text)),
  ('enable_music', to_jsonb(false)),
  ('enable_floating_photos', to_jsonb(true)),
  ('intro_question', to_jsonb('Bé có đồng ý để Heli được chính thức yêu thương, chăm sóc và gọi bé là người yêu không?'::text)),
  ('theme', to_jsonb('luxury-romantic'::text))
on conflict (key) do update set
  value = excluded.value;

insert into public.timeline_items
  (title, display_date, actual_date, description, mood, is_highlight, is_published, order_index)
select *
from (
  values
    ('Không biết từ bao giờ…', 'Một ngày rất lâu trước đó', null::date, 'Không biết từ bao giờ, Heli đã thích bé Quắn. Ban đầu chỉ là âm thầm giữ trong lòng, âm thầm quan sát, âm thầm ngắm nhìn bé, rồi tiếp cận bé như một người bạn.', 'Âm thầm', true, true, 1),
    ('Ngày cá tháng tư', '01/04', date '2026-04-01', 'Bé Quắn trêu Heli là thích Heli. Dù biết đó là lời nói đùa, Heli vẫn vui lắm, vì đó là câu mà Heli đã muốn nghe từ rất lâu rồi. Heli cũng tiện thể hint hint lại rằng Heli thích bé Quắn.', 'Vui lén', false, true, 2),
    ('Những ngày lòng bắt đầu rõ hơn', 'Sau 01/04', null::date, 'Những ngày sau đó là những lần Heli nói thích, những lần cả hai trải lòng, trêu nhau về tình yêu, rồi dần dần thân hơn rất nhiều.', 'Rõ ràng hơn', false, true, 3),
    ('Concert FPT', '12/04', date '2026-04-12', 'Heli đi concert FPT cùng nhóm bé Quắn. Vừa đến nơi là Heli đã ngóng tìm bé. Nhìn thấy dáng bé nhỏ nhắn dễ thương, Heli chỉ muốn được lại gần ngay. Được nghe nhạc hay, được ở gần bé, lòng Heli thật sự nhảy nhộn nhịp.', 'Rộn ràng', true, true, 4),
    ('Mega và tô tượng', '16/04', date '2026-04-16', 'Nghe tin bé Quắn qua Mega mua quà, Heli đang tập gym cũng vội về tắm rửa rồi chạy ra gặp bé. Tối đó đi tô tượng, Heli vừa tô vừa lén nhìn bé. Có thêm một kỷ niệm với bé thật sự rất vui.', 'Dễ thương', false, true, 5),
    ('Lần đầu nói thật lòng', '20/04 - 21/04', date '2026-04-21', 'Khuya 20/04 đến 2h sáng 21/04, Heli trải lòng với bé Quắn rằng Heli thích bé. Bé hơi sốc và nói chưa muốn yêu. Heli tôn trọng điều đó, tiếp tục chờ và tự nhủ mình cần cố gắng nhiều hơn để bé có thể tin tưởng.', 'Thật lòng', true, true, 6),
    ('First date', '23/04', date '2026-04-23', 'First date đi xem phim ‘Hẹn em ngày nhật thực’. Đi xem phim tình cảm với bé mà Heli còn khóc nhiều hơn bé. Sau đó đi ăn nướng, ngồi nói chuyện tới khuya ở công viên Liên Chiểu. Đây là dấu mốc đầu tiên rất đặc biệt.', 'Đặc biệt', true, true, 7),
    ('Date 2 và cái nắm tay', '04/05', date '2026-05-04', 'Trên đường chở bé về, Heli đề cập tới phần thưởng là được nắm tay bé. Rồi Heli đã chủ động nắm tay bé trên đoạn đường về. Một khoảnh khắc nhỏ nhưng Heli nhớ rất lâu.', 'Run run', false, true, 8),
    ('Con khỉ và những điều dịu dàng', '06/05', date '2026-05-06', 'Heli tặng bé Quắn con khỉ. Hai đứa đan tay, dựa nhau nói chuyện, xem TikTok cùng nhau. Bé còn lau mồ hôi tay cho Heli. Hôm đó Heli thật sự tan chảy.', 'Tan chảy', true, true, 9),
    ('Biển Mỹ Khê', '07/05', date '2026-05-07', 'Đi biển Mỹ Khê, tựa đầu nói chuyện, đan tay dạo biển, nói về tình yêu và gia đình. Biển hôm đó như xác nhận rõ hơn tình cảm của hai đứa.', 'Healing', true, true, 10),
    ('Một ngày cứ nghĩ về bé', '08/05', date '2026-05-08', 'Chiều đi hát, Heli ngồi dựa bé Quắn. Cả ngày hôm đó Heli cứ nghĩ về bé, muốn được ở cạnh và ôm bé nhiều hơn.', 'Nhớ', false, true, 11),
    ('Cái ôm sau xe', '11/05', date '2026-05-11', 'Heli chở bé Quắn đi sửa laptop và được bé ôm sau xe. Một điều nhỏ thôi nhưng làm Heli vui rất nhiều.', 'Ấm lòng', false, true, 12),
    ('Zone Six', '12/05', date '2026-05-12', 'Đi Zone Six, có những khoảnh khắc rất tình cảm, những cái ôm, những lần dựa vào nhau. Heli thật sự không muốn ngày hôm đó kết thúc.', 'Lưu luyến', true, true, 13),
    ('Lời thề dưới trời mưa', '16/05', date '2026-05-16', 'Heli thề trước trời mưa gió, sấm chớp cho bé Quắn. Một khoảnh khắc rất riêng của hai đứa.', 'Riêng tư', true, true, 14),
    ('Biển lại là nơi healing', '18/05', date '2026-05-18', 'Đi biển Mỹ Khê, Heli tặng bé máy chườm bụng và một con gấu. Hôm đó ngồi nói chuyện rất vui, rất hạnh phúc. Biển luôn là nơi healing của đôi ta.', 'Hạnh phúc', true, true, 15),
    ('Homestay lần đầu', '29/05', date '2026-05-29', 'Một buổi đi rất khó quên. Ban đầu cả hai còn ngại, nhưng rồi dần thoải mái hơn, cùng xem phim, cùng nói chuyện, cùng lưu lại nhiều khoảnh khắc đặc biệt.', 'Khó quên', true, true, 16),
    ('Một đêm ấm lòng', '04/06', date '2026-06-04', 'Chiều đi hát cùng bé Quắn, tối có thêm một buổi thật nhiều cảm xúc. Được ôm bé ngủ, được bé dỗ dành khi Heli yếu lòng, Heli thấy mình hạnh phúc và được thương rất nhiều.', 'Được thương', true, true, 17),
    ('Chùa Linh Ứng', '09/06', date '2026-06-09', 'Đi chùa Linh Ứng cùng bé Quắn. Heli đã cầu mọi điều tốt đẹp đến với bé, cầu bình an cho bé và cầu duyên cho đôi ta. Hôm đó có những tấm ảnh thật dễ thương và những khoảnh khắc rất an yên.', 'An yên', true, true, 18)
) as seed(title, display_date, actual_date, description, mood, is_highlight, is_published, order_index)
where not exists (select 1 from public.timeline_items);
