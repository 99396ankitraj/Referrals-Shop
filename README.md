# Referral & Credit E-commerce App

Full-stack referral and credit system with a modern React/Tailwind frontend and Node/Express/MongoDB backend.

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-validator, CORS, morgan
- Frontend: React (Vite), Redux Toolkit, React Router, Tailwind CSS, Framer Motion, Axios

## Features
- JWT auth: register, login, get current user
- Unique referral code per user and shareable link
- Referral tracking: pending → converted on first purchase
- Credits: both referrer and referred user earn 2 credits on first purchase only
- Products listing, cart, simulated checkout, purchase history
- Dashboard summary: total referred, converted, credits, referral link, purchases

## Local Setup

### Prereqs
- Node.js 18+
- MongoDB running locally (or Atlas connection string)

### 1) Backend
```
cd backend
copy .env.example .env  # On Windows, or create .env
# Update .env with MONGODB_URI and JWT_SECRET
npm install
npm run dev
```
Backend will start on http://localhost:5000 and seed sample products on first run.

### 2) Frontend
```
cd frontend
copy .env.example .env  # On Windows, or create .env
# Update VITE_API_URL if your backend URL differs
npm install
npm run dev
```
Frontend will start on http://localhost:5173

## Environment Variables

Backend (.env):
- PORT=5000
- MONGODB_URI=mongodb://127.0.0.1:27017/referral_credit_app
- JWT_SECRET=replace_with_strong_secret
- PUBLIC_APP_URL=http://localhost:5173

Frontend (.env):
- VITE_API_URL=http://localhost:5000/api

## API Overview (Backend)
- GET /api/health
- POST /api/auth/register { username, email, password, referralCode? }
- POST /api/auth/login { email, password }
- GET /api/auth/me (Bearer token)
- GET /api/products
- POST /api/purchases (Bearer token) { items: [{ productId, quantity }] }
- GET /api/purchases/mine (Bearer token)
- GET /api/dashboard/summary (Bearer token)
- GET /api/dashboard/referral-link (Bearer token)

## Notes on Referral Crediting
- First purchase crediting is atomic (no transactions) to work on standalone MongoDB.
- Only the first purchase of a referred user triggers +2 credits for both users.

## Deployment

- Backend: Render, Railway, or similar
  - Set env vars (MONGODB_URI, JWT_SECRET, PUBLIC_APP_URL)
  - Start command: `npm start`, Build: none
- Frontend: Vercel or Netlify
  - Set env var VITE_API_URL to your live backend URL (e.g. https://api.example.com/api)
  - Build command: `npm run build`, Publish dir: `dist`

## Common Issues
- Tailwind CSS at-rule warnings in IDE are harmless; Tailwind builds them via PostCSS during `npm run dev`/`build`.
- Ensure CORS allows your frontend origin in production; update `cors({ origin: '*' })` accordingly.

## License
MIT
