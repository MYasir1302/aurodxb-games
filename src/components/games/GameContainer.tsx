'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Game } from '@/types/game';
import { recordGamePlayed } from '@/lib/storage';
import { Maximize2, Minimize2, Keyboard, Sparkles } from 'lucide-react';

// Dynamically import games to keep initial page bundle ultra fast
const TrafficRacer = dynamic(() => import('./TrafficRacer'), { ssr: false });
const DriftMaster = dynamic(() => import('./DriftMaster'), { ssr: false });
const CircuitRush = dynamic(() => import('./CircuitRush'), { ssr: false });
const ParkingMaster = dynamic(() => import('./ParkingMaster'), { ssr: false });
const HillClimbRacer = dynamic(() => import('./HillClimbRacer'), { ssr: false });
const StuntRampJump = dynamic(() => import('./StuntRampJump'), { ssr: false });
const FuelRun = dynamic(() => import('./FuelRun'), { ssr: false });
const CarMerge = dynamic(() => import('./CarMerge'), { ssr: false });
const CarMemoryMatch = dynamic(() => import('./CarMemoryMatch'), { ssr: false });
const TaxiRush = dynamic(() => import('./TaxiRush'), { ssr: false });

interface Props {
  game: Game;
}

export default function GameContainer({ game }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Record recently played
    recordGamePlayed({
      slug: game.slug,
      title: game.title,
      category: game.category,
    });

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [game]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or denied
    }
  };

  const renderGame = () => {
    switch (game.slug) {
      case 'traffic-racer':
        return <TrafficRacer />;
      case 'drift-master':
        return <DriftMaster />;
      case 'circuit-rush':
        return <CircuitRush />;
      case 'parking-master':
        return <ParkingMaster />;
      case 'hill-climb-racer':
        return <HillClimbRacer />;
      case 'stunt-ramp-jump':
        return <StuntRampJump />;
      case 'fuel-run':
        return <FuelRun />;
      case 'car-merge':
        return <CarMerge />;
      case 'car-memory-match':
        return <CarMemoryMatch />;
      case 'taxi-rush':
        return <TaxiRush />;
      default:
        return <DriftMaster />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center rounded-3xl border border-brand-border bg-gradient-to-b from-brand-card to-brand-darker overflow-hidden shadow-2xl p-4 sm:p-6 ${
        isFullscreen ? 'h-screen w-screen p-2 rounded-none' : ''
      }`}
    >
      {/* Top Game Stage Bar */}
      <div className="w-full max-w-[640px] flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-gray-300">LIVE GAME STAGE</span>
        </div>

        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-border/60 hover:bg-brand-cyan hover:text-brand-darker text-gray-300 text-xs font-bold transition shadow"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" /> Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" /> Fullscreen
            </>
          )}
        </button>
      </div>

      {/* Centered Game Component */}
      <div className="w-full flex justify-center py-2">{renderGame()}</div>

      {/* Bottom Hint */}
      {!isFullscreen && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Keyboard className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Supports Keyboard & Touch Controls</span>
        </div>
      )}
    </div>
  );
}
