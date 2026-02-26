import React from "react";

const Profile = () => {
  return (
    <section className="profile" id="profile" data-scroll-section>
      <div className="section__header">
        <span className="section__number">03</span>
        <h2 className="section-title">Profile</h2>
      </div>
      <div className="profile__grid">
        <div>
          <h3 className="profile__title">Aswin Sagar</h3>
          <p className="profile__subtitle">
            Site Reliability Engineer | Google Cloud & HashiCorp Certified
          </p>
          <p className="profile__meta">
            Garden City Games • Bengaluru, Karnataka, India
          </p>
          <div className="profile__list">
            <span>DevOps & Cloud • AWS & GCP • Kubernetes & Docker</span>
            <span>Automation • Observability • SLOs/SLIs</span>
            <span>Delivering scalable cloud solutions with JavaScript & Python</span>
          </div>
        </div>
        <div>
          <p className="profile__meta">
            Certified Site Reliability & DevOps Engineer specializing in highly
            available, scalable systems using AWS, OpenStack, and modern
            observability stacks. Focused on automation, incident response, and
            reliability culture.
          </p>
          <div className="profile__list">
            <span>IaC: Terraform, Ansible</span>
            <span>CI/CD: Jenkins, GitHub Actions</span>
            <span>Containers: Docker, Kubernetes (EKS, self-managed)</span>
            <span>Monitoring: Logz.io, Prometheus, Grafana, Nagios</span>
            <span>Incident: Opsgenie, PagerDuty</span>
            <span>Automation: Python, Bash, Linux Admin</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
