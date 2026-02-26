import React, { useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const Marquee = ({ text, inverted = false }) => {
  const trackRef = useRef(null);
  useScrollReveal(trackRef);

  return (
    <section
      className={`marquee ${inverted ? "marquee--inverted" : ""}`}
      data-scroll-section
    >
      <div className="marquee__track reveal" ref={trackRef}>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </section>
  );
};

export default Marquee;
