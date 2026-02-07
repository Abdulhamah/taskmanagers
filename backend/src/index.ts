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
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/ai', aiRouter);
app.use('/api/chat', chatRouter);

// Function to check and send reminders periodically
async function startReminderService() {
  const { getDatabase } = await import('./db/init.js');
  
  // Check reminders every 5 minutes
  setInterval(async () => {
    try {
      const db = await getDatabase();
      const now = new Date();
      
      // Get all users with tasks that have reminder dates coming up
      const users = await db.all(
        `SELECT DISTINCT userId FROM tasks 
         WHERE reminderDate IS NOT NULL AND reminderSent = 0 
         AND datetime(reminderDate) <= datetime(?)`,
        now.toISOString()
      );

      for (const user of users) {
        if (user.userId) {
          try {
            // Trigger reminder sending for this user
            await fetch(`http://localhost:${PORT}/api/tasks/send-reminders/${user.userId}`, {
              method: 'POST'
            }).catch(err => console.log('Reminder service running...'));
          } catch (error) {
            console.error(`Error sending reminders for user ${user.userId}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder service:', error);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// Initialize database and start server
async function start() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start reminder service
    startReminderService();
    console.log('Reminder service started');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
