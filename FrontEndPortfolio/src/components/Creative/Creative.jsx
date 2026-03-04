import React, { useRef } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import RippleText from "../RippleText/RippleText";
import "../SectionShared.css";
import "./Creative.css";

const Creative = () => {
  const titleRef = useRef(null);

  useScrollReveal(titleRef);

  return (
    <section className="creative" id="creative" data-scroll-section>
      <div className="section__header">
        <span className="section__number">05</span>
        <RippleText tag="h2" className="section-title reveal" ref={titleRef} effect="smoke">
          Creative Labs
        </RippleText>
      </div>
      <div className="creative__grid">
        {[
          "Bike Rides & Long Routes",
          "Cricket Sessions",
          "Football Matches",
          "Weekend Adventure Trails",
          "Road Trip Planning",
          "Fitness & Endurance Training",
          "Outdoor Team Activities",
        ].map(
          (item) => (
            <div className="creative__card" key={item}>
              <span className="creative__item">{item}</span>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Creative;

