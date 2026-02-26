import React, { useEffect } from "react";
import Lenis from "lenis";
import LocomotiveScroll from "locomotive-scroll";
import {
  Navbar,
  SocialMedia,
  Hero,
  Marquee,
  About,
  Experience,
  Skills,
  Creative,
  Testimonials,
  Contact,
  Footer,
} from "./components";

const App = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor");
    const onMove = (event) => {
      if (!cursor) return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    const onDown = () => cursor?.classList.add("cursor--active");
    const onUp = () => cursor?.classList.remove("cursor--active");

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      wheelMultiplier: 1,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const loco = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      multiplier: 1,
    });

    const navbar = document.querySelector(".navbar");
    const onScroll = ({ scroll }) => {
      if (!navbar) return;
      if (scroll > 20) {
        navbar.classList.add("navbar--scrolled");
      } else {
        navbar.classList.remove("navbar--scrolled");
      }
    };

    lenis.on("scroll", onScroll);

    const revealItems = document.querySelectorAll(".io-reveal");
    const contactStack = document.querySelector(".contact__stack");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
    if (contactStack) observer.observe(contactStack);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      loco.destroy();
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <div className="app" data-scroll-container>
      <div className="cursor" aria-hidden="true" />
      <Navbar />
      <SocialMedia />
      <Hero />
      <Marquee text="SITE RELIABILITY — OBSERVABILITY — DEVOPS — PLATFORM — " inverted />
      <About />
      <Skills />
      <Experience />
      <Creative />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
