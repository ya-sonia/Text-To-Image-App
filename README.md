# Imagify — AI Text-to-Image SaaS App

A full-stack **AI SaaS application** where users turn text prompts into AI-generated images using a credit-based system.

Built with the **MERN stack** (MongoDB, Express, React, Node) — a learning project inspired by the GreatStack tutorial, extended with extra features.

---

## Features

| Feature | Description |
|---|---|
| **AI image generation** | Type any prompt → ClipDrop AI paints it in seconds |
| **Credit system** | 5 free credits on signup · 1 credit per image · buy more anytime |
| **JWT authentication** | Register / login with hashed passwords (bcrypt) |
| **Light & dark theme** | One-click theme toggle, saved across visits |
| **Prompt history** | Last 10 prompts saved — searchable, re-usable dropdown |
| **Personal gallery** | Every generation saved to the user's account (last 24) with lightbox preview + download |
| **Payments (Razorpay)** | Credit packs with checkout + signature verification — runs in **mock mode** until real TEST keys are added |
| **Modern UI** | Glassmorphism, glowing gradients, ambient blobs, smooth animations (Tailwind CSS) |

---

## Tech stack

**Frontend** — React 18 · Vite · Tailwind CSS v4 · React Router · Axios · React Toastify

**Backend** — Node.js · Express · MongoDB (Mongoose) · JWT · bcryptjs · Razorpay SDK · ClipDrop API

---

## Project structure

```
imagify/
├── client/                     # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/         # Navbar (theme + avatar menu), LoginModal, Footer, Loading
│       ├── context/            # AppContext — auth token, user data, theme
│       └── pages/
│           ├── Home.jsx        # Hero, prompt studio + history dropdown, showcase
│           ├── Result.jsx      # Generated image view + download
│           ├── Gallery.jsx     # User's saved creations (grid + lightbox)
│           └── BuyCredit.jsx   # Credit packs (mock / Razorpay checkout)
│
└── server/                     # Express API
    ├── config/db.js            # MongoDB connection
    ├── controllers/
    │   ├── userController.js     # register / login / credits
    │   ├── imageController.js    # ClipDrop generation + gallery
    │   └── paymentController.js  # Razorpay order + verification (+ mock fallback)
    ├── middleware/auth.js      # JWT route protection
    ├── models/userModel.js     # User + generations (gallery) schema
    ├── routes/                 # /api/user · /api/image · /api/payment
    ├── images/                 # Generated PNGs (served statically)
    └── server.js
```

---

## Getting started

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A free [ClipDrop API key](https://clipdrop.co/apis) (100 free credits)
- *(Optional)* Razorpay **Test Mode** keys — the app works without them via mock payments

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env    # then fill in your keys
npm run dev             # → http://localhost:4000
```

`server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/imagify?retryWrites=true&w=majority
JWT_SECRET=<any_long_random_string>
CLIPDROP_API_KEY=<your_clipdrop_key>
RAZORPAY_KEY_ID=rzp_test_...        # optional — mock mode without it
RAZORPAY_KEY_SECRET=...             # optional
CLIENT_URL=http://localhost:5173
PORT=4000
```

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env    # VITE_BACKEND_URL=http://localhost:4000
npm run dev             # → http://localhost:5173
```

### 3. Try the app
1. Sign up → you get **5 free credits**
2. Enter a prompt → **Generate** ✦
3. View / download the result, find all creations in your **Gallery**
4. Out of credits? **Buy Credits** (mock mode = instant free credits)

---

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/user/register` | — | Create account (returns JWT) |
| POST | `/api/user/login` | — | Login (returns JWT) |
| GET | `/api/user/credits` | JWT | Get credit balance + profile |
| POST | `/api/image/generate` | JWT | Generate image from prompt (−1 credit) |
| GET | `/api/image/my-images` | JWT | Get user's gallery (last 24) |
| POST | `/api/payment/create-order` | JWT | Create credit-pack order (Razorpay or mock) |
| POST | `/api/payment/verify` | JWT | Verify payment signature → add credits |

---

## Payment modes

- **Mock mode (default):** without Razorpay keys, buying credits is instant and free — the full order → verify → credits flow still runs, just without the gateway. Perfect for learning the architecture.
- **Razorpay TEST mode:** add your test keys to `.env` and the same buttons open the real Razorpay checkout (test card `4111 1111 1111 1111`). The server verifies the HMAC-SHA256 signature before adding credits — **no code changes needed**, mock is only a fallback.

---

## Roadmap / ideas

- [ ] Cloudinary image storage (replace local `images/` folder)
- [ ] Style presets (realistic / anime / 3D / oil painting)
- [ ] Referral system (invite friends → free credits)
- [ ] Password reset via email
- [ ] Deployment (Vercel + Render)

---

## What this project teaches

JWT auth flows · bcrypt password hashing · Mongoose schema design (`$push`/`$slice` for capped arrays) · REST API design · third-party API integration · payment gateway architecture (order → checkout → signature verification) · theme systems with CSS variables · localStorage persistence · responsive UI with Tailwind

---

## Author

**Sonia Yadav** — designed & built with
