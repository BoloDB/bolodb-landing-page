import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  anchorX: number;
  anchorY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

const PARTICLE_COUNT = 350;
const REPULSION_RADIUS = 150;
const FORCE_STRENGTH = 8;
const DAMPING = 0.92;
const SPRING = 0.008;
const MAX_DPR = 1.5;
const RESIZE_DEBOUNCE = 150;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const animIdRef = useRef<number>(0);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      particles.push({
        anchorX: x,
        anchorY: y,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: Math.random() * 1.2 + 0.4,
        opacity: Math.random() * 0.3 + 0.08,
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);

    const isDark = () =>
      document.documentElement.getAttribute('data-theme') !== 'light';

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      sizeRef.current = { w, h };

      // Re-anchor particles to new dimensions
      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(w, h);
      } else {
        const oldW = sizeRef.current.w || w;
        const oldH = sizeRef.current.h || h;
        for (const p of particlesRef.current) {
          p.anchorX = (p.anchorX / oldW) * w;
          p.anchorY = (p.anchorY / oldH) * h;
          p.x = (p.x / oldW) * w;
          p.y = (p.y / oldH) * h;
        }
      }
    };

    resize();

    // Initialize particles if not already done
    if (particlesRef.current.length === 0) {
      const { w, h } = sizeRef.current;
      particlesRef.current = initParticles(w, h);
    }

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, RESIZE_DEBOUNCE);
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Draw static frame for reduced motion
    if (reduced) {
      ctx.save();
      ctx.scale(dpr, dpr);
      const dark = isDark();
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(255, 255, 255, ${p.opacity})`
          : `rgba(15, 17, 24, ${p.opacity * 0.6})`;
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // Animation loop
    const draw = () => {
      if (document.hidden) {
        animIdRef.current = requestAnimationFrame(draw);
        return;
      }

      const { w, h } = sizeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const dark = isDark();

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      for (const p of particles) {
        // Mouse repulsion
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPULSION_RADIUS && dist > 0) {
            const force =
              Math.pow((REPULSION_RADIUS - dist) / REPULSION_RADIUS, 2) *
              FORCE_STRENGTH;
            const angle = Math.atan2(dy, dx);
            p.vx -= Math.cos(angle) * force;
            p.vy -= Math.sin(angle) * force;
          }
        }

        // Damping (ease-out)
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Spring-back to anchor
        p.vx += (p.anchorX - p.x) * SPRING;
        p.vy += (p.anchorY - p.y) * SPRING;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen edges (soft)
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = dark
          ? `rgba(255, 255, 255, ${p.opacity})`
          : `rgba(15, 17, 24, ${p.opacity * 0.6})`;
        ctx.fill();
      }

      // Draw subtle connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < 6400) {
            // ~80px radius
            const alpha = (1 - distSq / 6400) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = dark
              ? `rgba(77, 166, 255, ${alpha})`
              : `rgba(27, 127, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.restore();
      animIdRef.current = requestAnimationFrame(draw);
    };

    animIdRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(resizeTimer);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
