"use client";

import { useEffect, useRef } from "react";
import "./PixelCanvas.css";

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) this.shimmer();
    else this.size += this.sizeStep;
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.1;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    if (this.isReverse) this.size -= this.speed;
    else this.size += this.speed;
  }
}

function getEffectiveSpeed(value: number, reducedMotion: boolean) {
  const min = 0;
  const max = 100;
  const throttle = 0.001;
  if (value <= min || reducedMotion) return min;
  if (value >= max) return max * throttle;
  return value * throttle;
}

type PixelCanvasProps = {
  /** when true, pixels animate in; when false, they fade out */
  active: boolean;
  /** pixel grid spacing in px */
  gap?: number;
  /** animation speed (0–100, lower is slower) */
  speed?: number;
  /** comma-separated list of hex colors sampled per pixel */
  colors?: string;
  className?: string;
};

const DEFAULTS = {
  gap: 6,
  speed: 50,
  // gold range — lighter to deeper to keep cells from going monochrome
  colors: "#FFD700,#FFC72C,#A6790A,#FFE066",
};

/**
 * Background-only pixel canvas extracted from React Bits' PixelCard. Strips
 * the fixed dimensions / outer border / hover wiring so it can be dropped
 * into any positioned parent. Hover state is *controlled* via `active` —
 * the parent owns hover detection (lets us coexist with overlays that
 * would otherwise eat pointer events).
 */
export function PixelCanvas({ active, gap, speed, colors, className }: PixelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const timePreviousRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : 0);
  const reducedMotionRef = useRef<boolean>(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const finalGap = gap ?? DEFAULTS.gap;
  const finalSpeed = speed ?? DEFAULTS.speed;
  const finalColors = colors ?? DEFAULTS.colors;

  useEffect(() => {
    const initPixels = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      if (width === 0 || height === 0) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const colorsArray = finalColors.split(",");
      const pxs: Pixel[] = [];
      const reducedMotion = reducedMotionRef.current;
      const effectiveSpeed = getEffectiveSpeed(finalSpeed, reducedMotion);
      for (let x = 0; x < width; x += finalGap) {
        for (let y = 0; y < height; y += finalGap) {
          const color = colorsArray[Math.floor(Math.random() * colorsArray.length)];
          const dx = x - width / 2;
          const dy = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay = reducedMotion ? 0 : distance;
          pxs.push(new Pixel(canvas, ctx, x, y, color, effectiveSpeed, delay));
        }
      }
      pixelsRef.current = pxs;
    };

    initPixels();
    const observer = new ResizeObserver(() => initPixels());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [finalGap, finalSpeed, finalColors]);

  useEffect(() => {
    const tick = (fnName: "appear" | "disappear") => {
      animationRef.current = requestAnimationFrame(() => tick(fnName));
      const timeNow = performance.now();
      const timePassed = timeNow - timePreviousRef.current;
      const timeInterval = 1000 / 60;
      if (timePassed < timeInterval) return;
      timePreviousRef.current = timeNow - (timePassed % timeInterval);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allIdle = true;
      for (const pixel of pixelsRef.current) {
        pixel[fnName]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle && animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };

    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() =>
      tick(active ? "appear" : "disappear"),
    );

    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    };
  }, [active]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={`pixel-canvas-wrap ${className ?? ""}`}
    >
      <canvas className="pixel-canvas" ref={canvasRef} />
    </div>
  );
}
