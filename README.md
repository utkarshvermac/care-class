# CARE CLASS 🎓

**Know exactly how many classes you can skip — before you skip them.**

CARE CLASS is a full-stack MERN application that turns your college attendance register into a
live instrument. Log every class as **Present**, **Absent**, or **Cancelled**, and instantly see —
per subject — your live percentage, how many classes you can still safely miss, or how many you
must attend back-to-back to climb back above your target.

Built by **Utkarsh Verma** — BCA, C.S.J.M. University, Kanpur.
[LinkedIn](https://www.linkedin.com/in/utkarshvermac) · [Instagram](https://www.instagram.com/utkarshvermac) · [GitHub](https://github.com/utkarshvermac)

---

## ✨ Features

- **Secure auth** — JWT-based sessions, bcrypt-hashed passwords, protected routes.
- **The Bunk-O-Meter Engine** — a real math engine (`server/utils/bunkEngine.js`) that computes:
  - Live attendance percentage per subject
  - Safe-bunk count (how many more classes you can miss and stay above target)
  - Recovery count (how many classes you must attend in a row if you're already below target)
- **Cancelled ≠ Absent** — cancelled classes are excluded from the denominator entirely, so a
  professor's day off never hurts your percentage.
- **Per-subject targets** — 75% is the default, but every subject can have its own bar.
- **Daily attendance log** — a date-strip dashboard to mark today (or any past day) in seconds.
- **Monthly history & calendar view** — inspect any past day's log at a glance.
- **Analytics** — bar and pie charts (via Recharts) comparing attendance % against target and
  present/absent splits per subject.
- **CSV / JSON export** — download your full attendance history any time.
- **PWA-ready** — installable to your phone's home screen, offline app shell via `vite-plugin-pwa`.
- **Dark / light mode**, smooth micro-interactions, loading skeletons, and toast notifications
  throughout.

---

## 🛠️ Tech stack

| Layer     | Stack |
|-----------|-------|
| Frontend  | React 18 (Vite), Tailwind CSS, Lucide React icons, Axios, React Router, Recharts, react-hot-toast |
| Backend   | Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs |

---

## 📁 Project structure

```
care-class/
├── server/                  # Express API
│   ├── config/db.js         # Mongo connection
│   ├── models/              # User, Subject, AttendanceLog
│   ├── controllers/         # Route handlers
│   ├── routes/               # Express routers
│   ├── middleware/          # JWT auth guard, error handler
│   ├── utils/bunkEngine.js  # The core attendance math
│   ├── server.js            # App entry point
│   └── .env.example
│
├── client/                  # React (Vite) frontend
│   ├── src/
│   │   ├── api/axios.js     # Axios instance + auth interceptor
│   │   ├── context/         # Auth & Theme context providers
│   │   ├── components/      # Reusable UI (BunkMeter, Layout, modals…)
│   │   ├── pages/           # Landing, Login, Register, Dashboard, Subjects, History, Analytics, Settings
│   │   └── utils/bunkCalc.js
│   ├── public/               # PWA icons, favicon
│   └── .env.example
│
└── README.md
```

---

## 🚀 Getting started

### 1. Prerequisites
- Node.js 18+
- A MongoDB connection string (free tier on [MongoDB Atlas](https://www.mongodb.com/atlas) works great, or run MongoDB locally)

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# edit .env if your API isn't on localhost:5000
npm run dev         # starts on http://localhost:5173
```

Open `http://localhost:5173`, create an account, and start adding subjects.

### 4. Production build

```bash
cd client
npm run build        # outputs to client/dist
npm run preview       # sanity-check the production build locally
```

Deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS) and `client/dist` to any static
host (Vercel, Netlify, Render static site). Set `CLIENT_URL` on the server to your deployed
frontend origin, and `VITE_API_URL` on the client to your deployed API origin + `/api`.

---

## 🧮 How the Bunk-O-Meter math works

For a subject with `present` and `absent` counts and a `target` percentage:

- **Current %** = `present / (present + absent) × 100` (cancelled classes never enter this formula)
- **Safe bunks** (when above target): the largest `n` such that
  `present / (present + absent + n) ≥ target/100`
- **Must-attend** (when below target): the smallest `n` such that
  `(present + n) / (present + absent + n) ≥ target/100`

See `server/utils/bunkEngine.js` for the full implementation (mirrored on the client in
`client/src/utils/bunkCalc.js` for instant optimistic UI updates).

---

## 🔐 Environment variables

**server/.env**
```
PORT=5000
NODE_ENV=development
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📄 License

MIT — built as a college major project by Utkarsh Verma. Free to fork, learn from, and extend.
