import React, { useMemo, useRef, useState, useEffect } from "react";
/* eslint-disable react-hooks/exhaustive-deps */

const quotes = [
  "\"It works on my machine\" - Every dev ever",
  "\"99.9% uptime, 100% gray hair\"",
  "\"chmod 777 is always the answer\"",
  "\"Have you tried turning it off and on again?\"",
  "\"It's not a bug, it's undocumented behavior\"",
  "\"Monitoring everything, understanding nothing\"",
  "\"I don't always test in prod. Just kidding... mostly.\"",
  "\"Alert fatigue level: coffee is now infrastructure.\"",
];

const getInitialPos = () => {
  const w = typeof window !== "undefined" ? window.innerWidth : 1280;
  const mobile = w < 768;
  if (mobile) return { x: 16, y: 20 };
  return { x: Math.max(w - 320, 24), y: 100 };
};

export default function QuoteWidget() {
  const initialPos = useMemo(() => getInitialPos(), []);
  const [pos, setPos] = useState(initialPos);
  const posRef = useRef(initialPos);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef(initialPos);
  const momentumId = useRef(0);
  const cardRef = useRef(null);

  const clampPos = (x, y) => {
    const w = cardRef.current?.offsetWidth || 240;
    const h = cardRef.current?.offsetHeight || 120;
    return {
      x: Math.max(0, Math.min(window.innerWidth - w, x)),
      y: Math.max(0, Math.min(window.innerHeight - h, y)),
    };
  };

  const setBothPos = (next) => {
    posRef.current = next;
    setPos(next);
  };

  const stopMomentum = () => {
    if (momentumId.current) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = 0;
    }
  };

  const applyMomentum = () => {
    if (Math.abs(velocity.current.x) < 0.5 && Math.abs(velocity.current.y) < 0.5) {
      momentumId.current = 0;
      return;
    }
    const next = clampPos(
      posRef.current.x + velocity.current.x,
      posRef.current.y + velocity.current.y
    );
    velocity.current.x *= 0.88;
    velocity.current.y *= 0.88;
    setBothPos(next);
    momentumId.current = requestAnimationFrame(applyMomentum);
  };

  const onMouseDown = (e) => {
    stopMomentum();
    isDragging.current = true;
    offset.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
    e.preventDefault();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const next = clampPos(e.clientX - offset.current.x, e.clientY - offset.current.y);
      if (mobile) {
        velocity.current = {
          x: (next.x - lastPos.current.x) * 0.3,
          y: (next.y - lastPos.current.y) * 0.3,
        };
      }
      lastPos.current = next;
      setBothPos(next);
    };

    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (mobile) {
        stopMomentum();
        momentumId.current = requestAnimationFrame(applyMomentum);
      }
    };

    const onResize = () => {
      const next = clampPos(posRef.current.x, posRef.current.y);
      lastPos.current = next;
      setBothPos(next);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      if (mobile) stopMomentum();
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return undefined;

    const onTouchStart = (e) => {
      stopMomentum();
      isDragging.current = true;
      offset.current = {
        x: e.touches[0].clientX - posRef.current.x,
        y: e.touches[0].clientY - posRef.current.y,
      };
    };

    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      e.stopPropagation();
      const next = clampPos(
        e.touches[0].clientX - offset.current.x,
        e.touches[0].clientY - offset.current.y
      );
      velocity.current = {
        x: (next.x - lastPos.current.x) * 0.3,
        y: (next.y - lastPos.current.y) * 0.3,
      };
      lastPos.current = next;
      setBothPos(next);
    };

    const onTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      stopMomentum();
      momentumId.current = requestAnimationFrame(applyMomentum);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="widget-card no-select"
      onMouseDown={onMouseDown}
      style={{
        ...(typeof window !== "undefined" && window.innerWidth < 768
          ? { maxWidth: "154px", padding: "11px 12px", fontSize: "10px", lineHeight: 1.45 }
          : {}),
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 24,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "4px 16px 16px 16px",
        padding: "16px 18px",
        maxWidth: "220px",
        color: "rgba(255,255,255,0.85)",
        fontFamily: "monospace",
        fontSize: "12px",
        lineHeight: 1.6,
      }}
    >
      <div
        style={{
          fontSize: "11px",
          marginBottom: "8px",
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.14em",
        }}
      >
        ON-CALL MEMO
      </div>
      {quotes[quoteIdx]}
    </div>
  );
}
