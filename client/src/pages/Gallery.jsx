import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import Loading from "../components/Loading.jsx";

const Gallery = () => {
  const { backendUrl, isLoggedIn, token } = useContext(AppContext);
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null); 

  const loadGallery = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/image/my-images`);
      if (data.success) {
        setGenerations(data.generations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) loadGallery();
    else setLoading(false);
  }, [isLoggedIn]);

  const downloadImage = (url, i) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `imagify-${i + 1}.png`;
    link.click();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl">🔒</span>
        <p className="text-slate-500 dark:text-white/60 mt-4">
          Login to see your personal gallery
        </p>
      </div>
    );
  }

  return (
    <div className="relative px-6 py-14">
      <div className="blob w-[380px] h-[380px] bg-violet-400/25 dark:bg-violet-700/25 -top-10 right-1/4" />

      <div className="relative max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-white">
          My <span className="gradient-text">creations</span>
        </h1>
        <p className="text-center text-slate-500 dark:text-white/50 mt-3 text-sm">
          Your last 24 generated images live here
        </p>

        {loading ? (
          <Loading />
        ) : generations.length === 0 ? (
          <div className="text-center glass rounded-3xl p-12 mt-10">
            <span className="text-5xl">🎨</span>
            <p className="text-slate-500 dark:text-white/60 mt-4">
              Your gallery is empty — generate your first image!
            </p>
            <Link
              to="/"
              className="glow-btn inline-block px-7 py-3 rounded-full text-sm font-semibold mt-6"
            >
              Create now ✦
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
            {generations.map((gen, i) => (
              <div
                key={`${gen.imageUrl}-${i}`}
                className="group relative rounded-3xl overflow-hidden glass p-2 animate-fade-up"
                style={{ animationDelay: `${Math.min(i, 8) * 0.06}s` }}
              >
                <img
                  src={`${backendUrl}${gen.imageUrl}`}
                  alt={gen.prompt || "AI generation"}
                  onClick={() => setPreview(gen)}
                  className="w-full aspect-square object-cover rounded-2xl cursor-zoom-in"
                />

                {/* hover overlay */}
                <div className="absolute inset-2 rounded-2xl bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4 gap-2">
                  <p className="text-xs text-white/85 line-clamp-2">
                    {gen.prompt || "Untitled"}
                  </p>
                  <button
                    onClick={() => downloadImage(`${backendUrl}${gen.imageUrl}`, i)}
                    className="self-start text-xs font-medium px-3 py-1.5 rounded-full glow-btn"
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* lightbox preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="max-w-xl w-full glass-strong rounded-3xl p-3 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`${backendUrl}${preview.imageUrl}`}
              alt={preview.prompt || "AI generation"}
              className="w-full rounded-2xl"
            />
            <p className="text-sm text-white/60 p-4 text-center">
              {preview.prompt || "Untitled"}
            </p>
            <div className="flex justify-center gap-3 pb-4">
              <button
                onClick={() =>
                  downloadImage(`${backendUrl}${preview.imageUrl}`, 0)
                }
                className="glow-btn px-6 py-2.5 rounded-full text-sm font-semibold"
              >
                ⬇ Download
              </button>
              <button
                onClick={() => setPreview(null)}
                className="glass px-6 py-2.5 rounded-full text-sm text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
