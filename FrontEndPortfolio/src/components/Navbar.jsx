import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__brand">Aswin Sagar</div>
      <div className="navbar__links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#creative">Creative</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
