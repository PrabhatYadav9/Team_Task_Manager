# Visual Architecture & Database Schema Guide

## Database Schema Diagrams

### User Collection
```
User {
  _id: ObjectId
  name: String (required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (enum: ['Admin', 'Member'], default: 'Member')
  createdAt: Date (default: now)
  updatedAt: Date
}

Example Document:
{
  "_id": ObjectId("65a6bdf7c000000000000001"),
  "name": "Alice Johnson",
  "email": "alice@company.com",
  "password": "$2a$10$...(hashed)...", // Never expose this
  "role": "Admin",
  "createdAt": ISODate("2024-01-15T10:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:00:00Z")
}
```

### Project Collection
```
Project {
  _id: ObjectId
  name: String (required)
  description: String
  owner: ObjectId (ref: User, required)
  members: [ObjectId] (ref: User[])
  createdAt: Date (default: now)
  updatedAt: Date
}

Example Document:
{
  "_id": ObjectId("65a6bdf7c000000000000002"),
  "name": "Mobile App Development",
  "description": "Build iOS and Android apps",
  "owner": ObjectId("65a6bdf7c000000000000001"),
  "members": [
    ObjectId("65a6bdf7c000000000000001"),
    ObjectId("65a6bdf7c000000000000003")
  ],
  "createdAt": ISODate("2024-01-15T10:00:00Z"),
  "updatedAt": ISODate("2024-01-15T10:00:00Z")
}
```

### Task Collection
```
Task {
  _id: ObjectId
  title: String (required)
  description: String
  projectId: ObjectId (ref: Project, required)
  assignedTo: ObjectId (ref: User)
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo')
  dueDate: Date
  createdBy: ObjectId (ref: User, required)
  createdAt: Date (default: now)
  updatedAt: Date
}

Example Document:
{
  "_id": ObjectId("65a6bdf7c000000000000004"),
  "title": "Design UI Components",
  "description": "Create reusable UI component library",
  "projectId": ObjectId("65a6bdf7c000000000000002"),
  "assignedTo": ObjectId("65a6bdf7c000000000000003"),
  "status": "in-progress",
  "dueDate": ISODate("2024-02-01T00:00:00Z"),
  "createdBy": ObjectId("65a6bdf7c000000000000001"),
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-16T14:45:00Z")
}
```

## Entity Relationship Diagram

```
┌─────────────────┐
│      USER       │
├─────────────────┤
│ _id (PK)        │
│ name            │
│ email (unique)  │
│ password        │
│ role            │
│ createdAt       │
└────────┬────────┘
         │
         │ 1:N (as owner)
         ├────────────────────┐
         │                    │
         │ 1:N (as member)    │
         │                    │
    ┌────▼────────────────┐  ┌─▼──────────────────┐
    │     PROJECT         │  │      TASK          │
    ├─────────────────────┤  ├────────────────────┤
    │ _id (PK)            │  │ _id (PK)           │
    │ name                │  │ title              │
    │ description         │  │ description        │
    │ owner (FK: User)    │  │ projectId (FK: Pr) │
    │ members (FK: User[])│  │ assignedTo (FK: U) │
    │ createdAt           │  │ status             │
    └────────────────────┘  │ dueDate            │
         ▲                   │ createdBy (FK: U)  │
         │                   │ createdAt          │
         │   1:N             └────────────────────┘
         │  (tasks in)
         └───────────────────
```

## API Request Flow Diagram

```
CLIENT BROWSER (React)
        │
        ├─ LOGIN
        │   └─► POST /auth/login {email, password}
        │       ◄─ JWT Token + User Data
        │       └─ Store Token in localStorage
        │
        ├─ GET PROJECTS
        │   └─► GET /projects
        │       ◄─ Projects[]
        │
        ├─ CREATE PROJECT (Admin)
        │   └─► POST /projects {name, description}
        │       ◄─ New Project
        │
        ├─ ADD MEMBERS (Admin)
        │   └─► POST /projects/:id/members {memberId}
        │       ◄─ Updated Project
        │
        ├─ CREATE TASK (Admin)
        │   └─► POST /tasks {title, projectId, assignedTo, dueDate}
        │       ◄─ New Task
        │
        ├─ GET TASKS
        │   └─► GET /tasks/project/:id
        │       ◄─ Tasks[]
        │
        ├─ UPDATE TASK STATUS
        │   └─► PUT /tasks/:id {status}
        │       ◄─ Updated Task
        │
        └─ GET DASHBOARD STATS
            └─► GET /tasks/dashboard/stats
                ◄─ Statistics {total, todo, inProgress, done, overdue}

All requests include:
Authorization: Bearer <JWT_TOKEN>
```

## State Management Flow (Frontend)

```
┌──────────────────────────────────────┐
│      AuthContext                     │
├──────────────────────────────────────┤
│ State:                               │
│  - user (current user info)          │
│  - loading (auth check in progress)  │
│                                      │
│ Methods:                             │
│  - signup(data) → Create user        │
│  - login(data) → Authenticate        │
│  - logout() → Clear session          │
└──────────────────────────────────────┘
        │
        ├─ Accessed by <ProtectedRoute>
        ├─ Accessed by <Navbar>
        └─ Accessed by Page Components
```

## Component Hierarchy

```
App
├─ Router
│  ├─ Navbar (always visible)
│  │
│  └─ Routes
│     ├─ / (Home)
│     ├─ /login (Login page)
│     ├─ /signup (Signup page)
│     │
│     ├─ /dashboard (Protected)
│     │  └─ Dashboard
│     │     ├─ Stats Cards
│     │     ├─ Projects Grid
│     │     └─ Create Project Modal
│     │
│     └─ /projects/:id (Protected)
│        └─ ProjectPage
│           ├─ Project Header
│           ├─ Team Members List
│           ├─ Task Filters
│           ├─ Task Cards
│           ├─ Create Task Modal
│           └─ Add Member Modal
│
├─ AuthProvider (context)
└─ Components:
   ├─ Common (Loader, ErrorMessage, SuccessMessage)
   └─ ProtectedRoute (route protection)
```

## Authentication Flow Diagram

```
SIGNUP FLOW:
┌──────────────────┐
│  User fills      │
│  signup form     │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  POST /auth/signup           │
│  {name, email, password}     │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Validate inputs             │
│  Check email unique          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Hash password with bcrypt   │
│  (10 salt rounds)            │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Create user document        │
│  in MongoDB                  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Generate JWT token          │
│  (expires in 7 days)         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Return token + user data    │
│  Status 201                  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Frontend saves token to     │
│  localStorage                │
└──────────────────────────────┘


LOGIN FLOW:
┌──────────────────────┐
│  User enters         │
│  email & password    │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  POST /auth/login               │
│  {email, password}              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Find user by email             │
│  in MongoDB                     │
└────────┬────────────────────────┘
         │
         ├─ User not found ──► Return 401
         │
         ▼
┌─────────────────────────────────┐
│  Compare passwords with bcrypt  │
│  (entered vs stored hash)       │
└────────┬────────────────────────┘
         │
         ├─ Passwords don't match ──► Return 401
         │
         ▼
┌─────────────────────────────────┐
│  Generate JWT token             │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Return token + user data       │
│  Status 200                     │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend saves token,          │
│  redirects to dashboard         │
└─────────────────────────────────┘
```

## Protected Route Access Flow

```
User visits /dashboard
        │
        ▼
┌─────────────────────────────┐
│ <ProtectedRoute>            │
│ component                   │
└────────┬────────────────────┘
         │
         ├─ Is loading? ──────► Show <Loader/>
         │
         ├─ No token? ────────► Redirect to /login
         │
         └─ Has token? ───────► Render <Dashboard/>
```

## Task Status Flow

```
Creation
   │
   ▼
┌─────────┐
│  TODO   │  Initial status
└────┬────┘
     │ (Admin or Assignee updates)
     ▼
┌──────────────┐
│ IN-PROGRESS  │  Task being worked on
└────┬─────────┘
     │ (Admin or Assignee updates)
     ▼
┌──────────┐
│   DONE   │  Task completed
└──────────┘
```

## Error Handling Flow

```
API Request
    │
    ├─ Network error ──────────► Catch in try-catch
    │
    ├─ 400 Bad Request ────────► Show error message to user
    │
    ├─ 401 Unauthorized ───────► Clear token, redirect to login
    │
    ├─ 403 Forbidden ──────────► Show "not authorized" message
    │
    ├─ 404 Not Found ──────────► Show "resource not found" message
    │
    └─ 500 Server Error ───────► Show "server error" message
```

## File Upload Structure (Future Feature)

```
Task {
  ...existing fields...
  attachments: [
    {
      _id: ObjectId
      filename: String
      url: String (S3/Cloudinary URL)
      uploadedAt: Date
      uploadedBy: ObjectId (User)
    }
  ]
}
```

## Scaling Considerations

### For 10,000+ Users:
1. **Add Redis** - Cache frequently accessed data
2. **Database Sharding** - Distribute data across multiple servers
3. **CDN** - Serve static assets from CDN
4. **Load Balancer** - Distribute traffic across servers
5. **Message Queue** - Async tasks with Bull/RabbitMQ
6. **Microservices** - Split into independent services

### Caching Strategy:
```
User Token → Redis Cache → 24 hours
Project List → Redis Cache → 1 hour
Task Stats → Redis Cache → 30 minutes
```

---

This visual guide helps understand the complete flow and structure of the application!
