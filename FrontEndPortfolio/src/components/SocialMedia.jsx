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
        <BsGithub size={16} />
      </a>
      <a
        href="https://www.linkedin.com/in/aswinsagar12/"
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <BsLinkedin size={16} />
      </a>
      <a
        href="https://twitter.com/Aswinsagar12"
        target="_blank"
        rel="noreferrer"
        aria-label="Twitter"
      >
        <BsTwitter size={16} />
      </a>
    </div>
  );
};

export default SocialMedia;
