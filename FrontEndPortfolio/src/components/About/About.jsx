import React, { useEffect, useRef, useState } from "react";
import { client } from "../../client";
import useScrollReveal from "../../hooks/useScrollReveal";
import RippleText from "../RippleText/RippleText";
import "../SectionShared.css";
import "./About.css";

const About = () => {
  const [abouts, setAbouts] = useState([]);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const skillsRef = useRef(null);

  useScrollReveal(titleRef);
  useScrollReveal(textRef);
  useScrollReveal(skillsRef);

  useEffect(() => {
    const query = '*[_type == "abouts"]';
    client
      .fetch(query)
      .then((data) => setAbouts(data || []))
      .catch(() => setAbouts([]));
  }, []);

  const primary = abouts[0];
  const legacyAboutText =
    "As a Cloud Engineer, I architect and manage cloud environments that enable secure, scalable, and cost-effective solutions. I leverage cloud platforms to bring flexibility and resilience to modern applications, meeting the needs of dynamic business environments.";
  const creativeAboutText =
    "I build cloud systems like adventure routes: clear map, strong guardrails, and enough resilience to handle every unexpected turn. My goal is simple - fast releases, stable platforms, and fewer midnight alarms, so teams can focus on creating, not firefighting.";
  const displayedAbout =
    primary?.description && primary.description.trim() !== legacyAboutText
      ? primary.description
      : creativeAboutText;

  return (
    <section className="about section" id="about" data-scroll-section>
      <div className="section__header">
        <span className="section__number">02</span>
        <RippleText tag="h2" className="section-title reveal" ref={titleRef} effect="smoke">
          About
        </RippleText>
      </div>
      <div className="about__grid">
        <div className="about__left">
          <div className="about__badge"></div>
        </div>
        <div className="about__right">
          <p className="about__text soft-text reveal" ref={textRef}>
            {displayedAbout}
          </p>
          <div
            className="about__skills soft-text reveal"
            ref={skillsRef}
            style={{ transitionDelay: "0.1s" }}
          >
            Less fire-fighting, more automation. Less guesswork, more signals.
            More uptime, fewer 2 AM surprises.
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;


