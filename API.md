# API Documentation

## Base URL
```
http://localhost:3001
```

## Authentication
Currently, the API does not require authentication. In production, you should implement API key or JWT authentication.

---

## Tasks Endpoints

### Get All Tasks
Retrieve all tasks from the database.

**Request:**
```
GET /tasks
```

**Response:**
```json
[
  {
    "id": "uuid-string",
    "title": "Write report",
    "description": "Prepare quarterly report",
    "priority": "high",
    "status": "in-progress",
    "category": "work",
    "dueDate": "2024-02-15",
    "aiSuggestion": null,
    "createdAt": "2024-02-04T10:30:00Z",
    "updatedAt": "2024-02-04T10:30:00Z"
  }
]
```

### Create Task
Create a new task.

**Request:**
```
POST /tasks
Content-Type: application/json

{
  "title": "Write report",
  "description": "Prepare quarterly report",
  "priority": "high",
  "status": "todo",
  "category": "work",
  "dueDate": "2024-02-15"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-string",
  "title": "Write report",
  "description": "Prepare quarterly report",
  "priority": "high",
  "status": "todo",
  "category": "work",
  "dueDate": "2024-02-15",
  "aiSuggestion": null,
  "createdAt": "2024-02-04T10:30:00Z",
  "updatedAt": "2024-02-04T10:30:00Z"
}
```

### Get Task by ID
Retrieve a specific task.

**Request:**
```
GET /tasks/:id
```

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "title": "Write report",
  ...
}
```

### Update Task
Update a task's properties.

**Request:**
```
PUT /tasks/:id
Content-Type: application/json

{
  "status": "done",
  "priority": "medium"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-string",
  "title": "Write report",
  "status": "done",
  "priority": "medium",
  ...
}
```

### Delete Task
Delete a task.

**Request:**
```
DELETE /tasks/:id
```

**Response:** `204 No Content`

---

## AI Endpoints

### AI Task Assist
Get AI-generated description and category for a task title.

**Request:**
```
POST /ai/assist
Content-Type: application/json

{
  "title": "Plan team meeting"
}
```

**Response:** `200 OK`
```json
{
  "description": "Schedule and coordinate a team meeting to discuss project progress and upcoming deadlines.",
  "category": "work"
}
```

### AI Task Suggestion
Get AI suggestion for completing a task.

**Request:**
```
POST /ai/suggestion
Content-Type: application/json

{
  "title": "Write report",
  "description": "Prepare quarterly report",
  "status": "in-progress"
}
```

**Response:** `200 OK`
```json
{
  "suggestion": "Break down the report into sections (introduction, findings, recommendations). Start with the introduction and outline key findings from the data. Aim to complete one section per day."
}
```

### AI Task Analysis
Get AI analysis of all tasks.

**Request:**
```
GET /ai/analysis
```

**Response:** `200 OK`
```json
{
  "analysis": "You have 5 active tasks with 2 high-priority items. Focus on completing the 'Write report' and 'Code review' tasks first. Consider delegating the 'Update documentation' task to free up capacity."
}
```

---

## Health Check

### Server Status
Check if the server is running.

**Request:**
```
GET /health
```

**Response:** `200 OK`
```json
{
  "status": "ok"
}
```

---

## Error Responses

### Bad Request
```json
{
  "error": "Title is required"
}
```

### Not Found
```json
{
  "error": "Task not found"
}
```

### Server Error
```json
{
  "error": "Failed to create task"
}
```

---

## Task Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | - | Unique identifier (auto-generated) |
| title | string | Yes | Task title |
| description | string | No | Task description |
| priority | enum | No | 'low', 'medium', 'high' (default: 'medium') |
| status | enum | No | 'todo', 'in-progress', 'done' (default: 'todo') |
| category | string | No | Task category (default: 'work') |
| dueDate | string (ISO 8601) | No | Due date |
| aiSuggestion | string | - | AI-generated suggestion |
| createdAt | string (ISO 8601) | - | Creation timestamp |
| updatedAt | string (ISO 8601) | - | Last update timestamp |

---

## Rate Limiting
Currently, there is no rate limiting. In production, implement rate limiting to prevent abuse.

## CORS
CORS is enabled for all origins. In production, configure specific allowed origins.

## Content Type
All API responses are in JSON format. Requests with JSON bodies must include:
```
Content-Type: application/json
```

---

## Example Client Code

### JavaScript/Fetch
```javascript
// Create a task
const response = await fetch('http://localhost:3001/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New task',
    priority: 'high'
  })
});

const task = await response.json();
console.log(task);
```

### cURL
```bash
curl -X POST http://localhost:3001/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "New task",
    "priority": "high"
  }'
```

---

## Future Enhancements
- [ ] User authentication & authorization
- [ ] WebSocket for real-time updates
- [ ] Task attachments
- [ ] Comments and collaboration
- [ ] Task templates
- [ ] Recurring tasks
- [ ] Integrations (Slack, email, calendar)
