import React from "react";

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
    meta: "AWS, GCP, OpenStack, multi‑cloud strategy",
  },
  {
    title: "Containers & Orchestration",
    meta: "Docker, Kubernetes (EKS, self‑managed)",
  },
  {
    title: "Incident Response",
    meta: "PagerDuty, Opsgenie, postmortems, runbooks",
  },
];

const Skills = () => {
  return (
    <section className="skills" id="skills" data-scroll-section>
      <div className="section__header">
        <span className="section__number">03</span>
        <h2 className="section-title">Core Skills</h2>
      </div>
      <div className="skills__grid">
        {skills.map((skill) => (
          <div className="skills__card" key={skill.title}>
            <div className="skills__title">{skill.title}</div>
            <div className="skills__meta">{skill.meta}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
