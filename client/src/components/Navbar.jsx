import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import LoginModal from "./LoginModal.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIsLoggedIn,
    token,
    setToken,
    userData,
    theme,
    toggleTheme,
  } = useContext(AppContext);
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
    setUserData(null);
    setMenuOpen(false);
    navigate("/");
  };

  const initial = userData?.user?.name?.charAt(0).toUpperCase() || "S";

  return (
    <>
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            <span className="gradient-text">✦ Imagify</span>
          </Link>

          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light" : "Switch to dark"}
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {isLoggedIn ? (
              <>
                <Link
                  to="/gallery"
                  className="hidden sm:block text-sm px-4 py-2 rounded-full glass hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
                >
                  🖼 Gallery
                </Link>
                <Link
                  to="/buy"
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full bg-violet-500/15 border border-violet-400/30 text-violet-600 dark:text-violet-200 hover:bg-violet-500/25 transition"
                >
                  <span>⚡</span>
                  <span className="font-semibold">{userData?.creditBalance ?? "—"}</span>
                  <span className="hidden md:inline opacity-70">credits</span>
                </Link>

                {/* Profile avatar */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    title="Your profile"
                    className="w-9 h-9 rounded-full glow-btn flex items-center justify-center text-sm font-bold text-white"
                  >
                    {initial}
                  </button>

                  {menuOpen && (
                    <>
                      {/* invisible backdrop to close on outside click */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-60 dropdown-panel rounded-2xl p-1.5 z-50 animate-fade-up">
                        <div className="flex items-center gap-3 px-2.5 py-2.5">
                          <span className="w-10 h-10 rounded-full glow-btn flex items-center justify-center text-base font-bold text-white shrink-0">
                            {initial}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {userData?.user?.name}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-white/40 truncate">
                              {userData?.user?.email}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-violet-500/10 dark:border-white/10 my-1" />

                        <Link
                          to="/gallery"
                          onClick={() => setMenuOpen(false)}
                          className="block text-sm px-3 py-2 rounded-lg text-slate-700 dark:text-white/80 hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
                        >
                          🖼 My Gallery
                        </Link>
                        <Link
                          to="/buy"
                          onClick={() => setMenuOpen(false)}
                          className="block text-sm px-3 py-2 rounded-lg text-slate-700 dark:text-white/80 hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
                        >
                          ⚡ Buy Credits
                        </Link>

                        <div className="border-t border-violet-500/10 dark:border-white/10 my-1" />

                        <button
                          onClick={logout}
                          className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                        >
                          ⎋ Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-sm font-medium px-6 py-2 rounded-full glow-btn"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
