# Team Task Manager - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except auth endpoints) require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Member"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

## 📋 Project Endpoints

### 1. Create Project
**POST** `/projects`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Website Redesign",
  "description": "Complete redesign of company website",
  "members": ["507f1f77bcf86cd799439012"]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "members": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com"
      }
    ],
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### 2. Get All Projects
**GET** `/projects`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Website Redesign",
      "description": "Complete redesign of company website",
      "owner": {...},
      "members": [...],
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

### 3. Get Single Project
**GET** `/projects/:projectId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": {...},
    "members": [...],
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### 4. Update Project
**PUT** `/projects/:projectId`

**Request Body:**
```json
{
  "name": "Website Redesign v2",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {...}
}
```

---

### 5. Delete Project
**DELETE** `/projects/:projectId`

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

### 6. Add Member to Project
**POST** `/projects/:projectId/members`

**Request Body:**
```json
{
  "memberId": "507f1f77bcf86cd799439014"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Member added successfully",
  "data": {...}
}
```

---

### 7. Remove Member from Project
**DELETE** `/projects/:projectId/members/:memberId`

**Response (200):**
```json
{
  "success": true,
  "message": "Member removed successfully",
  "data": {...}
}
```

---

## ✅ Task Endpoints

### 1. Create Task
**POST** `/tasks`

**Request Body:**
```json
{
  "title": "Design Homepage",
  "description": "Create mockups for new homepage",
  "projectId": "507f1f77bcf86cd799439013",
  "assignedTo": "507f1f77bcf86cd799439012",
  "status": "todo",
  "dueDate": "2024-02-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "projectId": "507f1f77bcf86cd799439013",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "status": "todo",
    "dueDate": "2024-02-15T00:00:00Z",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### 2. Get Tasks by Project
**GET** `/tasks/project/:projectId`

**Query Parameters:**
- `status` (optional): `todo`, `in-progress`, or `done`

**Example:** `/tasks/project/507f1f77bcf86cd799439013?status=todo`

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "title": "Design Homepage",
      "description": "Create mockups for new homepage",
      "projectId": "507f1f77bcf86cd799439013",
      "assignedTo": {...},
      "status": "todo",
      "dueDate": "2024-02-15T00:00:00Z",
      "createdBy": {...},
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

### 3. Get Single Task
**GET** `/tasks/task/:taskId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "projectId": {...},
    "assignedTo": {...},
    "status": "todo",
    "dueDate": "2024-02-15T00:00:00Z",
    "createdBy": {...},
    "createdAt": "2024-01-01T12:00:00Z"
  }
}
```

---

### 4. Update Task
**PUT** `/tasks/:taskId`

**Request Body:**
```json
{
  "status": "in-progress",
  "title": "Design Homepage - Updated",
  "dueDate": "2024-02-20"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {...}
}
```

---

### 5. Delete Task
**DELETE** `/tasks/:taskId`

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 6. Get Dashboard Statistics
**GET** `/tasks/dashboard/stats`

**Query Parameters:**
- `projectId` (optional): Filter stats by project

**Example:** `/tasks/dashboard/stats?projectId=507f1f77bcf86cd799439013`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalTasks": 10,
    "todoTasks": 5,
    "inProgressTasks": 3,
    "doneTasks": 2,
    "overdueTasks": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "title": "Design Homepage",
        "assignedTo": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Jane Smith"
        },
        "projectId": {
          "_id": "507f1f77bcf86cd799439013",
          "title": "Website Redesign"
        },
        "dueDate": "2024-01-15T00:00:00Z",
        "status": "todo"
      }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'Member' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## 📝 Complete cURL Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete redesign of company website"
  }'
```

### Get All Projects
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer <your_token>"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "Design Homepage",
    "description": "Create mockups for new homepage",
    "projectId": "507f1f77bcf86cd799439013",
    "assignedTo": "507f1f77bcf86cd799439012",
    "dueDate": "2024-02-15"
  }'
```

### Get Tasks by Project
```bash
curl -X GET "http://localhost:5000/api/tasks/project/507f1f77bcf86cd799439013?status=todo" \
  -H "Authorization: Bearer <your_token>"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/507f1f77bcf86cd799439015 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "status": "in-progress"
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/tasks/dashboard/stats \
  -H "Authorization: Bearer <your_token>"
```

---

## 🔄 Typical User Flow

1. **User Signup**
   - POST `/auth/signup` → Get JWT token
   
2. **View Projects**
   - GET `/projects` → List all projects
   
3. **Admin Creates Project**
   - POST `/projects` → Create new project
   
4. **Admin Adds Members**
   - POST `/projects/:id/members` → Add team members
   
5. **Admin Creates Task**
   - POST `/tasks` → Create task and assign to member
   
6. **Member Views Tasks**
   - GET `/tasks/project/:projectId` → View project tasks
   
7. **Member Updates Task Status**
   - PUT `/tasks/:id` → Change status (todo → in-progress → done)
   
8. **View Dashboard**
   - GET `/tasks/dashboard/stats` → See overall statistics

---

## ⚠️ Important Notes

- All dates should be in ISO 8601 format (YYYY-MM-DD or full timestamp)
- Status values: `todo`, `in-progress`, `done`
- Role values: `Admin`, `Member`
- JWT token expires after 7 days by default
- All responses follow the same format with `success` and `data`/`message` fields
- Passwords must be at least 6 characters
- Emails must be unique and valid

