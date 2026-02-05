# Quick Start Guide

## Prerequisites
- Node.js v20 or higher
- npm v10 or higher
- Anthropic API key (for Claude AI features)

## 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskmaster-ai.git
cd taskmaster-ai
```

## 2. Run Setup Script
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
npm run install-all
cp backend/.env.example backend/.env
```

## 3. Configure API Key
Edit `backend/.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Get a free API key from: https://console.anthropic.com/

## 4. Start Development Server
```bash
npm run dev
```

## 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Features to Try

### ✨ Create a Task
1. Click "New Task" button
2. Enter task title (e.g., "Write project report")
3. Click "AI Assist" to auto-generate description and category
4. Set priority and due date (optional)
5. Click "Create Task"

### 🤖 Get AI Suggestions
1. Click the lightbulb (💡) icon on any task
2. AI will provide actionable suggestions

### 📊 View Analytics
- Tasks are organized in Kanban columns (To Do, In Progress, Done)
- Filter by status or completion
- Sort by priority or date

## Building for Production

### Frontend Build
```bash
npm run build --workspace=frontend
```
Output will be in `frontend/dist/`

### Backend Build
```bash
npm run build --workspace=backend
```
Output will be in `backend/dist/`

## Deployment Options

### Frontend (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend (Heroku)
```bash
heroku create your-app-name
git push heroku main
```

## Troubleshooting

### Port Already in Use
Change port in `backend/.env`:
```
PORT=3002
```

### API Key Issues
- Verify key in `backend/.env`
- Check key has correct permissions
- Request new key from Anthropic console

### Database Errors
Reset the database:
```bash
rm -rf backend/data/
npm run db:init --workspace=backend
```

## Support
- Check [README.md](README.md) for full documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Check [SECURITY.md](SECURITY.md) for security reporting

Happy task managing! 🚀
