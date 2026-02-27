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
  PhotoGallery,
  Contact,
  Footer,
} from "./components";

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      duration: 0.85,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.05,
      syncTouch: true,
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
      <Marquee
        text="SITE RELIABILITY · OBSERVABILITY · DEVOPS · PLATFORM ENGINEERING · KUBERNETES · CLOUD INFRASTRUCTURE · AUTOMATION · INCIDENT RESPONSE · PERFORMANCE · CI/CD"
        inverted
      />
      <About />
      <Skills />
      <Experience />
      <Creative />
      <Testimonials />
      <PhotoGallery />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;


