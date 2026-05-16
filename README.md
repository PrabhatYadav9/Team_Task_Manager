# Team Task Manager

A production-ready full-stack task management application built with React, Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Live Demo

- **Frontend Application:**  
  https://team-task-manager-9l3equru8-prabhaty701-5812s-projects.vercel.app

- **Backend API:**  
  https://team-task-manager-8wga.vercel.app

---

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT and bcrypt
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Project Management**: Create, update, and manage projects
- **Team Collaboration**: Add/remove team members from projects
- **Task Management**: Create, assign, and track tasks with status (Todo, In Progress, Done)
- **Dashboard**: View task statistics, filter by project, and track overdue tasks
- **Responsive UI**: Clean and modern interface with Tailwind CSS
- **Cloud Deployment**: Fully deployed using Vercel

---

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas or Local MongoDB
- Modern web browser

---

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update the `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Run the backend server:

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Update the frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

## 🌐 Production Deployment

### Frontend Deployment

The frontend is deployed on Vercel:

https://team-task-manager-9l3equru8-prabhaty701-5812s-projects.vercel.app

### Backend Deployment

The backend API is deployed on Vercel:

https://team-task-manager-8wga.vercel.app

---

## 🔐 Demo Credentials

### Admin Account

- **Email:** `admin@example.com`
- **Password:** `password123`

### Member Account

- **Email:** `member@example.com`
- **Password:** `password123`

---

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- Mongoose
- JWT Authentication
- bcrypt

### Database
- MongoDB Atlas

### Deployment
- Vercel

---

## 📁 Project Structure

```bash
team-task-manager/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
│
├── SETUP_GUIDE.md
├── API_DOCUMENTATION.md
├── POSTMAN_COLLECTION.md
└── README.md
```

---

## 📝 API Endpoints

### Authentication

- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User login
- `GET /api/auth/me` — Get current user

### Projects

- `POST /api/projects` — Create project (Admin only)
- `GET /api/projects` — Get all projects
- `GET /api/projects/:id` — Get project details
- `PUT /api/projects/:id` — Update project (Admin only)
- `DELETE /api/projects/:id` — Delete project (Admin only)
- `POST /api/projects/:id/members` — Add member (Admin only)
- `DELETE /api/projects/:id/members/:memberId` — Remove member (Admin only)

### Tasks

- `POST /api/tasks` — Create task (Admin only)
- `GET /api/tasks/project/:projectId` — Get tasks by project
- `GET /api/tasks/task/:id` — Get task details
- `PUT /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task (Admin only)
- `GET /api/tasks/dashboard/stats` — Get dashboard statistics

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Environment variables for sensitive data
- CORS configuration
- Input validation with express-validator

---

## 🐛 Troubleshooting

### Backend Connection Issues

```bash
# Verify backend deployment
curl https://team-task-manager-8wga.vercel.app
```

### Frontend API Issues

```bash
# Check frontend environment variable
VITE_API_URL=https://team-task-manager-8wga.vercel.app/api
```

### MongoDB Connection Issues

```bash
# Verify MongoDB URI in .env
MONGO_URI=your_mongodb_connection_string
```

---

## 📚 Documentation

- `SETUP_GUIDE.md` — Detailed setup and deployment instructions
- `API_DOCUMENTATION.md` — Complete REST API reference
- `POSTMAN_COLLECTION.md` — API testing collection

---

## 📞 Support

For issues, suggestions, or improvements:

1. Check the documentation files
2. Verify environment variables
3. Review backend deployment logs
4. Check MongoDB Atlas connection status

---

## ⭐ Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
