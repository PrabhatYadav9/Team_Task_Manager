# Team Task Manager - Postman Collection

This is a complete Postman collection for testing all API endpoints.

## Setup Instructions

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Import the collection by copying the JSON below
3. Create a new environment and add these variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be set automatically after login)
   - `admin_email`: `admin@example.com`
   - `admin_password`: `password123`
   - `project_id`: (copy actual ID from project creation response)
   - `task_id`: (copy actual ID from task creation response)

## Postman Collection JSON

```json
{
  "info": {
    "name": "Team Task Manager API",
    "description": "Complete API collection for Team Task Manager",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{token}}",
        "type": "string"
      }
    ]
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Signup",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    pm.environment.set('token', pm.response.json().token);",
                  "    pm.environment.set('user_id', pm.response.json().user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\",\n  \"role\": \"Admin\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/signup",
              "host": ["{{base_url}}"],
              "path": ["auth", "signup"]
            }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    pm.environment.set('token', pm.response.json().token);",
                  "    pm.environment.set('user_id', pm.response.json().user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/auth/me",
              "host": ["{{base_url}}"],
              "path": ["auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Projects",
      "item": [
        {
          "name": "Create Project",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    pm.environment.set('project_id', pm.response.json().data._id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Website Redesign\",\n  \"description\": \"Complete redesign of company website\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/projects",
              "host": ["{{base_url}}"],
              "path": ["projects"]
            }
          }
        },
        {
          "name": "Get All Projects",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/projects",
              "host": ["{{base_url}}"],
              "path": ["projects"]
            }
          }
        },
        {
          "name": "Get Single Project",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/projects/{{project_id}}",
              "host": ["{{base_url}}"],
              "path": ["projects", "{{project_id}}"]
            }
          }
        },
        {
          "name": "Update Project",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Website Redesign - Updated\",\n  \"description\": \"Updated description\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/projects/{{project_id}}",
              "host": ["{{base_url}}"],
              "path": ["projects", "{{project_id}}"]
            }
          }
        },
        {
          "name": "Add Member to Project",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"memberId\": \"user_id_here\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/projects/{{project_id}}/members",
              "host": ["{{base_url}}"],
              "path": ["projects", "{{project_id}}", "members"]
            }
          }
        },
        {
          "name": "Remove Member from Project",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/projects/{{project_id}}/members/member_id_here",
              "host": ["{{base_url}}"],
              "path": ["projects", "{{project_id}}", "members", "member_id_here"]
            }
          }
        },
        {
          "name": "Delete Project",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/projects/{{project_id}}",
              "host": ["{{base_url}}"],
              "path": ["projects", "{{project_id}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Create Task",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    pm.environment.set('task_id', pm.response.json().data._id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Design Homepage\",\n  \"description\": \"Create mockups for new homepage\",\n  \"projectId\": \"{{project_id}}\",\n  \"status\": \"todo\",\n  \"dueDate\": \"2024-02-15\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks",
              "host": ["{{base_url}}"],
              "path": ["tasks"]
            }
          }
        },
        {
          "name": "Get Tasks by Project",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/project/{{project_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "project", "{{project_id}}"]
            }
          }
        },
        {
          "name": "Get Tasks by Project (Filter - Todo)",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/project/{{project_id}}?status=todo",
              "host": ["{{base_url}}"],
              "path": ["tasks", "project", "{{project_id}}"],
              "query": [
                {
                  "key": "status",
                  "value": "todo"
                }
              ]
            }
          }
        },
        {
          "name": "Get Single Task",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/task/{{task_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "task", "{{task_id}}"]
            }
          }
        },
        {
          "name": "Update Task Status",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"status\": \"in-progress\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks/{{task_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "{{task_id}}"]
            }
          }
        },
        {
          "name": "Update Task (All Fields)",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Design Homepage - Updated\",\n  \"description\": \"Updated description\",\n  \"status\": \"done\",\n  \"dueDate\": \"2024-02-20\"\n}"
            },
            "url": {
              "raw": "{{base_url}}/tasks/{{task_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "{{task_id}}"]
            }
          }
        },
        {
          "name": "Delete Task",
          "request": {
            "method": "DELETE",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/{{task_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "{{task_id}}"]
            }
          }
        }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        {
          "name": "Get Dashboard Stats",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/dashboard/stats",
              "host": ["{{base_url}}"],
              "path": ["tasks", "dashboard", "stats"]
            }
          }
        },
        {
          "name": "Get Dashboard Stats (By Project)",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/tasks/dashboard/stats?projectId={{project_id}}",
              "host": ["{{base_url}}"],
              "path": ["tasks", "dashboard", "stats"],
              "query": [
                {
                  "key": "projectId",
                  "value": "{{project_id}}"
                }
              ]
            }
          }
        }
      ]
    }
  ]
}
```

## How to Use This Collection

1. **Import in Postman**: 
   - Open Postman
   - Click "Import"
   - Paste the JSON above
   - Click "Import"

2. **Setup Environment Variables**:
   - Create new environment "Team Task Manager"
   - Add variables:
     - `base_url`: `http://localhost:5000/api`
     - `token`: (empty, will be filled after login)
     - `project_id`: (empty, will be filled after project creation)
     - `task_id`: (empty, will be filled after task creation)

3. **Test Workflow**:
   - Run "Signup" or "Login" first
   - Token will be automatically saved
   - Create a project
   - Project ID will be automatically saved
   - Create tasks, update them, etc.

4. **Tips**:
   - All requests use `{{token}}` which is automatically set after authentication
   - Project and Task IDs are automatically extracted and saved
   - You can view environment variables by clicking the eye icon

## Demo Data for Testing

Create test users:
```
Admin User:
Email: admin@example.com
Password: password123
Role: Admin

Member User:
Email: member@example.com
Password: password123
Role: Member
```

