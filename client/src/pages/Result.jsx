import { useLocation, useNavigate } from "react-router-dom";

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const image = location.state?.image;
  const prompt = location.state?.prompt;

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "imagify-generation.png";
    link.click();
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="blob w-[400px] h-[400px] bg-fuchsia-400/25 dark:bg-fuchsia-700/25 top-0 left-1/3" />

      {!image ? (
        <div className="relative text-center glass rounded-3xl p-12 animate-fade-up">
          <span className="text-5xl">🖼️</span>
          <p className="text-slate-500 dark:text-white/60 mt-4">
            No artwork yet — create your first one!
          </p>
          <button
            onClick={() => navigate("/")}
            className="glow-btn px-7 py-3 rounded-full text-sm font-semibold mt-6"
          >
            Start creating ✦
          </button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-6 animate-fade-up w-full max-w-xl">
          <div className="glass rounded-3xl p-3 w-full animate-pulse-glow">
            <img
              src={image}
              alt="AI generated result"
              className="w-full rounded-2xl"
            />
          </div>

          {prompt && (
            <p className="text-sm text-slate-500 dark:text-white/50 text-center max-w-md">
              <span className="text-violet-600 dark:text-violet-300 font-medium">Prompt:</span> “{prompt}”
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={downloadImage}
              className="glow-btn px-7 py-3 rounded-full text-sm font-semibold"
            >
              ⬇ Download
            </button>
            <button
              onClick={() => navigate("/")}
              className="glass px-7 py-3 rounded-full text-sm font-medium text-slate-800 dark:text-white hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
            >
              Generate another ✦
            </button>
          </div>

          <button
            onClick={() => navigate("/gallery")}
            className="text-xs text-violet-600 dark:text-violet-300 hover:underline"
          >
            View all your creations → Gallery
          </button>
        </div>
      )}
    </div>
  );
};

export default Result;
