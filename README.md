# UniShare - University Document Sharing Platform

A modern web application for university students and faculty to share academic documents (PYQs, notes, syllabus) organized by department and semester.

**Live Demo:** https://uni-share-eight.vercel.app

---

## 🚀 Tech Stack

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

**Deployment:**
- Frontend: Vercel
- Backend: Render.com
- Database: Supabase
- File Storage: Cloudinary

---

## ✨ Features

- 🔐 Secure authentication with Clerk (User & Admin roles)
- 📁 Upload documents (up to 100MB, PDF, DOC, PPT, images)
- 🔍 Search and filter by department/semester
- 📥 Download documents with tracking
- 👨‍💼 Admin dashboard for managing departments
- 🎨 Clean, responsive UI

---

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase account)
- Clerk account
- Cloudinary account
- Render.com account (for backend deployment)
- Vercel account (for frontend deployment)

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/UniShare.git
cd UniShare
```

### 2. Install Dependencies

**Frontend:**
```bash
cd client
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Set Up Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# File Upload
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/jpeg,image/png
```

**Frontend (`client/.env`):**
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_URL=http://localhost:5000/api
```

### 4. Set Up Database

1. Go to Supabase Dashboard → SQL Editor
2. Run the schema from `server/src/database/schema.sql`
3. This creates tables for departments, semesters, and documents

### 5. Run the Application

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 🌐 Production Deployment

### Backend Deployment (Render.com)

1. **Create Render Project**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your UniShare repository

2. **Configure Service**
   - Render will auto-detect Node.js (uses `render.yaml`)
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Environment tab
   - Add all variables from `server/.env.example`
   - **Important:** Use Supabase's connection pooler URL:
     ```
     postgresql://postgres.[project]:PASSWORD@aws-1-[region].pooler.supabase.com:6543/postgres
     ```
   - URL-encode special characters in password (& → %26, / → %2F, @ → %40)

4. **Get Backend URL**
   - After deployment completes
   - Copy the URL (e.g., `https://unishare-nwsc.onrender.com`)

### Frontend Deployment (Vercel)

1. **Create Vercel Project**
   - Go to https://vercel.com
   - Click "Add New Project"
   - Import your UniShare repository

2. **Configure Build Settings**
   - Framework: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   VITE_API_URL=https://YOUR_RENDER_URL/api
   ```

4. **Deploy**
   - Click Deploy
   - Vercel will auto-deploy on every push to main branch

---

## 👤 Admin Setup

To make a user an admin:

1. Go to Clerk Dashboard → Users
2. Select the user
3. Click "Metadata" → "Public metadata"
4. Add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save and refresh the app

---

## 📁 Project Structure

```
UniShare/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   ├── App.jsx        # Main app with routing
│   │   └── index.css      # Global styles
│   ├── vercel.json        # Vercel config for routing
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Business logic
│   │   ├── middleware/    # Auth, upload, errors
│   │   ├── config/        # DB, Cloudinary config
│   │   ├── database/      # SQL schema
│   │   └── server.js      # Entry point
│   └── package.json
├── render.yaml            # Render deployment config
├── package.json
└── README.md
```

---

## 🔧 API Endpoints

### Departments
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id/semesters` - Get semesters for a department
- `POST /api/departments` - Create department (Admin only)
- `DELETE /api/departments/:id` - Delete department (Admin only)

### Documents
- `GET /api/documents` - Get all documents (with filters)
- `POST /api/documents/upload` - Upload document (Auth required)
- `POST /api/documents/:id/download` - Increment download count
- `DELETE /api/documents/:id` - Delete document (Owner or Admin)

---

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure you're using Supabase's **connection pooler** URL (port 6543)
- Verify password is URL-encoded in DATABASE_URL

### Clerk Authentication Issues
- Check environment variables are set correctly
- Verify Clerk publishable key matches between frontend and backend

### File Upload Issues
- Check Cloudinary credentials
- Verify file size is under 100MB
- Ensure file type is in ALLOWED_FILE_TYPES

### 404 on Routes (Vercel)
- Ensure `client/vercel.json` exists with rewrites configuration

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please open an issue on GitHub.
