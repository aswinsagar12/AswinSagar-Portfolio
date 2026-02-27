import React, { useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import {
  Navbar,
  SocialMedia,
  CustomCursor,
  HeroPlayground,
  Marquee,
  About,
  Experience,
  Skills,
  Creative,
  Testimonials,
  PhotoGallery,
  Contact,
  Footer,
  RouteNotFound,
} from "./components";

const ROUTE_TO_SECTION = {
  "/": "home",
  "/home": "home",
  "/about": "about",
  "/skills": "skills",
  "/experience": "experience",
  "/creative": "creative",
  "/testimonials": "testimonials",
  "/test": "testimonials",
  "/moments": "moments",
  "/projects": "moments",
  "/work": "moments",
  "/contact": "contact",
};

const normalizePath = (path) => {
  const clean = (path || "/")
    .toLowerCase()
    .split("?")[0]
    .split("#")[0]
    .replace(/\/+$/, "");
  return clean || "/";
};

const App = () => {
  const [routePath, setRoutePath] = useState(() =>
    typeof window !== "undefined" ? normalizePath(window.location.pathname) : "/"
  );
  const routeSection = useMemo(() => ROUTE_TO_SECTION[routePath] || null, [routePath]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
      if (scroll > 20) navbar.classList.add("navbar--scrolled");
      else navbar.classList.remove("navbar--scrolled");
    };

    const onPopState = () => {
      setRoutePath(normalizePath(window.location.pathname));
    };
    const onNavigate = (e) => {
      const next = normalizePath(e?.detail?.path || "/");
      if (window.location.pathname !== next) {
        window.history.pushState({}, "", next);
      }
      setRoutePath(next);
    };

    lenis.on("scroll", onScroll);
    lenis.scrollTo(0, { immediate: true });
    window.addEventListener("popstate", onPopState);
    window.addEventListener("app:navigate", onNavigate);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("app:navigate", onNavigate);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!routeSection) return;
    const id = window.setTimeout(() => {
      if (routeSection === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const section = document.getElementById(routeSection);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
    return () => window.clearTimeout(id);
  }, [routeSection]);

  return (
    <div className="app" data-scroll-container>
      <CustomCursor />
      {routeSection ? (
        <>
          <Navbar />
          <SocialMedia />
          <HeroPlayground />
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
        </>
      ) : (
        <RouteNotFound />
      )}
    </div>
  );
};

export default App;
