# Team Task Manager - Complete Guide & Examples

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Folder Structure](#folder-structure)
5. [API Examples](#api-examples)
6. [Frontend Features](#frontend-features)
7. [Security Implementation](#security-implementation)
8. [Performance & Best Practices](#performance--best-practices)

---

## Project Overview

**Team Task Manager** is a production-ready web application for managing projects and tasks within a team. It implements role-based access control, allowing admins to manage projects and assign tasks to team members.

### Key Technologies
- **Frontend**: React 18 + Vite (lightning-fast development)
- **Backend**: Node.js + Express (scalable REST API)
- **Database**: MongoDB + Mongoose (flexible data model)
- **Authentication**: JWT + bcrypt (secure)
- **Styling**: Tailwind CSS (modern, responsive UI)

---

## Architecture

### Backend Architecture

```
┌─────────────────────────────────────────┐
│         Client (Browser)                 │
└────────────────┬────────────────────────┘
                 │
                 ↓ HTTP/HTTPS
┌─────────────────────────────────────────┐
│      Express.js Server (Port 5000)       │
├─────────────────────────────────────────┤
│ Routes (authRoutes, projectRoutes, etc)  │
│ Middleware (auth, errorHandler)          │
│ Controllers (logic for each endpoint)    │
│ Models (User, Project, Task)             │
└────────────┬────────────────────────────┘
             │
             ↓ Mongoose Driver
┌─────────────────────────────────────────┐
│    MongoDB Database                      │
│    - Users Collection                    │
│    - Projects Collection                 │
│    - Tasks Collection                    │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌──────────────────────────────────────┐
│      React Components                 │
├──────────────────────────────────────┤
│  Pages:                               │
│  - Home, Login, Signup                │
│  - Dashboard, ProjectPage             │
├──────────────────────────────────────┤
│  Context: AuthContext (state mgmt)    │
│  Services: API calls (axios)          │
│  Components: Navbar, Forms, etc       │
└────────────┬─────────────────────────┘
             │
             ↓ HTTP Requests
┌──────────────────────────────────────┐
│      Backend API                      │
└──────────────────────────────────────┘
```

---

## Core Features

### 1. Authentication System

**User Signup/Login Flow:**
```
User Signup → Password Hashed → User Created → JWT Token Generated
                                              ↓
User Login → Password Validated → JWT Token Generated → Stored in localStorage
```

**JWT Token Structure:**
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: "userId", email: "user@example.com", role: "Admin", iat: ..., exp: ... }
Signature: HMACSHA256(base64(header) + base64(payload), secret)
```

### 2. Role-Based Access Control (RBAC)

| Action | Admin | Member |
|--------|-------|--------|
| Create Project | ✅ | ❌ |
| Delete Project | ✅ | ❌ |
| Add Team Members | ✅ | ❌ |
| Create Task | ✅ | ❌ |
| Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Projects | ✅ | ✅ |
| View Tasks | ✅ | ✅ |

### 3. Data Relationships

```
User
├── Projects (as owner)
├── Projects (as member)
└── Tasks (as creator)
└── Tasks (as assignee)

Project
├── Owner (User)
├── Members (User[])
└── Tasks (Task[])

Task
├── Project (Project)
├── Assigned To (User)
└── Created By (User)
```

---

## Folder Structure

### Backend
```
backend/
├── config/
│   └── database.js          # MongoDB connection
│
├── controllers/
│   ├── authController.js    # Auth logic (signup, login)
│   ├── projectController.js # Project operations
│   └── taskController.js    # Task operations
│
├── middleware/
│   ├── auth.js              # JWT verification & RBAC
│   └── errorHandler.js      # Global error handling
│
├── models/
│   ├── User.js              # User schema & methods
│   ├── Project.js           # Project schema
│   └── Task.js              # Task schema
│
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── projectRoutes.js     # Project endpoints
│   └── taskRoutes.js        # Task endpoints
│
├── .env.example             # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── server.js               # Entry point
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation
│   │   ├── Common.jsx           # Reusable UI components
│   │   └── ProtectedRoute.jsx   # Route protection
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Login page
│   │   ├── Signup.jsx           # Signup page
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   └── ProjectPage.jsx      # Project details
│   │
│   ├── services/
│   │   ├── apiClient.js         # Axios instance with interceptors
│   │   └── api.js               # API endpoints
│   │
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React DOM render
│   └── index.css                # Global styles + Tailwind
│
├── .env.example                 # Environment template
├── .gitignore                  # Git ignore rules
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies
└── index.html                  # HTML entry point
```

---

## API Examples

### Complete Workflow Example

#### 1. User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "password": "securePass123",
    "role": "Admin"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YTZiZGY3YzAwMDAwMDAwMDAwMDAwMSIsImVtYWlsIjoiYWxpY2VAY29tcGFueS5jb20iLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3MDU0MDQwMDAsImV4cCI6MTcwNjAwODgwMH0.XXX",
  "user": {
    "id": "65a6bdf7c000000000000001",
    "name": "Alice Johnson",
    "email": "alice@company.com",
    "role": "Admin"
  }
}
```

**Token Usage:** Save token to localStorage and include in all requests:
```javascript
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 2. Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Mobile App Development",
    "description": "Build iOS and Android apps"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "65a6bdf7c000000000000002",
    "name": "Mobile App Development",
    "description": "Build iOS and Android apps",
    "owner": {
      "_id": "65a6bdf7c000000000000001",
      "name": "Alice Johnson",
      "email": "alice@company.com"
    },
    "members": [
      {
        "_id": "65a6bdf7c000000000000001",
        "name": "Alice Johnson",
        "email": "alice@company.com"
      }
    ],
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### 3. Signup Member & Add to Project
```bash
# Signup Member
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@company.com",
    "password": "bobPass123",
    "role": "Member"
  }'

# Response contains Bob's ID: 65a6bdf7c000000000000003

# Add Bob to Project
curl -X POST http://localhost:5000/api/projects/65a6bdf7c000000000000002/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <alice_token>" \
  -d '{
    "memberId": "65a6bdf7c000000000000003"
  }'
```

#### 4. Create & Assign Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <alice_token>" \
  -d '{
    "title": "Design UI Components",
    "description": "Create reusable UI component library",
    "projectId": "65a6bdf7c000000000000002",
    "assignedTo": "65a6bdf7c000000000000003",
    "dueDate": "2024-02-01",
    "status": "todo"
  }'
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "65a6bdf7c000000000000004",
    "title": "Design UI Components",
    "description": "Create reusable UI component library",
    "projectId": "65a6bdf7c000000000000002",
    "assignedTo": {
      "_id": "65a6bdf7c000000000000003",
      "name": "Bob Smith",
      "email": "bob@company.com"
    },
    "status": "todo",
    "dueDate": "2024-02-01T00:00:00Z",
    "createdBy": {
      "_id": "65a6bdf7c000000000000001",
      "name": "Alice Johnson"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 5. Update Task Status (Member)
```bash
# Bob (Member) updates his task status
curl -X PUT http://localhost:5000/api/tasks/65a6bdf7c000000000000004 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <bob_token>" \
  -d '{
    "status": "in-progress"
  }'

# Later, mark as done
curl -X PUT http://localhost:5000/api/tasks/65a6bdf7c000000000000004 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <bob_token>" \
  -d '{
    "status": "done"
  }'
```

#### 6. Get Dashboard Statistics
```bash
# Alice gets stats for all her tasks
curl -X GET http://localhost:5000/api/tasks/dashboard/stats \
  -H "Authorization: Bearer <alice_token>"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "todoTasks": 3,
    "inProgressTasks": 5,
    "doneTasks": 2,
    "overdueTasks": [
      {
        "_id": "65a6bdf7c000000000000005",
        "title": "API Integration",
        "assignedTo": {
          "_id": "65a6bdf7c000000000000003",
          "name": "Bob Smith"
        },
        "projectId": {
          "_id": "65a6bdf7c000000000000002",
          "title": "Mobile App Development"
        },
        "dueDate": "2024-01-10T00:00:00Z",
        "status": "in-progress"
      }
    ]
  }
}
```

---

## Frontend Features

### Page 1: Home Page
- Welcome message
- Login/Signup buttons
- Feature cards (Projects, Team, Tasks)
- Responsive design

### Page 2: Login/Signup
- Form validation
- Error/success messages
- Redirect on success
- Demo credentials display

### Page 3: Dashboard
- Task statistics (total, by status, overdue)
- Project cards
- Create project modal
- Project filtering

### Page 4: Project Page
- Project details
- Team members list
- Add/remove members (admin only)
- Task list with filters
- Create task modal (admin only)
- Inline task status updates

### Page 5: Protected Routes
- Redirect unauthenticated users to login
- Admin-only routes
- Loading states

---

## Security Implementation

### 1. Password Security
```javascript
// User.js - Pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// matchPassword method for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

### 2. JWT Authentication
```javascript
// middleware/auth.js - Token verification
exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};
```

### 3. Role-Based Access Control
```javascript
// middleware/auth.js - RBAC middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} not authorized`
      });
    }
    next();
  };
};

// Usage in routes
router.post('/', authorize('Admin'), createProject);
```

### 4. CORS Protection
```javascript
// server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### 5. Environment Variables
```env
# Backend .env
JWT_SECRET=your-super-secret-key-never-share-this
JWT_EXPIRE=7d
MONGO_URI=mongodb://user:pass@cluster.mongodb.net/dbname
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

---

## Performance & Best Practices

### 1. Frontend Performance
- **Lazy Loading**: Pages loaded only when needed
- **Code Splitting**: Vite automatically splits code
- **Caching**: API responses cached in component state
- **Optimized Images**: SVG and icon fonts
- **Minified CSS**: Tailwind production build

### 2. Backend Performance
- **Database Indexing**: MongoDB indexes on frequently queried fields
- **Pagination**: Not implemented but can be added for large datasets
- **Caching**: Can be added with Redis
- **Validation**: Input validated before database operations
- **Error Handling**: Centralized error handler

### 3. Code Quality
- **Modular Structure**: Separation of concerns (Controllers, Models, Routes)
- **Error Handling**: Try-catch blocks and error middleware
- **Validation**: Express-validator for input sanitization
- **Comments**: Clear comments for complex logic
- **Naming Conventions**: Consistent and descriptive names

### 4. Database Optimization
```javascript
// Good: Populate only needed fields
Task.find().populate('assignedTo', 'name email').select('title status');

// Bad: Populate all fields
Task.find().populate('assignedTo');
```

### 5. API Best Practices
- RESTful endpoint design
- Consistent response format
- Proper HTTP status codes
- Descriptive error messages
- Request/response validation

---

## Deployment Checklist

- [ ] Change JWT_SECRET to production value
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas connection string
- [ ] Enable HTTPS
- [ ] Set CORS_ORIGIN to production domain
- [ ] Run `npm audit` to check vulnerabilities
- [ ] Configure environment variables on hosting platform
- [ ] Test all API endpoints
- [ ] Setup monitoring/logging
- [ ] Backup database regularly

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Token invalid | Check JWT_SECRET matches between encode/decode |
| CORS error | Verify CORS_ORIGIN matches frontend URL |
| MongoDB connection fails | Check connection string and network access |
| Task still shows as overdue | Verify dueDate is in ISO format |
| Member can't see project | Check if added to project members array |

---

## Next Steps & Enhancements

1. **Notifications**: Email notifications for task assignments
2. **File Uploads**: Attach files to tasks
3. **Comments**: Add task comments/discussions
4. **Activity Log**: Track all changes
5. **Search**: Full-text search for tasks/projects
6. **Kanban Board**: Drag-and-drop task management
7. **Reports**: PDF reports generation
8. **Real-time Updates**: WebSocket for live collaboration
9. **Mobile App**: React Native version
10. **Dark Mode**: Theme switching

---

This complete guide covers all aspects of the Team Task Manager application!
