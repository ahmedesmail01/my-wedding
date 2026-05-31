'use client';

import React, { useEffect, useRef } from 'react';
import { weddingConfig } from '@/config/wedding';

interface Sparkle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  alphaSpeed: number;
}

interface Butterfly {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  wobbleSpeed: number;
  wobbleRange: number;
  wobbleOffset: number;
  wingBeatSpeed: number;
  phase: number;
  opacity: number;
  color: string;
  strokeColor: string;
}

export default function ButterflyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Dynamic resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize particles based on configuration
    const showSparkles = weddingConfig.theme.particles === 'sparkles' || weddingConfig.theme.particles === 'both';
    const showButterflies = weddingConfig.theme.particles === 'butterflies' || weddingConfig.theme.particles === 'both';

    const sparkles: Sparkle[] = [];
    const butterflies: Butterfly[] = [];

    // Max limits for mobile optimization
    const maxSparkles = 25;
    const maxButterflies = 8;

    // Premium warm gold, rose gold, amber and champagne wing color palettes
    const wingColors = [
      { fill: '212, 175, 55', stroke: '244, 215, 120' }, // Classic Gold
      { fill: '230, 185, 95', stroke: '255, 220, 150' }, // Soft Amber
      { fill: '225, 155, 140', stroke: '250, 195, 185' }, // Rose Gold
      { fill: '242, 220, 180', stroke: '255, 240, 210' }  // Soft Champagne
    ];

    if (showSparkles) {
      for (let i = 0; i < maxSparkles; i++) {
        sparkles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speedY: -(Math.random() * 0.4 + 0.2),
          speedX: (Math.random() * 0.2 - 0.1),
          opacity: Math.random(),
          alphaSpeed: Math.random() * 0.02 + 0.01,
        });
      }
    }

    if (showButterflies) {
      for (let i = 0; i < maxButterflies; i++) {
        const randColor = wingColors[Math.floor(Math.random() * wingColors.length)];
        butterflies.push({
          x: Math.random() * width,
          y: Math.random() * height + 100, // spawn slightly low
          size: Math.random() * 8 + 8, // length radius
          speedY: -(Math.random() * 0.6 + 0.4),
          speedX: 0,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          wobbleRange: Math.random() * 1.2 + 0.6,
          wobbleOffset: Math.random() * 100,
          wingBeatSpeed: Math.random() * 0.15 + 0.1,
          phase: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.3 + 0.25, // semi-transparent glow
          color: randColor.fill,
          strokeColor: randColor.stroke
        });
      }
    }

    // Helper to draw a single 3D flapping butterfly
    const drawButterfly = (ctx: CanvasRenderingContext2D, b: Butterfly) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      // Soft angle tilt based on horizontal movement
      const tilt = Math.sin(b.wobbleOffset) * 0.15;
      ctx.rotate(tilt);

      // Flapping amplitude using sine wave (simulating 3D perspective fold)
      const flapScale = Math.sin(b.phase);
      
      // We draw the left and right wings with scale inversion
      ctx.fillStyle = `rgba(${b.color}, ${b.opacity})`;
      ctx.strokeStyle = `rgba(${b.strokeColor}, ${b.opacity + 0.25})`;
      ctx.lineWidth = 1;

      // Draw LEFT Wing (flapping dynamically)
      ctx.save();
      ctx.scale(flapScale, 1);
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Top wing lobe left
      ctx.bezierCurveTo(-b.size * 0.8, -b.size * 1.2, -b.size * 1.5, -b.size * 0.5, -b.size * 0.6, 0);
      // Bottom wing lobe left
      ctx.bezierCurveTo(-b.size * 1.1, b.size * 0.4, -b.size * 0.7, b.size * 0.9, -0.1 * b.size, b.size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Draw RIGHT Wing (flapping dynamically)
      ctx.save();
      ctx.scale(-flapScale, 1); // mirrored
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      // Top wing lobe right
      ctx.bezierCurveTo(-b.size * 0.8, -b.size * 1.2, -b.size * 1.5, -b.size * 0.5, -b.size * 0.6, 0);
      // Bottom wing lobe right
      ctx.bezierCurveTo(-b.size * 1.1, b.size * 0.4, -b.size * 0.7, b.size * 0.9, -0.1 * b.size, b.size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Antennae & slim body
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity - 0.1})`;
      ctx.moveTo(0, -b.size * 0.1);
      ctx.quadraticCurveTo(-b.size * 0.3, -b.size * 0.7, -b.size * 0.3, -b.size * 0.9);
      ctx.moveTo(0, -b.size * 0.1);
      ctx.quadraticCurveTo(b.size * 0.3, -b.size * 0.7, b.size * 0.3, -b.size * 0.9);
      ctx.stroke();

      // Slim gold body glow
      ctx.fillStyle = `rgba(212, 175, 55, ${b.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, b.size * 0.1, b.size * 0.08, b.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and Update Sparkles
      if (showSparkles) {
        sparkles.forEach((s) => {
          // Draw soft glowing sparkle circle
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2);
          gradient.addColorStop(0, `rgba(250, 240, 200, ${s.opacity})`);
          gradient.addColorStop(1, 'rgba(250, 240, 200, 0)');
          ctx.fillStyle = gradient;
          ctx.arc(s.x, s.y, s.size * 2, 0, Math.PI * 2);
          ctx.fill();

          // Move
          s.y += s.speedY;
          s.x += s.speedX;

          // Twinkle opacity
          s.opacity += s.alphaSpeed;
          if (s.opacity > 0.8 || s.opacity < 0.1) {
            s.alphaSpeed = -s.alphaSpeed;
          }

          // Boundary wrap
          if (s.y < -10) {
            s.y = height + 10;
            s.x = Math.random() * width;
            s.opacity = Math.random();
          }
        });
      }

      // 2. Draw and Update Butterflies
      if (showButterflies) {
        butterflies.forEach((b) => {
          drawButterfly(ctx, b);

          // Flight Mechanics: Constant rise + left/right elegant sway
          b.y += b.speedY;
          b.wobbleOffset += b.wobbleSpeed;
          b.x += Math.sin(b.wobbleOffset) * b.wobbleRange * 0.5;

          // Wing beat progression (cannot flit at constant rate, add minor wobble scaling)
          b.phase += b.wingBeatSpeed;

          // Boundary wrap with reset values
          if (b.y < -b.size * 2) {
            b.y = height + b.size * 2;
            b.x = Math.random() * (width - 60) + 30;
            b.opacity = Math.random() * 0.35 + 0.25;
            b.phase = Math.random() * Math.PI * 2;
          }
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicking through onto details
        zIndex: 5, // Sits exactly between background and card frame elements
      }}
    />
  );
}
