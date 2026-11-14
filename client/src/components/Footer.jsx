import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Footer = () => {
  const { theme } = useContext(AppContext);
  return (
    <footer className="border-t border-violet-200/50 dark:border-white/10 px-6 py-8 mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-slate-500 dark:text-white/40">
        <p>
          © 2026 <span className="gradient-text font-bold">✦ Imagify</span> — dream it, type it, see it
        </p>
        <div className="flex items-center gap-4">
          <Link to="/gallery" className="hover:text-violet-500 dark:hover:text-violet-300">
            Gallery
          </Link>
          <span>
            Designed & built with 💜 by{" "}
            <span className="font-semibold text-slate-700 dark:text-white/70">
              Sonia Yadav
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
