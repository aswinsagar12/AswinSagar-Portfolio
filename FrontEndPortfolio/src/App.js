import React, { useEffect } from "react";
import Lenis from "lenis";
import {
  Navbar,
  SocialMedia,
  CustomCursor,
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
    const lenis = new Lenis({
      smooth: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

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


    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app" data-scroll-container>
      <CustomCursor />
      <Navbar />
      <SocialMedia />
      <Hero />
      <Marquee text="SITE RELIABILITY - OBSERVABILITY - DEVOPS - PLATFORM - " inverted />
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


