import React from "react";

const Creative = () => {
  return (
    <section className="creative" id="creative" data-scroll-section>
      <div className="section__header">
        <span className="section__number">05</span>
        <h2 className="section-title">Creative Field</h2>
      </div>
      <div className="creative__grid io-reveal">
        {[
          "Bike",
          "Gym",
          "Editing",
          "Cricket",
          "Football",
          "Humour",
          "Foodie",
        ].map((item) => (
          <div className="creative__card" key={item}>
            <span className="creative__item">{item}</span>
            <span className="creative__meta soft-text">Personal energy</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Creative;
