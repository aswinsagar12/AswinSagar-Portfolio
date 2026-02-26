import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let targetX = 0;
    let targetY = 0;

    const onMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.transform = `translate(${targetX}px, ${targetY}px)`;
      dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
    };

    const onEnter = () => cursor.classList.add("cursor--active");
    const onLeave = () => cursor.classList.remove("cursor--active");

    window.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
