import React, { useEffect, useRef, useState } from "react";

export default function LocationWidget() {
  const [time, setTime] = useState("");
  const [pos, setPos] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const h = typeof window !== "undefined" ? window.innerHeight : 900;
    const mobile = w <= 768;
    const cardWidth = mobile ? 190 : 220;
    const cardHeight = 92;
    return {
      x: Math.max(8, w - cardWidth - (mobile ? 10 : 16)),
      y: Math.max(8, h - cardHeight - (mobile ? 84 : 20)),
    };
  });
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const clampPos = (x, y) => {
    const width = cardRef.current?.offsetWidth || 220;
    const height = cardRef.current?.offsetHeight || 92;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, window.innerWidth - width - 8);
    const maxY = Math.max(minY, window.innerHeight - height - 8);
    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY),
    };
  };

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
        zIndex: 20,
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "16px",
        padding: "14px 20px",
        color: "#fff",
        fontFamily: "monospace",
        minWidth: "180px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
        <span style={{ fontSize: "14px" }}>@</span>
        <span style={{ fontSize: "13px", fontWeight: 600 }}>Bangalore, India</span>
      </div>
      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", paddingLeft: "22px" }}>
        {time} IST
      </div>
    </div>
  );
}

