import React from "react";
import { BsTwitter, BsInstagram, BsGithub, BsLinkedin, BsLink45Deg } from "react-icons/bs";
import styled from "styled-components";

const Icons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 2rem;
  z-index: 3;
`;

const SocialMedia = () => {
  return (
    <div className="app__social">
      <div>
        <a href="https://github.com/aswinsagar12" target="_blank" className="app__flex">
          <BsGithub />
        </a>
      </div>
      <div>
        <a href="https://twitter.com/Aswinsagar12" target="_blank" className="app__flex">
          <BsTwitter />
        </a>
      </div>

      <div>
        <a href="https://www.instagram.com/aswin.sagar/" target="_blank" className="app__flex">
          <BsInstagram />
        </a>
      </div>
      <div>
        <a href="https://www.linkedin.com/in/aswinsagar12/" target="_blank" className="app__flex">
          <BsLinkedin />
        </a>
      </div>

      <span className="app__line"></span>
    </div>
  );
};

export default SocialMedia;
