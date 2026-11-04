'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, Fuel, Shield } from 'lucide-react';

interface Hazard {
  x: number;
  y: number;
  type: 'oil' | 'cone' | 'barrier';
  width: number;
  height: number;
}

interface Item {
  x: number;
  y: number;
  type: 'fuel_small' | 'fuel_large' | 'magnet';
  collected: boolean;
}

export default function FuelRun() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const stateRef = useRef({
    playerX: 200,
    playerY: 480,
    playerSpeed: 7,
    spinTimer: 0,
    spinAngle: 0,
    fuel: 100,
    distance: 0,
    score: 0,
    magnetTimer: 0,
    gameOver: false,
    roadOffset: 0,
    hazards: [] as Hazard[],
    items: [] as Item[],
    keys: {
      left: false,
      right: false,
      boost: false,
    },
    spawnTimer: 0,
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.playerX = 200;
    s.playerY = 480;
    s.playerSpeed = 7;
    s.spinTimer = 0;
    s.spinAngle = 0;
    s.fuel = 100;
    s.distance = 0;
    s.score = 0;
    s.magnetTimer = 0;
    s.gameOver = false;
    s.hazards = [];
    s.items = [];
    s.spawnTimer = 0;

    setDistance(0);
    setFuel(100);
    setIsGameOver(false);
    setIsNewRecord(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const saved = getHighScore('fuel-run');
    setHighScore(saved);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'Space') stateRef.current.keys.boost = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.code === 'Space') stateRef.current.keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (!s.gameOver) {
        // Fuel drain
        const drainRate = s.keys.boost ? 0.16 : 0.08;
        s.fuel -= drainRate;

        if (s.fuel <= 0) {
          s.fuel = 0;
          s.gameOver = true;
          sounds.playGameOver();
          const rec = saveHighScore('fuel-run', s.distance);
          if (rec) {
            setIsNewRecord(true);
            setHighScore(s.distance);
          }
          setIsGameOver(true);
        }

        // Magnet timer
        if (s.magnetTimer > 0) s.magnetTimer--;

        // Spin timer (from oil slick)
        if (s.spinTimer > 0) {
          s.spinTimer--;
          s.spinAngle += 0.35;
        } else {
          s.spinAngle = 0;
        }

        // Player speed
        s.playerSpeed = s.keys.boost && s.fuel > 0 ? 11 : 7;
        s.distance += Math.round(s.playerSpeed * 0.4);
        s.roadOffset = (s.roadOffset + s.playerSpeed) % 40;

        // Steering (if not spinning out)
        if (s.spinTimer === 0) {
          if (s.keys.left) s.playerX -= 6;
          if (s.keys.right) s.playerX += 6;
        }

        s.playerX = Math.max(55, Math.min(width - 55, s.playerX));

        // Spawning Hazards & Fuel
        s.spawnTimer++;
        if (s.spawnTimer > 35) {
          s.spawnTimer = 0;
          const spawnX = 60 + Math.random() * (width - 120);

          if (Math.random() > 0.45) {
            // Spawn Fuel or Magnet
            const rand = Math.random();
            const itemType = rand > 0.85 ? 'magnet' : rand > 0.4 ? 'fuel_large' : 'fuel_small';
            s.items.push({
              x: spawnX,
              y: -50,
              type: itemType,
              collected: false,
            });
          } else {
            // Spawn Hazard
            const types: ('oil' | 'cone' | 'barrier')[] = ['oil', 'cone', 'barrier'];
            const chosen = types[Math.floor(Math.random() * types.length)];
            s.hazards.push({
              x: spawnX,
              y: -50,
              type: chosen,
              width: chosen === 'barrier' ? 60 : 34,
              height: chosen === 'oil' ? 36 : 28,
            });
          }
        }

        // Update items
        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.y += s.playerSpeed;

          // Magnet Attraction
          if (s.magnetTimer > 0 && !item.collected) {
            const mdx = s.playerX - item.x;
            const mdy = s.playerY - item.y;
            item.x += mdx * 0.1;
            item.y += mdy * 0.1;
          }

          // Pickup collision
          if (!item.collected && Math.hypot(s.playerX - item.x, s.playerY - item.y) < 38) {
            item.collected = true;
            if (item.type === 'fuel_small') {
              s.fuel = Math.min(100, s.fuel + 20);
              sounds.playCoin();
            } else if (item.type === 'fuel_large') {
              s.fuel = Math.min(100, s.fuel + 45);
              sounds.playBoost();
            } else if (item.type === 'magnet') {
              s.magnetTimer = 300; // 5 seconds of magnet!
              sounds.playVictory();
            }
          }

          if (item.y > height + 60 || item.collected) {
            s.items.splice(i, 1);
          }
        }

        // Update hazards
        for (let i = s.hazards.length - 1; i >= 0; i--) {
          const h = s.hazards[i];
          h.y += s.playerSpeed;

          // Collision
          if (
            Math.abs(s.playerX - h.x) < (h.width + 30) / 2 &&
            Math.abs(s.playerY - h.y) < (h.height + 40) / 2
          ) {
            if (h.type === 'oil') {
              s.spinTimer = 40;
              sounds.playDrift();
            } else {
              // Barrier / cone impact
              s.fuel = Math.max(0, s.fuel - 15);
              sounds.playCrash();
            }
            s.hazards.splice(i, 1);
            continue;
          }

          if (h.y > height + 60) {
            s.hazards.splice(i, 1);
          }
        }

        // React state update
        if (Math.random() < 0.25) {
          setDistance(s.distance);
          setFuel(Math.round(s.fuel));
        }
      }

      // RENDER
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Cyber Road
      const roadLeft = 40;
      const roadW = width - 80;
      ctx.fillStyle = '#111728';
      ctx.fillRect(roadLeft, 0, roadW, height);

      // Glowing Neon Borders
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.fillRect(roadLeft - 3, 0, 4, height);
      ctx.fillRect(roadLeft + roadW - 1, 0, 4, height);
      ctx.shadowBlur = 0;

      // Dashed lane lines
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let y = -40 + s.roadOffset; y < height; y += 40) {
        ctx.fillRect(width / 2 - 2, y, 4, 20);
      }

      // Render Hazards
      for (const h of s.hazards) {
        ctx.save();
        ctx.translate(h.x, h.y);
        if (h.type === 'oil') {
          // Dark oil puddle
          ctx.fillStyle = '#020617';
          ctx.beginPath();
          ctx.ellipse(0, 0, h.width / 2, h.height / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (h.type === 'cone') {
          // Orange Cone
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Barrier
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-h.width / 2, -h.height / 2, h.width, h.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-h.width / 2 + 4, -h.height / 2 + 4, h.width - 8, h.height - 8);
        }
        ctx.restore();
      }

      // Render Items
      for (const item of s.items) {
        ctx.save();
        ctx.translate(item.x, item.y);
        if (item.type === 'magnet') {
          // Blue Magnet
          ctx.fillStyle = '#3b82f6';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 10;
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', 0, 0);
        } else {
          // Green / Gold Fuel Canister
          const isLarge = item.type === 'fuel_large';
          ctx.fillStyle = isLarge ? '#eab308' : '#10b981';
          ctx.shadowColor = isLarge ? '#eab308' : '#10b981';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.roundRect(-10, -13, 20, 26, 4);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '900 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('GAS', 0, 4);
        }
        ctx.restore();
      }

      // Magnet Field Effect on Car
      if (s.magnetTimer > 0) {
        ctx.save();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(s.playerX, s.playerY, 65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Render Player Car
      drawCarTopDown({
        ctx,
        x: s.playerX,
        y: s.playerY,
        angle: -Math.PI / 2 + s.spinAngle,
        width: 62,
        height: 32,
        primaryColor: '#06b6d4',
        accentColor: '#ffffff',
        type: 'sports',
        headlights: true,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[400px] mb-2 flex items-center justify-between px-4 py-2 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs text-gray-400 block uppercase font-mono">Distance</span>
            <span className="text-xl font-black text-brand-cyan font-mono">{distance}m</span>
          </div>
          <div className="border-l border-brand-border pl-3">
            <span className="text-xs text-gray-400 block uppercase font-mono">Best</span>
            <span className="text-base font-bold text-brand-purple font-mono">{highScore}m</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Fuel Bar */}
          <div className="flex items-center gap-2">
            <Fuel className={`w-4 h-4 ${fuel < 25 ? 'text-red-500 animate-bounce' : 'text-green-400'}`} />
            <div className="w-20 h-3 bg-brand-darker rounded-full overflow-hidden border border-brand-border">
              <div
                className={`h-full transition-all duration-100 ${
                  fuel > 40 ? 'bg-green-500' : fuel > 20 ? 'bg-yellow-400' : 'bg-red-500 animate-pulse'
                }`}
                style={{ width: `${fuel}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-brand-border/40 hover:bg-brand-border text-gray-300 transition"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-cyan" />}
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-brand-border shadow-2xl bg-brand-darker">
        <canvas
          ref={canvasRef}
          width={360}
          height={600}
          className="block w-[320px] sm:w-[360px] h-[520px] sm:h-[600px] touch-none"
        />

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-red-500 font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              TANK EMPTY!
            </span>
            <p className="text-gray-300 text-sm mb-4">You ran out of fuel on the highway</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-brand-cyan/20 border border-brand-cyan rounded-full text-brand-cyan text-sm font-bold animate-pulse">
                🏆 NEW DISTANCE RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[240px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Distance</span>
                <span className="font-bold text-brand-cyan font-mono">{distance}m</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">High Score</span>
                <span className="font-bold text-brand-purple font-mono">{highScore}m</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 active:scale-95 text-brand-darker font-black text-base rounded-xl shadow-neonCyan transition transform"
            >
              <RotateCcw className="w-5 h-5" /> REFUEL & DRIVE
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full max-w-[360px] mt-3 grid grid-cols-3 gap-2 px-1">
        <button
          onTouchStart={() => { stateRef.current.keys.left = true; }}
          onTouchEnd={() => { stateRef.current.keys.left = false; }}
          className="py-3 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200"
        >
          ◀ LEFT
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.boost = true; }}
          onTouchEnd={() => { stateRef.current.keys.boost = false; }}
          className="py-3 bg-brand-card active:bg-brand-purple/30 border border-brand-border rounded-xl text-xs font-bold text-brand-cyan flex flex-col items-center justify-center"
        >
          BOOST
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.right = true; }}
          onTouchEnd={() => { stateRef.current.keys.right = false; }}
          className="py-3 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
}
