import React, { useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import "./Marquee.css";

const Marquee = ({ text, inverted = false }) => {
  const trackRef = useRef(null);
  useScrollReveal(trackRef);

  const items = text
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
  const row = [...items, ...items];

  return (
    <section
      className={`marquee ${inverted ? "marquee--inverted" : ""}`}
      data-scroll-section
    >
      <div className="marquee__track reveal" ref={trackRef}>
        {row.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
