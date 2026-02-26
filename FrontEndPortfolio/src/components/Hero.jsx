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
        <div className="hero__heading">
          <h1 className="hero__title">
            <span className="hero__line">{splitLetters("ASWIN")}</span>
            <span className="hero__line">
              {splitLetters("SAGAR")}
              <span className="hero__mark">®</span>
            </span>
          </h1>
          <div className="hero__orbit" data-scroll data-scroll-speed="1.5">
            ↗
          </div>
        </div>
        <div className="hero__meta">
          <span>Site Reliability Engineer</span>
          <span>Google Cloud & HashiCorp Certified</span>
          <span>DevOps • Cloud • Observability</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
      <aside className="hero__details">
        <span>Location: Bengaluru, India</span>
        <span>Company: Garden City Games</span>
        <span>Focus: Reliability, Automation, SLOs</span>
        <span>Open to: SRE / DevOps / Platform Roles</span>
      </aside>
    </section>
  );
};

export default Hero;
