import React from "react";

const experiences = [
  {
    num: "01",
    title: ["Site Reliability", "Engineer"],
    company: "GARDEN CITY GAMES",
    location: "Bengaluru, India",
    years: "2025 — Present",
    desc: "Reliability engineering, observability, incident response.",
  },
  {
    num: "02",
    title: ["DevOps & Cloud", "Engineer"],
    company: "HCLTECH",
    location: "Bengaluru, India",
    years: "2022 — 2025",
    desc: "Automation, cloud infrastructure, CI/CD, Kubernetes.",
  },
];

const Experience = () => {
  return (
    <section className="experience" id="experience" data-scroll-section>
      <div className="section__header">
        <span className="section__number">04</span>
        <h2 className="section-title">Experience</h2>
      </div>
      <div className="experience__rows">
        {experiences.map((item, index) => (
          <div
            className="experience__row io-reveal"
            style={{ "--delay": `${index * 120}ms` }}
            key={item.num}
          >
            <div className="experience__rule" />
            <div className="experience__grid">
              <div className="experience__num">{item.num}</div>
              <div className="experience__title">
                <span className="experience__heading">{item.title[0]}</span>
                <span className="experience__heading">{item.title[1]}</span>
                <span className="experience__desc">{item.desc}</span>
              </div>
              <div className="experience__meta">
                <span className="experience__company">{item.company}</span>
                <span className="experience__location">{item.location}</span>
              </div>
              <div className="experience__year">{item.years}</div>
            </div>
            <div className="experience__rule" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
