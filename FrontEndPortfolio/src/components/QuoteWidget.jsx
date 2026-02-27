import React, { useEffect, useRef, useState } from "react";

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

export default function QuoteWidget() {
  const [pos, setPos] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const mobile = w <= 768;
    return mobile ? { x: 12, y: 18 } : { x: Math.max(w - 320, 24), y: 100 };
  });
  const [quoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const clampPos = (x, y) => {
    const width = cardRef.current?.offsetWidth || 240;
    const height = cardRef.current?.offsetHeight || 120;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, window.innerWidth - width - 8);
    const maxY = Math.max(minY, window.innerHeight - height - 8);
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  const onMouseDown = (e) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    if (!t) return;
    isDragging.current = true;
    offset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return;
      setPos(clampPos(e.clientX - offset.current.x, e.clientY - offset.current.y));
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const t = e.touches[0];
      if (!t) return;
      setPos(clampPos(t.clientX - offset.current.x, t.clientY - offset.current.y));
    };
    const onUp = () => {
      isDragging.current = false;
    };
    const onResize = () => {
      setPos((prev) => clampPos(prev.x, prev.y));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onUp);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="widget-card no-select"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
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
      <div style={{ fontSize: "11px", marginBottom: "8px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.14em" }}>
        ON-CALL MEMO
      </div>
      {quotes[quoteIdx]}
    </div>
  );
}
