# Cipher Build Blazer — Phase 2

Live build phase for **Cipher (CSE Association)'s** track of the Build Blazer event at SJEC.

This repo is the starting point for Phase 2, where third-year teams fork it and build the winning design into a live, deployed website.

## How this works

1. **Fork** this repository into your own GitHub account.
2. Clone your fork locally.
3. Implement the winning Figma design assigned to your team.
4. Commit early and often — the process matters as much as the result.
5. Deploy your build (Vercel, Netlify, GitHub Pages, or similar).
6. Submit your fork link + live deployment link before the deadline.

## Team

| Role | Name |
|------|------|
| Team Lead | Melroy Almeida |
| Team Members | Melroy Almeida |

## Design reference

Winning Figma design implementation for **Cipher (CSE Association) Track** — Build Blazer Phase 2.

## Tech stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Particle Physics
- **Backend**: Node.js, Express.js (ESM), TypeScript, Prisma ORM
- **Database**: PostgreSQL (Neon Serverless)
- **Authentication**: Firebase Authentication (Google OAuth 2.0 + Firebase Admin SDK)
- **Deployment**: Vercel (Frontend SPA & Admin Dashboard) + Render (API Backend)

## Deployment

- **Live Website**: [https://cipher-website-beta.vercel.app](https://cipher-website-beta.vercel.app)
- **Admin CMS Dashboard**: [https://cipher-admin-rho.vercel.app](https://cipher-admin-rho.vercel.app)
- **Live Backend API**: [https://cipher-wccb.onrender.com](https://cipher-wccb.onrender.com)

## Rules

- Fork, don't clone-and-push directly to this repo.
- Stick to the assigned Figma design as closely as possible.
- Submit via pull request or the link-submission form (whichever the organizers specify).

---
Organized by **Cipher (CSE Association)**, SJEC, in collaboration with **AgentBlazer Club**.

---

# ⚡ CIPHER — Official Website & Admin CMS

> The official digital portal and content management system for **CIPHER**, the premier Computer Science student organization at St Joseph Engineering College (SJEC).

---

## 🌟 Overview & Key Features

CIPHER Website is a full-stack, cyber-themed digital platform featuring:

- **Interactive Cyber Hero**: Canvas particle animation that interacts with mouse hover and multi-touch gestures.
- **Dynamic Bento Collage**: Interactive photo and achievements collage with tilted interactive cards and floating badges.
- **3D Interactive Carousels**: 3D cylindrical carousels showcasing Team Members and Community Contributors.
- **Events & Workshops Hub**: Filterable catalog of events (Technical, Hackathons, Workshops, Upcoming) with detailed modals and photo galleries.
- **Student Applications & Contact Forms**: Direct club join requests and query handling with validation and rate limiting.
- **Dedicated Protected Admin Panel**:
  - Full CRUD control for Events, Team Members, Community Contributors, Activities, Domains, Applications, and Messages.
  - Live Website Content Editor (announcements, stats, club rules, etc.).
  - Global Dark Mode toggle lock/unlock switch.
  - Multi-file Media Library supporting local disk uploads and optional Cloudinary cloud storage.
- **Enterprise-grade Security**:
  - Google OAuth 2.0 via Firebase Authentication.
  - Zero admin passwords stored on the server.
  - Server-side token verification on all protected endpoints via Firebase Admin SDK.
  - Strict email allowlist authorization (`ADMIN_EMAILS`).
  - Helmet HTTP security headers, CORS origin filtering, and Express rate limiting.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js (ESM), TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Neon serverless / Supabase / Railway) |
| **Authentication** | Firebase Authentication (Client SDK + Firebase Admin SDK) |
| **Media Storage** | Local static uploads (`/uploads`) + optional Cloudinary integration |
| **Deployment Target** | Vercel (Frontend SPA) + Render / Railway / Vercel Serverless (Backend) |

---

## 📁 Repository Architecture

```
cipher-website/
├── public/
│   └── assets/
│       ├── about/               # About section photo collage assets
│       ├── leaders/             # Core leadership portrait assets
│       ├── lumiere/             # Lumiere event gallery frames
│       ├── promptops/           # PromptOps event gallery frames
│       └── logo.png             # Official high-resolution CIPHER logo
├── src/
│   ├── admin/
│   │   ├── components/          # AdminLayout, ImageUploader, Sidebar
│   │   ├── context/             # ToastContext (custom notification system)
│   │   ├── lib/                 # api.ts (adminFetch with Firebase ID token), firebase.ts
│   │   └── pages/               # Dashboard, Members, Events, Applications, Messages, Settings, etc.
│   ├── components/              # Public UI (Hero, Navbar, About, Carousels, ParticleText, etc.)
│   ├── context/                 # ThemeContext (Dark / Light mode state)
│   ├── data/                    # Fallback static datasets (teamMembers.ts)
│   ├── pages/                   # Public routes (HomePage, AboutPage, EventsPage, TeamPage, ContactPage)
│   ├── index.css                # Tailwind directives and custom cyber glowing animations
│   └── main.tsx                 # Client entry point with code-split admin loading
├── server/
│   ├── prisma/
│   │   └── schema.prisma        # Complete database schema definitions
│   ├── public/
│   │   └── uploads/             # Destination for uploaded media (contains .gitkeep)
│   ├── src/
│   │   ├── controllers/         # REST API business logic handlers
│   │   ├── lib/                 # firebase-admin.ts, prisma.ts, cloudinary.ts
│   │   ├── middleware/          # auth.ts (Firebase verification), rateLimit.ts, upload.ts
│   │   ├── routes/              # Express API routers
│   │   ├── scripts/             # seed.ts (initial data seeding), create-admin.ts
│   │   └── index.ts             # Express server setup and route mounts
│   ├── .env.example             # Safe backend environment variables template
│   ├── package.json             # Backend dependencies and scripts
│   ├── Procfile                 # Production deployment process runner
│   ├── render.yaml              # Optional Render blueprint configuration
│   └── tsconfig.json            # Server TypeScript configuration
├── .env.example                 # Safe frontend environment variables template
├── .gitignore                   # Security hardened git exclusion list
├── index.html                   # HTML entry point with metadata and fonts
├── package.json                 # Frontend dependencies and scripts
├── postcss.config.js
├── README.md                    # Project documentation
├── tailwind.config.js           # Theme configuration and custom breakpoints
├── tsconfig.json                # Frontend TypeScript configuration
├── vercel.json                  # Vercel SPA routing rewrite rules
└── vite.config.ts               # Vite configuration and build modes
```

---

## 🚀 Quick Start (Fresh Clone Setup)

Follow these step-by-step instructions to get the complete project running locally on your computer.

### Prerequisites

- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (bundled with Node.js)
- **Git**: Installed and configured on your machine
- **PostgreSQL Database**: Free cloud database from [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or local PostgreSQL
- **Firebase Project**: Free project from [Firebase Console](https://console.firebase.google.com)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Melroy25/cipher-buildblazer.git cipher-website
cd cipher-website
```

---

### Step 2: Configure Environment Variables

#### 1. Frontend Configuration
Copy `.env.example` in the root folder to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your Firebase Web App configuration:

```env
VITE_API_URL="http://localhost:4000"
VITE_FIREBASE_API_KEY="your-api-key-here"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Allowed administrator Google accounts (comma-separated):
VITE_ADMIN_EMAILS="your-email@gmail.com"
```

---

#### 2. Backend Configuration
Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and update the values:

```env
DATABASE_URL="postgresql://username:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require"
SESSION_SECRET="replace-with-a-random-64-character-string"
JWT_SECRET="replace-with-a-random-64-character-string"

PORT=4000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Path to service account JSON (see next step)
GOOGLE_APPLICATION_CREDENTIALS="./firebase-service-account.json"
FIREBASE_PROJECT_ID="your-project-id"

# Allowed administrator Google accounts (comma-separated):
ADMIN_EMAILS="your-email@gmail.com"
```

---

#### 3. Firebase Service Account Key (Backend)
1. In [Firebase Console](https://console.firebase.google.com), click ⚙️ **Project Settings** → **Service accounts** tab.
2. Click **Generate new private key**, then confirm by clicking **Generate key**.
3. A JSON file will download to your computer.
4. Rename this file to `firebase-service-account.json`.
5. Place it inside the `server/` directory: `server/firebase-service-account.json`.

> ⚠️ **IMPORTANT**: `firebase-service-account.json` contains sensitive credentials and is strictly excluded by `.gitignore`. Never share or commit this file.

---

#### 4. Enable Google Sign-In in Firebase
1. In Firebase Console, go to **Authentication** (under Build) → **Sign-in method**.
2. Click **Google** → Toggle **Enable**.
3. Select your support email and click **Save**.
4. Switch to the **Settings** tab in Authentication → **Authorized domains**.
5. Ensure `localhost` is listed (it is added automatically by default).

---

### Step 3: Install Dependencies

```bash
npm install
cd server && npm install && cd ..
```

---

### Step 4: Database Setup & Initial Seeding

```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..
```

---

### Step 5: Start Development Servers

```bash
# Terminal 1: Backend (Port 4000)
cd server && npm run dev

# Terminal 2: Frontend (Port 3000)
npm run dev -- --port 3000
```

---

## 🌐 Accessing the Application

| View | URL | Description |
|---|---|---|
| **Public Website** | `http://localhost:3000` | Complete public-facing portal for students and visitors |
| **Admin Portal** | `http://localhost:3000/admin` | Protected administrative console (requires Google sign-in) |
| **Backend API** | `http://localhost:4000` | REST API service and health checks |
| **API Health Check**| `http://localhost:4000/api/health` | Status verification endpoint |

---

## 🔐 Administrative Access & Security Model

1. Navigate directly to `http://localhost:3000/admin`.
2. Click **"Continue with Google"**.
3. Select an authorized Google account listed in `ADMIN_EMAILS` / `VITE_ADMIN_EMAILS`.

---

## 📄 License & Credits

Developed by and for the **CIPHER Club**, Department of Computer Science & Engineering, St Joseph Engineering College, Vamanjoor, Mangaluru, Karnataka, India in collaboration with **AgentBlazer Club**.
