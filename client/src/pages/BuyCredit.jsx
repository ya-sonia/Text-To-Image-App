import { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";


const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve(true);
    script.onerror = resolve(false);
    document.body.appendChild(script);
  });

const plans = [
  {
    id: "Basic",
    name: "Basic Pack",
    credits: 100,
    price: "₹10",
    desc: "Perfect for trying out",
    perks: ["100 image generations", "Standard styles"],
  },
  {
    id: "Advanced",
    name: "Advanced Pack",
    credits: 500,
    price: "₹50",
    desc: "For regular creators",
    perks: ["500 image generations", "Priority generation", "All styles"],
    highlight: true,
  },
  {
    id: "Business",
    name: "Business Pack",
    credits: 5000,
    price: "₹250",
    desc: "For power users",
    perks: ["5000 image generations", "Priority generation", "Early access features"],
  },
];

const BuyCredit = () => {
  const { backendUrl, isLoggedIn, userData, loadUserData } = useContext(AppContext);
  const [loadingPlan, setLoadingPlan] = useState(null);

  const finishMock = async (planId) => {
    const verify = await axios.post(`${backendUrl}/api/payment/verify`, {
      planId,
    });
    if (verify.data.success) {
      toast.success(verify.data.message);
      await loadUserData();
    } else {
      toast.error(verify.data.message);
    }
  };

  const buyPlan = async (planId) => {
    if (!isLoggedIn) {
      toast.info("Login first to buy credits");
      return;
    }

    setLoadingPlan(planId);
    try {
      
      const { data } = await axios.post(`${backendUrl}/api/payment/create-order`, {
        planId,
      });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      
      if (data.mock) {
        await finishMock(planId);
        return;
      }

      
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load Razorpay checkout");
        return;
      }

      const { order, plan, keyId } = data;

      const checkout = new window.Razorpay({
        key: keyId,
        amount: order.amount,
        currency: "INR",
        name: "Imagify",
        description: plan.name,
        order_id: order.id,
        prefill: { name: userData?.user?.name },
        theme: { color: "#a855f7" },
        handler: async (response) => {
          const verify = await axios.post(`${backendUrl}/api/payment/verify`, {
            planId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verify.data.success) {
            toast.success(verify.data.message);
            await loadUserData();
          } else {
            toast.error(verify.data.message);
          }
        },
      });

      checkout.open();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative px-6 py-16">
      <div className="blob w-[380px] h-[380px] bg-violet-400/30 dark:bg-violet-700/25 -top-10 left-1/4" />

      <div className="relative max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-slate-900 dark:text-white">
          Power up with <span className="gradient-text">credits</span>
        </h1>
        <p className="text-center text-slate-500 dark:text-white/50 mt-3 max-w-xl mx-auto text-sm">
          Credits fuel your creativity — 1 credit = 1 generated image.
          Currently in <b className="text-violet-600 dark:text-violet-300">mock payment mode</b>: buying is
          instant and free, so you can learn the full flow.
        </p>

        {isLoggedIn && (
          <p className="text-center mt-5 text-sm text-slate-600 dark:text-white/70">
            Current balance:{" "}
            <span className="text-violet-600 dark:text-violet-300 font-semibold">
              ⚡ {userData?.creditBalance ?? "—"} credits
            </span>
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-7 animate-fade-up ${
                plan.highlight
                  ? "bg-gradient-to-b from-violet-500/15 to-fuchsia-500/10 dark:from-violet-600/30 dark:to-fuchsia-600/10 border border-violet-400/50 shadow-[0_0_50px_rgba(168,85,247,0.2)] md:-translate-y-3"
                  : "glass"
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-4 py-1.5 rounded-full glow-btn whitespace-nowrap">
                  ⭐ Most popular
                </span>
              )}

              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-white/45">{plan.desc}</p>

              <p className="mt-5">
                <span className="text-4xl font-extrabold gradient-text">{plan.price}</span>
                <span className="text-sm text-slate-400 dark:text-white/40 ml-2">/ {plan.credits} credits</span>
              </p>

              <ul className="mt-5 space-y-2.5 text-sm text-slate-600 dark:text-white/70">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span> {perk}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => buyPlan(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`mt-7 w-full py-3 rounded-xl text-sm font-semibold ${
                  plan.highlight
                    ? "glow-btn"
                    : "glass text-slate-800 dark:text-white hover:bg-violet-500/10 dark:hover:bg-white/10 transition"
                }`}
              >
                {loadingPlan === plan.id ? "Processing…" : "Buy credits →"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCredit;
