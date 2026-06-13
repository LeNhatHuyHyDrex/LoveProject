export type LetterType = 'accept' | 'gentle';
export type LoveChoice = LetterType;
export type MediaType = 'image' | 'video' | 'youtube';

export type Letter = {
  id?: string;
  type: LetterType;
  title: string;
  content: string;
  updated_at?: string;
};

export type MediaFile = {
  id: string;
  timeline_item_id: string | null;
  type: MediaType;
  url: string;
  thumbnail_url: string | null;
  public_id: string | null;
  caption: string | null;
  alt: string | null;
  is_floating: boolean;
  is_hero: boolean;
  order_index: number;
  created_at?: string;
};

export type TimelineItem = {
  id: string;
  title: string;
  display_date: string | null;
  actual_date: string | null;
  description: string | null;
  mood: string | null;
  is_highlight: boolean;
  is_published: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
  media: MediaFile[];
};

export type AppSettings = {
  site_title: string;
  heli_name: string;
  lover_name: string;
  background_music_url: string;
  enable_music: boolean;
  enable_floating_photos: boolean;
  intro_question: string;
  theme: string;
};

export type SettingsRow = {
  key: keyof AppSettings | string;
  value: unknown;
  updated_at?: string;
};

export type LoveResponse = {
  id: string;
  choice: LoveChoice;
  created_at: string;
  user_agent: string | null;
  note: string | null;
};
