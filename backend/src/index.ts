import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/init.js';
import tasksRouter from './routes/tasks.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);
app.use('/ai', aiRouter);
app.use('/chat', chatRouter);

// Initialize database and start server
async function start() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
