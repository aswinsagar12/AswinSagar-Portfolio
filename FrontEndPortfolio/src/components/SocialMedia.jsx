import React from "react";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";

const SocialMedia = () => {
  return (
    <div className="social">
      <a
        href="https://github.com/aswinsagar12"
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
      >
        <BsGithub />
      </a>
      <a
        href="https://www.linkedin.com/in/aswinsagar12/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <BsLinkedin />
      </a>
      <a
        href="https://twitter.com/Aswinsagar12"
        target="_blank"
        rel="noreferrer"
        aria-label="Twitter"
      >
        <BsTwitter />
      </a>
    </div>
  );
};

export default SocialMedia;
