export type GameCategory = 'Racing' | 'Parking' | 'Stunt' | 'Puzzle' | 'Casual';

export interface GameControlItem {
  key: string;
  action: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: GameCategory;
  tags: string[];
  controls: GameControlItem[];
  mobileControlsHint: string;
  featured?: boolean;
  trending?: boolean;
  releaseYear: number;
  rating: number; // e.g. 4.8
  playCount: number;
  thumbnailAccent: string; // neon color
}

export interface RecentlyPlayedItem {
  slug: string;
  title: string;
  category: GameCategory;
  lastPlayed: number;
  highScore: number;
}
