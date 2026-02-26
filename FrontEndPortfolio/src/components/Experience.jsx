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
          <div>
            <div className="experience__role">Site Reliability Engineer</div>
            <div className="experience__company">
              Garden City Games · Aug 2025 — Present · Bengaluru, India
            </div>
          </div>
          <div className="experience__details">
            <span>Automated AWS & OpenStack infrastructure with Terraform and Ansible.</span>
            <span>Built HA Kubernetes clusters and containerized workloads for scalability.</span>
            <span>Implemented observability with Logz.io, Prometheus, Grafana, Nagios.</span>
            <span>Streamlined incident response with Opsgenie and PagerDuty.</span>
            <span>Automated Linux admin and CI/CD workflows with Python and Bash.</span>
          </div>
        </div>
        <div className="experience__item">
          <div>
            <div className="experience__role">DevOps & Cloud Engineer</div>
            <div className="experience__company">
              HCLTech · Jun 2022 — Jul 2025 · Bengaluru, India
            </div>
          </div>
          <div className="experience__details">
            <span>Built Terraform modules for AWS and GCP, reducing deploy time.</span>
            <span>Managed CI/CD pipelines with Jenkins and GitHub Actions.</span>
            <span>Operated Kubernetes (EKS/GKE) and optimized reliability.</span>
            <span>Improved monitoring with Prometheus and Grafana.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
