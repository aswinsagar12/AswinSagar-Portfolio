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
          <div className="about__badge"></div>
        </div>
        <div className="about__right">
          <p className="about__text soft-text io-reveal">
            {primary?.description ||
              "As a Cloud Engineer, I architect and manage cloud environments that enable secure, scalable, and cost-effective solutions. I leverage cloud platforms to bring flexibility and resilience to modern applications, meeting the needs of dynamic business environments."}
          </p>
          <div className="about__skills soft-text io-reveal" style={{ "--delay": "120ms" }}>
            SRE, DevOps, Observability, Incident Response, Capacity Planning,
            Automation, Reliability Engineering
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
