# 🎯 Team Task Manager

A production-ready full-stack task management application designed for seamless team collaboration. Built with React, Node.js, Express, MongoDB, and JWT authentication.

🌐 **Live Demo:** [https://team-task-manager-8wga.vercel.app/](https://team-task-manager-8wga.vercel.app/)

---

## 🚀 Features

- **User Authentication**: Secure signup & login using JWT and bcrypt.
- **Role-Based Access Control**: Differentiated permissions for Admin and Member roles.
- **Project Management**: Create, update, and manage team projects seamlessly.
- **Team Collaboration**: Easily add or remove team members from specific projects.
- **Task Management**: Create, assign, and track tasks dynamically (Todo, In Progress, Done).
- **Interactive Dashboard**: View task statistics, filter by project, and track overdue tasks.
- **Responsive UI**: A modern, beautiful, and fully responsive user interface powered by Tailwind CSS.

---

## 🔐 Demo Access

You can test the live application directly: [Login Page](https://team-task-manager-9l3equru8-prabhaty701-5812s-projects.vercel.app/login)

**Admin Credentials:**
- Email: `admin@example.com`
- Password: `password123`

**Member Credentials:**
- Email: `member@example.com`
- Password: `password123`

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router, Zustand
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), bcrypt
- **Database**: MongoDB Atlas
- **Hosting**: 
  - Frontend deployed on **Vercel**
  - Backend deployed on **Railway**

---

## 🛠️ Quick Start (Local Development)

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/PrabhatYadav9/TaskManager.git
cd TaskManager
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on .env.example
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT Secret
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
# Create a .env file and add VITE_API_URL=http://localhost:5001/api
cp .env.example .env
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 📝 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current logged-in user profile

### Projects
- `POST /api/projects` - Create a project (Admin)
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get specific project details
- `PUT /api/projects/:id` - Update project details (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/members` - Add team member (Admin)
- `DELETE /api/projects/:id/members/:memberId` - Remove team member (Admin)

### Tasks
- `POST /api/tasks` - Create a new task (Admin)
- `GET /api/tasks/project/:projectId` - Get tasks by project
- `GET /api/tasks/task/:id` - Get specific task details
- `PUT /api/tasks/:id` - Update task status/details
- `DELETE /api/tasks/:id` - Delete task (Admin)
- `GET /api/tasks/dashboard/stats` - Get dashboard metrics

---

## 📚 Documentation

For more detailed information, check out the following files in the repository:
- [Setup & Deployment Guide](./SETUP_GUIDE.md)
- [Complete API Documentation](./API_DOCUMENTATION.md)
- [Postman API Collection](./POSTMAN_COLLECTION.md)

---

## 📄 License
This project is open source and available under the MIT License.

Built with ❤️ by Prabhat Yadav
