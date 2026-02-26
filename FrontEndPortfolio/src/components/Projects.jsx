import React, { useEffect, useState } from "react";
import { client } from "../client";

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const query = '*[_type=="works"] | order(_createdAt desc)';
    client
      .fetch(query)
      .then((data) => setProjects(data || []))
      .catch(() => setProjects([]));
  }, []);

  return (
    <section className="projects section" id="work" data-scroll-section>
      <div className="section__header">
        <span className="section__number">01</span>
        <h2 className="section-title">Selected Work</h2>
      </div>
      <div className="projects__list">
        {projects.length === 0 && (
          <div className="project-row project-row--empty">
            <div className="project-row__index">00</div>
            <div className="project-row__title">Projects loading</div>
            <div className="project-row__meta">
              Connect Sanity to populate this list.
            </div>
          </div>
        )}
        {projects.map((project, index) => (
          <a
            className="project-row"
            key={project.title + index}
            href={project.projectLink || project.codeLink || "#"}
            target={project.projectLink || project.codeLink ? "_blank" : undefined}
            rel={project.projectLink || project.codeLink ? "noreferrer" : undefined}
          >
            <div className="project-row__index">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="project-row__content">
              <div
                className="project-row__title"
                data-scroll
                data-scroll-speed="1"
              >
                {project.title}
              </div>
              <div className="project-row__meta">
                {project.description || "Project description"}
              </div>
              <div className="project-row__tags">
                {(project.tags || []).slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="project-row__arrow">↗</div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
