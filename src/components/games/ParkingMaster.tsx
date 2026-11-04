'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, Star, ShieldAlert } from 'lucide-react';

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  type?: 'wall' | 'car' | 'cone';
  color?: string;
}

interface ParkingSpot {
  x: number;
  y: number;
  w: number;
  h: number;
  targetAngle: number; // expected radians
}

interface LevelData {
  levelNumber: number;
  name: string;
  startX: number;
  startY: number;
  startAngle: number;
  spot: ParkingSpot;
  obstacles: Obstacle[];
}

const LEVELS: LevelData[] = [
  {
    levelNumber: 1,
    name: 'Standard Bay',
    startX: 120,
    startY: 380,
    startAngle: 0,
    spot: { x: 480, y: 160, w: 90, h: 50, targetAngle: 0 },
    obstacles: [
      { x: 480, y: 90, w: 80, h: 45, type: 'car', color: '#f43f5e' },
      { x: 480, y: 230, w: 80, h: 45, type: 'car', color: '#3b82f6' },
      { x: 300, y: 260, w: 20, h: 120, type: 'wall' },
    ],
  },
  {
    levelNumber: 2,
    name: 'Cone Alley',
    startX: 100,
    startY: 120,
    startAngle: Math.PI / 2,
    spot: { x: 480, y: 380, w: 90, h: 50, targetAngle: 0 },
    obstacles: [
      { x: 220, y: 200, w: 18, h: 18, type: 'cone' },
      { x: 280, y: 240, w: 18, h: 18, type: 'cone' },
      { x: 340, y: 280, w: 18, h: 18, type: 'cone' },
      { x: 480, y: 310, w: 80, h: 45, type: 'car', color: '#10b981' },
      { x: 480, y: 450, w: 80, h: 45, type: 'car', color: '#eab308' },
    ],
  },
  {
    levelNumber: 3,
    name: 'Parallel Squeeze',
    startX: 120,
    startY: 300,
    startAngle: 0,
    spot: { x: 380, y: 150, w: 95, h: 48, targetAngle: 0 },
    obstacles: [
      { x: 240, y: 150, w: 75, h: 44, type: 'car', color: '#ec4899' },
      { x: 520, y: 150, w: 75, h: 44, type: 'car', color: '#8b5cf6' },
      { x: 380, y: 70, w: 380, h: 20, type: 'wall' },
    ],
  },
  {
    levelNumber: 4,
    name: 'Reverse Pillar Alley',
    startX: 480,
    startY: 400,
    startAngle: -Math.PI / 2,
    spot: { x: 140, y: 140, w: 50, h: 90, targetAngle: Math.PI / 2 },
    obstacles: [
      { x: 280, y: 160, w: 30, h: 30, type: 'wall' },
      { x: 280, y: 320, w: 30, h: 30, type: 'wall' },
      { x: 140, y: 240, w: 45, h: 80, type: 'car', color: '#06b6d4' },
      { x: 140, y: 40, w: 45, h: 80, type: 'car', color: '#f59e0b' },
    ],
  },
  {
    levelNumber: 5,
    name: 'The Penthouse Garage',
    startX: 100,
    startY: 420,
    startAngle: -Math.PI / 2,
    spot: { x: 500, y: 100, w: 85, h: 50, targetAngle: 0 },
    obstacles: [
      { x: 220, y: 180, w: 20, h: 240, type: 'wall' },
      { x: 360, y: 60, w: 20, h: 240, type: 'wall' },
      { x: 500, y: 170, w: 80, h: 45, type: 'car', color: '#ef4444' },
    ],
  },
];

export default function ParkingMaster() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gear, setGear] = useState<'D' | 'R'>('D');
  const [health, setHealth] = useState(3);
  const [parkingProgress, setParkingProgress] = useState(0); // 0 to 100%
  const [isLevelCleared, setIsLevelCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [stars, setStars] = useState(3);

  const stateRef = useRef({
    x: LEVELS[0].startX,
    y: LEVELS[0].startY,
    angle: LEVELS[0].startAngle,
    speed: 0,
    gear: 'D' as 'D' | 'R',
    health: 3,
    parkTimer: 0,
    startTime: Date.now(),
    cleared: false,
    gameOver: false,
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
    },
  });

  const loadLevel = useCallback((lvlIndex: number) => {
    const lvl = LEVELS[lvlIndex];
    const s = stateRef.current;
    s.x = lvl.startX;
    s.y = lvl.startY;
    s.angle = lvl.startAngle;
    s.speed = 0;
    s.gear = 'D';
    s.health = 3;
    s.parkTimer = 0;
    s.startTime = Date.now();
    s.cleared = false;
    s.gameOver = false;

    setCurrentLevelIdx(lvlIndex);
    setGear('D');
    setHealth(3);
    setParkingProgress(0);
    setIsLevelCleared(false);
    setIsGameOver(false);
    sounds.playClick();
  }, []);

  const toggleGear = useCallback(() => {
    const s = stateRef.current;
    s.gear = s.gear === 'D' ? 'R' : 'D';
    setGear(s.gear);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'KeyG' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') toggleGear();
      if (e.code === 'KeyR') loadLevel(currentLevelIdx);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentLevelIdx, loadLevel, toggleGear]);

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
      const currentLevel = LEVELS[currentLevelIdx];

      if (!s.cleared && !s.gameOver) {
        // Driving Physics
        const maxSpeed = 3.2;
        const accel = 0.12;

        if (s.keys.up) {
          if (s.gear === 'D') s.speed = Math.min(maxSpeed, s.speed + accel);
          else s.speed = Math.max(-maxSpeed * 0.7, s.speed - accel);
        } else if (s.keys.down) {
          // Brake
          s.speed *= 0.85;
        } else {
          s.speed *= 0.94;
        }

        // Steer
        if (Math.abs(s.speed) > 0.08) {
          const steerRate = 0.045;
          const steerDir = s.speed > 0 ? 1 : -1;
          if (s.keys.left) s.angle -= steerRate * steerDir;
          if (s.keys.right) s.angle += steerRate * steerDir;
        }

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;

        // Boundaries
        if (s.x < 30 || s.x > width - 30 || s.y < 30 || s.y > height - 30) {
          s.speed = -s.speed * 0.6;
          s.health -= 1;
          setHealth(s.health);
          sounds.playCrash();
          if (s.health <= 0) {
            s.gameOver = true;
            setIsGameOver(true);
          }
        }

        // Obstacle collisions
        for (const obs of currentLevel.obstacles) {
          const obsLeft = obs.x - obs.w / 2;
          const obsRight = obs.x + obs.w / 2;
          const obsTop = obs.y - obs.h / 2;
          const obsBottom = obs.y + obs.h / 2;

          // Simple circle-box test for car center
          if (
            s.x + 18 > obsLeft &&
            s.x - 18 < obsRight &&
            s.y + 14 > obsTop &&
            s.y - 14 < obsBottom
          ) {
            s.speed = -s.speed * 0.8;
            s.health -= 1;
            setHealth(s.health);
            sounds.playCrash();
            if (s.health <= 0) {
              s.gameOver = true;
              setIsGameOver(true);
            }
            break;
          }
        }

        // Check Parking Spot Alignment
        const spot = currentLevel.spot;
        const dx = Math.abs(s.x - spot.x);
        const dy = Math.abs(s.y - spot.y);

        // Normalize angles to 0..PI
        let angleDiff = Math.abs((s.angle % (Math.PI * 2)) - spot.targetAngle);
        while (angleDiff > Math.PI) angleDiff -= Math.PI;
        angleDiff = Math.abs(angleDiff);

        const insideSpot = dx < spot.w * 0.35 && dy < spot.h * 0.35;
        const alignedAngle = angleDiff < 0.3 || Math.abs(angleDiff - Math.PI) < 0.3;

        if (insideSpot && alignedAngle && Math.abs(s.speed) < 0.15) {
          s.parkTimer += 1;
          const progress = Math.min(100, Math.floor((s.parkTimer / 65) * 100));
          setParkingProgress(progress);

          if (s.parkTimer >= 65) {
            s.cleared = true;
            sounds.playVictory();
            const earnedStars = s.health === 3 ? 3 : s.health === 2 ? 2 : 1;
            setStars(earnedStars);
            saveHighScore('parking-master', (currentLevelIdx + 1) * 1000 + earnedStars * 100);
            setIsLevelCleared(true);
          }
        } else {
          s.parkTimer = Math.max(0, s.parkTimer - 2);
          setParkingProgress(Math.floor((s.parkTimer / 65) * 100));
        }
      }

      // RENDER
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Parking Floor Texture
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Parking Spot Target
      const spot = currentLevel.spot;
      ctx.save();
      ctx.translate(spot.x, spot.y);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(-spot.w / 2, -spot.h / 2, spot.w, spot.h);
      ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
      ctx.fillRect(-spot.w / 2, -spot.h / 2, spot.w, spot.h);

      // Letter "P" inside parking spot
      ctx.fillStyle = '#eab308';
      ctx.font = '900 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', 0, 0);
      ctx.restore();

      // Render Obstacles
      for (const obs of currentLevel.obstacles) {
        ctx.save();
        ctx.translate(obs.x, obs.y);

        if (obs.type === 'car') {
          drawCarTopDown({
            ctx,
            x: 0,
            y: 0,
            angle: 0,
            width: obs.w,
            height: obs.h,
            primaryColor: obs.color || '#3b82f6',
            accentColor: '#ffffff',
            type: 'sedan',
            headlights: false,
          });
        } else if (obs.type === 'cone') {
          // Orange safety traffic cone
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(0, 0, obs.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, obs.w / 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Concrete barrier wall
          ctx.fillStyle = '#334155';
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.fillRect(-obs.w / 2, -obs.h / 2, obs.w, obs.h);
          ctx.strokeRect(-obs.w / 2, -obs.h / 2, obs.w, obs.h);
          // Hazard yellow stripes
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(-obs.w / 2, -obs.h / 2);
          ctx.lineTo(obs.w / 2, obs.h / 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Draw Player Sedan
      drawCarTopDown({
        ctx,
        x: s.x,
        y: s.y,
        angle: s.angle,
        width: 60,
        height: 30,
        primaryColor: '#00f0ff',
        accentColor: '#ffffff',
        type: 'sedan',
        brakeLights: s.keys.down,
        headlights: true,
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [currentLevelIdx]);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[640px] mb-2 flex items-center justify-between px-4 py-2 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs text-gray-400 block uppercase font-mono">Level</span>
            <span className="text-lg font-black text-brand-cyan">
              {currentLevelIdx + 1} <span className="text-xs font-normal text-gray-400">({LEVELS[currentLevelIdx].name})</span>
            </span>
          </div>

          <div className="flex items-center gap-1 border-l border-brand-border pl-3">
            {[1, 2, 3].map((h) => (
              <ShieldAlert
                key={h}
                className={`w-5 h-5 ${h <= health ? 'text-green-400 fill-green-400/30' : 'text-gray-600'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Parking Progress Meter */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase font-mono">Parking Meter</span>
            <div className="w-24 h-3 bg-brand-darker rounded-full overflow-hidden border border-brand-border">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-100"
                style={{ width: `${parkingProgress}%` }}
              />
            </div>
          </div>

          {/* Gear Indicator */}
          <button
            onClick={toggleGear}
            className={`px-3 py-1 font-black text-base rounded-lg border flex items-center gap-1 transition ${
              gear === 'D'
                ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan'
                : 'bg-red-500/20 border-red-500 text-red-400'
            }`}
            title="Click or press 'G' to switch gear"
          >
            {gear === 'D' ? 'DRIVE (D)' : 'REVERSE (R)'}
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

      {/* Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-brand-border shadow-2xl bg-brand-darker">
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="block w-full max-w-[640px] h-[340px] sm:h-[480px] touch-none"
        />

        {/* Level Cleared Screen */}
        {isLevelCleared && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-green-400 font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              PARKED SAFELY!
            </span>
            <p className="text-gray-300 text-sm mb-4">Flawless alignment in the bay!</p>

            <div className="flex gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={`w-8 h-8 ${s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => loadLevel(currentLevelIdx)}
                className="px-5 py-3 bg-brand-card hover:bg-brand-border border border-brand-border font-bold text-sm rounded-xl text-gray-200 transition"
              >
                Retry
              </button>
              {currentLevelIdx < LEVELS.length - 1 ? (
                <button
                  onClick={() => loadLevel(currentLevelIdx + 1)}
                  className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-brand-darker font-black text-sm rounded-xl shadow-neonCyan transition"
                >
                  NEXT LEVEL ➔
                </button>
              ) : (
                <button
                  onClick={() => loadLevel(0)}
                  className="px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-brand-darker font-black text-sm rounded-xl shadow-neonCyan transition"
                >
                  START OVER
                </button>
              )}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-red-500 font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              VEHICLE TOTALED!
            </span>
            <p className="text-gray-300 text-sm mb-6">Too many collisions with garage obstacles.</p>

            <button
              onClick={() => loadLevel(currentLevelIdx)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 text-brand-darker font-black text-base rounded-xl shadow-neonCyan transition"
            >
              <RotateCcw className="w-5 h-5" /> RETRY LEVEL
            </button>
          </div>
        )}
      </div>

      {/* Touch Controls */}
      <div className="w-full max-w-[640px] mt-3 flex items-center justify-between gap-2 px-2">
        <div className="flex gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.left = true; }}
            onTouchEnd={() => { stateRef.current.keys.left = false; }}
            className="w-14 h-14 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-xl font-bold text-gray-200"
          >
            ◀
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.right = true; }}
            onTouchEnd={() => { stateRef.current.keys.right = false; }}
            className="w-14 h-14 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-xl font-bold text-gray-200"
          >
            ▶
          </button>
        </div>

        <button
          onClick={toggleGear}
          className={`flex-1 max-w-[140px] h-14 rounded-xl font-black text-sm border flex items-center justify-center ${
            gear === 'D' ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan' : 'bg-red-500/20 border-red-500 text-red-400'
          }`}
        >
          GEAR: {gear}
        </button>

        <div className="flex gap-2">
          <button
            onTouchStart={() => { stateRef.current.keys.down = true; }}
            onTouchEnd={() => { stateRef.current.keys.down = false; }}
            className="w-14 h-14 bg-brand-card active:bg-red-500/30 border border-brand-border rounded-xl text-xs font-bold text-gray-200"
          >
            BRAKE
          </button>
          <button
            onTouchStart={() => { stateRef.current.keys.up = true; }}
            onTouchEnd={() => { stateRef.current.keys.up = false; }}
            className="w-14 h-14 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-xs font-bold text-brand-cyan"
          >
            GAS
          </button>
        </div>
      </div>
    </div>
  );
}
