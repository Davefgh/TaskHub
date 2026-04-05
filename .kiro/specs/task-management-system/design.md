# TaskHub Design Document

## Overview

TaskHub is a full-stack task management system built with Next.js (client) and Node.js/Express (server). The system enables users to create, manage, and collaborate on tasks organized within projects. The architecture follows a client-server model with a RESTful API, secure authentication, and real-time capabilities.

**Key Design Goals:**
- Scalable and maintainable architecture
- Secure authentication and session management
- Real-time task updates across users
- Responsive design for desktop and mobile
- Clear separation of concerns between frontend and backend

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pages: Login, Register, Dashboard, Tasks, Projects  │   │
│  │  Components: Forms, Cards, Boards, Filters           │   │
│  │  State Management: React Context / Hooks             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/WebSocket)
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway & Middleware                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CORS, Authentication, Error Handling, Logging       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Server Layer (Node.js/Express)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: Auth, Tasks, Projects, Comments, Users      │   │
│  │  Services: Business Logic Layer                       │   │
│  │  Models: Database Models & Validation                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (MongoDB)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections: Users, Tasks, Projects, Comments       │   │
│  │  Indexes: Performance optimization                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- **Framework**: Next.js 15.1.4 (React 19)
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API + Hooks
- **HTTP Client**: Fetch API / Axios
- **Real-Time**: WebSocket (Socket.io)
- **Type Safety**: TypeScript

**Backend:**
- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens) + bcrypt
- **Session Management**: HTTP-only cookies
- **Real-Time**: Socket.io
- **Validation**: Custom middleware + Mongoose schemas
- **Environment**: dotenv for configuration

**Database Choice Rationale:**
- MongoDB chosen for flexibility in task schema evolution
- Document-based model aligns with task/project hierarchies
- Horizontal scalability for future growth
- Native support for complex queries on task filters

## Database Schema

### Collections and Models

#### 1. Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  name: String (required),
  passwordHash: String (required, bcrypt hashed),
  createdAt: Date (default: now),
  updatedAt: Date (default: now),
  lastLogin: Date,
  isActive: Boolean (default: true)
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })
```

#### 2. Tasks Collection

```javascript
{
  _id: ObjectId,
  title: String (required, max 255),
  description: String (max 5000),
  status: String (enum: ["To Do", "In Progress", "Done", "Blocked"], default: "To Do"),
  priority: String (enum: ["Low", "Medium", "High", "Critical"], default: "Medium"),
  projectId: ObjectId (ref: Projects),
  assigneeId: ObjectId (ref: Users),
  createdBy: ObjectId (ref: Users, required),
  dueDate: Date,
  createdAt: Date (default: now),
  updatedAt: Date (default: now),
  comments: [ObjectId] (ref: Comments)
}

// Indexes
db.tasks.createIndex({ projectId: 1 })
db.tasks.createIndex({ assigneeId: 1 })
db.tasks.createIndex({ status: 1 })
db.tasks.createIndex({ priority: 1 })
db.tasks.createIndex({ dueDate: 1 })
db.tasks.createIndex({ createdAt: -1 })
db.tasks.createIndex({ title: "text", description: "text" })
```

#### 3. Projects Collection

```javascript
{
  _id: ObjectId,
  name: String (required, max 255),
  description: String (max 5000),
  ownerId: ObjectId (ref: Users, required),
  members: [ObjectId] (ref: Users),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}

// Indexes
db.projects.createIndex({ ownerId: 1 })
db.projects.createIndex({ createdAt: -1 })
```

#### 4. Comments Collection

```javascript
{
  _id: ObjectId,
  taskId: ObjectId (ref: Tasks, required),
  userId: ObjectId (ref: Users, required),
  content: String (required, max 2000),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}

// Indexes
db.comments.createIndex({ taskId: 1, createdAt: 1 })
db.comments.createIndex({ userId: 1 })
```

#### 5. Sessions Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users, required),
  token: String (unique, required),
  expiresAt: Date (required),
  createdAt: Date (default: now),
  isValid: Boolean (default: true)
}

// Indexes
db.sessions.createIndex({ userId: 1 })
db.sessions.createIndex({ token: 1 }, { unique: true })
db.sessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### Entity Relationships

```
Users (1) ──────────────── (Many) Tasks (as assignee)
  │                           │
  │                           ├─ (Many) Comments
  │                           └─ (1) Projects
  │
  ├─ (Many) Projects (as owner)
  │
  └─ (Many) Sessions
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

```typescript
// Request
{
  email: string (valid email format)
  password: string (min 8 characters)
  name: string (required)
}

// Response (201 Created)
{
  success: boolean
  message: string
  user: {
    id: string
    email: string
    name: string
  }
}

// Error Responses
400: Invalid email format / Password too short / Email already exists
```

#### POST /api/auth/login
Authenticate user and create session.

```typescript
// Request
{
  email: string
  password: string
}

// Response (200 OK)
{
  success: boolean
  message: string
  user: {
    id: string
    email: string
    name: string
  }
  token: string (JWT token in HTTP-only cookie)
}

// Error Responses
401: Invalid credentials
```

#### POST /api/auth/logout
Invalidate user session.

```typescript
// Response (200 OK)
{
  success: boolean
  message: string
}
```

### Task Endpoints

#### GET /api/tasks
Retrieve all tasks for authenticated user with optional filters.

```typescript
// Query Parameters
?status=To Do,In Progress
?priority=High,Critical
?assigneeId=userId
?projectId=projectId
?search=keyword
?sortBy=dueDate|priority|status|createdAt
?sortOrder=asc|desc
?page=1&limit=20

// Response (200 OK)
{
  success: boolean
  data: Task[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
```

#### POST /api/tasks
Create a new task.

```typescript
// Request
{
  title: string (required)
  description?: string
  status?: string (default: "To Do")
  priority?: string (default: "Medium")
  projectId?: string
  assigneeId?: string
  dueDate?: Date
}

// Response (201 Created)
{
  success: boolean
  data: Task
}

// Error Responses
400: Missing required fields / Invalid data format
```

#### GET /api/tasks/:id
Retrieve task details.

```typescript
// Response (200 OK)
{
  success: boolean
  data: Task (with populated comments)
}

// Error Responses
404: Task not found
```

#### PUT /api/tasks/:id
Update task information.

```typescript
// Request (any fields to update)
{
  title?: string
  description?: string
  status?: string
  priority?: string
  assigneeId?: string
  dueDate?: Date
}

// Response (200 OK)
{
  success: boolean
  data: Task
}

// Error Responses
404: Task not found
403: Unauthorized
```

#### DELETE /api/tasks/:id
Delete a task.

```typescript
// Response (200 OK)
{
  success: boolean
  message: string
}

// Error Responses
404: Task not found
403: Unauthorized
```

### Project Endpoints

#### GET /api/projects
Retrieve all projects for authenticated user.

```typescript
// Response (200 OK)
{
  success: boolean
  data: Project[]
}
```

#### POST /api/projects
Create a new project.

```typescript
// Request
{
  name: string (required)
  description?: string
}

// Response (201 Created)
{
  success: boolean
  data: Project
}
```

#### GET /api/projects/:id
Retrieve project details with tasks.

```typescript
// Response (200 OK)
{
  success: boolean
  data: Project (with tasks array)
}
```

#### PUT /api/projects/:id
Update project information.

```typescript
// Request
{
  name?: string
  description?: string
}

// Response (200 OK)
{
  success: boolean
  data: Project
}
```

#### DELETE /api/projects/:id
Delete a project.

```typescript
// Response (200 OK)
{
  success: boolean
  message: string
}
```

### Comment Endpoints

#### POST /api/tasks/:taskId/comments
Add a comment to a task.

```typescript
// Request
{
  content: string (required, max 2000)
}

// Response (201 Created)
{
  success: boolean
  data: Comment
}
```

#### GET /api/tasks/:taskId/comments
Retrieve all comments for a task.

```typescript
// Response (200 OK)
{
  success: boolean
  data: Comment[]
}
```

#### DELETE /api/comments/:id
Delete a comment.

```typescript
// Response (200 OK)
{
  success: boolean
  message: string
}
```

### User Endpoints

#### GET /api/users/profile
Retrieve authenticated user's profile.

```typescript
// Response (200 OK)
{
  success: boolean
  data: User
}
```

#### PUT /api/users/profile
Update user profile.

```typescript
// Request
{
  name?: string
  email?: string
}

// Response (200 OK)
{
  success: boolean
  data: User
}
```

#### PUT /api/users/password
Change user password.

```typescript
// Request
{
  currentPassword: string
  newPassword: string (min 8 characters)
}

// Response (200 OK)
{
  success: boolean
  message: string
}

// Error Responses
401: Current password incorrect
```

## Frontend Architecture

### Page Structure

```
src/app/
├── layout.tsx                 # Root layout with navigation
├── page.tsx                   # Home/redirect page
├── login/
│   └── page.tsx              # Login page
├── register/
│   └── page.tsx              # Registration page
├── dashboard/
│   └── page.tsx              # Dashboard overview
├── tasks/
│   ├── page.tsx              # Task list view
│   ├── board/
│   │   └── page.tsx          # Kanban board view
│   └── [id]/
│       └── page.tsx          # Task detail page
├── projects/
│   ├── page.tsx              # Projects list
│   └── [id]/
│       └── page.tsx          # Project detail page
└── profile/
    └── page.tsx              # User profile page
```

### Component Hierarchy

```
App
├── Layout
│   ├── Navigation
│   ├── Sidebar
│   └── Main Content
│
├── Auth Pages
│   ├── LoginForm
│   └── RegisterForm
│
├── Dashboard
│   ├── StatisticsCard
│   ├── RecentTasksList
│   └── QuickActionButtons
│
├── Tasks
│   ├── TaskList
│   │   ├── TaskCard
│   │   ├── FilterPanel
│   │   └── SearchBar
│   │
│   ├── TaskBoard
│   │   ├── StatusColumn
│   │   │   └── TaskCard (draggable)
│   │   └── ColumnHeader
│   │
│   └── TaskDetail
│       ├── TaskHeader
│       ├── TaskMetadata
│       ├── CommentSection
│       │   ├── CommentList
│       │   └── CommentForm
│       └── ActionButtons
│
├── Projects
│   ├── ProjectList
│   │   └── ProjectCard
│   └── ProjectDetail
│       └── ProjectTasksList
│
└── Profile
    ├── ProfileForm
    └── PasswordChangeForm
```

### State Management

Using React Context API with custom hooks:

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
}

// contexts/TaskContext.tsx
interface TaskContextType {
  tasks: Task[]
  filters: TaskFilters
  setFilters: (filters: TaskFilters) => void
  createTask: (task: TaskInput) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  fetchTasks: () => Promise<void>
}

// contexts/ProjectContext.tsx
interface ProjectContextType {
  projects: Project[]
  createProject: (project: ProjectInput) => Promise<void>
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  fetchProjects: () => Promise<void>
}
```

### Routing Structure

```typescript
// app/layout.tsx - Root layout with auth check
// Middleware to protect routes

// Protected routes require valid session token
// Public routes: /login, /register
// Protected routes: /dashboard, /tasks, /projects, /profile
```

## Backend Architecture

### Middleware Stack

```typescript
// middleware/cors.ts
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// middleware/auth.ts
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
}

// middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  })
}

// middleware/validation.ts
export const validateInput = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.details[0].message })
  req.validatedData = value
  next()
}
```

### Service Layer Structure

```typescript
// services/AuthService.ts
class AuthService {
  async register(email: string, password: string, name: string): Promise<User>
  async login(email: string, password: string): Promise<{ user: User, token: string }>
  async validatePassword(plainPassword: string, hash: string): Promise<boolean>
  async hashPassword(password: string): Promise<string>
}

// services/TaskService.ts
class TaskService {
  async createTask(userId: string, taskData: TaskInput): Promise<Task>
  async getTasksByUser(userId: string, filters: TaskFilters): Promise<Task[]>
  async getTaskById(taskId: string): Promise<Task>
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task>
  async deleteTask(taskId: string): Promise<void>
  async searchTasks(userId: string, query: string): Promise<Task[]>
}

// services/ProjectService.ts
class ProjectService {
  async createProject(userId: string, projectData: ProjectInput): Promise<Project>
  async getProjectsByUser(userId: string): Promise<Project[]>
  async getProjectById(projectId: string): Promise<Project>
  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project>
  async deleteProject(projectId: string): Promise<void>
}

// services/CommentService.ts
class CommentService {
  async addComment(taskId: string, userId: string, content: string): Promise<Comment>
  async getCommentsByTask(taskId: string): Promise<Comment[]>
  async deleteComment(commentId: string): Promise<void>
}
```

### Database Models

```typescript
// models/User.ts
interface User {
  _id: ObjectId
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
}

// models/Task.ts
interface Task {
  _id: ObjectId
  title: string
  description?: string
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  projectId?: ObjectId
  assigneeId?: ObjectId
  createdBy: ObjectId
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  comments: ObjectId[]
}

// models/Project.ts
interface Project {
  _id: ObjectId
  name: string
  description?: string
  ownerId: ObjectId
  members: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// models/Comment.ts
interface Comment {
  _id: ObjectId
  taskId: ObjectId
  userId: ObjectId
  content: string
  createdAt: Date
  updatedAt: Date
}
```

### Validation and Error Handling

```typescript
// validation/schemas.ts
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().required()
})

const taskSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(5000),
  status: Joi.string().valid('To Do', 'In Progress', 'Done', 'Blocked'),
  priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical'),
  dueDate: Joi.date(),
  assigneeId: Joi.string()
})

// errors/AppError.ts
class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404)
  }
}
```

## Security Considerations

### Password Security

```typescript
// Password hashing with bcrypt
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Never log or store plain text passwords
```

### Session and JWT Management

```typescript
// JWT token generation
import jwt from 'jsonwebtoken'

export function generateToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

// HTTP-only cookie configuration
res.cookie('token', token, {
  httpOnly: true,           // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'strict',       // CSRF protection
  maxAge: 24 * 60 * 60 * 1000  // 24 hours
})
```

### CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600
}

app.use(cors(corsOptions))
```

### Input Validation

```typescript
// Validate all user inputs
// Use Joi or similar validation library
// Sanitize inputs to prevent injection attacks
// Validate email format, password strength, etc.

// Example: Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
  throw new ValidationError('Invalid email format')
}

// Example: Password validation
if (password.length < 8) {
  throw new ValidationError('Password must be at least 8 characters')
}
```

### Authorization

```typescript
// Verify user owns resource before allowing modifications
export async function authorizeTaskOwner(taskId: string, userId: string) {
  const task = await Task.findById(taskId)
  if (!task || task.createdBy.toString() !== userId) {
    throw new UnauthorizedError('You do not have permission to modify this task')
  }
}

// Similar checks for projects, comments, etc.
```

## Real-Time Updates

### WebSocket Implementation with Socket.io

```typescript
// server/socket.ts
import { Server } from 'socket.io'

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

// Authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    socket.userId = decoded.userId
    next()
  } catch (error) {
    next(new Error('Authentication error'))
  }
})

// Handle connections
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`)
  
  // Join user-specific room
  socket.join(`user:${socket.userId}`)
  
  // Listen for task updates
  socket.on('task:update', (taskData) => {
    // Broadcast to all users viewing this task
    io.to(`task:${taskData.id}`).emit('task:updated', taskData)
  })
  
  // Listen for comment additions
  socket.on('comment:add', (commentData) => {
    io.to(`task:${commentData.taskId}`).emit('comment:added', commentData)
  })
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`)
  })
})

// Emit events from API routes
export function emitTaskUpdate(taskId: string, taskData: Task) {
  io.to(`task:${taskId}`).emit('task:updated', taskData)
}

export function emitCommentAdded(taskId: string, comment: Comment) {
  io.to(`task:${taskId}`).emit('comment:added', comment)
}
```

### Client-Side Socket Integration

```typescript
// hooks/useSocket.ts
import { useEffect, useRef } from 'react'
import io from 'socket.io-client'

export function useSocket(token: string) {
  const socketRef = useRef(null)
  
  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: { token }
    })
    
    return () => {
      socketRef.current?.disconnect()
    }
  }, [token])
  
  return socketRef.current
}

// Usage in components
function TaskDetail({ taskId }) {
  const socket = useSocket(authToken)
  const [task, setTask] = useState(null)
  
  useEffect(() => {
    socket?.on('task:updated', (updatedTask) => {
      if (updatedTask.id === taskId) {
        setTask(updatedTask)
      }
    })
    
    return () => {
      socket?.off('task:updated')
    }
  }, [socket, taskId])
}
```

## Data Flow Diagrams

### Authentication Flow

```
User Input (Email, Password)
         ↓
   Validation
         ↓
   Hash Password (bcrypt)
         ↓
   Query Database
         ↓
   Compare Hashes
         ↓
   Generate JWT Token
         ↓
   Set HTTP-only Cookie
         ↓
   Return User Data + Token
         ↓
   Store in Context
         ↓
   Redirect to Dashboard
```

### Task Creation Flow

```
User Submits Form
         ↓
   Client Validation
         ↓
   POST /api/tasks
         ↓
   Server Validation
         ↓
   Create Task Document
         ↓
   Save to Database
         ↓
   Emit WebSocket Event
         ↓
   Return Task Data
         ↓
   Update Local State
         ↓
   Broadcast to Other Users
         ↓
   Update UI
```

### Task Update Flow

```
User Modifies Task
         ↓
   Client Validation
         ↓
   PUT /api/tasks/:id
         ↓
   Server Validation
         ↓
   Authorize User
         ↓
   Update Database
         ↓
   Emit WebSocket Event
         ↓
   Return Updated Task
         ↓
   Update Local State
         ↓
   Broadcast to Other Users
         ↓
   Update UI
```

## Error Handling Strategy

### Client-Side Error Handling

```typescript
// utils/errorHandler.ts
export function handleApiError(error: any): string {
  if (error.response?.status === 401) {
    return 'Session expired. Please log in again.'
  }
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.'
  }
  if (error.response?.status === 404) {
    return 'Resource not found.'
  }
  if (error.response?.status === 400) {
    return error.response.data.message || 'Invalid input. Please check your data.'
  }
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.'
  }
  if (error.message === 'Network Error') {
    return 'Network connection failed. Please check your internet.'
  }
  return 'An unexpected error occurred.'
}

// Usage in components
try {
  await createTask(taskData)
} catch (error) {
  const message = handleApiError(error)
  showErrorNotification(message)
}
```

### Server-Side Error Handling

```typescript
// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err)
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  
  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      success: false,
      message: err.message
    })
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: err.message
    })
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})
```

## Testing Strategy

### Unit Tests
- Service layer functions (task creation, filtering, etc.)
- Validation functions
- Utility functions
- Authentication logic

### Integration Tests
- API endpoint tests with database
- Authentication flow
- Task CRUD operations
- Filter and search functionality

### End-to-End Tests
- Complete user workflows (register → login → create task → view board)
- Real-time updates
- Error scenarios

### Test Tools
- Backend: Jest, Supertest
- Frontend: Vitest, React Testing Library
- E2E: Cypress or Playwright



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Valid Registration Creates Account

*For any* valid email and password combination, submitting a registration form SHALL result in a new user account being created in the database.

**Validates: Requirements 1.2**

### Property 2: Duplicate Email Registration Rejected

*For any* email that already exists in the system, attempting to register with that email SHALL result in an error response and no new account creation.

**Validates: Requirements 1.3**

### Property 3: Invalid Email Format Rejected

*For any* string that does not match valid email format, submitting a registration form with that email SHALL result in an error response.

**Validates: Requirements 1.4**

### Property 4: Password Length Validation

*For any* password string shorter than 8 characters, submitting a registration form with that password SHALL result in an error response.

**Validates: Requirements 1.5**

### Property 5: Password Hashing on Registration

*For any* user registration, the password stored in the database SHALL be a bcrypt hash and SHALL NOT be the plain text password.

**Validates: Requirements 1.7**

### Property 6: Valid Login Creates Session

*For any* user with valid credentials, submitting a login form with correct email and password SHALL result in a session token being created and returned.

**Validates: Requirements 2.2**

### Property 7: Non-Existent Email Login Fails

*For any* email that does not exist in the system, attempting to login with that email SHALL result in an error response.

**Validates: Requirements 2.3**

### Property 8: Incorrect Password Login Fails

*For any* user, attempting to login with an incorrect password SHALL result in an error response.

**Validates: Requirements 2.4**

### Property 9: Session Token Stored in Cookie

*For any* successful login, the response SHALL include a session token stored in an HTTP-only cookie.

**Validates: Requirements 2.5**

### Property 10: Session Expiration After 24 Hours

*For any* session token, if 24 hours of inactivity have passed, the token SHALL be invalid and require re-authentication.

**Validates: Requirements 2.6**

### Property 11: Unique Session Tokens

*For any* user, each login attempt SHALL generate a unique session token that differs from all previous tokens.

**Validates: Requirements 3.1**

### Property 12: Protected Pages Require Valid Session

*For any* protected endpoint accessed without a valid session token, the request SHALL be rejected with an unauthorized response.

**Validates: Requirements 3.2**

### Property 13: Logout Invalidates Session

*For any* user with an active session, after logout, that session token SHALL no longer be valid for API requests.

**Validates: Requirements 3.3**

### Property 14: Expired Sessions Require Re-authentication

*For any* expired session token, attempting to use it for API requests SHALL result in an unauthorized response.

**Validates: Requirements 3.4**

### Property 15: Session Token Included in Requests

*For any* authenticated API request, the session token SHALL be present in either the request headers or cookies.

**Validates: Requirements 3.5**

### Property 16: Dashboard Task Count Accuracy

*For any* user, the total task count displayed on the dashboard SHALL equal the number of tasks assigned to that user in the database.

**Validates: Requirements 4.1**

### Property 17: Dashboard Status Breakdown Accuracy

*For any* user, the count of tasks in each status displayed on the dashboard SHALL match the actual count of tasks with that status in the database.

**Validates: Requirements 4.2**

### Property 18: Dashboard Priority Breakdown Accuracy

*For any* user, the count of tasks at each priority level displayed on the dashboard SHALL match the actual count of tasks with that priority in the database.

**Validates: Requirements 4.3**

### Property 19: Dashboard Recent Tasks Accuracy

*For any* user with more than 5 tasks, the dashboard SHALL display exactly the 5 most recently created tasks.

**Validates: Requirements 4.4**

### Property 20: Task Creation with Title

*For any* task submission with a non-empty title, a new task SHALL be created in the database with the provided information.

**Validates: Requirements 5.2**

### Property 21: Task Creation Requires Title

*For any* task submission without a title, the request SHALL be rejected with a validation error.

**Validates: Requirements 5.3**

### Property 22: Default Task Status

*For any* task created without an explicit status, the task SHALL have a default status of "To Do".

**Validates: Requirements 5.4**

### Property 23: Default Task Priority

*For any* task created without an explicit priority, the task SHALL have a default priority of "Medium".

**Validates: Requirements 5.5**

### Property 24: Default Task Assignment

*For any* task created by a user, the task SHALL be assigned to that user by default.

**Validates: Requirements 5.6**

### Property 25: Task List Retrieval

*For any* user, retrieving the task list SHALL return all tasks assigned to that user.

**Validates: Requirements 6.1**

### Property 26: Task List Display Fields

*For any* task displayed in the task list, the response SHALL include title, status, priority, and due date fields.

**Validates: Requirements 6.2**

### Property 27: Default Task Sorting

*For any* task list retrieved without explicit sort parameters, tasks SHALL be sorted by due date in ascending order.

**Validates: Requirements 6.3**

### Property 28: Task List Count Accuracy

*For any* user, the total task count displayed SHALL equal the number of tasks returned in the task list.

**Validates: Requirements 6.5**

### Property 29: Task Board Status Organization

*For any* task board view, tasks SHALL be organized into columns corresponding to their status (To Do, In Progress, Done, Blocked).

**Validates: Requirements 7.2**

### Property 30: Task Board Status Update

*For any* task moved to a different status column, the task's status in the database SHALL be updated to match the new column.

**Validates: Requirements 7.3**

### Property 31: Task Board Column Counts

*For any* task board view, the count displayed for each column SHALL equal the number of tasks in that status.

**Validates: Requirements 7.4**

### Property 32: Task Detail Display

*For any* task detail page, the response SHALL include title, description, status, priority, and due date.

**Validates: Requirements 8.1**

### Property 33: Task Detail Assignee Display

*For any* task with an assigned user, the task detail page SHALL display the assignee information.

**Validates: Requirements 8.2**

### Property 34: Task Detail Comments Display

*For any* task with comments, the task detail page SHALL display all comments associated with that task.

**Validates: Requirements 8.3**

### Property 35: Task Detail Timestamps Display

*For any* task detail page, the response SHALL include creation date and last modified date.

**Validates: Requirements 8.4**

### Property 36: Task Update Persistence

*For any* task update request with valid data, the task in the database SHALL be updated with the new information.

**Validates: Requirements 9.2**

### Property 37: Task Status Update

*For any* task status change, the task's status in the database SHALL be updated immediately.

**Validates: Requirements 9.3**

### Property 38: Task Priority Update

*For any* task priority change, the task's priority in the database SHALL be updated immediately.

**Validates: Requirements 9.4**

### Property 39: Task Due Date Update

*For any* task due date change, the task's due date in the database SHALL be updated immediately.

**Validates: Requirements 9.5**

### Property 40: Task Deletion

*For any* task deletion request, the task SHALL be removed from the database and no longer appear in task lists.

**Validates: Requirements 10.2**

### Property 41: Deletion Cancellation

*For any* task deletion that is cancelled, the task SHALL remain in the database unchanged.

**Validates: Requirements 10.3**

### Property 42: Deleted Task Removal from Views

*For any* deleted task, it SHALL not appear in any task list or view for any user.

**Validates: Requirements 10.4**

### Property 43: Task Assignment Update

*For any* task assignment change, the task SHALL be assigned to the new assignee in the database.

**Validates: Requirements 11.2**

### Property 44: Assigned Task Appears in Assignee List

*For any* task assigned to a user, that task SHALL appear in the assigned user's task list.

**Validates: Requirements 11.3**

### Property 45: Task Reassignment

*For any* task reassigned from one user to another, the task SHALL be removed from the previous assignee's list and added to the new assignee's list.

**Validates: Requirements 11.4**

### Property 46: Priority Persistence

*For any* priority level set on a task, the task in the database SHALL have that priority saved.

**Validates: Requirements 12.2**

### Property 47: Priority Display in List

*For any* task in the task list, the priority level SHALL be displayed.

**Validates: Requirements 12.3**

### Property 48: Priority Display on Board

*For any* task card on the task board, the priority level SHALL be displayed.

**Validates: Requirements 12.4**

### Property 49: Status Persistence

*For any* status set on a task, the task in the database SHALL have that status saved.

**Validates: Requirements 13.2**

### Property 50: Status-Based Board Organization

*For any* task board, tasks SHALL be organized into columns by their status.

**Validates: Requirements 13.3**

### Property 51: Immediate Status Update

*For any* task status change, the update SHALL be reflected in the database immediately.

**Validates: Requirements 13.4**

### Property 52: Due Date Persistence

*For any* due date set on a task, the task in the database SHALL have that due date saved.

**Validates: Requirements 14.2**

### Property 53: Due Date Display in List

*For any* task in the task list, the due date SHALL be displayed.

**Validates: Requirements 14.3**

### Property 54: Overdue Task Highlighting

*For any* task with a due date today or in the past, the task SHALL be highlighted in red.

**Validates: Requirements 14.4**

### Property 55: Upcoming Task Highlighting

*For any* task with a due date within 3 days, the task SHALL be highlighted in yellow.

**Validates: Requirements 14.5**

### Property 56: Comment Creation

*For any* comment submitted on a task, the comment SHALL be saved to the database with the user's name and timestamp.

**Validates: Requirements 15.2**

### Property 57: Comment Chronological Order

*For any* task with multiple comments, the comments SHALL be displayed in chronological order (oldest first).

**Validates: Requirements 15.3**

### Property 58: Real-Time Comment Display

*For any* comment added to a task, the comment SHALL appear immediately on the task detail page.

**Validates: Requirements 15.4**

### Property 59: Status Filter Accuracy

*For any* status filter applied to the task list, only tasks with the selected status SHALL be displayed.

**Validates: Requirements 16.2**

### Property 60: Status Filter Clearing

*For any* status filter that is cleared, all tasks SHALL be displayed again.

**Validates: Requirements 16.3**

### Property 61: Priority Filter Accuracy

*For any* priority filter applied to the task list, only tasks with the selected priority SHALL be displayed.

**Validates: Requirements 17.2**

### Property 62: Priority Filter Clearing

*For any* priority filter that is cleared, all tasks SHALL be displayed again.

**Validates: Requirements 17.3**

### Property 63: Assignee Filter Accuracy

*For any* assignee filter applied to the task list, only tasks assigned to the selected users SHALL be displayed.

**Validates: Requirements 18.2**

### Property 64: Assignee Filter Clearing

*For any* assignee filter that is cleared, all tasks SHALL be displayed again.

**Validates: Requirements 18.3**

### Property 65: Search Accuracy

*For any* search term entered, only tasks with matching title or description SHALL be displayed.

**Validates: Requirements 19.2**

### Property 66: Search Clearing

*For any* search that is cleared, all tasks SHALL be displayed again.

**Validates: Requirements 19.3**

### Property 67: Real-Time Search

*For any* search term entered, results SHALL be updated in real-time as the user types.

**Validates: Requirements 19.4**

### Property 68: Task Sorting Accuracy

*For any* sort option selected, tasks SHALL be reordered according to the selected criteria (Due Date, Priority, Status, Created Date).

**Validates: Requirements 20.2**

### Property 69: Task Project Assignment

*For any* task assigned to a project, the task SHALL be associated with that project in the database.

**Validates: Requirements 21.1**

### Property 70: Project List Retrieval

*For any* user, retrieving the projects list SHALL return all projects owned or accessible to that user.

**Validates: Requirements 21.2**

### Property 71: Project Task Filtering

*For any* project, clicking on it SHALL display all tasks associated with that project.

**Validates: Requirements 21.3**

### Property 72: Project Creation

*For any* project creation request with a name, a new project SHALL be created in the database with that name.

**Validates: Requirements 21.4**

### Property 73: Profile Update

*For any* profile update request with valid data, the user's profile in the database SHALL be updated with the new information.

**Validates: Requirements 24.2**

### Property 74: Password Change Hashing

*For any* password change, the new password SHALL be hashed using bcrypt before being stored in the database.

**Validates: Requirements 24.4**

### Property 75: Real-Time Task Update Notification

*For any* task updated by another user, users viewing that task SHALL be notified of the change.

**Validates: Requirements 25.1**

### Property 76: Real-Time Task Refresh

*For any* task updated, the task information on all users' screens viewing that task SHALL be refreshed with the new data.

**Validates: Requirements 25.2**

### Property 77: Real-Time Comment Display

*For any* comment added to a task, the comment SHALL appear immediately on all users' screens viewing that task.

**Validates: Requirements 25.3**

### Property 78: Missing Required Fields Error

*For any* form submission with missing required fields, an error message SHALL be displayed indicating which fields are required.

**Validates: Requirements 26.1**

### Property 79: Invalid Data Format Error

*For any* form submission with invalid data format, an error message SHALL be displayed indicating the correct format.

**Validates: Requirements 26.2**

### Property 80: Unauthorized Action Error

*For any* action attempted without proper permissions, an error message SHALL be displayed indicating insufficient permissions.

**Validates: Requirements 26.3**

### Property 81: Server Error Display

*For any* server error response, a user-friendly error message SHALL be displayed to the user.

**Validates: Requirements 27.1**

### Property 82: Network Error Display

*For any* network request failure, a message SHALL be displayed indicating the connection issue.

**Validates: Requirements 27.2**

### Property 83: Server Unavailability Display

*For any* server unavailability, a message SHALL be displayed indicating the service is temporarily unavailable.

**Validates: Requirements 27.3**

### Property 84: Task Creation Persistence

*For any* task created, the task SHALL be saved to the database and retrievable after creation.

**Validates: Requirements 28.1**

### Property 85: Task Update Persistence

*For any* task update, the changes SHALL be saved to the database and retrievable after update.

**Validates: Requirements 28.2**

### Property 86: Task Deletion Persistence

*For any* task deleted, the task SHALL be removed from the database and no longer retrievable.

**Validates: Requirements 28.3**

### Property 87: Data Retrieval After Re-authentication

*For any* user who logs out and logs back in, all their tasks SHALL be retrieved from the database.

**Validates: Requirements 28.4**

### Property 88: Profile Update Persistence

*For any* profile update, the changes SHALL be saved to the database and retrievable after update.

**Validates: Requirements 24.2**

### Property 89: Bcrypt Salt Factor

*For any* password hashed during registration or password change, the bcrypt salt factor SHALL be at least 10.

**Validates: Requirements 30.1**

### Property 90: Password Comparison

*For any* login attempt, the provided password SHALL be compared against the stored bcrypt hash.

**Validates: Requirements 30.2**

### Property 91: Plain Text Password Not Stored

*For any* user registration or password change, the plain text password SHALL NOT be stored in the database or logs.

**Validates: Requirements 30.3**

