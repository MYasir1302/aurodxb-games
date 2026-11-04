import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES, GAMES, getGamesByCategory } from '@/data/games';
import { GameCategory } from '@/types/game';
import GameCard from '@/components/common/GameCard';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import { ChevronRight, Flag, Trophy } from 'lucide-react';

interface Props {
  params: {
    name: string;
  };
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({
    name: c.name.toLowerCase(),
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const categoryInfo = CATEGORIES.find(
    (c) => c.name.toLowerCase() === params.name.toLowerCase()
  );

  if (!categoryInfo) return { title: 'Category Not Found' };

  return {
    title: `${categoryInfo.name} Car Games - Play Free Online`,
    description: categoryInfo.description,
    openGraph: {
      title: `${categoryInfo.name} Car Games | AuroDXB Games`,
      description: categoryInfo.description,
      url: `https://aurodxb.com/category/${params.name.toLowerCase()}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const categoryInfo = CATEGORIES.find(
    (c) => c.name.toLowerCase() === params.name.toLowerCase()
  );

  if (!categoryInfo) {
    notFound();
  }

  const categoryGames = getGamesByCategory(categoryInfo.name);

  return (
    <div className="w-full flex flex-col">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
        <Link href="/" className="hover:text-brand-cyan transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-400">Categories</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-brand-cyan font-bold">{categoryInfo.name}</span>
      </nav>

      {/* Category Hero Header */}
      <div className="w-full p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-card via-brand-darker to-[#13112e] border border-brand-border mb-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-mono font-bold text-brand-purple uppercase tracking-widest mb-2 block">
            GENRE SPOTLIGHT
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3">
            {categoryInfo.name} <span className="text-brand-cyan">Games</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
            {categoryInfo.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="px-3 py-1 rounded-full bg-brand-darker border border-brand-border text-brand-cyan font-bold">
              {categoryGames.length} Games Available
            </span>
            <span>• Instant browser gameplay</span>
          </div>
        </div>

        {/* Ambient Neon Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Games Grid */}
      <section className="w-full mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoryGames.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* AdSense Unit */}
      <AdPlaceholder slot="below-game" className="mb-12" />

      {/* Other Categories Switcher */}
      <section className="w-full pt-8 border-t border-brand-border/80">
        <h2 className="text-xl font-black text-white mb-4">Explore Other Genres</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.filter((c) => c.name !== categoryInfo.name).map((other) => {
            const count = GAMES.filter((g) => g.category === other.name).length;
            return (
              <Link
                key={other.name}
                href={`/category/${other.name.toLowerCase()}`}
                className="p-4 rounded-2xl bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-purple/60 transition group"
              >
                <div className="font-bold text-white group-hover:text-brand-purple mb-1">
                  {other.name}
                </div>
                <div className="text-xs text-gray-400">{count} games</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
