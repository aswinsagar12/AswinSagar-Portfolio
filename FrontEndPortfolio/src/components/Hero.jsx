import React from "react";

const splitLetters = (text) =>
  text.split("").map((char, index) => (
    <span className="hero__letter" key={`${char}-${index}`}>
      {char}
    </span>
  ));

const Hero = () => {
  return (
    <section className="hero section" id="home" data-scroll-section>
      <div className="hero__content">
        <div className="hero__spacer" aria-hidden="true" />
        <div className="hero__right">
          <div className="hero__heading">
            <h1 className="hero__title">
              <span className="hero__line">{splitLetters("ASWIN")}</span>
              <span className="hero__line">{splitLetters("SAGAR")}</span>
            </h1>
            <div className="hero__orbit" data-scroll data-scroll-speed="1.5">
              ↗
            </div>
          </div>
          <div className="hero__meta">
            <span>SITE RELIABILITY ENGINEER</span>
            <span>
              I solve reliability problems at scale by aligning systems, people,
              and process. Former architect of incident response.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
