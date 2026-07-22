# 📝 Notes Application

<p align="center">
  <b>A modern, full-stack, multi-user note-taking platform inspired by Google Keep and Apple Notes.</b><br/>
  Featuring assignment-compatible REST APIs, version history tracking, full-text search, secure note sharing, and a responsive React SPA.
</p>

<p align="center">
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-blue?style=for-the-badge&logo=react" alt="Frontend" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js" alt="Backend" /></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb" alt="Database" /></a>
  <a href="#-testing"><img src="https://img.shields.io/badge/Testing-Jest-red?style=for-the-badge&logo=jest" alt="Testing" /></a>
  <a href="#-docker-compose-full-stack-recommended"><img src="https://img.shields.io/badge/DevOps-Docker-blue?style=for-the-badge&logo=docker" alt="Docker" /></a>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Core Assignment REST Endpoints](#core-assignment-rest-endpoints)
  - [Custom & Advanced Features](#custom--advanced-features)
- [Tech Stack](#-tech-stack)
- [Project Structure & Architecture](#-project-structure--architecture)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-full-stack-recommended)
  - [Option B: Local Manual Setup](#option-b-local-manual-setup)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Notes Management](#notes-management)
  - [System & Custom Endpoints](#system--custom-endpoints)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Testing](#-testing)
- [Security & Best Practices](#-security--best-practices)
- [Deployment Guide](#-deployment-guide)

---

## 🌟 Overview

The **Notes Application** is a production-ready, multi-user note-taking platform. It provides:
1. An **assignment-compatible REST backend** exposing root-level routes (`/register`, `/login`, `/notes`, etc.) for automated grading.
2. A **React 18 Single Page Application (SPA)** with a sleek dark-mode user interface, real-time feedback, and interactive note management.

---

## ✨ Key Features

### Core Assignment REST Endpoints

| # | Feature | Method & Endpoint | Description / Expected Response |
|---|---------|-------------------|----------------------------------|
| 1 | **Register** | `POST /register` | `201 Created` + `{ "message": "..." }` |
| 2 | **Login** | `POST /login` | `200 OK` + `{ "access_token": "..." }` *(or `401 Unauthorized`)* |
| 3 | **List Notes** | `GET /notes` | JWT required; returns array of owned notes |
| 4 | **Get Note** | `GET /notes/{id}` | Accessible by owner or shared recipient |
| 5 | **Create Note** | `POST /notes` | `201 Created` — Note object with `id`, `title`, `content`, `created_at`, `updated_at` |
| 6 | **Update Note** | `PUT /notes/{id}` | `200 OK` — Updated note object |
| 7 | **Delete Note** | `DELETE /notes/{id}` | `204 No Content` |
| 8 | **Share Note** | `POST /notes/{id}/share` | Body: `{ "share_with_email": "..." }` — `200 OK` + message |
| 9 | **OpenAPI Spec** | `GET /openapi.json` | Machine-readable OpenAPI 3.0 document |
| 10 | **About Endpoint** | `GET /about` | Author information + custom feature manifest |

> [!NOTE]
> All note responses strictly enforce **`snake_case`** field names (`id`, `created_at`, `updated_at`) as required by the assignment specification.

### Custom & Advanced Features

- 🕒 **Version History**: Automatic snapshot creation on note update. View, compare, and restore previous note revisions (UI + API).
- 🔍 **Full-Text Search**: Instant keyword search across note titles and content via `GET /search?q=keyword`.
- 👥 **Secure Sharing**: Share notes by user email address; recipients receive instant read access.
- 📄 **Pagination**: Optional `page` and `limit` parameters for note listing and search.
- 🎨 **Modern Frontend**: React 18 SPA with dark mode, full CRUD, responsive layouts, and toast alerts.
- 📖 **Interactive Swagger UI**: Explore and test API endpoints directly at `GET /api-docs`.
- 🐳 **Dockerization**: One-command containerized deployment for MongoDB, Backend, and Frontend.

---

## 🛠 Tech Stack

| Component | Technology | Role |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | UI Framework, Build Tool, & Utility-first Styling |
| | React Router, Axios, React Hook Form, Toastify | Client Routing, HTTP Client, Form Validation, & Alerts |
| **Backend** | Node.js, Express.js | Server Runtime & Web Framework |
| | Mongoose, JWT, Joi, Winston, Morgan, Helmet | Database ODM, Authentication, Validation, Logging, & Security |
| **Database** | MongoDB | NoSQL Document Store (Atlas Cloud or Docker Container) |
| **Testing** | Jest, Supertest, Mongo Memory Server | End-to-end REST Integration Testing |
| **DevOps** | Docker, Docker Compose, Nginx | Multi-service Containerization & Web Server |

---

## 🏗 Project Structure & Architecture

```
Notes_Web_App/
├── backend/                 # Node.js + Express API Server
│   ├── src/
│   │   ├── config/          # Environment & database connection configuration
│   │   ├── controllers/     # Route controllers (assignment & extended features)
│   │   ├── services/        # Business logic (sharing, versioning, search)
│   │   ├── repositories/    # Data access abstraction layer
│   │   ├── models/          # Mongoose database schemas (User, Note, NoteVersion)
│   │   ├── routes/          # Express route definitions
│   │   ├── middlewares/     # Authentication, Joi validation, error handling, rate limiting
│   │   ├── validators/      # Joi schema validation rules
│   │   ├── utils/           # Winston logger, error classes, formatters
│   │   ├── docs/openapi.js  # OpenAPI 3.0 specification definition
│   │   └── tests/           # Jest integration test suite
│   ├── server.js            # Express server entry point
│   ├── Dockerfile           # Backend container build file
│   └── package.json
├── frontend/                # React 18 + Vite SPA Client
│   ├── src/
│   │   ├── components/      # UI components (Navbar, NoteCard, Modals, Spinners)
│   │   ├── context/         # React Context (AuthContext, ThemeContext)
│   │   ├── pages/           # Views (Login, Register, Dashboard, NoteDetail)
│   │   ├── services/        # Axios API wrapper functions
│   │   ├── utils/           # Client-side helper functions
│   │   ├── App.jsx          # App root & React Router configuration
│   │   └── main.jsx         # Client entry point
│   ├── Dockerfile           # Frontend Nginx container build file
│   ├── nginx.conf           # Nginx production configuration
│   ├── vercel.json          # Vercel SPA rewrite configuration
│   └── package.json
├── docker-compose.yml       # Full-stack Docker Compose file
├── DEPLOYMENT.md            # Production deployment guide (Render, Railway, Vercel)
└── README.md                # Main project documentation
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance, MongoDB Atlas URI, or **Docker**

---

### Option A: Docker Compose Full Stack (Recommended)

Run MongoDB, Backend, and Frontend together with a single command:

```bash
# Windows PowerShell
$env:JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters"
docker compose up --build

# Linux / macOS / Bash
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters" docker compose up --build
```

- 🖥️ **Frontend App**: `http://localhost:5173`
- 🌐 **Backend API**: `http://localhost:5000`
- 📚 **Swagger Docs**: `http://localhost:5000/api-docs`

---

### Option B: Local Manual Setup

#### 1. Backend Setup

```bash
cd backend
cp .env.example .env
```

Configure `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Optional metadata exposed at GET /about
ABOUT_NAME=Your Name
ABOUT_EMAIL=you@example.com
```

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

- 🌐 **API Base URL**: `http://localhost:5000`
- 📚 **Swagger UI**: `http://localhost:5000/api-docs`

#### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Configure `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Install dependencies and run the client:

```bash
npm install
npm run dev
```

- 🖥️ **Web Application**: `http://localhost:5173`

> [!IMPORTANT]
> **Server Process Warning:** If logging in fails with `Route not found: /login`, an old Node process may still be running on port 5000. Restart the backend process (`npm run dev`).

> [!TIP]
> - **Client Routing vs API Proxy:** `VITE_API_URL` must point directly to `http://localhost:5000`. Do not proxy `/notes` in Vite, as React Router handles `/notes` on the client side.

---

## 📡 API Reference

Base Server URL: `http://localhost:5000` *(or your deployed API domain)*

### Authentication

#### `POST /register`
Registers a new user account.

```json
// Request Body
{
  "email": "user@example.com",
  "password": "password123"
}
```

```json
// Response (201 Created)
{
  "message": "User registered successfully"
}
```

#### `POST /login`
Authenticates user and returns a Bearer JWT token.

```json
// Request Body
{
  "email": "user@example.com",
  "password": "password123"
}
```

```json
// Response (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> Authenticate protected routes by adding header: `Authorization: Bearer <access_token>`

---

### Notes Management

<details>
<summary><b>▶ Click to expand Endpoint Details</b></summary>

#### `GET /notes`
Returns an array of notes owned by the authenticated user.

#### `GET /notes/{id}`
Retrieves a specific note by ID. User must be owner or recipient of a shared note.

#### `POST /notes`
Creates a new note.

```json
// Request Body
{
  "title": "Architecture Plan",
  "content": "Layered MVC pattern details..."
}
```

#### `PUT /notes/{id}`
Updates note title/content. Automatically creates a version history snapshot.

#### `DELETE /notes/{id}`
Deletes a note (`204 No Content`).

#### `POST /notes/{id}/share`
Shares a note with another registered user by email.

```json
// Request Body
{
  "share_with_email": "colleague@example.com"
}
```

</details>

---

### System & Custom Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/about` | Author information & custom feature registry |
| `GET` | `/openapi.json` | Machine-readable OpenAPI 3.0 JSON specification |
| `GET` | `/api-docs` | Interactive Swagger UI documentation |
| `GET` | `/health` | Service health status check |
| `GET` | `/search?q={query}` | Search notes by keyword across title and content |
| `GET` | `/notes/shared` | List notes shared with the current user |
| `GET` | `/notes/{id}/history` | Retrieve version history for a note |
| `POST` | `/notes/{id}/restore/{versionId}` | Restore a note to a previous version |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Min 32-character secret key for JWT signing |
| `PORT` | No | `5000` | Express server port |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Allowed origin URL for CORS |
| `JWT_EXPIRES_IN` | No | `7d` | Access token expiration duration |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limiting window size in milliseconds |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per rate limit window |
| `ABOUT_NAME` | No | — | Author name exposed at `GET /about` |
| `ABOUT_EMAIL` | No | — | Author email exposed at `GET /about` |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|:---:|:---:|---|
| `VITE_API_URL` | **Yes** | `http://localhost:5000` | Backend API base URL without trailing slash |

---

## 🛠 Available Scripts

### Backend (`backend/`)

- `npm run dev` — Launches development server with auto-reloading (`nodemon`).
- `npm start` — Runs production backend server (`node server.js`).
- `npm test` — Executes Jest unit and integration test suite.
- `npm run lint` — Checks codebase formatting with ESLint.

### Frontend (`frontend/`)

- `npm run dev` — Starts Vite dev server with HMR at `http://localhost:5173`.
- `npm run build` — Compiles production build into `dist/` directory.
- `npm run preview` — Previews production build locally.

---

## 🧪 Testing

The backend includes a comprehensive automated test suite built with **Jest**, **Supertest**, and an in-memory MongoDB database (`mongodb-memory-server`).

To run backend tests:

```bash
cd backend
npm test
```

Test coverage includes:
- ✅ User Registration & Login authentication flow
- ✅ JWT Authorization & Header protection
- ✅ Notes CRUD operations & `snake_case` payload compliance
- ✅ Note Sharing permissions & access control
- ✅ Full-text search and `/about` metadata endpoints

---

## 🔒 Security & Best Practices

- 🔐 **Password Security**: Hashed using **bcrypt** with 12 salt rounds.
- 🔑 **Stateless Auth**: Protected routes secured via **JWT Bearer Tokens**.
- 🛡️ **Payload Validation**: Input requests sanitized and validated via **Joi**.
- 🛡️ **HTTP Headers**: Security headers enabled via **Helmet**.
- 💉 **NoSQL Injection Protection**: Sanitized via **`express-mongo-sanitize`**.
- ⏱️ **Rate Limiting**: Rate limiting applied to API and auth endpoints (disabled during testing).
- 🚨 **Centralized Error Handling**: Operational errors return formatted `{ "message": "..." }` responses without stack trace leaks in production.

---

## ☁️ Deployment Guide

Detailed deployment instructions are available in [DEPLOYMENT.md](file:///c:/Users/anany/OneDrive/Desktop/Projects/notes-app-main/DEPLOYMENT.md).

- **Backend (Render / Railway)**: Set root directory to `backend`, Build Command: `npm install`, Start Command: `npm start`, add environment variables.
- **Frontend (Vercel / Netlify)**: Set root directory to `frontend`, Build Command: `npm run build`, Output Directory: `dist`, set `VITE_API_URL`. Ensure `vercel.json` is included for SPA route rewrites.
