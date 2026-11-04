import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GAMES, getGameBySlug, getRelatedGames } from '@/data/games';
import GameContainer from '@/components/games/GameContainer';
import GameCard from '@/components/common/GameCard';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import { ChevronRight, Star, Flame, Trophy, Keyboard, Smartphone, Flag } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return GAMES.map((game) => ({
    slug: game.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const game = getGameBySlug(params.slug);
  if (!game) {
    return { title: 'Game Not Found' };
  }

  return {
    title: `${game.title} - Free Online Car Game`,
    description: game.shortDescription,
    keywords: [
      game.title,
      `${game.title} online`,
      `${game.category} car game`,
      'free browser car game',
      ...game.tags,
    ],
    openGraph: {
      title: `${game.title} - Play Free on AuroDXB Games`,
      description: game.description,
      url: `https://aurodxb.com/games/${game.slug}`,
      type: 'video.other',
    },
  };
}

export default function GamePage({ params }: Props) {
  const game = getGameBySlug(params.slug);
  if (!game) {
    notFound();
  }

  const relatedGames = getRelatedGames(game.slug, 4);

  return (
    <div className="w-full flex flex-col">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
        <Link href="/" className="hover:text-brand-cyan transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link href={`/category/${game.category.toLowerCase()}`} className="hover:text-brand-purple transition">
          {game.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-bold">{game.title}</span>
      </nav>

      {/* Main Game Stage Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 items-start">
        {/* Left Column: Game Canvas Stage */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Game Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-border text-brand-cyan border border-brand-cyan/30">
                  {game.category}
                </span>
                {game.trending && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-pink text-white">
                    <Flame className="w-3 h-3 fill-white" /> POPULAR
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white">{game.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-card border border-brand-border text-yellow-400 text-xs font-bold font-mono">
                <Star className="w-4 h-4 fill-yellow-400" />
                <span>{game.rating.toFixed(1)}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-brand-card border border-brand-border text-gray-300 text-xs font-mono">
                {(game.playCount / 1000).toFixed(1)}k plays
              </div>
            </div>
          </div>

          {/* Centered Game Canvas Component */}
          <GameContainer game={game} />

          {/* Under-Game AdSense Banner */}
          <AdPlaceholder slot="below-game" className="my-6" />

          {/* Description & Overview */}
          <div className="mt-4 p-6 rounded-2xl bg-brand-card/60 border border-brand-border">
            <h2 className="text-lg font-bold text-white mb-2">About {game.title}</h2>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">{game.description}</p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-brand-border/60">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-brand-darker border border-brand-border text-gray-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Controls Cheatsheet & Sidebar Ad */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Controls Instructions Card */}
          <div className="p-6 rounded-2xl bg-brand-card border border-brand-border shadow-lg">
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <Keyboard className="w-4 h-4 text-brand-cyan" /> Controls Guide
            </h2>

            <div className="space-y-2.5 mb-6">
              {game.controls.map((ctrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-darker border border-brand-border/60 text-xs"
                >
                  <span className="font-mono font-bold text-brand-cyan px-2 py-1 bg-brand-card rounded-md border border-brand-border">
                    {ctrl.key}
                  </span>
                  <span className="text-gray-300 font-medium">{ctrl.action}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-brand-darker/60 border border-brand-border/40">
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-purple mb-1">
                <Smartphone className="w-3.5 h-3.5" /> Mobile & Tablet Play
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {game.mobileControlsHint}
              </p>
            </div>
          </div>

          {/* Sidebar Google AdSense Unit */}
          <AdPlaceholder slot="sidebar" />
        </div>
      </div>

      {/* Related Games Section */}
      <section className="w-full mt-12 pt-8 border-t border-brand-border/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">More Car Games to Play</h2>
            <p className="text-xs text-gray-400 mt-0.5">Jump straight into another high-speed ride</p>
          </div>
          <Link
            href={`/category/${game.category.toLowerCase()}`}
            className="text-xs font-bold text-brand-cyan hover:underline"
          >
            All {game.category} Games ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedGames.map((rel) => (
            <GameCard key={rel.slug} game={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}
