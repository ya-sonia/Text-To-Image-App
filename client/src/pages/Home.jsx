import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";

const steps = [
  {
    icon: "✍️",
    title: "Describe your vision",
    desc: "Type any idea — a scene, a style, a feeling. Words are all you need.",
  },
  {
    icon: "🤖",
    title: "AI paints it",
    desc: "Our AI model turns your prompt into a unique image in seconds.",
  },
  {
    icon: "⬇️",
    title: "Download & share",
    desc: "Save your artwork in one click and find it anytime in your Gallery.",
  },
];

const showcase = [
  { emoji: "🦅", label: "Eagle over snowy peaks", bg: "from-sky-400/50 to-indigo-500/50 dark:from-sky-500/40 dark:to-indigo-700/40" },
  { emoji: "🌇", label: "Neon cyberpunk city", bg: "from-fuchsia-400/50 to-purple-600/50 dark:from-fuchsia-500/40 dark:to-purple-800/40" },
  { emoji: "🤖", label: "Cute robot gardener", bg: "from-violet-400/50 to-blue-500/50 dark:from-violet-500/40 dark:to-blue-700/40" },
  { emoji: "🐉", label: "Dragon in the mist", bg: "from-emerald-400/50 to-teal-600/50 dark:from-emerald-500/40 dark:to-teal-800/40" },
  { emoji: "🌌", label: "Dreamlike galaxies", bg: "from-pink-400/50 to-rose-600/50 dark:from-pink-500/40 dark:to-rose-800/40" },
  { emoji: "🏖️", label: "Sunset island escape", bg: "from-amber-400/50 to-orange-600/50 dark:from-amber-500/40 dark:to-orange-800/40" },
];

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, backendUrl, userData, loadUserData } = useContext(AppContext);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("promptHistory") || "[]")
  );
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const pushHistory = (p) => {
    const updated = [p, ...history.filter((x) => x !== p)].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("promptHistory", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    setHistorySearch("");
    setShowAllHistory(false);
    setHistoryOpen(false);
    localStorage.removeItem("promptHistory");
    toast.info("Prompt history cleared");
  };

  const filteredHistory = history.filter((h) =>
    h.toLowerCase().includes(historySearch.toLowerCase())
  );
  const visibleHistory = showAllHistory
    ? filteredHistory
    : filteredHistory.slice(0, 5);

  const samplePrompts = [
    "A majestic eagle flying over snowy mountains at sunset",
    "A cozy cafe interior with warm lighting, illustration style",
    "Futuristic city skyline with neon lights at night",
    "A cute robot reading a book in a garden",
  ];

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setHistoryOpen(false);

    if (!isLoggedIn) {
      toast.info("Login to start creating ✨");
      return;
    }
    if (!prompt.trim()) {
      toast.info("Describe what you want to see first");
      return;
    }
    if (userData?.creditBalance === 0) {
      toast.info("You're out of credits!");
      navigate("/buy");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/image/generate`, {
        prompt,
      });

      if (data.success) {
        pushHistory(prompt);
        navigate("/result", {
          state: { image: data.resultImage, prompt },
        });
        await loadUserData();
      } else {
        toast.error(data.message);
        if (data.creditBalance === 0) navigate("/buy");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ambient background glows */}
      <div className="blob w-[420px] h-[420px] bg-violet-400/30 dark:bg-violet-700/30 -top-20 -left-40" />
      <div className="blob w-[380px] h-[380px] bg-fuchsia-400/25 dark:bg-fuchsia-700/25 top-40 -right-40" />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative max-w-4xl mx-auto px-6 pt-16 pb-10 text-center animate-fade-up">
        <span className="inline-flex items-center gap-2 text-xs px-4 py-1.5 rounded-full glass text-violet-600 dark:text-violet-200 mb-6">
          ✨ AI-powered · No design skills needed
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
          Turn your imagination into{" "}
          <span className="gradient-text">stunning images</span>
        </h1>
        <p className="text-slate-500 dark:text-white/50 mt-4 max-w-xl mx-auto text-lg">
          Describe anything you can dream of — Imagify paints it for you in
          seconds. <span className="font-medium text-slate-700 dark:text-white/80">Start with 5 free credits.</span>
        </p>

        {/* prompt studio card */}
        <div className="relative mt-10 max-w-2xl mx-auto text-left">
          <form
            onSubmit={onSubmitHandler}
            className="glass rounded-3xl p-3 flex flex-col sm:flex-row gap-3 shadow-2xl"
          >
          <span className="hidden sm:flex items-center pl-3 text-xl">🎨</span>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A glowing forest with floating lanterns…"
            className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-slate-400 dark:placeholder:text-white/35 text-slate-900 dark:text-white"
          />

          {/* prompt history dropdown */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              title="Your recent prompts"
              className="sm:order-none w-10 h-10 self-center rounded-xl glass flex items-center justify-center hover:bg-violet-500/10 dark:hover:bg-white/10 transition shrink-0"
            >
              🕘
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="glow-btn px-8 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap"
          >
            {loading ? "Creating…" : "Generate ✦"}
          </button>
        </form>

          {historyOpen && (
            <div className="mt-2 w-full sm:w-[420px] sm:ml-auto dropdown-panel rounded-2xl p-1.5 text-left animate-fade-up">
              <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1">
                <p className="text-[11px] font-semibold text-slate-400 dark:text-white/40">
                  Your recent prompts ({history.length})
                </p>
                <button
                  type="button"
                  onClick={() => setHistoryOpen(false)}
                  className="text-[11px] text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white"
                >
                  ✕ close
                </button>
              </div>

              {/* search inside history */}
              {history.length > 5 && (
                <div className="px-1.5 pb-1.5">
                  <input
                    type="text"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    placeholder="🔍 Search your prompts…"
                    className="dark-input w-full rounded-lg px-3 py-1.5 text-xs"
                    autoFocus
                  />
                </div>
              )}

              {/* scrollable list — max 5 visible unless expanded */}
              <div className="max-h-[236px] overflow-y-auto">
                {visibleHistory.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setPrompt(h);
                      setHistoryOpen(false);
                      setHistorySearch("");
                    }}
                    className="w-full text-left text-[13px] leading-snug px-2.5 py-2 rounded-lg text-slate-700 dark:text-white/80 hover:bg-violet-500/10 dark:hover:bg-white/10 transition truncate"
                  >
                    🖌 {h}
                  </button>
                ))}

                {visibleHistory.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-white/40 px-3 py-4 text-center">
                    No prompts match “{historySearch}”
                  </p>
                )}
              </div>

              {/* footer actions */}
              <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1 border-t border-violet-500/10 dark:border-white/10 mt-1">
                {filteredHistory.length > 5 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllHistory((s) => !s)}
                    className="text-[11px] text-violet-600 dark:text-violet-300 font-medium hover:underline"
                  >
                    {showAllHistory
                      ? "Show less"
                      : `Show all ${filteredHistory.length}`}
                  </button>
                ) : (
                  <span />
                )}
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[11px] text-red-500 hover:text-red-400"
                  >
                    🗑 Clear history
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="text-xs text-slate-400 dark:text-white/35 self-center">Try:</span>
          {samplePrompts.map((s) => (
            <button
              key={s}
              onClick={() => setPrompt(s)}
              className="text-xs px-3.5 py-1.5 rounded-full glass text-slate-600 dark:text-white/70 hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {isLoggedIn && (
          <p className="mt-6 text-sm text-slate-500 dark:text-white/50">
            You have{" "}
            <span className="text-violet-500 dark:text-violet-300 font-semibold">
              ⚡ {userData?.creditBalance ?? "—"} credits
            </span>{" "}
            — each image costs 1
          </p>
        )}
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          How it <span className="gradient-text">works</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="glass rounded-3xl p-7 text-center hover:bg-violet-500/[0.07] dark:hover:bg-white/[0.09] transition animate-fade-up"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="text-4xl mb-4 animate-floaty" style={{ animationDelay: `${i * 0.5}s` }}>
                {s.icon}
              </div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-white/50 mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Showcase ─────────────────────────────────────────── */}
      <section className="relative max-w-5xl mx-auto px-6 py-10 pb-20">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          What will <span className="gradient-text">you</span> create?
        </h2>
        <p className="text-center text-slate-500 dark:text-white/50 mt-2 text-sm">
          A glimpse of the styles you can generate
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {showcase.map((s, i) => (
            <div
              key={s.label}
              className={`relative rounded-3xl p-6 aspect-[4/3] bg-gradient-to-br ${s.bg} glass flex flex-col items-center justify-center gap-3 hover:scale-[1.03] transition-transform duration-300`}
            >
              <span className="text-5xl animate-floaty" style={{ animationDelay: `${i * 0.4}s` }}>
                {s.emoji}
              </span>
              <span className="text-xs text-slate-700 dark:text-white/75 text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
