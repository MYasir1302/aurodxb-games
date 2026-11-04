'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, Zap } from 'lucide-react';

interface TrafficCar {
  x: number;
  y: number;
  speed: number;
  color: string;
  lane: number;
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export default function TrafficRacer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speedDisplay, setSpeedDisplay] = useState(80);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Game state refs for 60fps loop
  const stateRef = useRef({
    playerX: 200,
    playerY: 480,
    targetX: 200,
    playerSpeed: 7,
    baseSpeed: 7,
    maxSpeed: 16,
    distance: 0,
    score: 0,
    highScore: 0,
    gameOver: false,
    roadOffset: 0,
    traffic: [] as TrafficCar[],
    particles: [] as Particle[],
    laneWidth: 70,
    lanes: [65, 135, 205, 275],
    screenShake: 0,
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
    },
    spawnTimer: 0,
    nearMissCount: 0,
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.playerX = 205;
    s.playerY = 480;
    s.targetX = 205;
    s.playerSpeed = 7;
    s.baseSpeed = 7;
    s.distance = 0;
    s.score = 0;
    s.gameOver = false;
    s.traffic = [];
    s.particles = [];
    s.screenShake = 0;
    s.spawnTimer = 0;
    s.nearMissCount = 0;

    setIsGameOver(false);
    setIsNewHighScore(false);
    setScore(0);
    setSpeedDisplay(90);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const currentHigh = getHighScore('traffic-racer');
    setHighScore(currentHigh);
    stateRef.current.highScore = currentHigh;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#ec4899', '#8b5cf6'];

    const loop = () => {
      const s = stateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      if (!s.gameOver) {
        // Boost / Speed control
        let currentTargetSpeed = s.baseSpeed;
        if (s.keys.up) currentTargetSpeed = s.maxSpeed;
        else if (s.keys.down) currentTargetSpeed = s.baseSpeed * 0.55;

        s.playerSpeed += (currentTargetSpeed - s.playerSpeed) * 0.1;
        s.baseSpeed += 0.0006; // Gradual speed increase over time

        // Steering
        const steerSpeed = 6;
        if (s.keys.left) s.playerX -= steerSpeed;
        if (s.keys.right) s.playerX += steerSpeed;

        // Boundaries
        const roadLeft = 40;
        const roadRight = width - 40;
        if (s.playerX < roadLeft + 20) s.playerX = roadLeft + 20;
        if (s.playerX > roadRight - 20) s.playerX = roadRight - 20;

        // Distance & score
        s.distance += s.playerSpeed;
        s.score = Math.floor(s.distance / 10) + s.nearMissCount * 150;
        s.roadOffset = (s.roadOffset + s.playerSpeed) % 40;

        // Spawn traffic
        s.spawnTimer++;
        if (s.spawnTimer > Math.max(35, 75 - Math.floor(s.distance / 400))) {
          s.spawnTimer = 0;
          const laneIdx = Math.floor(Math.random() * s.lanes.length);
          const laneX = s.lanes[laneIdx];

          // Check if lane is free near top
          const isOccupied = s.traffic.some((t) => Math.abs(t.x - laneX) < 40 && t.y < 120);
          if (!isOccupied) {
            s.traffic.push({
              x: laneX,
              y: -80,
              speed: 2 + Math.random() * 3,
              color: colors[Math.floor(Math.random() * colors.length)],
              lane: laneIdx,
              width: 58,
              height: 30,
            });
          }
        }

        // Update traffic
        for (let i = s.traffic.length - 1; i >= 0; i--) {
          const t = s.traffic[i];
          t.y += s.playerSpeed - t.speed;

          // Check near miss
          const dx = Math.abs(s.playerX - t.x);
          const dy = Math.abs(s.playerY - t.y);

          if (dx < 38 && dy < 54) {
            // Collision!
            s.gameOver = true;
            s.screenShake = 20;
            sounds.playCrash();

            // Spawn explosion particles
            for (let p = 0; p < 40; p++) {
              s.particles.push({
                x: s.playerX,
                y: s.playerY,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                color: Math.random() > 0.5 ? '#ff4400' : '#ffff00',
                size: 3 + Math.random() * 5,
                life: 1,
              });
            }

            const record = saveHighScore('traffic-racer', s.score);
            if (record) {
              setIsNewHighScore(true);
              setHighScore(s.score);
            }
            setIsGameOver(true);
            break;
          } else if (dx < 48 && dy < 45 && dy > 35 && !((t as unknown as { countedMiss: boolean }).countedMiss)) {
            (t as unknown as { countedMiss: boolean }).countedMiss = true;
            s.nearMissCount++;
            sounds.playBoost();
          }

          // Remove offscreen
          if (t.y > height + 100) {
            s.traffic.splice(i, 1);
          }
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) s.particles.splice(i, 1);
      }

      // Screen shake decay
      if (s.screenShake > 0) s.screenShake *= 0.9;

      // React state update throttled
      if (Math.random() < 0.25) {
        setScore(s.score);
        setSpeedDisplay(Math.round(s.playerSpeed * 12));
      }

      // RENDER
      ctx.save();
      if (s.screenShake > 0.5) {
        ctx.translate((Math.random() - 0.5) * s.screenShake, (Math.random() - 0.5) * s.screenShake);
      }

      // Background grass/verge
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(0, 0, width, height);

      // Cyber Road Bed
      const roadLeft = 30;
      const roadW = width - 60;
      ctx.fillStyle = '#11162b';
      ctx.fillRect(roadLeft, 0, roadW, height);

      // Neon road borders
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(roadLeft - 4, 0, 4, height);
      ctx.fillRect(roadLeft + roadW, 0, 4, height);
      ctx.shadowBlur = 0;

      // Dashed lane dividers
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      const laneStep = roadW / 4;
      for (let l = 1; l < 4; l++) {
        const lx = roadLeft + l * laneStep;
        for (let y = -40 + s.roadOffset; y < height; y += 40) {
          ctx.fillRect(lx - 2, y, 4, 20);
        }
      }

      // Render Traffic Cars
      s.traffic.forEach((t) => {
        drawCarTopDown({
          ctx,
          x: t.x,
          y: t.y,
          angle: Math.PI / 2, // Facing downward
          width: t.width,
          height: t.height,
          primaryColor: t.color,
          accentColor: '#ffffff',
          headlights: false,
          brakeLights: false,
        });
      });

      // Render Player Car
      if (!s.gameOver || s.particles.length > 0) {
        drawCarTopDown({
          ctx,
          x: s.playerX,
          y: s.playerY,
          angle: -Math.PI / 2, // Facing upward
          width: 62,
          height: 32,
          primaryColor: '#00f0ff',
          accentColor: '#a855f7',
          brakeLights: s.keys.down,
          headlights: true,
        });
      }

      // Nitro exhaust glow
      if (s.keys.up && !s.gameOver) {
        ctx.save();
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(s.playerX - 9, s.playerY + 34, 4 + Math.random() * 4, 0, Math.PI * 2);
        ctx.arc(s.playerX + 9, s.playerY + 34, 4 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Render explosion particles
      s.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Top HUD */}
      <div className="w-full max-w-[400px] mb-2 flex items-center justify-between px-3 py-2 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs text-gray-400 block uppercase font-mono">Score</span>
            <span className="text-xl font-black text-brand-cyan font-mono">{score}</span>
          </div>
          <div className="border-l border-brand-border pl-3">
            <span className="text-xs text-gray-400 block uppercase font-mono">Best</span>
            <span className="text-base font-bold text-brand-purple font-mono">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-mono">Speed</span>
            <span className="text-xl font-black text-yellow-400 font-mono">{speedDisplay} <span className="text-xs font-normal">KM/H</span></span>
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

      {/* Canvas Wrapper */}
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
              CRASHED!
            </span>
            <p className="text-gray-300 text-sm mb-4">Traffic overwhelmed your sports car</p>

            {isNewHighScore && (
              <div className="mb-4 px-4 py-1.5 bg-brand-cyan/20 border border-brand-cyan rounded-full text-brand-cyan text-sm font-bold animate-pulse">
                🏆 NEW HIGH SCORE!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[240px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Score</span>
                <span className="font-bold text-brand-cyan font-mono">{score}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">High Score</span>
                <span className="font-bold text-brand-purple font-mono">{highScore}</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 active:scale-95 text-brand-darker font-black text-base rounded-xl shadow-neonCyan transition transform"
            >
              <RotateCcw className="w-5 h-5" /> PLAY AGAIN
            </button>
          </div>
        )}
      </div>

      {/* Touch / On-screen Controls for Mobile */}
      <div className="w-full max-w-[360px] mt-3 grid grid-cols-3 gap-2 px-1">
        <button
          onTouchStart={() => { stateRef.current.keys.left = true; }}
          onTouchEnd={() => { stateRef.current.keys.left = false; }}
          onMouseDown={() => { stateRef.current.keys.left = true; }}
          onMouseUp={() => { stateRef.current.keys.left = false; }}
          className="py-3 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200 shadow"
        >
          ◀ LEFT
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.up = true; }}
          onTouchEnd={() => { stateRef.current.keys.up = false; }}
          onMouseDown={() => { stateRef.current.keys.up = true; }}
          onMouseUp={() => { stateRef.current.keys.up = false; }}
          className="py-3 bg-brand-card active:bg-brand-purple/30 border border-brand-border rounded-xl text-xs font-bold text-brand-cyan flex flex-col items-center justify-center shadow"
        >
          <Zap className="w-4 h-4 mb-0.5 text-brand-cyan" /> NITRO
        </button>
        <button
          onTouchStart={() => { stateRef.current.keys.right = true; }}
          onTouchEnd={() => { stateRef.current.keys.right = false; }}
          onMouseDown={() => { stateRef.current.keys.right = true; }}
          onMouseUp={() => { stateRef.current.keys.right = false; }}
          className="py-3 bg-brand-card active:bg-brand-cyan/30 border border-brand-border rounded-xl text-lg font-bold text-gray-200 shadow"
        >
          RIGHT ▶
        </button>
      </div>
    </div>
  );
}
