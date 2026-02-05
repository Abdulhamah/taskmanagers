# TaskMaster AI - Smart Task Management Application

A full-stack task management web application with AI-powered features. Organize your tasks, get intelligent suggestions, and boost your productivity.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v20+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)

## Features

✨ **Core Features**
- Create, read, update, and delete tasks
- Organize tasks by status (To Do, In Progress, Done)
- Categorize tasks (Work, Personal, Shopping, Health, Other)
- Set task priorities (Low, Medium, High)
- Due date management
- Filter and sort tasks

🤖 **AI-Powered Features**
- **AI Task Assistant**: Automatically generate descriptions and categorize tasks based on the title
- **Smart Suggestions**: Get AI-powered suggestions to help complete your tasks
- **Task Analysis**: AI analyzes your task list and provides productivity insights

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern styling
- **Lucide React** for beautiful icons
- **date-fns** for date formatting

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **SQLite** for lightweight data persistence
- **Claude API** (via Anthropic) for AI features
- **CORS** for cross-origin requests

## Project Structure

```
TaskMaster AI/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # React Context for state management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
├── backend/                   # Express backend server
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── ai/               # AI integration
│   │   ├── db/               # Database setup
│   │   └── index.ts          # Server entry point
│   ├── tsconfig.json
│   └── package.json
├── package.json              # Root package for monorepo
└── .gitignore
```

## Installation

### Prerequisites
- Node.js v20+ 
- npm v10+
- OpenAI API key

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/taskmaster-ai.git
cd taskmaster-ai
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Configure environment variables**

Create a `.env` file in the backend directory:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk_your_key_here
PORT=3001
```

4. **Initialize the database**
```bash
npm run db:init --workspace=backend
```

## Running the Application

### Development Mode

Start both frontend and backend in development mode:

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:3001`
- Start the frontend dev server on `http://localhost:5173`

Visit `http://localhost:5173` in your browser to use the application.

### Production Build

Build both frontend and backend:

```bash
npm run build
```

Start the production server:

```bash
npm start --workspace=backend
```

## API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### AI Routes
- `POST /ai/assist` - Get AI assistance for task description and category
- `POST /ai/suggestion` - Get AI suggestion for completing a task
- `GET /ai/analysis` - Get AI analysis of all tasks

## Task Management Features

### Task Properties
```typescript
{
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  dueDate?: string;
  aiSuggestion?: string;
  createdAt: string;
  updatedAt: string;
}
```

## AI Features Usage

### AI Task Assistant
1. Click "New Task"
2. Enter a task title
3. Click "AI Assist" button
4. The AI will auto-fill description and suggest a category

### Smart Suggestions
1. Click the lightbulb icon on any task card
2. The AI will provide actionable suggestions
3. Use the suggestions to improve task completion

### Task Analysis
The AI can analyze your entire task list and provide insights about:
- Task distribution by priority
- Productivity patterns
- Recommended focus areas

## Development

### Project Scripts

```bash
# Development
npm run dev                           # Start both frontend and backend
npm run dev --workspace=frontend      # Start only frontend
npm run dev --workspace=backend       # Start only backend

# Building
npm run build                         # Build both
npm run build --workspace=frontend    # Build only frontend
npm run build --workspace=backend     # Build only backend

# Database
npm run db:init --workspace=backend   # Initialize database
```

### Code Style
- TypeScript with strict mode enabled
- ESLint for code quality
- Consistent formatting with Prettier

## Database Schema

### Tasks Table
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  dueDate TEXT,
  category TEXT NOT NULL DEFAULT 'work',
  aiSuggestion TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

Indexes for performance:
- `idx_status` on status column
- `idx_category` on category column
- `idx_priority` on priority column

## Deployment

### Deploy to Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Deploy to Heroku (Backend)
```bash
heroku login
heroku create your-app-name
git push heroku main
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@taskmaster.ai or open an issue on GitHub.

## Roadmap

- [ ] User authentication and accounts
- [ ] Shared task lists and collaboration
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Task reminders and notifications
- [ ] Advanced analytics dashboard
- [ ] Integration with calendar apps
- [ ] Dark mode support

## Acknowledgments

- Built with [React](https://react.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Powered by [Claude API](https://www.anthropic.com)
- Icons from [Lucide React](https://lucide.dev)

---

Made with ❤️ by the TaskMaster team
