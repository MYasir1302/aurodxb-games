'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

interface CardItem {
  id: number;
  carId: string;
  name: string;
  color: string;
  svg: React.ReactNode;
  isFlipped: boolean;
  isMatched: boolean;
}

const CAR_ICONS = [
  {
    carId: 'roadster',
    name: 'Roadster',
    color: '#00f0ff',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <path d="M4 12 L10 6 L30 6 L36 12 L34 16 L6 16 Z" fill="#00f0ff" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'formula',
    name: 'Formula 1',
    color: '#a855f7',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <polygon points="4,10 20,8 36,5 34,14 6,14" fill="#a855f7" />
        <rect x="34" y="3" width="4" height="12" fill="#ffffff" />
        <circle cx="10" cy="15" r="3" fill="#0f172a" />
        <circle cx="30" cy="15" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'muscle',
    name: 'Muscle GT',
    color: '#ef4444',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <rect x="4" y="7" width="32" height="9" rx="2" fill="#ef4444" />
        <rect x="12" y="3" width="16" height="5" rx="1" fill="#7f1d1d" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'supercar',
    name: 'Supercar',
    color: '#f59e0b',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <polygon points="2,12 12,6 28,6 38,12 34,16 6,16" fill="#f59e0b" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'cybertruck',
    name: 'Cyber Truck',
    color: '#06b6d4',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <polygon points="4,13 14,4 32,4 36,13 34,16 6,16" fill="#06b6d4" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'buggy',
    name: 'Dune Buggy',
    color: '#10b981',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <rect x="6" y="7" width="28" height="8" rx="3" fill="#10b981" />
        <line x1="10" y1="7" x2="16" y2="2" stroke="#ffffff" strokeWidth="2" />
        <circle cx="10" cy="15" r="4" fill="#0f172a" />
        <circle cx="30" cy="15" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'taxi',
    name: 'Metro Taxi',
    color: '#eab308',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <rect x="4" y="8" width="32" height="8" rx="2" fill="#eab308" />
        <rect x="18" y="4" width="6" height="4" fill="#000000" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'police',
    name: 'Interceptor',
    color: '#3b82f6',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <rect x="4" y="8" width="32" height="8" rx="2" fill="#1e293b" />
        <rect x="16" y="5" width="4" height="3" fill="#ef4444" />
        <rect x="20" y="5" width="4" height="3" fill="#3b82f6" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'hyper',
    name: 'Hypercar',
    color: '#ec4899',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <path d="M2,12 Q14,4 28,4 Q38,10 38,14 L34,16 L6,16 Z" fill="#ec4899" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'pickup',
    name: 'Power 4x4',
    color: '#84cc16',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <polygon points="4,14 4,9 24,9 24,4 34,4 36,14" fill="#84cc16" />
        <circle cx="10" cy="16" r="3.5" fill="#0f172a" />
        <circle cx="30" cy="16" r="3.5" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'classic',
    name: 'Retro Coupe',
    color: '#d946ef',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <rect x="4" y="9" width="32" height="7" rx="3" fill="#d946ef" />
        <ellipse cx="20" cy="8" rx="8" ry="4" fill="#701a75" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
  {
    carId: 'drift',
    name: 'Drift Spec',
    color: '#14b8a6',
    svg: (
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <polygon points="4,13 12,6 30,6 38,13 34,16 6,16" fill="#14b8a6" />
        <line x1="4" y1="6" x2="8" y2="10" stroke="#000000" strokeWidth="2" />
        <circle cx="10" cy="16" r="3" fill="#0f172a" />
        <circle cx="30" cy="16" r="3" fill="#0f172a" />
      </svg>
    ),
  },
];

type Difficulty = 'easy' | 'medium' | 'hard';

export default function CarMemoryMatch() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const initGame = useCallback((diff: Difficulty) => {
    let pairCount = 8;
    if (diff === 'easy') pairCount = 6;
    if (diff === 'hard') pairCount = 12;

    const selectedCars = CAR_ICONS.slice(0, pairCount);
    const cardDeck: CardItem[] = [];

    selectedCars.forEach((car, idx) => {
      cardDeck.push({
        id: idx * 2,
        carId: car.carId,
        name: car.name,
        color: car.color,
        svg: car.svg,
        isFlipped: false,
        isMatched: false,
      });
      cardDeck.push({
        id: idx * 2 + 1,
        carId: car.carId,
        name: car.name,
        color: car.color,
        svg: car.svg,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    setCards(cardDeck);
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setTimerSec(0);
    setIsGameOver(false);
    setIsNewRecord(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const saved = getHighScore('car-memory-match');
    setHighScore(saved);
    initGame(difficulty);
  }, [difficulty, initGame]);

  // Timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setTimerSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  const handleCardClick = (id: number) => {
    if (flippedIds.length >= 2) return;
    const clickedCard = cards.find((c) => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    sounds.playClick();
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    // Flip card visually
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards.find((c) => c.id === newFlipped[0])!;
      const secondCard = clickedCard;

      if (firstCard.carId === secondCard.carId) {
        // MATCH!
        setTimeout(() => {
          sounds.playCoin();
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setMatches((prev) => {
            const nextMatches = prev + 1;
            const targetTotal = cards.length / 2;
            if (nextMatches >= targetTotal) {
              // GAME WON!
              sounds.playVictory();
              setIsGameOver(true);
              const scoreCalc = Math.max(100, 5000 - timerSec * 30 - moves * 40);
              const rec = saveHighScore('car-memory-match', scoreCalc);
              if (rec) {
                setIsNewRecord(true);
                setHighScore(scoreCalc);
              }
            }
            return nextMatches;
          });
        }, 400);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstCard.id || c.id === secondCard.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[560px] mx-auto">
      {/* Top HUD */}
      <div className="w-full mb-3 flex items-center justify-between px-4 py-2.5 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Moves</span>
            <span className="text-xl font-black text-brand-cyan font-mono">{moves}</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Matches</span>
            <span className="text-base font-bold text-green-400 font-mono">
              {matches} / {cards.length / 2}
            </span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Time</span>
            <span className="text-base font-bold text-yellow-400 font-mono">{timerSec}s</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty selector */}
          <div className="flex rounded-lg bg-brand-darker p-0.5 border border-brand-border text-xs">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  initGame(d);
                }}
                className={`px-2 py-1 rounded capitalize font-bold transition ${
                  difficulty === d
                    ? 'bg-brand-purple text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={() => initGame(difficulty)}
            className="p-2 rounded-lg bg-brand-border/40 hover:bg-brand-border text-gray-300 transition"
            title="Restart (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-brand-border/40 hover:bg-brand-border text-gray-300 transition"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-cyan" />}
          </button>
        </div>
      </div>

      {/* Cards Board */}
      <div className="w-full p-4 bg-brand-darker border-2 border-brand-border rounded-2xl shadow-2xl relative min-h-[420px]">
        <div
          className={`grid gap-2.5 sm:gap-3 ${
            difficulty === 'easy'
              ? 'grid-cols-3 sm:grid-cols-4'
              : difficulty === 'medium'
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-6'
          }`}
        >
          {cards.map((card) => {
            const isRevealed = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={isRevealed}
                className={`relative aspect-[3/4] sm:aspect-square rounded-xl border-2 transition-all duration-300 transform perspective-1000 flex flex-col items-center justify-center p-2 text-center ${
                  isRevealed
                    ? 'bg-brand-card/90 shadow-md scale-95 border-brand-cyan'
                    : 'bg-gradient-to-br from-brand-card to-brand-border hover:border-brand-purple/60 active:scale-95 border-brand-border cursor-pointer'
                }`}
                style={{
                  borderColor: card.isMatched ? '#10b981' : isRevealed ? card.color : undefined,
                }}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-between w-full h-full animate-fadeIn">
                    <div className="my-auto">{card.svg}</div>
                    <span
                      className="text-[10px] sm:text-xs font-bold truncate max-w-full"
                      style={{ color: card.color }}
                    >
                      {card.name}
                    </span>
                    {card.isMatched && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 absolute top-1.5 right-1.5" />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Sparkles className="w-5 h-5 text-brand-purple/40 mb-1" />
                    <span className="text-[10px] text-gray-500 font-mono font-bold">AURO</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Modal */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-brand-purple font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              GARAGE MATCHED!
            </span>
            <p className="text-gray-300 text-sm mb-4">You paired all car cards in {timerSec} seconds!</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-brand-purple/20 border border-brand-purple rounded-full text-brand-purple text-sm font-bold animate-pulse">
                🏆 NEW MATCH RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[240px] mb-6 text-sm">
              <div className="flex justify-between py-1 border-b border-brand-border/50">
                <span className="text-gray-400">Total Moves</span>
                <span className="font-bold text-brand-cyan">{moves}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Clear Time</span>
                <span className="font-bold text-yellow-400 font-mono">{timerSec}s</span>
              </div>
            </div>

            <button
              onClick={() => initGame(difficulty)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-cyan hover:brightness-110 text-brand-darker font-black text-sm rounded-xl shadow-neonPurple transition"
            >
              <RotateCcw className="w-4 h-4" /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
