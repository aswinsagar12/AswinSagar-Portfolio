import React from "react";
import "./Navbar.css";

const Navbar = () => {
  const handleNavigate = (e, path) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("app:navigate", { detail: { path } }));
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">Aswin Sagar</div>
      <div className="navbar__links">
        <a href="/about" className="navbar__link" onClick={(e) => handleNavigate(e, "/about")}>
          <span className="navbar__link-side navbar__link-side--before">to know more</span>
          <span className="navbar__link-main">About</span>
          <span className="navbar__link-side navbar__link-side--after">me</span>
        </a>
        <a href="/contact" className="navbar__link" onClick={(e) => handleNavigate(e, "/contact")}>
          <span className="navbar__link-side navbar__link-side--before">dont be shy</span>
          <span className="navbar__link-main">Say Hi</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;


