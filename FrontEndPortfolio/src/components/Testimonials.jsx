import React, { useEffect, useRef, useState } from "react";
import { client } from "../client";
import useScrollReveal from "../hooks/useScrollReveal";

const TestimonialCard = ({ item, index }) => {
  const cardRef = useRef(null);
  useScrollReveal(cardRef);

  const name = (item.name || "").replace(/�/g, "·").trim();
  const company = (item.company || "").replace(/�/g, "·").trim();

  return (
    <div
      className="testimonial-card reveal"
      ref={cardRef}
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div className="testimonial-card__quote soft-text">{item.feedback}</div>
      <div className="testimonial-card__author">
        {name} · {company}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const titleRef = useRef(null);
  const placeholderRef = useRef(null);

  useScrollReveal(titleRef);
  useScrollReveal(placeholderRef);

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
        <h2 className="section-title reveal" ref={titleRef}>
          Testimonials
        </h2>
      </div>
      <div className="testimonials__grid">
        {(testimonials.length ? testimonials : []).map((item, index) => (
          <TestimonialCard item={item} index={index} key={item._id || item.name} />
        ))}
        {testimonials.length === 0 && (
          <div className="testimonial-card reveal" ref={placeholderRef}>
            <div className="testimonial-card__quote">
              "Trusted to keep critical systems reliable and calm under pressure."
            </div>
            <div className="testimonial-card__author">- Placeholder</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;

