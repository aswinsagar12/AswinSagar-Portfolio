import React, { useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

const skills = [
  {
    title: "Reliability Engineering",
    meta: "SLOs, SLIs, error budgets, capacity planning",
  },
  {
    title: "Observability",
    meta: "Prometheus, Grafana, Logz.io, NewRelic, CloudWatch",
  },
  {
    title: "Automation & IaC",
    meta: "Terraform, Ansible, Bash, Python",
  },
  {
    title: "Cloud Platforms",
    meta: "AWS, GCP, OpenStack, multi-cloud strategy",
  },
  {
    title: "Containers & Orchestration",
    meta: "Docker, Kubernetes (EKS, self-managed)",
  },
  {
    title: "Incident Response",
    meta: "PagerDuty, Opsgenie, postmortems, runbooks",
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
        <h2 className="section-title reveal" ref={titleRef}>Core Skills</h2>
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

