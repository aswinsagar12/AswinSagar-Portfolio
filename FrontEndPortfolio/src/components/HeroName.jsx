import React, { useEffect, useRef } from "react";

const firstLine = "ASWIN".split("");
const secondLine = "SAGAR".split("");
const allLetters = [...firstLine, ...secondLine];

function HeroName() {
  const refs = useRef([]);
  const fillDirectionRef = useRef(allLetters.map((_, i) => (i < firstLine.length ? -1 : 1)));
  const hitCountRef = useRef(allLetters.map(() => 0));
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [fills, setFills] = React.useState(() =>
    allLetters.map((_, i) => (i < firstLine.length ? 1 : 0))
  );

  useEffect(() => {
    const handler = (e) => {
      const idx = e?.detail?.index;
      const el = refs.current[idx];
      if (!el || typeof idx !== "number") return;
      const direction = fillDirectionRef.current[idx] || 1;
      el.setAttribute("data-flow", direction > 0 ? "fill" : "drain");
      el.classList.remove("letter-shake");
      void el.offsetWidth;
      el.classList.add("letter-shake");
      window.setTimeout(() => {
        el.classList.remove("letter-shake");
      }, 500);

      setFills((prev) => {
        if (idx < 0 || idx >= prev.length) return prev;
        const next = [...prev];
        const dir = fillDirectionRef.current[idx] || 1;
        const priorHits = hitCountRef.current[idx] || 0;
        const step = priorHits === 0 ? 0.1 : 0.2;
        let value = next[idx] + dir * step;

        if (value >= 1) {
          value = 1;
          fillDirectionRef.current[idx] = -1;
          hitCountRef.current[idx] = 0;
        } else if (value <= 0) {
          value = 0;
          fillDirectionRef.current[idx] = 1;
          hitCountRef.current[idx] = 0;
        } else {
          hitCountRef.current[idx] = priorHits + 1;
        }

        next[idx] = Number(value.toFixed(3));
        return next;
      });
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
        paddingTop: isMobile ? "16vh" : 0,
        paddingBottom: 0,
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? "clamp(4.4rem, 18vw, 8.5rem)" : "clamp(3.2rem, 11vw, 8.8rem)",
          fontFamily: "'HK Grotesk Wide', Outfit, Arial, sans-serif",
          fontWeight: 800,
          color: "#fff",
          letterSpacing: isMobile ? "0.14em" : "0.1em",
          lineHeight: 1,
          textAlign: "center",
          margin: 0,
        }}
      >
        {firstLine.map((l, i) => (
          <span
            key={`a-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-letter-index={i}
            data-char={l}
            className="hero-name-letter hero-name-letter--water"
            style={{ display: "inline-block", "--fill": fills[i] }}
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
              data-char={l}
              className="hero-name-letter hero-name-letter--water"
              style={{ display: "inline-block", "--fill": fills[idx] }}
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
