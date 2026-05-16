# Team Task Manager

A production-ready full-stack task management application built with React, Node.js, Express, MongoDB, and JWT authentication.

🌐 **Live Demo:** [https://team-task-manager-8wga.vercel.app/](https://team-task-manager-8wga.vercel.app/)

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT and bcrypt
- **Role-Based Access Control**: Admin and Member roles with different permissions
- **Project Management**: Create, update, and manage projects
- **Team Collaboration**: Add/remove team members from projects
- **Task Management**: Create, assign, and track tasks with status (Todo, In Progress, Done)
- **Dashboard**: View task statistics, filter by project, and track overdue tasks
- **Responsive UI**: Clean and modern interface with Tailwind CSS

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Modern web browser

## 🛠️ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed installation and deployment instructions
- [API Documentation](./API_DOCUMENTATION.md) - Complete REST API reference
- [Postman Collection](./POSTMAN_COLLECTION.md) - Postman API testing collection

## 🔐 Demo Credentials

You can test the application live here: [Login Page](https://team-task-manager-9l3equru8-prabhaty701-5812s-projects.vercel.app/login)

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Member Account:**
- Email: `member@example.com`
- Password: `password123`

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcrypt
- **Database**: MongoDB
- **Hosting**: Railway (recommended)

## 📁 Project Structure

```
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

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `POST /api/projects` - Create project (Admin only)
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `POST /api/projects/:id/members` - Add member (Admin only)
- `DELETE /api/projects/:id/members/:memberId` - Remove member (Admin only)

### Tasks
- `POST /api/tasks` - Create task (Admin only)
- `GET /api/tasks/project/:projectId` - Get tasks by project
- `GET /api/tasks/task/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics

## 🚀 Deployment

### Deploy on Railway

1. Push code to GitHub
2. Connect GitHub to Railway
3. Set environment variables:
   - `MONGO_URI` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT
   - `NODE_ENV` - production
4. Deploy backend and frontend services

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed deployment instructions.

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- Environment variables for sensitive data
- CORS configuration
- Input validation with express-validator

## 🐛 Troubleshooting

### Backend connection issues
```bash
# Check MongoDB connection
mongosh # or mongo for older versions

# Verify environment variables
cat backend/.env
```

### Frontend API connection issues
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check frontend environment
cat frontend/.env
```

## 📞 Support

For issues, questions, or suggestions:
1. Check the documentation files
2. Review the API documentation
3. Check MongoDB and Node.js logs

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

---

**Happy task managing! 🎉**

Built with ❤️ by Your Team
