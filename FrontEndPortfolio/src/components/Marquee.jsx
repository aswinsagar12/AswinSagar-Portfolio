import React from "react";

const Marquee = ({ text, inverted = false }) => {
  return (
    <section
      className={`marquee ${inverted ? "marquee--inverted" : ""}`}
      data-scroll-section
    >
      <div className="marquee__track">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </section>
  );
};

export default Marquee;
