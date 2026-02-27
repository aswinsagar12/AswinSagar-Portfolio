import React, { useEffect, useRef } from "react";

const firstLine = "ASWIN".split("");
const secondLine = "SAGAR".split("");

function HeroName() {
  const refs = useRef([]);

  useEffect(() => {
    const handler = (e) => {
      const idx = e?.detail?.index;
      const el = refs.current[idx];
      if (!el) return;
      el.classList.remove("letter-shake");
      void el.offsetWidth;
      el.classList.add("letter-shake");
      window.setTimeout(() => {
        el.classList.remove("letter-shake");
      }, 500);
    };
    window.addEventListener("letterShake", handler);
    return () => window.removeEventListener("letterShake", handler);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(3.2rem, 11vw, 8.8rem)",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "-0.01em",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        {firstLine.map((l, i) => (
          <span
            key={`a-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-letter-index={i}
            className="hero-name-letter"
            style={{ display: "inline-block" }}
          >
            {l}
          </span>
        ))}
        <br />
        {secondLine.map((l, i) => {
          const idx = i + firstLine.length;
          return (
            <span
              key={`b-${idx}`}
              ref={(el) => {
                refs.current[idx] = el;
              }}
              data-letter-index={idx}
              className="hero-name-letter"
              style={{ display: "inline-block" }}
            >
              {l}
            </span>
          );
        })}
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.5)",
          fontFamily: "monospace",
          letterSpacing: "0.3em",
          fontSize: "0.9rem",
          marginTop: "1rem",
        }}
      >
        SITE RELIABILITY ENGINEER
      </p>
    </div>
  );
}

export default HeroName;
