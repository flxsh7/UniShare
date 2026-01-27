# UniShare - University Document Sharing Platform

A modern web application for university students and faculty to share academic documents (PYQs, notes, syllabus) organized by department and semester.

## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router v6
- Clerk Authentication
- Axios
- Vanilla CSS

**Backend:**
- Node.js with Express
- PostgreSQL (Supabase)
- Cloudinary (File Storage)
- Clerk SDK

## Features

- 🔐 Secure authentication with Clerk (User & Admin roles)
- 📁 Upload documents (up to 100MB)
- 🔍 Search and filter by department/semester
- 📥 Download documents
- 👨‍💼 Admin dashboard for managing departments/semesters

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Supabase account)
- Clerk account
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
cd e:\WorkSpace\UniShare
```

2. **Install dependencies**

Frontend:
```bash
cd client
npm install
```

Backend:
```bash
cd server
npm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` in both `client` and `server` directories and fill in your credentials.

4. **Set up database**
```bash
cd server
# Run the schema.sql file in your PostgreSQL database
```

5. **Run the application**

Backend (from server directory):
```bash
npm run dev
```

Frontend (from client directory):
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend will be available at `http://localhost:5000`

## Project Structure

```
UniShare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── App.jsx
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, error handling
│   │   ├── config/        # Configuration
│   │   └── server.js
│   └── package.json
└── README.md
```

## License

MIT
