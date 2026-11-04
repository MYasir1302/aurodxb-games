import { RecentlyPlayedItem } from '@/types/game';

const HIGH_SCORE_PREFIX = 'auro_highscore_';
const RECENTLY_PLAYED_KEY = 'auro_recently_played';

export function getHighScore(gameSlug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = localStorage.getItem(HIGH_SCORE_PREFIX + gameSlug);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function saveHighScore(gameSlug: string, score: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getHighScore(gameSlug);
    if (score > current) {
      localStorage.setItem(HIGH_SCORE_PREFIX + gameSlug, String(Math.floor(score)));
      return true; // New record!
    }
  } catch {
    // Ignore storage quota error
  }
  return false;
}

export function getRecentlyPlayed(): RecentlyPlayedItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENTLY_PLAYED_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordGamePlayed(item: Omit<RecentlyPlayedItem, 'lastPlayed' | 'highScore'>) {
  if (typeof window === 'undefined') return;
  try {
    const list = getRecentlyPlayed().filter((g) => g.slug !== item.slug);
    const updated: RecentlyPlayedItem = {
      ...item,
      lastPlayed: Date.now(),
      highScore: getHighScore(item.slug),
    };
    const nextList = [updated, ...list].slice(0, 6);
    localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(nextList));
  } catch {
    // Ignore storage quota error
  }
}
