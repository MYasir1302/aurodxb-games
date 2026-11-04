import React from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';
import GameThumbnail from './GameThumbnail';
import { Play, Flame, Star, Trophy, Sparkles } from 'lucide-react';

interface Props {
  game: Game;
}

export default function HeroFeatured({ game }: Props) {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-brand-border bg-gradient-to-br from-brand-card via-brand-darker to-[#13112b] p-6 sm:p-8 lg:p-10 shadow-2xl mb-12">
      {/* Background Neon Glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Info & CTA */}
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-brand-purple to-brand-cyan text-brand-darker shadow-neonCyan">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> FEATURED CAR GAME
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-border/60 text-brand-cyan border border-brand-cyan/40">
              {game.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
            {game.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl mb-6">
            {game.description}
          </p>

          {/* Quick Specs Pill Row */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-brand-darker/80 px-3 py-1.5 rounded-xl border border-brand-border text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="font-bold">{game.rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-darker/80 px-3 py-1.5 rounded-xl border border-brand-border text-gray-300">
              <Flame className="w-4 h-4 text-brand-pink fill-brand-pink" />
              <span>{(game.playCount / 1000).toFixed(1)}k Sessions</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-darker/80 px-3 py-1.5 rounded-xl border border-brand-border text-brand-cyan">
              <Trophy className="w-4 h-4" />
              <span>Global Leaderboard</span>
            </div>
          </div>

          {/* Play Now CTA Button */}
          <Link
            href={`/games/${game.slug}`}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-cyan via-[#53f3ff] to-brand-purple text-brand-darker font-black text-lg tracking-wider hover:brightness-110 hover:shadow-neonCyan active:scale-95 transition-all duration-200"
          >
            <Play className="w-6 h-6 fill-brand-darker" /> PLAY NOW - FREE
          </Link>
        </div>

        {/* Right Column: Hero Graphic Preview */}
        <div className="lg:col-span-5 relative">
          <Link
            href={`/games/${game.slug}`}
            className="group relative block aspect-[16/11] rounded-2xl overflow-hidden border-2 border-brand-border group-hover:border-brand-cyan shadow-2xl transition duration-300"
          >
            <GameThumbnail slug={game.slug} className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/80 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 backdrop-blur-[2px]">
              <div className="w-16 h-16 rounded-full bg-brand-cyan text-brand-darker flex items-center justify-center shadow-neonCyan transform scale-90 group-hover:scale-100 transition">
                <Play className="w-8 h-8 fill-brand-darker ml-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
