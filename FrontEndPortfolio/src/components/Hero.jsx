import React, { useEffect, useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const Hero = () => {
  const canvasRef = useRef(null);
  const captionRef = useRef(null);

  useScrollReveal(captionRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.parentElement?.offsetWidth || window.innerWidth;
    let height = canvas.parentElement?.offsetHeight || window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = canvas.parentElement?.offsetWidth || window.innerWidth;
      height = canvas.parentElement?.offsetHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1 + Math.random(),
    }));

    let rafId;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(255,255,255,${0.3 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="hero section" id="home" data-scroll-section>
      <canvas ref={canvasRef} className="hero__canvas" />
      <div className="hero__content is-visible">
        <div className="hero__spacer" aria-hidden="true" />
        <div className="hero__right">
          <div className="hero__heading">
            <h1 className="hero__title">
              {["ASWIN", "SAGAR"].map((word, index) => (
                <span
                  className="hero__word"
                  style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
                  key={word}
                >
                  <span className="hero__word-inner">{word}</span>
                </span>
              ))}
            </h1>
            <div className="hero__orbit" aria-hidden="true">
              {"\u2197"}
            </div>
          </div>
          <div className="hero__meta">
            <span className="hero__role">SITE RELIABILITY ENGINEER</span>
            <span
              className="hero__caption soft-text reveal"
              ref={captionRef}
              style={{ transitionDelay: "0.3s" }}
            >
              I build calm, resilient platforms
              for teams that ship
              with confidence.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;



