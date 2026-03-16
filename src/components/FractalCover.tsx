"use client";

import { useEffect, useRef } from "react";

// Hash function to generate consistent seed from string
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

// Seeded random number generator (deterministic)
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Draw a polygon (hexagon)
function polygon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  sides: number
) {
  ctx.moveTo(cx + r, cy);
  for (let i = 1; i <= sides; i++) {
    const a = (i * Math.PI * 2) / sides;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
}

// Draw concentric hexagons with PSYCHEDELIC colors 🌈
function drawConcentricHex(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  rng: () => number
) {
  const rings = 4 + Math.floor(rng() * 5); // 4-8 rings for more complexity
  const rotation = rng() * Math.PI / 3; // Random rotation for variety
  
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  
  // Psychedelic: pick a random base hue, then shift through spectrum
  const baseHue = Math.floor(rng() * 360);
  
  for (let i = rings; i > 0; i--) {
    ctx.beginPath();
    polygon(ctx, 0, 0, (i / rings) * r, 6);
    
    // Shift hue for each ring = rainbow effect
    const hueShift = (i * 40) % 360; // 40° per ring
    const hue = (baseHue + hueShift) % 360;
    const saturation = 70 + Math.floor(rng() * 30); // 70-100% - SUPER saturated
    const lightness = 45 + Math.floor(rng() * 30); // 45-75% - vibrant
    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Colorful glow shadows
    ctx.shadowColor = `hsla(${hue}, 80%, 50%, 0.5)`;
    ctx.shadowBlur = 15;
    ctx.fill();
  }
  
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  // Contrasting stroke color
  const strokeHue = (baseHue + 180) % 360; // Complementary color
  ctx.strokeStyle = `hsla(${strokeHue}, 70%, 60%, ${0.3 + rng() * 0.3})`;
  ctx.beginPath();
  polygon(ctx, 0, 0, r, 6);
  ctx.stroke();
  
  ctx.restore();
}

// Draw the full honeycomb pattern - ZOOMED IN for abstract macro effect
function drawHoneycomb(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed: string
) {
  ctx.clearRect(0, 0, w, h);
  const rng = mulberry32(hash(seed));
  
  // MUCH BIGGER hexagons - zoomed in macro view (3-4x larger)
  const hexW = Math.max(60, Math.floor(w * 0.25)); // Increased from 0.08 to 0.25
  const hexH = (Math.sqrt(3) / 2) * hexW;
  
  // Add random scale variation for organic feel
  const baseScale = 0.8 + rng() * 0.4; // 0.8-1.2x variation

  let y = -hexH * 1.5;
  let row = 0;
  
  while (y < h + hexH * 1.5) {
    const xOffset = (row % 2 === 0 ? 0 : hexW / 2) - hexW * 1.5;
    for (let x = xOffset; x < w + hexW * 1.5; x += hexW) {
      // Random size variation per hex for abstract look
      const hexScale = baseScale * (0.9 + rng() * 0.3);
      drawConcentricHex(ctx, x, y, hexW * 0.45 * hexScale, rng);
    }
    y += hexH;
    row++;
  }
}

interface FractalCoverProps {
  seed: string;
  className?: string;
}

export function FractalCover({ seed, className }: FractalCoverProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    
    const resize = () => {
      const w = Math.floor(c.clientWidth);
      const h = Math.floor(c.clientHeight);
      c.width = w * dpr;
      c.height = h * dpr;
      const ctx = c.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawHoneycomb(ctx, w, h, seed);
    };

    // Lazy-draw when visible (performance optimization)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            resize();
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(c);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, [seed]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

