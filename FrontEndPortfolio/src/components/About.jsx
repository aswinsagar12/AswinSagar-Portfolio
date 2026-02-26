import React, { useEffect, useState } from "react";
import { client } from "../client";

const About = () => {
  const [abouts, setAbouts] = useState([]);

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
        <h2 className="section-title">About</h2>
      </div>
      <div className="about__grid">
        <div className="about__left">
          <div className="about__badge">02</div>
        </div>
        <div className="about__right">
          <p className="about__text">
            {primary?.description ||
              "I build reliable, observable systems that scale. My focus is on SRE practices, automation, incident response, and platform resilience."}
          </p>
          <div className="about__skills">
            SRE, DevOps, Observability, Incident Response, Capacity Planning,
            Automation, Reliability Engineering
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
