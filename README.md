# ExpertFlow - Real-Time Expert Session Booking System

A production-ready, full-stack web application that allows users to discover experts, view their availability, and book 1-on-1 sessions. Built with the MERN stack and featuring real-time availability syncing to prevent double bookings.

## 🚀 Features

- **Expert Discovery**: Search and filter experts by name, specialty, and price.
- **Real-Time Availability**: Powered by Socket.io, slot availability updates instantly across all connected clients when a booking is made or cancelled.
- **Race-Condition Safety**: Double bookings are prevented at the database level using MongoDB unique compound indexes.
- **Modern UI/UX**: Clean, responsive, light dashboard theme with 3D pop card effects built using React and vanilla CSS.
- **Booking Management**: Users can look up their bookings via email and cancel sessions easily.

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- React Router DOM
- Socket.io Client
- Axios
- React Hot Toast (Notifications)

**Backend:**
- Node.js
- Express
- MongoDB & Mongoose
- Socket.io
- Express Validator

## 📦 Project Structure

The project is structured as a monorepo with separate `client` and `server` directories.

```text
ExpertFlow/
├── client/       # React frontend application
└── server/       # Node.js/Express backend application
```

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd ExpertFlow
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (do not commit this file):
```env
MONGO_URI=mongodb://localhost:27017/expertflow
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed the database with sample experts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🔒 Security Best Practices

This repository is configured to ignore sensitive files:
- All `.env` files are excluded from version control to prevent credential leaks.
- `node_modules` and build directories (`dist`) are excluded to keep the repository clean.
