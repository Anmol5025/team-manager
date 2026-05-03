# TeamTask - Full Stack Task Management Application

A modern, full-stack task management application built with Next.js 15, featuring a unified codebase for both frontend and backend.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **UI Components**: Lucide React icons
- **Date Handling**: date-fns

## Features

### Authentication & Authorization
- Secure user authentication (Signup & Login)
- JWT-based session management
- Role-Based Access Control (Admin & Member roles)

### Dashboard
- Comprehensive overview of task statistics
- Real-time task metrics (Total, Completed, Pending, Overdue)
- Responsive, premium UI design

### Project Management
- Create, view, and delete projects (Admin only)
- Assign team members to projects
- Role-specific visibility and control

### Task Management
- Create and assign tasks to team members (Admin only)
- Track task status (Todo, In Progress, Done)
- Filter tasks by status
- Due date tracking with overdue indicators
- Update task status (All users)
- Delete tasks (Admin only)

## Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskmanager-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
NEXTAUTH_SECRET=thisismysecretkey12345
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=thisismysecretkey12345
```

4. Start MongoDB (if running locally):
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Windows
net start MongoDB

# On Linux
sudo systemctl start mongod
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (backend)
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── projects/      # Project management endpoints
│   │   │   ├── tasks/         # Task management endpoints
│   │   │   └── users/         # User management endpoints
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── projects/          # Projects page
│   │   ├── tasks/             # Tasks page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page (redirects to login)
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── DashboardLayout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                   # Utility functions
│   │   ├── api.ts            # Axios instance with auth
│   │   ├── auth.ts           # JWT utilities
│   │   ├── db.ts             # MongoDB connection
│   │   └── utils.ts          # Helper functions
│   └── models/                # Mongoose models
│       ├── User.ts
│       ├── Project.ts
│       └── Task.ts
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Default User Roles

- **Admin**: Can create projects, create tasks, assign tasks, delete projects/tasks
- **Member**: Can view assigned projects and tasks, update task status

## UI Features

- Clean, modern interface with Tailwind CSS
- Responsive design for all screen sizes
- Smooth transitions and hover effects
- Loading states and error handling
- Modal dialogs for creating projects and tasks
- Status badges and filters
- Overdue task indicators

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin only)
- `DELETE /api/projects/:id` - Delete project (Admin only)
- `PUT /api/projects/:id` - Update project (Admin only)

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/dashboard` - Get task statistics
- `POST /api/tasks` - Create task (Admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin only)

### Users
- `GET /api/users` - Get all users (Admin only)

## 🚢 Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```