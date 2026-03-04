import React, { useEffect, useRef, useState } from "react";
import batmanLogo from "../../assets/BatMan.svg";
import useScrollReveal from "../../hooks/useScrollReveal";
import RippleText from "../RippleText/RippleText";
import "../SectionShared.css";
import "./Contact.css";

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const emailRef = useRef(null);
  const linksRef = useRef(null);
  const launchTimeoutRef = useRef(null);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const [showTopControl, setShowTopControl] = useState(false);
  const [launchingTopControl, setLaunchingTopControl] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useScrollReveal(titleRef);
  useScrollReveal(emailRef);
  useScrollReveal(linksRef);

  useEffect(() => {
    const onScroll = () => {
      const node = sectionRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const inContact = rect.top < window.innerHeight && rect.bottom > 0;
      const footer = document.querySelector(".footer");
      const footerVisible = footer ? footer.getBoundingClientRect().top <= window.innerHeight : false;
      setShowTopControl(inContact && footerVisible);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (launchTimeoutRef.current) window.clearTimeout(launchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const onPointerMove = (e) => {
      if (!dragRef.current.active) return;
      const nextX = dragRef.current.originX + (e.clientX - dragRef.current.startX);
      const nextY = dragRef.current.originY + (e.clientY - dragRef.current.startY);
      setDragOffset({ x: nextX, y: nextY });
    };

    const onPointerUp = () => {
      dragRef.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  const handleTopClick = () => {
    if (launchingTopControl) return;
    setLaunchingTopControl(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: { path: "/" } }));
    launchTimeoutRef.current = window.setTimeout(() => {
      setLaunchingTopControl(false);
    }, 980);
  };

  const handleDragStart = (e) => {
    dragRef.current.active = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.originX = dragOffset.x;
    dragRef.current.originY = dragOffset.y;
  };

  return (
    <section className="contact section" id="contact" data-scroll-section ref={sectionRef}>
      <div className="contact__content">
        <RippleText tag="h2" className="contact__title reveal" ref={titleRef} effect="smoke">
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
      {showTopControl && (
        <div className="contact__top-control">
          <span className="contact__top-hint">to scroll to top click this button</span>
          <div
            className="contact__top-button-wrap"
            style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
          >
            <button
              type="button"
              className={`contact__top-button ${launchingTopControl ? "contact__top-button--launching" : ""}`}
              aria-label="Scroll to top"
              onPointerDown={handleDragStart}
              onClick={handleTopClick}
            >
              <img src={batmanLogo} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;

