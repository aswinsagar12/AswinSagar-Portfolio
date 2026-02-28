import React, { useEffect, useMemo, useRef, useState } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import "../WidgetBase.css";

const getInitialPos = () => {
  const w = typeof window !== "undefined" ? window.innerWidth : 1280;
  const h = typeof window !== "undefined" ? window.innerHeight : 900;
  const mobile = w < 768;
  if (mobile) return { x: Math.max(8, Math.floor((w - 150) / 2)), y: Math.floor(h * 0.68) };
  return { x: Math.max(8, w - 220 - 16), y: Math.max(8, h - 92 - 20) };
};

export default function LocationWidget() {
  const initialPos = useMemo(() => getInitialPos(), []);
  const [time, setTime] = useState("");
  const [pos, setPos] = useState(initialPos);
  const posRef = useRef(initialPos);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastPos = useRef(initialPos);
  const momentumId = useRef(0);
  const cardRef = useRef(null);

  const clampPos = (x, y) => {
    const el = cardRef.current;
    const w = el?.offsetWidth || 220;
    const h = el?.offsetHeight || 92;
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
    const el = cardRef.current;
    if (!el) return;
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour12: false })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
          ? { minWidth: "126px", padding: "10px 12px" }
          : {}),
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 22,
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
        <span style={{ fontSize: typeof window !== "undefined" && window.innerWidth < 768 ? "11px" : "14px" }}>@</span>
        <span
          style={{
            fontSize: typeof window !== "undefined" && window.innerWidth < 768 ? "10px" : "13px",
            fontWeight: 600,
          }}
        >
          Bangalore, India
        </span>
      </div>
      <div
        style={{
          fontSize: typeof window !== "undefined" && window.innerWidth < 768 ? "9px" : "12px",
          color: "rgba(255,255,255,0.5)",
          paddingLeft: typeof window !== "undefined" && window.innerWidth < 768 ? "14px" : "22px",
        }}
      >
        {time} IST
      </div>
    </div>
  );
}


