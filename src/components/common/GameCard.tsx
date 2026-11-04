'use client';

import React from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';
import GameThumbnail from './GameThumbnail';
import { Play, Star, Flame } from 'lucide-react';

interface Props {
  game: Game;
  priority?: boolean;
}

export default function GameCard({ game }: Props) {
  return (
    <div className="group relative flex flex-col bg-brand-card hover:bg-brand-cardHover border border-brand-border hover:border-brand-cyan/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-cardGlow">
      {/* Thumbnail Area */}
      <Link href={`/games/${game.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-brand-darker">
        <GameThumbnail slug={game.slug} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md bg-brand-darker/80 text-gray-200 border border-brand-border">
          {game.category}
        </div>

        {/* Trending / New Badge */}
        {game.trending && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-pink text-white shadow-neonPink">
            <Flame className="w-3 h-3 fill-white" /> HOT
          </div>
        )}

        {/* Hover Overlay with Big Play Icon */}
        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-brand-cyan text-brand-darker flex items-center justify-center shadow-neonCyan transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-7 h-7 fill-brand-darker ml-1" />
          </div>
        </div>
      </Link>

      {/* Card Info Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <Link
            href={`/games/${game.slug}`}
            className="font-black text-base text-gray-100 group-hover:text-brand-cyan transition-colors truncate"
          >
            {game.title}
          </Link>
          <div className="flex items-center gap-1 text-xs font-bold text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            <span>{game.rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
          {game.shortDescription}
        </p>

        {/* Card Footer: Tags & Play Button */}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/60">
          <span className="text-[11px] text-gray-500 font-mono">
            {(game.playCount / 1000).toFixed(1)}k plays
          </span>

          <Link
            href={`/games/${game.slug}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-border hover:bg-brand-cyan hover:text-brand-darker text-gray-200 text-xs font-bold transition-all duration-200"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> PLAY
          </Link>
        </div>
      </div>
    </div>
  );
}
