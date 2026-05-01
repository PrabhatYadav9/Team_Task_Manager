# Team Task Manager - Complete Setup & Deployment Guide

## Project Overview

This is a production-ready full-stack Task Management application built with:
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT with bcrypt password hashing

## ⚙️ Step-by-Step Setup

### Prerequisites

Ensure you have installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Backend Setup

#### Step 1: Navigate to backend folder
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create .env file
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

**Edit `.env`:**
```env
PORT=5000
NODE_ENV=development

# MongoDB - Use MongoDB Atlas or Local MongoDB
MONGO_URI=mongodb://localhost:27017/team-task-manager
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/team-task-manager

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Step 4: Start backend server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

#### Step 1: Navigate to frontend folder
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create .env file
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

**Edit `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 4: Start frontend development server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Test the Application

1. Open browser: `http://localhost:5173`
2. Click "Sign Up" to create account or use demo credentials:
   - **Admin**: admin@example.com / password123
   - **Member**: member@example.com / password123
3. Start creating projects and tasks

---

## 🚀 Deployment on Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Team Task Manager"
git branch -M main
git remote add origin https://github.com/yourusername/team-task-manager.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub repository
5. Select the repository
6. **For the backend service:**
   - Add service for Node.js
   - Set `ROOT_DIRECTORY` to `backend`
   - Set `START_COMMAND` to `npm start`

**Environment Variables (in Railway Dashboard):**
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your-production-secret-key-change-this
CORS_ORIGIN=https://your-frontend-domain.com
```

**Obtain MongoDB Atlas URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create user credentials
4. Get connection string
5. Replace `<password>` and `<cluster>` in URI

### Step 3: Deploy Frontend on Railway

1. In Railway, create new service
2. Add service for Next.js or Static Site
3. Set `ROOT_DIRECTORY` to `frontend`
4. Set `START_COMMAND` to `npm run build && npm run preview`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-railway-url/api
```

### Step 4: Connect Services

1. In Railway, link frontend to backend environment
2. Update frontend environment variable with actual backend URL

---

## 📦 Production Build

### Build Backend (if needed)
```bash
cd backend
npm start
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

Production build will be in `frontend/dist`

---

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

### Option 2: MongoDB Atlas (Recommended for Production)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
5. Update `MONGO_URI` in `.env`

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS in production
- [ ] Use MongoDB Atlas with IP whitelist
- [ ] Set strong passwords for database users
- [ ] Enable CORS only for your domain
- [ ] Use `npm audit` to check for vulnerabilities

```bash
npm audit
npm audit fix
```

---

## 📚 API Documentation

See `API_DOCUMENTATION.md` for complete REST API endpoints and examples.

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # Linux/Mac
netstat -ano | findstr :5000  # Windows

# MongoDB connection error
# Ensure MongoDB is running and MONGO_URI is correct
```

### Frontend won't connect to backend
```bash
# Check if VITE_API_URL is correct in .env
# Ensure backend is running on 5000
# Check CORS_ORIGIN matches frontend URL
```

### Database errors
```bash
# Check MongoDB connection
mongo # or mongosh for newer versions
use team-task-manager
db.users.find()
```

---

## 📝 Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Common.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── ProjectPage.jsx
    │   ├── services/
    │   │   ├── apiClient.js
    │   │   └── api.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── index.html
```

---

## 🎯 Features Implemented

### Authentication ✅
- User signup and login
- Password hashing with bcrypt
- JWT token generation and validation
- Protected routes

### User Roles ✅
- Admin role
  - Create/Delete projects
  - Add/Remove team members
  - Create/Assign tasks
  - Update task status
- Member role
  - View projects
  - Update own task status

### Project Management ✅
- Create projects (Admin only)
- Add/Remove team members (Admin only)
- View all projects
- Project details page

### Task Management ✅
- Create tasks (Admin only)
- Assign tasks to team members
- Update task status (Todo → In Progress → Done)
- Set due dates
- Filter tasks by status
- Delete tasks (Admin only)

### Dashboard ✅
- Total tasks count
- Tasks by status breakdown
- Overdue tasks tracking
- Filter by project
- Task statistics

---

## 📞 Support & Contact

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check MongoDB and Node.js logs

Happy task managing! 🎉
