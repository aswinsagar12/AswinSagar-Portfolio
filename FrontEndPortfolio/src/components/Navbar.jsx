import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">Aswin Sagar</div>
      <div className="navbar__links">
        <a href="#about"><span>About</span></a>
        <a href="#contact"><span>Contact</span></a>
      </div>
    </nav>
  );
};

export default Navbar;
