import React from "react";

const Experience = () => {
  return (
    <section className="experience" id="experience" data-scroll-section>
      <div className="section__header">
        <span className="section__number">04</span>
        <h2 className="section-title">Experience</h2>
      </div>
      <div className="experience__list">
        <div className="experience__item">
          <div className="experience__num">01</div>
          <div className="experience__role">Site Reliability Engineer</div>
          <div className="experience__details">2025 — Present</div>
        </div>
        <div className="experience__item">
          <div className="experience__num">02</div>
          <div className="experience__role">DevOps & Cloud Engineer</div>
          <div className="experience__details">2022 — 2025</div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
