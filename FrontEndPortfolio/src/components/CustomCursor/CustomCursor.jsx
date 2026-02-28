import React, { useEffect, useRef } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice) return undefined;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let targetX = 0;
    let targetY = 0;
    let rafId = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%) scale(1)`;
        dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      });
    };

    const onEnter = () => cursor.classList.add("cursor--active");
    const onLeave = () => cursor.classList.remove("cursor--active");

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;


