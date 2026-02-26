import React, { useEffect, useState } from "react";
import { client } from "../client";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const query = '*[_type == "testimonials"]';
    client
      .fetch(query)
      .then((data) => setTestimonials(data || []))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <section className="testimonials" id="testimonials" data-scroll-section>
      <div className="section__header">
        <span className="section__number">06</span>
        <h2 className="section-title">Testimonials</h2>
      </div>
      <div className="testimonials__grid io-reveal">
        {(testimonials.length ? testimonials : []).map((item) => (
          <div className="testimonial-card" key={item._id || item.name}>
            <div className="testimonial-card__quote soft-text">
              {item.feedback}
            </div>
            <div className="testimonial-card__author">
              {item.name} · {item.company}
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="testimonial-card">
            <div className="testimonial-card__quote">
              "Trusted to keep critical systems reliable and calm under pressure."
            </div>
            <div className="testimonial-card__author">— Placeholder</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
