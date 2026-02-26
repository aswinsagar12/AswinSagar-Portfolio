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
          <div className="creative__item creative__item--one">Biker</div>
          <div className="creative__item creative__item--two">Gym</div>
          <div className="creative__item creative__item--three">Sports</div>
          <div className="creative__item creative__item--four">Editing</div>
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
