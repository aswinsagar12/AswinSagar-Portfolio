import React, { useCallback, useEffect, useRef, useState } from "react";
import BatmanLogo3D from "./BatmanLogo3D";
import FloatingGlassShards3D from "./FloatingGlassShards3D";
import VolumetricDust3D from "./VolumetricDust3D";
import OrbitingRings3D from "./OrbitingRings3D";
import ProceduralRocks3D from "./ProceduralRocks3D";
import EnergyFieldPlane3D from "./EnergyFieldPlane3D";
import useScrollReveal from "../hooks/useScrollReveal";
import "./Hero.css";

const nameLines = ["ASWIN", "SAGAR"];
const HERO_3D_MODE = "dust"; // Values: "batman", "glass", "dust", "rings", "rocks", "energy", "batman+dust"

const Hero = () => {
  const captionRef = useRef(null);
  const [hideIndicator, setHideIndicator] = useState(false);
  const [logoFx, setLogoFx] = useState({ active: false, x: 0.5, y: 0.5 });
  const pointerRafRef = useRef(0);
  const pendingPointerRef = useRef({ x: 0.5, y: 0.5 });

  useScrollReveal(captionRef);

  useEffect(() => {
    const onScroll = () => {
      setHideIndicator((window.scrollY || 0) > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (pointerRafRef.current) cancelAnimationFrame(pointerRafRef.current);
    };
  }, []);

  const handleInteractionChange = useCallback((active) => {
    setLogoFx((prev) => ({ ...prev, active }));
  }, []);

  const handlePointerMove = useCallback(({ x, y }) => {
    pendingPointerRef.current = { x, y };
    if (pointerRafRef.current) return;
    pointerRafRef.current = requestAnimationFrame(() => {
      pointerRafRef.current = 0;
      setLogoFx((prev) => ({
        ...prev,
        x: pendingPointerRef.current.x,
        y: pendingPointerRef.current.y,
      }));
    });
  }, []);

  const renderHeroBackground = () => {
    switch (HERO_3D_MODE) {
      case "batman":
        return (
          <BatmanLogo3D
            onInteractionChange={handleInteractionChange}
            onPointerMove={handlePointerMove}
          />
        );
      case "glass":
        return <FloatingGlassShards3D />;
      case "rings":
        return <OrbitingRings3D />;
      case "rocks":
        return <ProceduralRocks3D />;
      case "energy":
        return <EnergyFieldPlane3D />;
      case "batman+dust":
        return (
          <>
            <div className="hero__background-layer hero__background-layer--dust">
              <VolumetricDust3D />
            </div>
            <div className="hero__background-layer hero__background-layer--batman">
              <BatmanLogo3D
                onInteractionChange={handleInteractionChange}
                onPointerMove={handlePointerMove}
              />
            </div>
          </>
        );
      case "dust":
      default:
        return <VolumetricDust3D />;
    }
  };

  return (
    <section
      className={`hero section hero--3d ${logoFx.active ? "hero--logo-active" : ""}`}
      id="home"
      data-scroll-section
    >
      <div className="hero__background" aria-hidden="true">
        {renderHeroBackground()}
      </div>
      <div className="hero__overlay">
        <div className="hero__name">
          {nameLines.map((line, lineIndex) => (
            <h1 key={line} className="hero__name-line">
              {[...line].map((letter, letterIndex) => {
                const targetX = (letterIndex + 0.5) / line.length;
                const targetY = lineIndex === 0 ? 0.36 : 0.68;
                const dist = Math.hypot(logoFx.x - targetX, logoFx.y - targetY);
                const hit = Math.max(0, 1 - dist * 2.9);
                const isTouched = logoFx.active && hit > 0.2;

                return (
                  <span
                    key={`${line}-${letter}-${letterIndex}`}
                    className={`hero__letter ${isTouched ? "hero__letter--outline" : ""}`}
                    style={{
                      opacity: 1,
                      color: isTouched ? "transparent" : "#ffffff",
                      textShadow: "none",
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </h1>
          ))}
        </div>

        <div className="hero__subtitle">
          <span className="hero__role">SITE RELIABILITY ENGINEER</span>
          <span
            className="hero__caption soft-text reveal"
            ref={captionRef}
            style={{ transitionDelay: "0.2s" }}
          >
          </span>
        </div>
      </div>
      <div className={`hero__scroll ${hideIndicator ? "hero__scroll--hide" : ""}`}>
        <span>{"\u2193"}</span>
      </div>
    </section>
  );
};

export default Hero;
