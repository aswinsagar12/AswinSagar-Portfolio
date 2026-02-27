import React from "react";
import DevOpsIcons3D from "./DevOpsIcons3D";
import HeroName from "./HeroName";
import LocationWidget from "./LocationWidget";
import QuoteWidget from "./QuoteWidget";
import TerminalWidget from "./TerminalWidget";

export default function HeroPlayground() {
  return (
    <section
      id="home"
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
      <TerminalWidget />
    </section>
  );
}
