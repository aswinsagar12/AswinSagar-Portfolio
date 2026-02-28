import React, { useRef } from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import RippleText from "../RippleText/RippleText";
import "../SectionShared.css";
import "./Contact.css";

const Contact = () => {
  const titleRef = useRef(null);
  const emailRef = useRef(null);
  const linksRef = useRef(null);

  useScrollReveal(titleRef);
  useScrollReveal(emailRef);
  useScrollReveal(linksRef);

  return (
    <section className="contact section" id="contact" data-scroll-section>
      <div className="contact__content">
        <RippleText tag="h2" className="contact__title reveal" ref={titleRef}>
          Let&apos;s Work Together
        </RippleText>
        <a className="contact__email reveal" ref={emailRef} href="mailto:aswinsagar12@gmail.com">
          aswinsagar12@gmail.com
        </a>
        <div className="contact__links reveal" ref={linksRef}>
          <a href="https://www.instagram.com/aswin.sagar/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/aswinsagar12/" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.youtube.com/@aswinsagar12" target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href="https://in.pinterest.com/aswinsagar/" target="_blank" rel="noreferrer">
            Pinterest
          </a>
          <a href="https://www.linkedin.com/in/aswinsagar12/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;


