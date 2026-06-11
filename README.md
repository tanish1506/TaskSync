# ⚡ TaskSync — Premium Workspace & Task Management

<p align="center">
  <img src="https://img.shields.io/badge/Vite-64748B?style=for-the-badge&logo=vite&logoColor=FFD62C" alt="Vite Badge"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind Badge"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express Badge"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge"/>
</p>

<p align="center">
  <a href="https://task-sync-six-theta.vercel.app/"><strong>🌐 Live Demo Deployment</strong></a>
</p>

---

## ✨ Overview

**TaskSync** is a premium MERN stack productivity dashboard engineered with state-of-the-art responsiveness, elegant dark-mode glassmorphic aesthetics, and robust real-time database tracking. It empowers operators to catalog, organize, filter, and analyze operational tasks with clean and interactive visualizations.

---

## 🎨 Premium Design Architecture

* **Glassmorphism & Harmonized HSL Palette**: Styled using tailored dark HSL palettes with subtle blur backdrops, custom micro-animations, and dynamic shadows.
* **Fully Responsive Adaptive Viewports**: 
  * Stacked name cards and circular magnifying glass search drawers on mobile devices.
  * Collapsible backdrop overlays and side navigation drawers.
* **Dynamic Metric Visualization**: SVG-rendered circular progress calculation trackers computation of workspace velocity indexes.

---

## 🛠️ Feature Breakdown

### 🔐 Secure Gateways & Authentication
* **Custom JWT Session Management**: Full local storage state retention preventing viewport reset issues.
* **Mongoose Schema Validations**: Client and server-side password checks (6+ characters) with user-friendly error reporting.
* **SSO Integrations (Upcoming)**: High-fidelity login gateways designed for Google, GitHub, and Facebook authentication.

### 📋 Full-Scale Task Operations (CRUD)
* **Milestone Logs**: Detailed bento-grid cards and tabular logs mapping priorities (High, Medium, Low) and task categories.
* **Workspace Detail Panels**: Quick overlays to read details, verify timeline anchors (due dates), switch status toggles, or purge records.
* **Status Filtration**: Dynamically filter deliverables (All, Pending, Completed) with custom UI drops.

---

## 🏗️ Technology Stack

```
   ┌─────────────────────────────────────────────────────────┐
   │                        FRONTEND                         │
   │   React 18  •  Vite  •  Tailwind CSS  •  Context API    │
   └────────────────────────────┬────────────────────────────┘
                                │ (Axios HTTP API)
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                        BACKEND                          │
   │    Node.js  •  Express  •  JSON Web Tokens (JWT)        │
   └────────────────────────────┬────────────────────────────┘
                                │ (Mongoose ODM)
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                       DATABASE                          │
   │               MongoDB Atlas Cloud Cluster               │
   └─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

Follow these steps to deploy and run **TaskSync** on your local machine:

### 1. Clone & Set Up Directory

Clone this repository to your workspace:
```bash
git clone https://github.com/your-username/tasksync.git
cd tasksync
```

### 2. Configure Environment Files

Navigate to the `Backend` directory and copy the environment template:
```bash
cd Backend
cp .env.example .env
```
Open `.env` and configure your credentials:
```env
PORT=5000
MONGO_URL=your_mongodb_atlas_uri
JWT_SECRET=your_secure_hash_secret_key
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### 3. Install Dependencies

Install all dependencies in both directories:

**Backend Setup:**
```bash
cd Backend
npm install
```

**Frontend Setup:**
```bash
cd ../frontend
npm install
```

### 4. Boot Up Servers

Run backend and frontend servers in split terminals:

**Start Backend Server:**
```bash
cd Backend
npm run dev
# Server will run on port 5000 (http://localhost:5000)
```

**Start Frontend Client:**
```bash
cd frontend
npm run dev
# App will boot on port 5173 (http://localhost:5173)
```

---

## 📂 Project Structure

```
├── Backend/
│   ├── config/              # MongoDB connection setups
│   ├── controllers/         # Task and Auth request handlers
│   ├── middleware/          # Authorization checks & Global error handlers
│   ├── models/              # Mongoose schemas (Task, User)
│   ├── routes/              # Express API route endpoints
│   ├── utils/               # App errors & Async catch handlers
│   ├── server.js            # App configuration & server initiation
│   └── .env.example         # Environment template file
└── frontend/
    ├── public/              # Static public resources
    └── src/
        ├── components/      # Common UI (Sidebar, Layout, AddTaskModal)
        ├── context/         # AuthProvider & Context state hooks
        ├── pages/           # Pages (Dashboard, Settings, Analytics)
        ├── services/        # Backend API integration (Axios client)
        ├── App.jsx          # Route controller gates
        └── main.jsx         # App initiation entrypoint
```

---

## 🔒 Security Practices

* **Passwords Cryptography**: Secure user passwords hashed using `bcryptjs` (salt rounds: 12).
* **Route Firewalls**: Private routes protected with Express Authorization headers and JSON Web Tokens.
* **Error Sanitization**: Custom global error middleware preventing backend internal stack leaks in production environments.
