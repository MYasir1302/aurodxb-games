'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, Timer, Zap } from 'lucide-react';

interface Checkpoint {
  x: number;
  y: number;
  radius: number;
  passed: boolean;
}

interface BoostPad {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}

export default function CircuitRush() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentLap, setCurrentLap] = useState(1);
  const [currentLapTime, setCurrentLapTime] = useState('00:00.00');
  const [bestLapTime, setBestLapTime] = useState('--:--.--');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const stateRef = useRef({
    x: 180,
    y: 420,
    vx: 0,
    vy: 0,
    speed: 0,
    angle: -Math.PI / 2,
    maxSpeed: 7.5,
    boostTimer: 0,
    currentLap: 1,
    totalLaps: 3,
    lapStartTime: Date.now(),
    bestLapMs: 9999999,
    gameOver: false,
    checkpoints: [
      { x: 180, y: 160, radius: 45, passed: false },
      { x: 380, y: 120, radius: 45, passed: false },
      { x: 540, y: 220, radius: 45, passed: false },
      { x: 420, y: 320, radius: 45, passed: false },
      { x: 500, y: 420, radius: 45, passed: false },
      { x: 180, y: 420, radius: 55, passed: false }, // Finish line
    ] as Checkpoint[],
    boostPads: [
      { x: 260, y: 130, width: 36, height: 24, angle: 0 },
      { x: 320, y: 440, width: 36, height: 24, angle: Math.PI },
    ] as BoostPad[],
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
      boost: false,
    },
  });

  const formatTime = (ms: number) => {
    if (ms >= 9999990) return '--:--.--';
    const totalSec = ms / 1000;
    const minutes = Math.floor(totalSec / 60);
    const seconds = Math.floor(totalSec % 60);
    const millis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(2, '0')}`;
  };

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.x = 180;
    s.y = 420;
    s.vx = 0;
    s.vy = 0;
    s.speed = 0;
    s.angle = -Math.PI / 2;
    s.currentLap = 1;
    s.lapStartTime = Date.now();
    s.gameOver = false;
    s.boostTimer = 0;
    s.checkpoints.forEach((cp) => (cp.passed = false));

    setIsGameOver(false);
    setIsNewRecord(false);
    setCurrentLap(1);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const savedBest = getHighScore('circuit-rush');
    if (savedBest > 0) {
      stateRef.current.bestLapMs = savedBest;
      setBestLapTime(formatTime(savedBest));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'Space') stateRef.current.keys.boost = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
      if (e.code === 'Space') stateRef.current.keys.boost = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetGame]);

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
        // Boost timer
        if (s.boostTimer > 0) s.boostTimer--;

        const currentMaxSpeed = s.boostTimer > 0 ? 11.5 : s.maxSpeed;

        // Throttle & Brake
        if (s.keys.up) {
          s.speed = Math.min(currentMaxSpeed, s.speed + 0.25);
        } else if (s.keys.down) {
          s.speed = Math.max(-2.5, s.speed - 0.35);
        } else {
          s.speed *= 0.98;
        }

        // Steer
        if (Math.abs(s.speed) > 0.2) {
          const steerRate = 0.052;
          const steerDir = s.speed > 0 ? 1 : -1;
          if (s.keys.left) s.angle -= steerRate * steerDir;
          if (s.keys.right) s.angle += steerRate * steerDir;
        }

        s.vx = Math.cos(s.angle) * s.speed;
        s.vy = Math.sin(s.angle) * s.speed;

        s.x += s.vx;
        s.y += s.vy;

        // Wall collisions
        s.x = Math.max(25, Math.min(width - 25, s.x));
        s.y = Math.max(25, Math.min(height - 25, s.y));

        // Check boost pads
        for (const pad of s.boostPads) {
          if (Math.hypot(s.x - pad.x, s.y - pad.y) < 28) {
            if (s.boostTimer === 0) {
              sounds.playBoost();
              s.boostTimer = 45;
              s.speed = 11;
            }
          }
        }

        // Checkpoints & Laps
        for (let i = 0; i < s.checkpoints.length; i++) {
          const cp = s.checkpoints[i];
          const dist = Math.hypot(s.x - cp.x, s.y - cp.y);

          if (dist < cp.radius) {
            // Check if previous checkpoints passed
            const allPriorPassed = s.checkpoints.slice(0, i).every((c) => c.passed);
            if (allPriorPassed && !cp.passed) {
              cp.passed = true;
              sounds.playCoin();

              // Finish line hit
              if (i === s.checkpoints.length - 1) {
                const lapTimeMs = Date.now() - s.lapStartTime;
                if (lapTimeMs < s.bestLapMs) {
                  s.bestLapMs = lapTimeMs;
                  setBestLapTime(formatTime(lapTimeMs));
                  saveHighScore('circuit-rush', lapTimeMs);
                  setIsNewRecord(true);
                }

                if (s.currentLap >= s.totalLaps) {
                  s.gameOver = true;
                  sounds.playVictory();
                  setIsGameOver(true);
                } else {
                  s.currentLap++;
                  setCurrentLap(s.currentLap);
                  s.lapStartTime = Date.now();
                  s.checkpoints.forEach((c) => (c.passed = false));
                }
              }
            }
          }
        }

        // Timer HUD display
        const currentElapsed = Date.now() - s.lapStartTime;
        setCurrentLapTime(formatTime(currentElapsed));
      }

      // RENDER
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw Complex Circuit Track
      ctx.save();
      // Outer asphalt
      ctx.lineWidth = 110;
      ctx.strokeStyle = '#181f33';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(180, 420);
      ctx.lineTo(180, 160);
      ctx.quadraticCurveTo(240, 90, 380, 120);
      ctx.quadraticCurveTo(550, 150, 540, 220);
      ctx.quadraticCurveTo(500, 310, 420, 320);
      ctx.quadraticCurveTo(530, 360, 500, 420);
      ctx.lineTo(180, 420);
      ctx.stroke();

      // Neon Track Boundary Lines
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Finish Line Chequered Strip
      ctx.save();
      ctx.translate(180, 420);
      ctx.rotate(Math.PI / 2);
      for (let fx = -45; fx < 45; fx += 10) {
        ctx.fillStyle = fx % 20 === 0 ? '#ffffff' : '#000000';
        ctx.fillRect(fx, -6, 10, 6);
        ctx.fillStyle = fx % 20 === 0 ? '#000000' : '#ffffff';
        ctx.fillRect(fx, 0, 10, 6);
      }
      ctx.restore();

      // Draw Boost Pads
      for (const pad of s.boostPads) {
        ctx.save();
        ctx.translate(pad.x, pad.y);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fillRect(-pad.width / 2, -pad.height / 2, pad.width, pad.height);
        // Chevron arrows
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-8, -6);
        ctx.lineTo(0, 0);
        ctx.lineTo(-8, 6);
        ctx.moveTo(2, -6);
        ctx.lineTo(10, 0);
        ctx.lineTo(2, 6);
        ctx.stroke();
        ctx.restore();
      }

      // Draw Checkpoint markers (faint rings)
      s.checkpoints.forEach((cp, idx) => {
        if (!cp.passed && idx < s.checkpoints.length - 1) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // Boost Exhaust Flame
      if (s.boostTimer > 0) {
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(
          s.x - Math.cos(s.angle) * 32,
          s.y - Math.sin(s.angle) * 32,
          8 + Math.random() * 5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // Draw Formula Player Car
      drawCarTopDown({
        ctx,
        x: s.x,
        y: s.y,
        angle: s.angle,
        width: 64,
        height: 30,
        primaryColor: '#00f0ff',
        accentColor: '#ffffff',
        type: 'formula',
        brakeLights: s.keys.down,
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
      <div className="w-full max-w-[640px] mb-2 flex items-center justify-between px-4 py-2 bg-brand-card/90 border border-brand-border rounded-xl backdrop-blur-md shadow-md text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-xs text-gray-400 block uppercase font-mono">Lap</span>
            <span className="text-2xl font-black text-brand-cyan font-mono">
              {currentLap} <span className="text-sm font-normal text-gray-400">/ 3</span>
            </span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-xs text-gray-400 block uppercase font-mono">Lap Time</span>
            <span className="text-lg font-bold text-yellow-400 font-mono">{currentLapTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-mono">Best Lap</span>
            <span className="text-lg font-bold text-brand-purple font-mono">{bestLapTime}</span>
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
          width={640}
          height={480}
          className="block w-full max-w-[640px] h-[340px] sm:h-[480px] touch-none"
        />

        {/* Victory Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-brand-cyan font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              CHEQUERED FLAG!
            </span>
            <p className="text-gray-300 text-sm mb-4">You completed all 3 Grand Prix laps!</p>

            {isNewRecord && (
              <div className="mb-4 px-4 py-1.5 bg-brand-cyan/20 border border-brand-cyan rounded-full text-brand-cyan text-sm font-bold animate-pulse">
                🏆 NEW LAP RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[260px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Best Lap</span>
                <span className="font-bold text-yellow-400 font-mono">{bestLapTime}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">Status</span>
                <span className="font-bold text-brand-cyan">Completed 3/3</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-cyan to-brand-purple hover:brightness-110 active:scale-95 text-brand-darker font-black text-base rounded-xl shadow-neonCyan transition transform"
            >
              <RotateCcw className="w-5 h-5" /> RACE AGAIN
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
          onTouchStart={() => {
            stateRef.current.boostTimer = 45;
            sounds.playBoost();
          }}
          className="flex-1 max-w-[150px] h-14 bg-brand-cyan/20 active:bg-brand-cyan/50 border border-brand-cyan rounded-xl text-sm font-black text-brand-cyan flex items-center justify-center gap-1 shadow-neonCyan"
        >
          <Zap className="w-4 h-4" /> BOOST
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
