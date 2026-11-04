'use client';

import React, { useState } from 'react';
import { GAMES, CATEGORIES } from '@/data/games';
import { GameCategory } from '@/types/game';
import HeroFeatured from '@/components/common/HeroFeatured';
import GameCard from '@/components/common/GameCard';
import RecentlyPlayed from '@/components/common/RecentlyPlayed';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import GameThumbnail from '@/components/common/GameThumbnail';
import Link from 'next/link';
import { Flame, Grid, Trophy, Sparkles, Play } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Featured game is Drift Master
  const featuredGame = GAMES.find((g) => g.featured) || GAMES[0];

  // Trending games
  const trendingGames = GAMES.filter((g) => g.trending);

  // Filtered games for category tabs
  const displayedGames =
    selectedCategory === 'all'
      ? GAMES
      : GAMES.filter(
          (g) => g.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="w-full flex flex-col">
      {/* Hero Featured Game Banner */}
      <HeroFeatured game={featuredGame} />

      {/* Recently Played Section (from localStorage) */}
      <RecentlyPlayed />

      {/* Horizontal "Trending" Car Games Row */}
      <section className="w-full mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-pink fill-brand-pink" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Trending Rides</h2>
          </div>
          <span className="text-xs text-gray-400 font-mono">Most popular this week</span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
          {trendingGames.map((game) => (
            <div
              key={game.slug}
              className="min-w-[260px] sm:min-w-[300px] max-w-[320px] flex-shrink-0 snap-start"
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </section>

      {/* In-feed Ad Banner */}
      <AdPlaceholder slot="in-feed" className="my-6" />

      {/* Main Games Catalog Section with Category Tabs */}
      <section className="w-full mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Grid className="w-6 h-6 text-brand-cyan" /> All Car Games
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Select a genre or explore the entire 10-car collection
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-purple text-brand-darker shadow-neonCyan'
                  : 'bg-brand-card hover:bg-brand-cardHover text-gray-400 hover:text-white border border-brand-border'
              }`}
            >
              All (10)
            </button>

            {CATEGORIES.map((cat) => {
              const count = GAMES.filter((g) => g.category === cat.name).length;
              const isActive = selectedCategory === cat.name.toLowerCase();

              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name.toLowerCase())}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-neonPurple border border-brand-purple'
                      : 'bg-brand-card hover:bg-brand-cardHover text-gray-400 hover:text-white border border-brand-border'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid of Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* Why AuroDXB Games SEO Featurettes */}
      <section className="w-full rounded-3xl bg-brand-card/50 border border-brand-border p-6 sm:p-10 mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest">
            THE MINICLIP FOR CAR ENTHUSIASTS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Built for Pure Speed & Zero Friction
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Every game is 100% self-engineered in HTML5 Canvas and React. No external plugins, no bulky downloads, and no intrusive popups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-brand-darker/60 border border-brand-border">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center font-bold mb-4">
              ⚡
            </div>
            <h3 className="font-bold text-base text-white mb-2">Instant Browser Play</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Play directly on smartphone, tablet, or desktop with 60 FPS Canvas rendering and full touch support.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-darker/60 border border-brand-border">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/40 text-brand-purple flex items-center justify-center font-bold mb-4">
              🏆
            </div>
            <h3 className="font-bold text-base text-white mb-2">Persistent High Scores</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your best lap times, drift records, and garage merges are automatically stored locally in your browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-brand-darker/60 border border-brand-border">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 flex items-center justify-center font-bold mb-4">
              🎮
            </div>
            <h3 className="font-bold text-base text-white mb-2">10 Diverse Genres</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              From endless highway overtaking to 2D hill climbing, precision parking, and 2048 car puzzle merges.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
