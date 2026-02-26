import React from "react";

const Creative = () => {
  return (
    <section className="creative" id="creative" data-scroll-section>
      <div className="section__header">
        <span className="section__number">05</span>
        <h2 className="section-title">Creative Field</h2>
      </div>
      <div className="creative__grid">
        <div className="creative__list">
          <div className="creative__row">
            <span className="creative__num">01</span>
            <span className="creative__item">Biker</span>
          </div>
          <div className="creative__row">
            <span className="creative__num">02</span>
            <span className="creative__item">Gym</span>
          </div>
          <div className="creative__row">
            <span className="creative__num">03</span>
            <span className="creative__item">Sports</span>
          </div>
          <div className="creative__row">
            <span className="creative__num">04</span>
            <span className="creative__item">Editing</span>
          </div>
        </div>
        <div className="creative__shapes">
          <div className="creative__shape creative__shape--ring" />
          <div className="creative__shape creative__shape--ring-lg" />
          <div className="creative__shape creative__shape--burst" />
        </div>
      </div>
    </section>
  );
};

export default Creative;
