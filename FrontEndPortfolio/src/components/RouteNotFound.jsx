import React from "react";

export default function RouteNotFound() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#000",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "min(780px, 100%)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 18,
          padding: "2rem",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1 }}>404_NOT_FOUND</h1>
        <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.68)" }}>
          The path you requested does not exist on aswinsagar.com.
        </p>
        <p style={{ marginTop: "0.5rem", color: "rgba(255,255,255,0.68)" }}>
          Try: <code>/about</code>, <code>/skills</code>, <code>/experience</code>, <code>/creative</code>,{" "}
          <code>/testimonials</code>, <code>/projects</code>, <code>/contact</code>
        </p>
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <a
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: "0.65rem 0.9rem",
            }}
          >
            Go Home
          </a>
          <a
            href="/#contact"
            style={{
              color: "#fff",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 12,
              padding: "0.65rem 0.9rem",
            }}
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}
