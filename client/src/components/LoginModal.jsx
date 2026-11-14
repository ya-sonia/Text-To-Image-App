import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { useContext } from "react";

const LoginModal = ({ onClose }) => {
  const { backendUrl, setToken, setIsLoggedIn, loadUserData } =
    useContext(AppContext);
  const [state, setState] = useState("Login"); // "Login" | "Sign Up"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const url = state === "Login" ? "/api/user/login" : "/api/user/register";

      const { data } = await axios.post(`${backendUrl}${url}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsLoggedIn(true);
        onClose();
        await loadUserData();
        toast.success(
          state === "Login"
            ? "Welcome back! 👋"
            : "Account created — 5 free credits unlocked! 🎉"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl glass-strong p-8 animate-fade-up shadow-2xl"
      >
        {/* decorative glow */}
        <div className="blob w-40 h-40 bg-violet-400/25 dark:bg-violet-600/40 -top-10 -right-10" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-slate-500 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold gradient-text">
          {state === "Login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-white/50 mt-1 mb-7">
          {state === "Login"
            ? "Log in to keep creating AI art"
            : "Sign up and get 5 free credits instantly ✨"}
        </p>

        <form onSubmit={submitHandler} className="space-y-3">
          {state === "Sign Up" && (
            <input
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dark-input w-full rounded-xl px-4 py-3 text-sm"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="dark-input w-full rounded-xl px-4 py-3 text-sm"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="dark-input w-full rounded-xl px-4 py-3 text-sm"
          />

          <button
            type="submit"
            className="glow-btn w-full py-3 rounded-xl text-sm font-semibold mt-2"
          >
            {state === "Login" ? "Login" : "Create account →"}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-white/50 mt-5 text-center">
          {state === "Login"
            ? "Don't have an account yet? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => setState(state === "Login" ? "Sign Up" : "Login")}
            className="text-fuchsia-600 dark:text-fuchsia-400 font-semibold hover:opacity-80"
          >
            {state === "Login" ? "Sign up free" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
