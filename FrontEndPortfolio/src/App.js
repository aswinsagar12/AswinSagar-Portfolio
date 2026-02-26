import React, { useEffect } from "react";
import Lenis from "lenis";
import LocomotiveScroll from "locomotive-scroll";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    gsap.registerPlugin(ScrollTrigger);

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

    gsap.from(".hero__letter", {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.03,
      delay: 0.2,
    });

    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      loco.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="app" data-scroll-container>
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
