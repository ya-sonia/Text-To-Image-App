import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";


let razorpayInstance = null;

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("xxxx")) {
    throw new Error("Razorpay keys not configured yet. Add your TEST keys to server/.env");
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};


const plans = {
  Basic: { credits: 100, amount: 1000, name: "Basic Pack" },
  Advanced: { credits: 500, amount: 5000, name: "Advanced Pack" },
  Business: { credits: 5000, amount: 25000, name: "Business Pack" },
};

const isRazorpayConfigured = () =>
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes("xxxx");


const createOrder = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    const plan = plans[planId];

    if (!plan) {
      return res.json({ success: false, message: "Invalid plan" });
    }

    
    if (!isRazorpayConfigured()) {
      return res.json({
        success: true,
        mock: true,
        plan,
        message: "Mock payment mode — no Razorpay keys configured",
      });
    }

    
    const options = {
      amount: plan.amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { userId, planId, credits: plan.credits },
    };

    const order = await getRazorpay().orders.create(options);

    res.json({ success: true, order, plan, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const {
      userId,
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    
    if (!isRazorpayConfigured()) {
      const plan = plans[planId];
      const user = await userModel.findById(userId);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { creditBalance: user.creditBalance + plan.credits },
        { new: true }
      );

      return res.json({
        success: true,
        mock: true,
        message: `Mock payment successful. ${plan.credits} credits added!`,
        creditBalance: updatedUser.creditBalance,
      });
    }

    
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.json({ success: false, message: "Payment verification failed" });
    }

   
    const plan = plans[planId];
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { creditBalance: user.creditBalance + plan.credits },
      { new: true }
    );

    res.json({
      success: true,
      message: `Payment verified. ${plan.credits} credits added!`,
      creditBalance: updatedUser.creditBalance,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { createOrder, verifyPayment };
