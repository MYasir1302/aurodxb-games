'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { RotateCcw, Volume2, VolumeX, Undo2, Trophy } from 'lucide-react';

interface CarTierInfo {
  tier: number;
  val: number;
  name: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  iconSvg: React.ReactNode;
}

const CAR_TIERS: Record<number, CarTierInfo> = {
  2: {
    tier: 1,
    val: 2,
    name: 'Compact',
    bgGradient: 'from-blue-900/60 to-blue-800/80',
    borderColor: '#3b82f6',
    textColor: '#93c5fd',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <rect x="6" y="8" width="36" height="12" rx="3" fill="#3b82f6" />
        <rect x="14" y="3" width="18" height="8" rx="2" fill="#1e3a8a" />
        <circle cx="12" cy="20" r="4" fill="#0f172a" />
        <circle cx="36" cy="20" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  4: {
    tier: 2,
    val: 4,
    name: 'Sedan',
    bgGradient: 'from-teal-900/60 to-teal-800/80',
    borderColor: '#14b8a6',
    textColor: '#5eead4',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <rect x="4" y="9" width="40" height="11" rx="3" fill="#14b8a6" />
        <path d="M12 9 L18 2 L30 2 L36 9 Z" fill="#042f2e" />
        <circle cx="11" cy="20" r="4" fill="#0f172a" />
        <circle cx="37" cy="20" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  8: {
    tier: 3,
    val: 8,
    name: 'Muscle GT',
    bgGradient: 'from-amber-900/60 to-amber-800/80',
    borderColor: '#f59e0b',
    textColor: '#fde68a',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <rect x="3" y="8" width="42" height="12" rx="3" fill="#f59e0b" />
        <rect x="12" y="3" width="20" height="7" rx="1" fill="#78350f" />
        <rect x="2" y="12" width="4" height="4" fill="#dc2626" />
        <circle cx="11" cy="20" r="4" fill="#0f172a" />
        <circle cx="37" cy="20" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  16: {
    tier: 4,
    val: 16,
    name: 'Coupe',
    bgGradient: 'from-rose-900/60 to-rose-800/80',
    borderColor: '#f43f5e',
    textColor: '#fecdd3',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <rect x="4" y="9" width="40" height="11" rx="4" fill="#f43f5e" />
        <path d="M14 9 L22 3 L32 3 L38 9 Z" fill="#4c0519" />
        <circle cx="12" cy="20" r="4" fill="#0f172a" />
        <circle cx="36" cy="20" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  32: {
    tier: 5,
    val: 32,
    name: 'Off-Road',
    bgGradient: 'from-emerald-900/60 to-emerald-800/80',
    borderColor: '#10b981',
    textColor: '#a7f3d0',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <rect x="5" y="6" width="38" height="12" rx="4" fill="#10b981" />
        <line x1="8" y1="6" x2="16" y2="1" stroke="#ffffff" strokeWidth="2" />
        <line x1="32" y1="1" x2="40" y2="6" stroke="#ffffff" strokeWidth="2" />
        <circle cx="12" cy="19" r="5" fill="#022c22" stroke="#6ee7b7" strokeWidth="1" />
        <circle cx="36" cy="19" r="5" fill="#022c22" stroke="#6ee7b7" strokeWidth="1" />
      </svg>
    ),
  },
  64: {
    tier: 6,
    val: 64,
    name: 'Supercar',
    bgGradient: 'from-purple-900/60 to-purple-800/80',
    borderColor: '#a855f7',
    textColor: '#e9d5ff',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <path d="M4 14 L12 8 L36 8 L44 14 L42 19 L6 19 Z" fill="#a855f7" />
        <path d="M16 8 L22 3 L30 3 L34 8 Z" fill="#3b0764" />
        <rect x="2" y="6" width="6" height="3" fill="#00f0ff" />
        <circle cx="11" cy="19" r="4" fill="#0f172a" />
        <circle cx="37" cy="19" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  128: {
    tier: 7,
    val: 128,
    name: 'Hypercar',
    bgGradient: 'from-pink-900/60 to-pink-800/80',
    borderColor: '#ec4899',
    textColor: '#fbcfe8',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <path d="M2 13 L14 7 L36 7 L46 13 L42 19 L4 19 Z" fill="#ec4899" />
        <polygon points="18,7 24,2 32,2 36,7" fill="#500724" />
        <circle cx="11" cy="19" r="4" fill="#0f172a" />
        <circle cx="37" cy="19" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  256: {
    tier: 8,
    val: 256,
    name: 'Cyber Track',
    bgGradient: 'from-cyan-950/80 to-cyan-900/90',
    borderColor: '#06b6d4',
    textColor: '#a5f3fc',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <polygon points="2,16 12,4 40,4 46,16 42,20 6,20" fill="#06b6d4" />
        <line x1="12" y1="4" x2="40" y2="4" stroke="#ffffff" strokeWidth="2" />
        <circle cx="10" cy="20" r="4" fill="#083344" />
        <circle cx="38" cy="20" r="4" fill="#083344" />
      </svg>
    ),
  },
  512: {
    tier: 9,
    val: 512,
    name: 'Formula V',
    bgGradient: 'from-yellow-950/80 to-amber-900/90',
    borderColor: '#eab308',
    textColor: '#fef08a',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <polygon points="4,12 24,9 44,6 40,16 8,16" fill="#eab308" />
        <rect x="42" y="3" width="4" height="15" fill="#1e293b" />
        <circle cx="12" cy="18" r="4" fill="#0f172a" />
        <circle cx="36" cy="18" r="4" fill="#0f172a" />
      </svg>
    ),
  },
  1024: {
    tier: 10,
    val: 1024,
    name: 'Auro Prototype',
    bgGradient: 'from-purple-950/90 to-indigo-900/90',
    borderColor: '#8b5cf6',
    textColor: '#ddd6fe',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto">
        <path d="M2 13 L12 5 L36 5 L46 13 L42 19 L4 19 Z" fill="#8b5cf6" />
        <circle cx="24" cy="10" r="4" fill="#00f0ff" />
        <circle cx="10" cy="19" r="4" fill="#1e1b4b" stroke="#00f0ff" strokeWidth="1" />
        <circle cx="38" cy="19" r="4" fill="#1e1b4b" stroke="#00f0ff" strokeWidth="1" />
      </svg>
    ),
  },
  2048: {
    tier: 11,
    val: 2048,
    name: 'Future Auro 2048',
    bgGradient: 'from-brand-cyan/30 via-brand-purple/40 to-brand-pink/30',
    borderColor: '#00f0ff',
    textColor: '#ffffff',
    iconSvg: (
      <svg viewBox="0 0 48 24" className="w-12 h-6 mx-auto animate-pulse">
        <polygon points="2,14 16,3 32,3 46,14 38,19 10,19" fill="#00f0ff" />
        <rect x="18" y="5" width="12" height="4" fill="#ff2a85" />
        <circle cx="12" cy="18" r="3" fill="#a855f7" />
        <circle cx="36" cy="18" r="3" fill="#a855f7" />
      </svg>
    ),
  },
};

type Grid = number[][];

export default function CarMerge() {
  const [grid, setGrid] = useState<Grid>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const [previousGrid, setPreviousGrid] = useState<Grid | null>(null);
  const [score, setScore] = useState(0);
  const [previousScore, setPreviousScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Spawn a new tile (2 or 4) in an empty cell
  const spawnTile = (currentGrid: Grid): Grid => {
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }

    if (emptyCells.length === 0) return currentGrid;

    const chosen = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = currentGrid.map((row) => [...row]);
    newGrid[chosen.r][chosen.c] = Math.random() > 0.85 ? 4 : 2;
    return newGrid;
  };

  const startNewGame = useCallback(() => {
    let fresh: Grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    fresh = spawnTile(fresh);
    fresh = spawnTile(fresh);
    setGrid(fresh);
    setPreviousGrid(null);
    setScore(0);
    setIsGameOver(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const undoMove = () => {
    if (previousGrid) {
      setGrid(previousGrid);
      setScore(previousScore);
      setPreviousGrid(null);
      sounds.playClick();
    }
  };

  useEffect(() => {
    const saved = getHighScore('car-merge');
    setHighScore(saved);
    startNewGame();
  }, [startNewGame]);

  // Check if any moves are available
  const canMove = (g: Grid): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (g[r][c] === 0) return true;
        if (r < 3 && g[r][c] === g[r + 1][c]) return true;
        if (c < 3 && g[r][c] === g[r][c + 1]) return true;
      }
    }
    return false;
  };

  // 2048 slide logic
  const slideRow = (row: number[]): { newRow: number[]; gainedScore: number; merged: boolean } => {
    let filtered = row.filter((v) => v !== 0);
    let gainedScore = 0;
    let merged = false;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        gainedScore += filtered[i];
        filtered[i + 1] = 0;
        merged = true;
      }
    }

    filtered = filtered.filter((v) => v !== 0);
    while (filtered.length < 4) {
      filtered.push(0);
    }

    return { newRow: filtered, gainedScore, merged };
  };

  const move = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (isGameOver) return;

      let gainedTotal = 0;
      let hasMergedAny = false;
      let newGrid: Grid = grid.map((r) => [...r]);

      if (dir === 'LEFT') {
        for (let r = 0; r < 4; r++) {
          const res = slideRow(newGrid[r]);
          newGrid[r] = res.newRow;
          gainedTotal += res.gainedScore;
          if (res.merged) hasMergedAny = true;
        }
      } else if (dir === 'RIGHT') {
        for (let r = 0; r < 4; r++) {
          const reversed = [...newGrid[r]].reverse();
          const res = slideRow(reversed);
          newGrid[r] = res.newRow.reverse();
          gainedTotal += res.gainedScore;
          if (res.merged) hasMergedAny = true;
        }
      } else if (dir === 'UP') {
        for (let c = 0; c < 4; c++) {
          const col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
          const res = slideRow(col);
          for (let r = 0; r < 4; r++) newGrid[r][c] = res.newRow[r];
          gainedTotal += res.gainedScore;
          if (res.merged) hasMergedAny = true;
        }
      } else if (dir === 'DOWN') {
        for (let c = 0; c < 4; c++) {
          const col = [newGrid[3][c], newGrid[2][c], newGrid[1][c], newGrid[0][c]];
          const res = slideRow(col);
          const reversed = res.newRow.reverse();
          for (let r = 0; r < 4; r++) newGrid[r][c] = reversed[r];
          gainedTotal += res.gainedScore;
          if (res.merged) hasMergedAny = true;
        }
      }

      // Check if grid changed
      const changed = JSON.stringify(newGrid) !== JSON.stringify(grid);
      if (changed) {
        setPreviousGrid(grid);
        setPreviousScore(score);

        const spawned = spawnTile(newGrid);
        setGrid(spawned);

        const newScore = score + gainedTotal;
        setScore(newScore);

        if (hasMergedAny) {
          sounds.playCoin();
        } else {
          sounds.playClick();
        }

        saveHighScore('car-merge', newScore);
        if (newScore > highScore) setHighScore(newScore);

        if (!canMove(spawned)) {
          setIsGameOver(true);
          sounds.playGameOver();
        }
      }
    },
    [grid, isGameOver, score, highScore]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move('LEFT');
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') move('RIGHT');
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') move('UP');
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') move('DOWN');
      if (e.code === 'KeyU') undoMove();
      if (e.code === 'KeyR') startNewGame();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, startNewGame]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) move('RIGHT');
        else move('LEFT');
      } else {
        if (dy > 0) move('DOWN');
        else move('UP');
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-[440px] mx-auto">
      {/* Top HUD */}
      <div className="w-full mb-3 flex items-center justify-between px-4 py-2.5 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Score</span>
            <span className="text-xl font-black text-brand-cyan font-mono">{score}</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-[10px] text-gray-400 block uppercase font-mono">Best</span>
            <span className="text-base font-bold text-brand-purple font-mono">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {previousGrid && (
            <button
              onClick={undoMove}
              className="p-2 rounded-lg bg-brand-border/40 hover:bg-brand-border text-gray-300 transition"
              title="Undo Move (U)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={startNewGame}
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

      {/* 4x4 Grid Board */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full p-3 bg-brand-darker border-2 border-brand-border rounded-2xl shadow-2xl relative"
      >
        <div className="grid grid-cols-4 gap-2.5 aspect-square">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const car = val > 0 ? CAR_TIERS[val] : null;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all duration-150 ${
                    car
                      ? `bg-gradient-to-b ${car.bgGradient} shadow-md`
                      : 'bg-brand-card/40 border-brand-border/40'
                  }`}
                  style={{ borderColor: car ? car.borderColor : undefined }}
                >
                  {car ? (
                    <>
                      <div className="w-full flex justify-between items-center text-[10px] font-mono font-bold">
                        <span className="text-gray-400">T{car.tier}</span>
                        <span style={{ color: car.textColor }}>{car.val}</span>
                      </div>
                      <div className="my-auto">{car.iconSvg}</div>
                      <div
                        className="text-[10px] font-bold truncate max-w-full"
                        style={{ color: car.textColor }}
                      >
                        {car.name}
                      </div>
                    </>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <Trophy className="w-12 h-12 text-yellow-400 mb-2 animate-bounce" />
            <span className="text-brand-purple font-black tracking-widest text-2xl uppercase">
              GARAGE FULL!
            </span>
            <p className="text-gray-300 text-xs mb-4">No more merges possible</p>

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-3 w-full max-w-[200px] mb-4 text-sm">
              <div className="flex justify-between py-1 text-xs">
                <span className="text-gray-400">Score</span>
                <span className="font-bold text-brand-cyan">{score}</span>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-cyan to-brand-purple text-brand-darker font-black text-sm rounded-xl shadow-neonCyan transition"
            >
              NEW GARAGE
            </button>
          </div>
        )}
      </div>

      {/* Touch D-Pad for Swipe / Tap */}
      <div className="w-full mt-3 flex justify-center gap-2">
        <button
          onClick={() => move('LEFT')}
          className="w-16 h-12 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200"
        >
          ◀
        </button>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => move('UP')}
            className="w-16 h-8 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-lg text-sm font-bold text-gray-200"
          >
            ▲
          </button>
          <button
            onClick={() => move('DOWN')}
            className="w-16 h-8 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-lg text-sm font-bold text-gray-200"
          >
            ▼
          </button>
        </div>
        <button
          onClick={() => move('RIGHT')}
          className="w-16 h-12 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
