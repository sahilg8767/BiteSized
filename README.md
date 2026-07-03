# 🍽️ Reelo — Reels-first Food Delivery

A full-stack food delivery web app where restaurants market dishes through
**short vertical videos (reels)** instead of static photos — think *Swiggy meets
Instagram Reels*. Users scroll an autoplaying food feed, like/save/comment, and
order in a tap; restaurants upload reels and manage incoming orders from a
dashboard.

> Built with the MERN stack (MongoDB, Express, React, Node) + Tailwind CSS.

---

## ✨ Features

### For users
- 📱 **Reels feed** — full-screen, scroll-snapping vertical videos that autoplay in view
- ❤️ **Engagement** — like, save and comment on reels (persisted per user)
- 🔖 **Saved reels** — a personal collection of bookmarked dishes
- 🔎 **Search** — debounced search across dishes, categories and restaurants
- 🏪 **Restaurant profiles** — visit a restaurant and watch all its reels
- 🛒 **Cart & checkout** — single-restaurant cart, delivery address, place order
- 📦 **Order history** — track order status (placed → preparing → out for delivery → delivered)

### For food partners (restaurants)
- ⬆️ **Upload reels** — video + name, price, category, description
- 📊 **Dashboard** — reels grid, revenue/orders/reels stats
- 🧾 **Order management** — see incoming orders and update their status

### Engineering
- 🔐 **JWT auth** in httpOnly cookies, role-based (`user` / `food-partner`)
- 🛡️ Helmet, rate-limiting, `express-validator`, centralized error handling
- 🗄️ Server-side price/partner resolution (client totals never trusted)
- ☁️ Video storage via **ImageKit**
- 🎨 Tailwind CSS v4, React Context for auth + cart, protected routes

---

## 🧱 Tech stack

| Layer      | Tech |
|------------|------|
| Frontend   | React (Vite), React Router, Tailwind CSS v4, Axios, React Icons |
| Backend    | Node.js, Express 5, Mongoose |
| Database   | MongoDB (Atlas) |
| Auth       | JWT + httpOnly cookies, bcryptjs |
| Media      | ImageKit |
| Security   | Helmet, express-rate-limit, express-validator |

---

## 📂 Project structure

```
food-delivery/
├── backend/
│   ├── server.js               # entry: env, DB connect, listen
│   ├── seed.js                 # demo data seeder
│   └── src/
│       ├── app.js              # express app (helmet, cors, routes, errors)
│       ├── controller/         # auth, food, engagement, order, foodPartner
│       ├── models/             # user, food-partner, food, like, save, comment, order
│       ├── routes/             # /api/auth, /api/food, /api/food-partner, /api/orders
│       ├── middlewares/        # auth, validate, error
│       ├── validators/         # request validation rules
│       ├── services/           # ImageKit storage
│       └── utils/              # jwt, cookies, asyncHandler, ApiError
└── frontend/
    └── src/
        ├── api/axios.js        # axios instance (baseURL + credentials)
        ├── context/            # AuthContext, CartContext
        ├── components/         # ReelFeed, ReelCard, ProtectedRoute, ...
        ├── pages/              # Home, Reels, Search, Cart, Checkout, Orders, ...
        └── routes/AppRoutes.jsx
```

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+
- A MongoDB database (local or [Atlas](https://www.mongodb.com/atlas))
- An [ImageKit](https://imagekit.io) account (for video uploads)

### 1. Clone & install
```bash
git clone <your-repo-url>
cd food-delivery

# backend
cd backend && npm install

# frontend
cd ../frontend && npm install
```

### 2. Configure environment

**backend/.env** (copy from `backend/.env.example`):
```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

**frontend/.env** (copy from `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:3000
```

### 3. Run
```bash
# terminal 1 — backend (http://localhost:3000)
cd backend && npm run dev

# terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev
```

### 4. (Optional) seed demo data
Populates demo restaurants, users and reels. **Wipes existing data.**
```bash
cd backend && npm run seed
```
Demo logins:
- User: `user@demo.com` / `password123`
- Partner: `spicegarden@demo.com` / `password123`

---

## 🔌 API reference (summary)

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/register` | Register a user |
| POST | `/user/login` | Login a user |
| GET  | `/user/logout` | Logout |
| POST | `/food-partner/register` | Register a partner |
| POST | `/food-partner/login` | Login a partner |
| GET  | `/food-partner/logout` | Logout |
| GET  | `/me` | Current session (bootstrap auth) |

### Food — `/api/food`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/` | Paginated reels feed (optional auth → isLiked/isSaved) |
| GET  | `/search?q=` | Search dishes |
| GET  | `/:id` | Single reel |
| GET  | `/partner/:id` | A partner's reels |
| GET  | `/partner/mine` | Logged-in partner's reels |
| GET  | `/saved` | User's saved reels |
| POST | `/` | Create a reel (partner, multipart video) |
| POST | `/:id/like` | Toggle like |
| POST | `/:id/save` | Toggle save |
| GET  | `/:id/comments` | List comments |
| POST | `/:id/comments` | Add a comment |

### Restaurants — `/api/food-partner`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List restaurants (with reel counts) |
| GET | `/:id` | Public restaurant profile |

### Orders — `/api/orders`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST  | `/` | Place an order (user) |
| GET   | `/mine` | User's order history |
| GET   | `/partner` | Partner's incoming orders |
| PATCH | `/:id/status` | Update order status (partner) |

---

## 🌐 Deployment notes

- **Backend** → Render / Railway / Fly. Set all `.env` vars; set `NODE_ENV=production`
  and `CLIENT_URL` to your deployed frontend origin (comma-separated for multiple).
- **Frontend** → Vercel / Netlify. Set `VITE_API_URL` to the deployed backend URL.
- **Database** → MongoDB Atlas. Under *Network Access*, allow your server's IP
  (or `0.0.0.0/0`). Prefer the **SRV** connection string (`mongodb+srv://...`).
- **Cookies** → in production the auth cookie is `Secure` + `SameSite=None`, so both
  apps must be served over HTTPS.

### 🔒 Before going public
- Rotate `JWT_SECRET` and create a **new MongoDB user + password**.
- Never commit `.env` (already gitignored); use the host's secret manager.

---

## 📸 Screenshots

_Add screenshots / a short demo GIF here (reels feed, restaurant profile, checkout, partner dashboard)._

---

## 📝 License

MIT — free to use for learning and portfolios.
