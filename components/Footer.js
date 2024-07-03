import { GithubIcon, TwitterIcon, Linkedin02Icon } from "hugeicons-react";

const Footer = () => {
  return (
    <div className="flex min-h-[15vh] flex-col items-center justify-center gap-6">
      <div id="footer-icons-row" className="flex justify-center gap-8">
        <a
          href="https://github.com/jackiewong99"
          target="_blank"
          className="duration-100 ease-in hover:opacity-60 hover:transition-all"
        >
          <GithubIcon size={40} color="#5c8d89" strokeWidth={2} />
        </a>
        <a
          href="https://twitter.com/wongzjackie"
          target="_blank"
          className="duration-100 ease-in hover:opacity-60 hover:transition-all"
        >
          <TwitterIcon size={40} color="#5c8d89" strokeWidth={2} />
        </a>
        <a
          href="https://www.linkedin.com/in/jackiezwong/"
          target="_blank"
          className="duration-100 ease-in hover:opacity-60 hover:transition-all"
        >
          <Linkedin02Icon size={40} color="#5c8d89" strokeWidth={2} />
        </a>
      </div>
      <div id="footer-text">
        <h5 className="text-sm text-forest-700">
          Designed &amp; Built by Jackie Wong
        </h5>
      </div>
    </div>
  );
};

export default Footer;
