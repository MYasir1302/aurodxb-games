// Helper functions for drawing stylish vector-like cars directly onto HTML5 Canvas

export interface CarDrawOptions {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  angle?: number; // radians
  width?: number; // length
  height?: number; // width
  primaryColor?: string;
  accentColor?: string;
  type?: 'sports' | 'formula' | 'taxi' | 'sedan' | 'truck' | 'police' | 'muscle';
  brakeLights?: boolean;
  headlights?: boolean;
}

export function drawCarTopDown({
  ctx,
  x,
  y,
  angle = 0,
  width = 64, // length of car
  height = 32, // width of car
  primaryColor = '#00f0ff',
  accentColor = '#ffffff',
  type = 'sports',
  brakeLights = false,
  headlights = true,
}: CarDrawOptions) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const halfW = width / 2;
  const halfH = height / 2;

  // Headlight beams
  if (headlights) {
    ctx.save();
    const beamGrad = ctx.createRadialGradient(
      halfW, 0, 5,
      halfW + 120, 0, 140
    );
    beamGrad.addColorStop(0, 'rgba(255, 255, 220, 0.28)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 220, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(halfW - 5, -halfH + 4);
    ctx.lineTo(halfW + 140, -halfH - 45);
    ctx.lineTo(halfW + 140, halfH + 45);
    ctx.lineTo(halfW - 5, halfH - 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Shadow underneath
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(-halfW - 2, -halfH + 2, width + 4, height, 8);
  ctx.fill();

  // Wheels (4 tires)
  ctx.fillStyle = '#111827';
  const tireW = width * 0.22;
  const tireH = height * 0.24;
  // Front left
  ctx.fillRect(halfW - tireW - 4, -halfH - 2, tireW, tireH);
  // Front right
  ctx.fillRect(halfW - tireW - 4, halfH - tireH + 2, tireW, tireH);
  // Rear left
  ctx.fillRect(-halfW + 4, -halfH - 2, tireW, tireH);
  // Rear right
  ctx.fillRect(-halfW + 4, halfH - tireH + 2, tireW, tireH);

  // Car Body Base
  ctx.fillStyle = primaryColor;
  ctx.beginPath();
  if (type === 'formula') {
    // Formula 1 style pointed nose and wide sidepods
    ctx.moveTo(halfW + 4, 0);
    ctx.lineTo(halfW * 0.4, -halfH * 0.4);
    ctx.lineTo(0, -halfH);
    ctx.lineTo(-halfW * 0.7, -halfH * 0.85);
    ctx.lineTo(-halfW, -halfH * 0.5);
    ctx.lineTo(-halfW, halfH * 0.5);
    ctx.lineTo(-halfW * 0.7, halfH * 0.85);
    ctx.lineTo(0, halfH);
    ctx.lineTo(halfW * 0.4, halfH * 0.4);
    ctx.closePath();
  } else {
    // Sleek sports / aerodynamic body
    ctx.roundRect(-halfW, -halfH, width, height, [6, 12, 12, 6]);
  }
  ctx.fill();

  // Body highlights / racing stripe
  ctx.fillStyle = accentColor;
  ctx.fillRect(-halfW + 8, -2, width - 16, 4);

  // Cockpit / Windshield
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(-halfW * 0.2, -halfH * 0.7, halfW * 0.8, height * 0.7, 4);
  ctx.fill();

  // Glass reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.moveTo(-halfW * 0.1, -halfH * 0.5);
  ctx.lineTo(halfW * 0.35, -halfH * 0.5);
  ctx.lineTo(halfW * 0.2, -halfH * 0.1);
  ctx.lineTo(-halfW * 0.1, -halfH * 0.1);
  ctx.closePath();
  ctx.fill();

  // Special Taxi Sign
  if (type === 'taxi') {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-6, -6, 12, 12);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TAXI', 0, 0);
  }

  // Headlights glow on car front
  ctx.fillStyle = '#fffffa';
  ctx.fillRect(halfW - 3, -halfH + 3, 3, 5);
  ctx.fillRect(halfW - 3, halfH - 8, 3, 5);

  // Brake / Tail lights
  if (brakeLights) {
    ctx.fillStyle = '#ff1111';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 12;
    ctx.fillRect(-halfW, -halfH + 2, 4, 7);
    ctx.fillRect(-halfW, halfH - 9, 4, 7);
    ctx.shadowBlur = 0;
  } else {
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(-halfW, -halfH + 3, 3, 6);
    ctx.fillRect(-halfW, halfH - 9, 3, 6);
  }

  // Rear spoiler
  if (type === 'sports' || type === 'formula') {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-halfW - 2, -halfH - 2, 4, height + 4);
  }

  ctx.restore();
}
