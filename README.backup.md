# 🛡️ BhoomiChain: Decentralized Blockchain-Based Land Registry

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Blockchain](https://img.shields.io/badge/Blockchain-SHA--256-F7931A?style=for-the-badge&logo=bitcoin&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📌 Project Overview

**BhoomiChain** is a full-stack, blockchain-powered land registry platform that demonstrates how property ownership records can be stored immutably, transferred securely, and audited transparently — without relying on a central authority.

The project combines:

- ⛓️ **Blockchain Simulation** (SHA-256 hashing, Proof-of-Work mining, chain validation)
- 🏛️ **Smart Contract Logic** (chaincode simulator for atomic land transactions)
- 🖥️ **React Dashboard** (glassmorphism UI with real-time data)
- 🔐 **JWT Authentication** (secure user registration & login)
- 🐘 **PostgreSQL Ledger** (off-chain data persistence)
- 🐳 **Docker Compose** (one-command database setup)

---

## 🎯 Problem Statement

Traditional land registry systems rely on **centralized databases** managed by government offices, making them vulnerable to:

| Problem | Impact |
|---------|--------|
| 🔓 Data Tampering | Fraudulent ownership changes |
| 📋 Paper-Based Records | Lost or damaged documents |
| ⏳ Lengthy Verification | Weeks-long title searches |
| 🏢 Single Point of Failure | System outages block all operations |
| 🕵️ Lack of Transparency | No public audit trail |

**BhoomiChain** solves these by anchoring every land registration and transfer on a **blockchain-style immutable ledger**, providing cryptographic proof of ownership and a tamper-proof audit trail.

---

## 🚀 Key Features

- 📝 **Land Registration** — Register parcels with owner, location, area, and survey number
- 🔄 **Ownership Transfer** — Peer-to-peer transfers recorded as blockchain transactions
- ⛏️ **Block Mining** — Mine pending transactions into new blocks with SHA-256 PoW
- 🔍 **Block Explorer** — Visual chain explorer showing blocks linked by hashes
- 📊 **Dashboard** — Real-time statistics: total lands, transactions, users, mined blocks
- 🔐 **Authentication** — JWT-based login/register with bcrypt password hashing
- 🐳 **Docker Setup** — One-command PostgreSQL provisioning via Docker Compose
- 🎨 **Premium UI** — Dark glassmorphism theme with animations and responsive design

---

## 🏗️ System Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React Client   │────▶│   Express API    │────▶│   PostgreSQL     │
│   (Vite + SPA)   │◀────│   (REST + JWT)   │◀────│   (Docker)       │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │   Chaincode      │
                         │   Simulator      │
                         │  (SHA-256 PoW)   │
                         └──────────────────┘
```

**Data Flow:**
1. User submits a land registration or transfer via the React dashboard.
2. Express API validates the request, writes to PostgreSQL, and creates a pending transaction.
3. When "Mine Block" is triggered, the Chaincode Simulator batches pending transactions, computes a SHA-256 hash with proof-of-work, and appends a new block to the chain.
4. The Block Explorer visualises the entire chain with linked hashes.

---

## 📂 Repository Structure

```
BhoomiChain/
│
├── client/                          # 🖥️ React Front-End (Vite)
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Client dependencies
│   ├── vite.config.js               # Vite config with API proxy
│   └── src/
│       ├── main.jsx                 # App bootstrap
│       ├── App.jsx                  # Root component with routing
│       ├── App.css                  # App-level styles
│       ├── index.css                # Global design system (CSS vars)
│       ├── ErrorBoundary.jsx        # Crash-safe error wrapper
│       ├── utils/
│       │   └── api.js               # Axios instance + JWT interceptor
│       └── components/
│           ├── Login.jsx / .css     # Authentication - Login
│           ├── Register.jsx / .css  # Authentication - Register
│           ├── Navbar.jsx / .css    # Navigation bar
│           ├── Dashboard.jsx / .css # Stats overview + recent txns
│           ├── LandRegistry.jsx/.css# Land CRUD + transfer modal
│           ├── BlockExplorer.jsx/.css# Visual blockchain explorer
│           └── TransactionForm.jsx/.css # Transaction ledger
│
├── server/                          # ⚙️ Express API
│   ├── index.js                     # Server entry point
│   ├── routes.js                    # All REST endpoints
│   ├── db.js                        # PostgreSQL connection pool
│   ├── auth.js                      # JWT middleware
│   ├── seed.sql                     # Schema + demo data
│   └── package.json                 # Server dependencies
│
├── chaincode/                       # ⛓️ Blockchain Logic
│   └── simulator.js                 # SHA-256 hashing, mining, validation
│
├── docker-compose.yml               # 🐳 PostgreSQL container
├── .env.example                     # 🔑 Environment variable template
├── .gitignore                       # Git exclusions
├── package.json                     # 📦 Root scripts
├── LICENSE                          # MIT License
└── README.md                       # 📖 This file
```

---

## 🧠 Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Front-End** | React 18, Vite, React Router | Single-Page Application |
| **Styling** | Vanilla CSS, Glassmorphism, Inter Font | Premium dark-theme UI |
| **Back-End** | Node.js 20, Express 4 | RESTful API server |
| **Authentication** | JWT, bcryptjs | Secure auth flow |
| **Database** | PostgreSQL 15 | Persistent data storage |
| **Blockchain** | Custom SHA-256 simulator | Block mining & validation |
| **Containerisation** | Docker Compose | One-command DB setup |
| **HTTP Client** | Axios | API communication |

---

## ▶️ Getting Started

### Prerequisites

- **Node.js** (v18+) and **npm**
- **Docker Desktop** (for PostgreSQL)
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/<your-username>/BhoomiChain.git
cd BhoomiChain
```

### 2️⃣ Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env to customise DB credentials and JWT secret (defaults work out of the box)
```

### 3️⃣ Start PostgreSQL via Docker

```bash
docker-compose up -d
```

### 4️⃣ Install Dependencies

```bash
# Install both server and client dependencies
cd server && npm install && cd ../client && npm install && cd ..
```

### 5️⃣ Start the Application

**Terminal 1 — API Server:**
```bash
cd server
npm run dev          # Runs on http://localhost:5000
```

**Terminal 2 — React Client:**
```bash
cd client
npm run dev          # Runs on http://localhost:5173
```

### 6️⃣ Open in Browser

Navigate to **http://localhost:5173** and log in with:

| Email | Password | Role |
|-------|----------|------|
| `demo@bhoomi.in` | `password123` | Demo User |
| `admin@bhoomi.in` | `admin123` | Admin |

---

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login and get JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user info |
| `GET` | `/api/lands` | ❌ | List all registered lands |
| `POST` | `/api/lands` | ✅ | Register a new land parcel |
| `POST` | `/api/lands/transfer` | ✅ | Transfer land ownership |
| `GET` | `/api/transactions` | ❌ | List all transactions |
| `GET` | `/api/blocks` | ❌ | List all mined blocks |
| `POST` | `/api/blocks/mine` | ✅ | Mine pending transactions |
| `GET` | `/api/stats` | ❌ | Dashboard statistics |

---

## ⛓️ Blockchain Implementation

The **Chaincode Simulator** (`chaincode/simulator.js`) implements:

1. **SHA-256 Hashing** — Each block's hash is computed from its index, timestamp, previous hash, transaction data, and nonce.
2. **Proof-of-Work Mining** — Blocks are mined by incrementing a nonce until the hash meets difficulty criteria.
3. **Chain Validation** — The entire chain can be verified by checking that each block's `previousHash` matches the preceding block's `hash`.
4. **Genesis Block** — The first block in the chain is automatically created during database seeding.

---

## 🔒 Security & Privacy

- **Password Hashing** — All passwords are hashed with bcrypt (10 salt rounds)
- **JWT Authentication** — Stateless token-based auth with configurable expiry
- **SQL Injection Prevention** — Parameterised queries via `pg` library
- **CORS Protection** — Configurable cross-origin resource sharing
- **Input Validation** — Server-side validation on all endpoints

---

## 🎓 Academic Purpose

This project was developed as part of an academic exercise at **Manipal University Jaipur** to demonstrate:

- Blockchain fundamentals (hashing, mining, consensus)
- Full-stack web development (React + Express + PostgreSQL)
- Decentralised application architecture
- Smart contract simulation
- Secure authentication patterns

---

## 🔮 Future Enhancements

- 🌐 **Hyperledger Fabric Integration** — Replace the simulator with a real permissioned blockchain
- 🔏 **Zero-Knowledge Proofs** — Privacy-preserving ownership verification
- 📱 **Mobile App** — React Native companion app
- 🗺️ **GIS Integration** — Map-based land parcel visualisation
- 🤖 **AI Fraud Detection** — ML-based anomaly detection on transactions
- ☁️ **Cloud Deployment** — AWS/GCP with Kubernetes orchestration

---

## 👩‍💻 Author

**Anushka Chaudhary**

Blockchain · Cyber Security · Full-Stack Development

- 🔗 [GitHub](https://github.com/anushka-chaudhary16)

---

## ⭐ Support

If you find **BhoomiChain** useful, please give it a ⭐ on GitHub and share it with your network!

---

*Built with ❤️ at Manipal University Jaipur*
