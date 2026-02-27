import React, { useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";
import RippleText from "./RippleText";

const experiences = [
  {
    num: "01",
    title: ["Site Reliability", "Engineer"],
    company: "GARDEN CITY GAMES",
    location: "Bengaluru, India",
    years: "2025 - Present",
    desc: "Reliability engineering, observability, incident response.",
  },
  {
    num: "02",
    title: ["DevOps & Cloud", "Engineer"],
    company: "HCLTECH",
    location: "Bengaluru, India",
    years: "2022 - 2025",
    desc: "Automation, cloud infrastructure, CI/CD, Kubernetes.",
  },
];

const ExperienceRow = ({ item, index }) => {
  const rowRef = useRef(null);
  const topRuleRef = useRef(null);
  const bottomRuleRef = useRef(null);

  useScrollReveal(rowRef);
  useScrollReveal(topRuleRef);
  useScrollReveal(bottomRuleRef);

  return (
    <div
      className="experience__row reveal"
      style={{ transitionDelay: `${index * 0.1}s` }}
      ref={rowRef}
    >
      <div className="experience__rule reveal-line" ref={topRuleRef} />
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
        <div className="experience__year">
          {item.years}
          <span className="experience__arrow">-></span>
        </div>
      </div>
      <div className="experience__rule reveal-line" ref={bottomRuleRef} />
    </div>
  );
};

const Experience = () => {
  const titleRef = useRef(null);
  useScrollReveal(titleRef);

  return (
    <section className="experience" id="experience" data-scroll-section>
      <div className="section__header">
        <span className="section__number">04</span>
        <RippleText tag="h2" className="section-title reveal" ref={titleRef}>
          Experience
        </RippleText>
      </div>
      <div className="experience__rows">
        {experiences.map((item, index) => (
          <ExperienceRow item={item} index={index} key={item.num} />
        ))}
      </div>
    </section>
  );
};

export default Experience;

