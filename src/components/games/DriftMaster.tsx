'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sounds } from '@/lib/audio';
import { getHighScore, saveHighScore } from '@/lib/storage';
import { drawCarTopDown } from '@/lib/carDraw';
import { RotateCcw, Volume2, VolumeX, Flame } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

interface SkidMark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  alpha: number;
}

export default function DriftMaster() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [isDrifting, setIsDrifting] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const stateRef = useRef({
    // Car physics
    x: 350,
    y: 420,
    vx: 0,
    vy: 0,
    speed: 0,
    angle: 0, // car heading
    angularVelocity: 0,
    accel: 0,
    steerAngle: 0,
    driftAngle: 0,
    isDrifting: false,
    driftTimer: 0,
    combo: 1,
    score: 0,
    highScore: 0,
    timeLeft: 60, // 60-second drift challenge!
    gameOver: false,
    skidMarks: [] as SkidMark[],
    smokeParticles: [] as Particle[],
    prevRearLeft: { x: 0, y: 0 },
    prevRearRight: { x: 0, y: 0 },
    keys: {
      up: false,
      down: false,
      left: false,
      right: false,
      handbrake: false,
    },
  });

  const resetGame = useCallback(() => {
    const s = stateRef.current;
    s.x = 350;
    s.y = 420;
    s.vx = 0;
    s.vy = 0;
    s.speed = 0;
    s.angle = -Math.PI / 2;
    s.angularVelocity = 0;
    s.combo = 1;
    s.score = 0;
    s.timeLeft = 60;
    s.gameOver = false;
    s.skidMarks = [];
    s.smokeParticles = [];

    setIsGameOver(false);
    setIsNewHighScore(false);
    setScore(0);
    setMultiplier(1);
    setIsDrifting(false);
    sounds.playClick();
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  useEffect(() => {
    const currentHigh = getHighScore('drift-master');
    setHighScore(currentHigh);
    stateRef.current.highScore = currentHigh;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = true;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = true;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = true;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = true;
      if (e.code === 'Space') stateRef.current.keys.handbrake = true;
      if (e.code === 'KeyR') resetGame();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowUp' || e.key === 'w' || e.key === 'W') stateRef.current.keys.up = false;
      if (e.code === 'ArrowDown' || e.key === 's' || e.key === 'S') stateRef.current.keys.down = false;
      if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.keys.left = false;
      if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.keys.right = false;
      if (e.code === 'Space') stateRef.current.keys.handbrake = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 1-second countdown interval
    const timerInterval = setInterval(() => {
      const s = stateRef.current;
      if (!s.gameOver) {
        s.timeLeft -= 1;
        if (s.timeLeft <= 0) {
          s.timeLeft = 0;
          s.gameOver = true;
          sounds.playVictory();
          const rec = saveHighScore('drift-master', s.score);
          if (rec) {
            setIsNewHighScore(true);
            setHighScore(s.score);
          }
          setIsGameOver(true);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(timerInterval);
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
        // Vehicle physics parameters
        const maxForwardSpeed = 8.5;
        const maxReverseSpeed = -3.0;
        const acceleration = 0.22;
        const braking = 0.35;
        const naturalDecel = 0.985;
        const steerSpeed = 0.055;

        // Throttle & Brake
        if (s.keys.up) {
          s.speed = Math.min(maxForwardSpeed, s.speed + acceleration);
        } else if (s.keys.down) {
          s.speed = Math.max(maxReverseSpeed, s.speed - braking);
        } else {
          s.speed *= naturalDecel;
        }

        // Steering
        if (Math.abs(s.speed) > 0.2) {
          const steerDir = s.speed > 0 ? 1 : -1;
          if (s.keys.left) s.angle -= steerSpeed * steerDir;
          if (s.keys.right) s.angle += steerSpeed * steerDir;
        }

        // Velocity components
        const forwardVx = Math.cos(s.angle) * s.speed;
        const forwardVy = Math.sin(s.angle) * s.speed;

        // Grip vs lateral slip
        let lateralGrip = s.keys.handbrake ? 0.88 : 0.94;
        s.vx = s.vx * lateralGrip + forwardVx * (1 - lateralGrip);
        s.vy = s.vy * lateralGrip + forwardVy * (1 - lateralGrip);

        s.x += s.vx;
        s.y += s.vy;

        // Track Bounds Collision
        const margin = 30;
        if (s.x < margin) { s.x = margin; s.vx = -s.vx * 0.5; }
        if (s.x > width - margin) { s.x = width - margin; s.vx = -s.vx * 0.5; }
        if (s.y < margin) { s.y = margin; s.vy = -s.vy * 0.5; }
        if (s.y > height - margin) { s.y = height - margin; s.vy = -s.vy * 0.5; }

        // Drift calculation: angle between velocity vector and car heading
        const velocityHeading = Math.atan2(s.vy, s.vx);
        let diffAngle = Math.abs(s.angle - velocityHeading);
        while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
        diffAngle = Math.abs(diffAngle);

        const currentSpeedMag = Math.hypot(s.vx, s.vy);
        const drifting = diffAngle > 0.35 && currentSpeedMag > 2.5;

        if (drifting) {
          s.driftTimer += 1;
          if (s.driftTimer % 15 === 0) {
            sounds.playDrift();
          }
          if (s.driftTimer > 20) {
            s.combo = Math.min(5, 1 + Math.floor(s.driftTimer / 60));
          }
          const driftPoints = Math.round(diffAngle * 12 * s.combo);
          s.score += driftPoints;

          // Emit tire smoke
          for (let i = 0; i < 2; i++) {
            s.smokeParticles.push({
              x: s.x - Math.cos(s.angle) * 20 + (Math.random() - 0.5) * 8,
              y: s.y - Math.sin(s.angle) * 20 + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              alpha: 0.6,
              size: 5 + Math.random() * 6,
            });
          }

          // Add skid marks
          const rlX = s.x - Math.cos(s.angle) * 18 + Math.cos(s.angle + Math.PI / 2) * 10;
          const rlY = s.y - Math.sin(s.angle) * 18 + Math.sin(s.angle + Math.PI / 2) * 10;
          if (s.prevRearLeft.x !== 0) {
            s.skidMarks.push({
              x1: s.prevRearLeft.x,
              y1: s.prevRearLeft.y,
              x2: rlX,
              y2: rlY,
              alpha: 0.45,
            });
          }
          s.prevRearLeft = { x: rlX, y: rlY };
        } else {
          s.driftTimer = Math.max(0, s.driftTimer - 2);
          if (s.driftTimer === 0) s.combo = 1;
          s.prevRearLeft = { x: 0, y: 0 };
        }

        s.isDrifting = drifting;

        if (Math.random() < 0.2) {
          setScore(s.score);
          setMultiplier(s.combo);
          setIsDrifting(drifting);
        }
      }

      // Update smoke
      for (let i = s.smokeParticles.length - 1; i >= 0; i--) {
        const p = s.smokeParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.size += 0.3;
        p.alpha -= 0.02;
        if (p.alpha <= 0) s.smokeParticles.splice(i, 1);
      }

      // Keep max 250 skid marks
      if (s.skidMarks.length > 250) {
        s.skidMarks.splice(0, s.skidMarks.length - 250);
      }

      // RENDER
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Draw Race Track Circuit
      ctx.save();
      // Outer track boundary
      ctx.lineWidth = 140;
      ctx.strokeStyle = '#1e293b';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      // Rounded racetrack loop
      ctx.moveTo(180, 150);
      ctx.lineTo(width - 180, 150);
      ctx.arc(width - 180, height / 2, 160, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(180, height - 150);
      ctx.arc(180, height / 2, 160, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();

      // Neon curb inner/outer lines
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(180, 80);
      ctx.lineTo(width - 180, 80);
      ctx.arc(width - 180, height / 2, 230, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(180, height - 80);
      ctx.arc(180, height / 2, 230, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();

      ctx.strokeStyle = '#a855f7';
      ctx.shadowColor = '#a855f7';
      ctx.beginPath();
      ctx.moveTo(180, 220);
      ctx.lineTo(width - 180, 220);
      ctx.arc(width - 180, height / 2, 90, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(180, height - 220);
      ctx.arc(180, height / 2, 90, Math.PI / 2, -Math.PI / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Render Skidmarks
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      for (const sm of s.skidMarks) {
        ctx.strokeStyle = `rgba(15, 23, 42, ${sm.alpha})`;
        ctx.beginPath();
        ctx.moveTo(sm.x1, sm.y1);
        ctx.lineTo(sm.x2, sm.y2);
        ctx.stroke();
      }

      // Render Smoke
      for (const sp of s.smokeParticles) {
        ctx.fillStyle = `rgba(220, 230, 245, ${sp.alpha})`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Player Drift Car
      drawCarTopDown({
        ctx,
        x: s.x,
        y: s.y,
        angle: s.angle,
        width: 66,
        height: 33,
        primaryColor: '#a855f7',
        accentColor: '#00f0ff',
        type: 'sports',
        brakeLights: s.keys.handbrake || s.keys.down,
        headlights: true,
      });

      // Drift Combo Floating Text
      if (s.isDrifting && s.combo > 1) {
        ctx.save();
        ctx.font = '900 22px system-ui, sans-serif';
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.fillText(`DRIFT x${s.combo}!`, s.x, s.y - 35);
        ctx.restore();
      }

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
            <span className="text-xs text-gray-400 block uppercase font-mono">Drift Score</span>
            <span className="text-2xl font-black text-brand-purple font-mono">{score}</span>
          </div>
          <div className="border-l border-brand-border pl-4">
            <span className="text-xs text-gray-400 block uppercase font-mono">Best</span>
            <span className="text-lg font-bold text-brand-cyan font-mono">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDrifting ? (
            <div className="flex items-center gap-1 text-brand-cyan animate-pulse font-black text-base px-2 py-1 bg-brand-cyan/20 border border-brand-cyan rounded-lg">
              <Flame className="w-4 h-4 fill-brand-cyan" /> x{multiplier}
            </div>
          ) : (
            <div className="text-gray-400 text-xs font-mono uppercase">Straight</div>
          )}

          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-mono">Time</span>
            <span className="text-xl font-black text-yellow-400 font-mono">{stateRef.current.timeLeft}s</span>
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

        {/* Challenge Over Screen */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <span className="text-brand-purple font-black tracking-widest text-3xl mb-1 uppercase drop-shadow-lg">
              SESSION FINISHED!
            </span>
            <p className="text-gray-300 text-sm mb-4">You shredded the circuit tires!</p>

            {isNewHighScore && (
              <div className="mb-4 px-4 py-1.5 bg-brand-purple/20 border border-brand-purple rounded-full text-brand-purple text-sm font-bold animate-pulse">
                🏆 NEW DRIFT RECORD!
              </div>
            )}

            <div className="bg-brand-card/80 border border-brand-border rounded-xl p-4 w-full max-w-[260px] mb-6">
              <div className="flex justify-between py-1 border-b border-brand-border/50 text-sm">
                <span className="text-gray-400">Total Score</span>
                <span className="font-bold text-brand-purple font-mono">{score}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-400">Best Record</span>
                <span className="font-bold text-brand-cyan font-mono">{highScore}</span>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-cyan hover:brightness-110 active:scale-95 text-brand-darker font-black text-base rounded-xl shadow-neonPurple transition transform"
            >
              <RotateCcw className="w-5 h-5" /> DRIFT AGAIN
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
          onTouchStart={() => { stateRef.current.keys.handbrake = true; }}
          onTouchEnd={() => { stateRef.current.keys.handbrake = false; }}
          className="flex-1 max-w-[160px] h-14 bg-brand-purple/20 active:bg-brand-purple/50 border border-brand-purple rounded-xl text-sm font-black text-brand-purple flex items-center justify-center gap-1 shadow-neonPurple"
        >
          <Flame className="w-4 h-4" /> HANDBRAKE
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
