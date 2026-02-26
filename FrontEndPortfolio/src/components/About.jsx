import React, { useEffect, useRef, useState } from "react";
import { client } from "../client";
import useScrollReveal from "../hooks/useScrollReveal";

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

  return (
    <section className="about section" id="about" data-scroll-section>
      <div className="section__header">
        <span className="section__number">02</span>
        <h2 className="section-title reveal" ref={titleRef}>About</h2>
      </div>
      <div className="about__grid">
        <div className="about__left">
          <div className="about__badge"></div>
        </div>
        <div className="about__right">
          <p className="about__text soft-text reveal" ref={textRef}>
            {primary?.description ||
              "As a Cloud Engineer, I architect and manage cloud environments that enable secure, scalable, and cost-effective solutions. I leverage cloud platforms to bring flexibility and resilience to modern applications, meeting the needs of dynamic business environments."}
          </p>
          <div
            className="about__skills soft-text reveal"
            ref={skillsRef}
            style={{ transitionDelay: "0.1s" }}
          >
            SRE, DevOps, Observability, Incident Response, Capacity Planning,
            Automation, Reliability Engineering
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
