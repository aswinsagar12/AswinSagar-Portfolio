import React from "react";
import { BsGithub } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SocialIcons = () => {
  return (
    <div>
      <div>
        <NavLink>
          <BsGithub width={30} heigh={25} fill="current" />
        </NavLink>
      </div>
      <div>
        <NavLink>
          <FaTwitter width={30} heigh={25} fill="current" />
        </NavLink>
      </div>
      <div>
        <NavLink>
          <FaInstagram width={30} heigh={25} fill="current" />
        </NavLink>
      </div>
      <div>
        <NavLink>
          <FaLinkedinIn width={30} heigh={25} fill="current" />
        </NavLink>
      </div>
      <div>
        <NavLink>
          <FaFacebook width={30} heigh={25} fill="current" />
        </NavLink>
      </div>
    </div>
  );
};

export default SocialIcons;
