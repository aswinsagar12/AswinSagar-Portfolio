import React, { useRef } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import RippleText from "../RippleText/RippleText";
import "../SectionShared.css";
import "./Skills.css";

const skills = [
  {
    title: "Cloud & DevOps",
    meta: "AWS, GCP, DigitalOcean, Terraform, Ansible, Docker, Kubernetes, Helm",
  },
  {
    title: "CI/CD & Release Engineering",
    meta: "Jenkins, GitHub Actions, Maven, Nexus, Git workflows, progressive delivery",
  },
  {
    title: "Observability & Monitoring",
    meta: "Prometheus, Grafana, Splunk, CloudWatch, SLO/SLI design, alert tuning",
  },
  {
    title: "Security & Compliance",
    meta: "IAM, VPC networking, OAuth 2.0, Okta, SOC 2, ISO 27001 readiness",
  },
  {
    title: "Automation & Scripting",
    meta: "Python, JavaScript, TypeScript, YAML, JSON, Bash, Lambda automation",
  },
  {
    title: "Development Stack",
    meta: "Node.js, Angular, Java, REST APIs, Postman, SQL, NoSQL, MongoDB",
  },
  {
    title: "Reliability Operations",
    meta: "Incident response, automated remediation, postmortems, resilience engineering",
  },
  {
    title: "Collaboration & Delivery",
    meta: "Jira, Confluence, Agile sprint execution, cross-functional delivery ownership",
  },
];

const SkillCard = ({ skill, index }) => {
  const cardRef = useRef(null);
  useScrollReveal(cardRef);

  return (
    <div
      className="skills__card reveal"
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="skills__title">{skill.title}</div>
      <div className="skills__meta">{skill.meta}</div>
    </div>
  );
};

const Skills = () => {
  const titleRef = useRef(null);
  useScrollReveal(titleRef);

  return (
    <section className="skills" id="skills" data-scroll-section>
      <div className="section__header">
        <span className="section__number">03</span>
        <RippleText tag="h2" className="section-title reveal" ref={titleRef}>
          Core Skills
        </RippleText>
      </div>
      <div className="skills__grid">
        {skills.map((skill, index) => (
          <SkillCard skill={skill} index={index} key={skill.title} />
        ))}
      </div>
    </section>
  );
};

export default Skills;



