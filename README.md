# ⚡ FlashCard MERN — Premium Edition

> A full-stack **MERN** application for managing student flashcards with JWT auth, image uploads via Cloudinary, real-time search, filtering, sorting, and pagination.

---

## 🎯 Project Purpose

**FlashCard MERN** is a **Student Directory Management System** — a digital card file for colleges, coaching institutes, or academic departments.

### What It Does
- Admins **register/login** and manage student profiles with photos, course, year, city, and contact details
- The **public** can browse and search the directory without logging in
- A **live stats dashboard** shows total students, unique courses, and cities at a glance
- Student photos are stored in the **cloud (Cloudinary)** with automatic face-cropping

### Real-World Use Cases
- 🏫 A college department maintaining an enrolled-student roster
- 📚 A coaching center tracking batches by year and subject
- 🏢 Any institution needing a searchable, filterable people directory with cloud photo storage

### As a Learning / Portfolio Project
Covers the complete modern MERN stack:
- **MongoDB Atlas** + Mongoose ODM with text indexes
- **Express** REST API with middleware, validation, and rate limiting
- **React** + Vite with hooks, context, and client-side routing
- **Node.js** with JWT auth, Cloudinary uploads, Helmet security

---

## 🏗️ Project Structure

```
FlashCard-MERN/
├── README.md
├── backend/
│   ├── server.js                    # Express entry point
│   ├── .env.example                 # Environment variable template
│   ├── .gitignore
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── db.js                # MongoDB Atlas connection
│       │   └── cloudinary.js        # Cloudinary + Multer setup
│       ├── models/
│       │   ├── User.js              # User schema (bcrypt pre-save hook)
│       │   └── Student.js           # Student schema (full-text + compound indexes)
│       ├── controllers/
│       │   ├── authController.js    # register / login / getMe
│       │   └── studentController.js # CRUD + search + pagination + stats
│       ├── routes/
│       │   ├── authRoutes.js
│       │   └── studentRoutes.js
│       └── middleware/
│           ├── auth.js              # JWT protect + adminOnly guards
│           ├── errorMiddleware.js   # Global error handler + 404
│           └── validate.js          # express-validator rule sets
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── src/
        ├── App.jsx                  # Router setup
        ├── main.jsx                 # React entry point
        ├── index.css                # Global design system / CSS variables
        ├── utils/
        │   └── api.js               # Axios instance + JWT interceptor + auto-logout
        ├── context/
        │   └── AuthContext.jsx      # Global auth state (login / register / logout)
        ├── components/
        │   ├── Navbar.jsx           # Sticky navbar with user pill
        │   ├── StudentCard.jsx      # Card with avatar/initials fallback + year badge
        │   ├── StudentModal.jsx     # Add/Edit modal with image preview
        │   └── Pagination.jsx       # Smart ellipsis pagination
        └── pages/
            ├── Home.jsx             # Grid with stats, debounced search, filters, skeletons
            ├── Login.jsx
            └── Register.jsx
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Backend `.env`

```bash
cd backend
cp .env.example .env
```

Fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/flashcard_db
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Configure Frontend `.env`

```bash
cd frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (runs on :5000)
cd backend
npm run dev

# Terminal 2 — Frontend (runs on :5173)
cd frontend
npm run dev
```

Open: **http://localhost:5173**

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

#### 🔐 Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/auth/register` | Register new user, returns JWT | ❌ |
| POST | `/auth/login` | Login + get JWT token | ❌ |
| GET | `/auth/me` | Get current logged-in user | ✅ |

#### 🎓 Student Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/students` | List all (search + filter + paginate + sort) | ❌ |
| GET | `/students/stats` | Total count, unique courses, unique cities | ❌ |
| GET | `/students/:id` | Get single student by ID | ❌ |
| POST | `/students` | Create student (supports image upload) | ✅ |
| PUT | `/students/:id` | Update student (supports image upload) | ✅ |
| DELETE | `/students/:id` | Delete student + remove image from Cloudinary | ✅ |

#### Query Params for `GET /students`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `search` | string | `?search=sanjeev` | Full-text search across name, course, city |
| `course` | string | `?course=btech` | Filter by course (regex, case-insensitive) |
| `city` | string | `?city=agra` | Filter by city (regex, case-insensitive) |
| `year` | number | `?year=2` | Filter by year (1–6) |
| `page` | number | `?page=1` | Page number (default: 1) |
| `limit` | number | `?limit=9` | Results per page (default: 9, max: 50) |
| `sort` | string | `?sort=-createdAt` | Sort field (prefix `-` for descending) |

---

## 🛡️ Auth Flow

```
1. POST /auth/register  → Creates user, returns JWT
2. POST /auth/login     → Verifies password (bcrypt), returns JWT
3. Store token in localStorage  (key: fc_token)
4. Every protected request sends:  Authorization: Bearer <token>
5. Token expires in 7 days
6. On 401 response → Axios interceptor clears storage + redirects to /login
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **JWT Auth** | Register, Login, protected routes with protect middleware |
| **bcryptjs** | Passwords hashed with 12 salt rounds |
| **MongoDB Atlas** | Cloud database, Mongoose ODM, text + compound indexes |
| **Cloudinary** | Cloud image storage with auto face-crop (400x400) |
| **Real-time Search** | Debounced 350ms full-text search across name/course/city |
| **Filters** | Filter by course, city, and year simultaneously |
| **Sort** | Sort by name, year, or date created (asc/desc) |
| **Pagination** | Configurable page size, smart ellipsis page buttons |
| **Stats Dashboard** | Total students, unique courses, unique cities |
| **Rate Limiting** | 100 req/15 min global · 10 req/15 min on auth routes |
| **Helmet** | Security HTTP headers |
| **Input Validation** | express-validator on all POST/PUT routes |
| **Global Error Handler** | Consistent JSON error format with Mongoose error mapping |
| **Skeleton Loading** | Shimmer placeholders while data loads |
| **Toast Notifications** | react-hot-toast for success/error feedback |
| **Responsive UI** | Works on mobile, tablet, and desktop |
| **Auto logout** | Axios interceptor redirects on expired/invalid token |

---

## 🐛 Bugs Fixed (v1.1)

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `AuthContext.jsx` | `api` imported without `.js` extension — breaks strict ESM resolution | Changed to `'../utils/api.js'` |
| 2 | `AuthContext.jsx` | `useEffect` imported but never used — dead import warning | Removed from import list |
| 3 | `Navbar.jsx` | `useState` imported but never used — dead import warning | Removed from import list |
| 4 | `Home.jsx` | **Double API call on mount** — filter useEffect + page useEffect both fired simultaneously at startup | Added `filterChangedRef` flag to suppress the duplicate page-effect fetch |
| 5 | `Home.jsx` | `useCallback` deps included all filter state, causing the page useEffect to re-run on every filter change alongside the filter effect | Removed `useCallback`; `fetchStudents` accepts explicit `overridePage` param |
| 6 | `Home.jsx` | `handleSaved` called `setPage(1)` after `fetchStudents(1)`, triggering a second redundant fetch via page useEffect | Uses `filterChangedRef` to suppress the follow-up page effect |
| 7 | Both | No `.gitignore` in backend/ or frontend/ — node_modules/ and .env would be accidentally committed | Added `.gitignore` to both directories |

---

## 👨‍💻 Developer

**Snehil Singh** — Full-Stack MERN Developer

---

Made with ❤️ — FlashCard Premium Edition
