'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentlyPlayed } from '@/lib/storage';
import { RecentlyPlayedItem } from '@/types/game';
import GameThumbnail from './GameThumbnail';
import { History, Play, Trophy } from 'lucide-react';

export default function RecentlyPlayed() {
  const [recent, setRecent] = useState<RecentlyPlayedItem[]>([]);

  useEffect(() => {
    setRecent(getRecentlyPlayed());
  }, []);

  if (recent.length === 0) return null;

  return (
    <section className="w-full mb-12">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-brand-cyan" />
        <h2 className="text-xl sm:text-2xl font-black text-white">Recently Played</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
        {recent.map((item) => (
          <Link
            key={item.slug}
            href={`/games/${item.slug}`}
            className="group relative flex flex-col bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-purple rounded-xl overflow-hidden p-2 transition-all duration-200 hover:-translate-y-1 shadow-sm"
          >
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-brand-darker mb-2">
              <GameThumbnail slug={item.slug} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Play className="w-6 h-6 text-brand-cyan fill-brand-cyan" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-200 group-hover:text-brand-purple truncate">
                {item.title}
              </span>
              {item.highScore > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-mono text-yellow-400 mt-0.5">
                  <Trophy className="w-3 h-3" />
                  <span>{item.highScore}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
