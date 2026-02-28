import React, { useEffect, useState } from "react";
import DevOpsIcons3D from "../DevOpsIcons3D/DevOpsIcons3D";
import HeroName from "../HeroName/HeroName";
import LocationWidget from "../LocationWidget/LocationWidget";
import QuoteWidget from "../QuoteWidget/QuoteWidget";
import TerminalWidget from "../TerminalWidget/TerminalWidget";
import "./HeroPlayground.css";

export default function HeroPlayground() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 720
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="home"
      className="hero-container"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <DevOpsIcons3D />
      <HeroName />
      <LocationWidget />
      <QuoteWidget />
      {!isMobile && <TerminalWidget />}
    </section>
  );
}




