import { MetadataRoute } from 'next';
import { GAMES, CATEGORIES } from '@/data/games';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aurodxb.com';

  // Static core pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  // Game pages
  const gamePages = GAMES.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Category pages
  const categoryPages = CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat.name.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...gamePages, ...categoryPages];
}
