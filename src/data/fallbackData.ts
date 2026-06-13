import type { AppSettings, Letter, MediaFile, TimelineItem } from '../types';

export const defaultSettings: AppSettings = {
  site_title: 'Heli & bé Quắn',
  heli_name: 'Heli',
  lover_name: 'bé Quắn',
  background_music_url: '',
  enable_music: false,
  enable_floating_photos: true,
  intro_question:
    'Bé có đồng ý để Heli được chính thức yêu thương, chăm sóc và gọi bé là người yêu không?',
  theme: 'luxury-romantic',
};

export const defaultLetters: Letter[] = [
  {
    type: 'accept',
    title: 'Cảm ơn bé đã chọn Heli 💖',
    content: `Cảm ơn bé đã đến bên anh.

Nếu em thấy được những dòng này, có nghĩa là em đã đồng ý rồi. Lúc này chắc anh đang vui lắm, vui theo cái cách mà anh không biết phải diễn tả sao cho đủ.

Anh biết để có được ngày hôm nay không hề dễ dàng. Cảm ơn bé vì đã cho anh cơ hội được bước gần hơn vào thế giới của bé, được yêu thương bé một cách chính thức hơn, được chăm sóc, dỗ dành và ở cạnh bé nhiều hơn.

Anh không dám hứa rằng anh sẽ luôn hoàn hảo, nhưng anh hứa sẽ luôn cố gắng. Cố gắng lắng nghe bé hơn, hiểu bé hơn, thương bé đúng cách hơn, và không để bé phải cảm thấy mình không được trân trọng.

Anh mong rằng từ hôm nay, ngày em trở thành người yêu của anh, sẽ là một ngày thật đặc biệt. Một ngày mà bé được yêu, được thương, được chiều chuộng và được đặt ở một vị trí thật dịu dàng trong tim anh.

Anh sẽ nỗ lực để không đánh mất điều quý giá này.

Yêu bé Quắn nhiều lắm.

— Heli <33`,
  },
  {
    type: 'gentle',
    title: 'Cảm ơn bé vì đã thật lòng với Heli 🌙',
    content: `Cảm ơn bé đã nhận bó hoa và lắng nghe lời tỏ tình của Heli.

Nếu bé đang đọc những dòng này, có lẽ câu trả lời của bé chưa phải là điều Heli mong nhất. Nhưng bé đừng cảm thấy mình có lỗi nha. Việc bé trả lời thật lòng với Heli đã là điều Heli rất trân trọng rồi.

Có thể Heli vẫn chưa đủ để bé hoàn toàn tin tưởng, hoặc có thể bé cần thêm thời gian để chắc chắn với cảm xúc của mình. Không sao cả. Heli hiểu mà.

Heli sẽ buồn một chút, chắc chắn là có. Nhưng Heli không muốn bé vì vậy mà phải nặng lòng hay khó xử. Heli đã chuẩn bị tinh thần cho mọi khả năng trước khi nói ra điều này, vì Heli muốn thành thật với tình cảm của mình.

Nếu bé vẫn cho phép, Heli vẫn muốn được quan tâm bé theo cách nhẹ nhàng nhất, không làm bé áp lực, không làm bé phải né tránh. Heli sẽ tiếp tục cố gắng hơn, trưởng thành hơn, để một ngày nào đó bé có thể nhìn thấy Heli là một người đáng tin, đáng thương và đáng để bé gửi gắm tình cảm.

Sau khi đọc tới đây rồi, mong bé đừng nghĩ nhiều nha. Bé chỉ cần là bé thôi. Còn Heli vẫn ở đây, vẫn thương bé, vẫn dịu dàng với bé như vậy.

Yêu bé.

— Heli <3`,
  },
];

const demoMedia: MediaFile[] = [
  {
    id: 'demo-photo-1',
    timeline_item_id: 'timeline-4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    public_id: null,
    caption: 'Một góc nhỏ rất dịu dàng',
    alt: 'Ánh sáng lãng mạn',
    is_floating: true,
    is_hero: true,
    order_index: 1,
  },
  {
    id: 'demo-photo-2',
    timeline_item_id: 'timeline-7',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    public_id: null,
    caption: 'First date trong trí nhớ của Heli',
    alt: 'Khoảnh khắc hẹn hò',
    is_floating: true,
    is_hero: false,
    order_index: 2,
  },
  {
    id: 'demo-photo-3',
    timeline_item_id: 'timeline-10',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    public_id: null,
    caption: 'Biển là nơi mọi thứ mềm lại',
    alt: 'Bãi biển lúc hoàng hôn',
    is_floating: true,
    is_hero: false,
    order_index: 3,
  },
  {
    id: 'demo-photo-4',
    timeline_item_id: 'timeline-15',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    public_id: null,
    caption: 'Một nơi healing cho hai đứa',
    alt: 'Không gian ấm áp',
    is_floating: true,
    is_hero: false,
    order_index: 4,
  },
  {
    id: 'demo-photo-5',
    timeline_item_id: 'timeline-18',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: null,
    public_id: null,
    caption: 'Bình yên là khi được cầu điều tốt cho bé',
    alt: 'Khung cảnh yên bình',
    is_floating: true,
    is_hero: false,
    order_index: 5,
  },
  {
    id: 'demo-video-1',
    timeline_item_id: 'timeline-13',
    type: 'youtube',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    public_id: null,
    caption: 'Video demo: thay bằng video thật trong admin',
    alt: 'Thumbnail video',
    is_floating: false,
    is_hero: false,
    order_index: 6,
  },
];

const timelineSource = [
  {
    title: 'Không biết từ bao giờ…',
    display_date: 'Một ngày rất lâu trước đó',
    actual_date: null,
    description:
      'Không biết từ bao giờ, Heli đã thích bé Quắn. Ban đầu chỉ là âm thầm giữ trong lòng, âm thầm quan sát, âm thầm ngắm nhìn bé, rồi tiếp cận bé như một người bạn.',
    mood: 'Âm thầm',
    is_highlight: true,
  },
  {
    title: 'Ngày cá tháng tư',
    display_date: '01/04',
    actual_date: '2026-04-01',
    description:
      'Bé Quắn trêu Heli là thích Heli. Dù biết đó là lời nói đùa, Heli vẫn vui lắm, vì đó là câu mà Heli đã muốn nghe từ rất lâu rồi. Heli cũng tiện thể hint hint lại rằng Heli thích bé Quắn.',
    mood: 'Vui lén',
    is_highlight: false,
  },
  {
    title: 'Những ngày lòng bắt đầu rõ hơn',
    display_date: 'Sau 01/04',
    actual_date: null,
    description:
      'Những ngày sau đó là những lần Heli nói thích, những lần cả hai trải lòng, trêu nhau về tình yêu, rồi dần dần thân hơn rất nhiều.',
    mood: 'Rõ ràng hơn',
    is_highlight: false,
  },
  {
    title: 'Concert FPT',
    display_date: '12/04',
    actual_date: '2026-04-12',
    description:
      'Heli đi concert FPT cùng nhóm bé Quắn. Vừa đến nơi là Heli đã ngóng tìm bé. Nhìn thấy dáng bé nhỏ nhắn dễ thương, Heli chỉ muốn được lại gần ngay. Được nghe nhạc hay, được ở gần bé, lòng Heli thật sự nhảy nhộn nhịp.',
    mood: 'Rộn ràng',
    is_highlight: true,
  },
  {
    title: 'Mega và tô tượng',
    display_date: '16/04',
    actual_date: '2026-04-16',
    description:
      'Nghe tin bé Quắn qua Mega mua quà, Heli đang tập gym cũng vội về tắm rửa rồi chạy ra gặp bé. Tối đó đi tô tượng, Heli vừa tô vừa lén nhìn bé. Có thêm một kỷ niệm với bé thật sự rất vui.',
    mood: 'Dễ thương',
    is_highlight: false,
  },
  {
    title: 'Lần đầu nói thật lòng',
    display_date: '20/04 - 21/04',
    actual_date: '2026-04-21',
    description:
      'Khuya 20/04 đến 2h sáng 21/04, Heli trải lòng với bé Quắn rằng Heli thích bé. Bé hơi sốc và nói chưa muốn yêu. Heli tôn trọng điều đó, tiếp tục chờ và tự nhủ mình cần cố gắng nhiều hơn để bé có thể tin tưởng.',
    mood: 'Thật lòng',
    is_highlight: true,
  },
  {
    title: 'First date',
    display_date: '23/04',
    actual_date: '2026-04-23',
    description:
      'First date đi xem phim ‘Hẹn em ngày nhật thực’. Đi xem phim tình cảm với bé mà Heli còn khóc nhiều hơn bé. Sau đó đi ăn nướng, ngồi nói chuyện tới khuya ở công viên Liên Chiểu. Đây là dấu mốc đầu tiên rất đặc biệt.',
    mood: 'Đặc biệt',
    is_highlight: true,
  },
  {
    title: 'Date 2 và cái nắm tay',
    display_date: '04/05',
    actual_date: '2026-05-04',
    description:
      'Trên đường chở bé về, Heli đề cập tới phần thưởng là được nắm tay bé. Rồi Heli đã chủ động nắm tay bé trên đoạn đường về. Một khoảnh khắc nhỏ nhưng Heli nhớ rất lâu.',
    mood: 'Run run',
    is_highlight: false,
  },
  {
    title: 'Con khỉ và những điều dịu dàng',
    display_date: '06/05',
    actual_date: '2026-05-06',
    description:
      'Heli tặng bé Quắn con khỉ. Hai đứa đan tay, dựa nhau nói chuyện, xem TikTok cùng nhau. Bé còn lau mồ hôi tay cho Heli. Hôm đó Heli thật sự tan chảy.',
    mood: 'Tan chảy',
    is_highlight: true,
  },
  {
    title: 'Biển Mỹ Khê',
    display_date: '07/05',
    actual_date: '2026-05-07',
    description:
      'Đi biển Mỹ Khê, tựa đầu nói chuyện, đan tay dạo biển, nói về tình yêu và gia đình. Biển hôm đó như xác nhận rõ hơn tình cảm của hai đứa.',
    mood: 'Healing',
    is_highlight: true,
  },
  {
    title: 'Một ngày cứ nghĩ về bé',
    display_date: '08/05',
    actual_date: '2026-05-08',
    description:
      'Chiều đi hát, Heli ngồi dựa bé Quắn. Cả ngày hôm đó Heli cứ nghĩ về bé, muốn được ở cạnh và ôm bé nhiều hơn.',
    mood: 'Nhớ',
    is_highlight: false,
  },
  {
    title: 'Cái ôm sau xe',
    display_date: '11/05',
    actual_date: '2026-05-11',
    description:
      'Heli chở bé Quắn đi sửa laptop và được bé ôm sau xe. Một điều nhỏ thôi nhưng làm Heli vui rất nhiều.',
    mood: 'Ấm lòng',
    is_highlight: false,
  },
  {
    title: 'Zone Six',
    display_date: '12/05',
    actual_date: '2026-05-12',
    description:
      'Đi Zone Six, có những khoảnh khắc rất tình cảm, những cái ôm, những lần dựa vào nhau. Heli thật sự không muốn ngày hôm đó kết thúc.',
    mood: 'Lưu luyến',
    is_highlight: true,
  },
  {
    title: 'Lời thề dưới trời mưa',
    display_date: '16/05',
    actual_date: '2026-05-16',
    description:
      'Heli thề trước trời mưa gió, sấm chớp cho bé Quắn. Một khoảnh khắc rất riêng của hai đứa.',
    mood: 'Riêng tư',
    is_highlight: true,
  },
  {
    title: 'Biển lại là nơi healing',
    display_date: '18/05',
    actual_date: '2026-05-18',
    description:
      'Đi biển Mỹ Khê, Heli tặng bé máy chườm bụng và một con gấu. Hôm đó ngồi nói chuyện rất vui, rất hạnh phúc. Biển luôn là nơi healing của đôi ta.',
    mood: 'Hạnh phúc',
    is_highlight: true,
  },
  {
    title: 'Homestay lần đầu',
    display_date: '29/05',
    actual_date: '2026-05-29',
    description:
      'Một buổi đi rất khó quên. Ban đầu cả hai còn ngại, nhưng rồi dần thoải mái hơn, cùng xem phim, cùng nói chuyện, cùng lưu lại nhiều khoảnh khắc đặc biệt.',
    mood: 'Khó quên',
    is_highlight: true,
  },
  {
    title: 'Một đêm ấm lòng',
    display_date: '04/06',
    actual_date: '2026-06-04',
    description:
      'Chiều đi hát cùng bé Quắn, tối có thêm một buổi thật nhiều cảm xúc. Được ôm bé ngủ, được bé dỗ dành khi Heli yếu lòng, Heli thấy mình hạnh phúc và được thương rất nhiều.',
    mood: 'Được thương',
    is_highlight: true,
  },
  {
    title: 'Chùa Linh Ứng',
    display_date: '09/06',
    actual_date: '2026-06-09',
    description:
      'Đi chùa Linh Ứng cùng bé Quắn. Heli đã cầu mọi điều tốt đẹp đến với bé, cầu bình an cho bé và cầu duyên cho đôi ta. Hôm đó có những tấm ảnh thật dễ thương và những khoảnh khắc rất an yên.',
    mood: 'An yên',
    is_highlight: true,
  },
];

export const fallbackTimeline: TimelineItem[] = timelineSource.map((item, index) => {
  const id = `timeline-${index + 1}`;

  return {
    id,
    ...item,
    is_published: true,
    order_index: index + 1,
    media: demoMedia
      .filter((media) => media.timeline_item_id === id)
      .sort((a, b) => a.order_index - b.order_index),
  };
});

export const fallbackFloatingMedia = demoMedia.filter(
  (media) => media.type === 'image' && media.is_floating,
);

export const getDefaultLetter = (type: Letter['type']) =>
  defaultLetters.find((letter) => letter.type === type) ?? defaultLetters[0];
