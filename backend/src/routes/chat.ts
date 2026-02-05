import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/init.js';
import { getTaskSuggestion } from '../ai/assistant.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }

    const db = await getDatabase();
    
    // Verify user exists
    const user = await db.get('SELECT id FROM users WHERE id = ?', userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get AI response
    const response = await getAIChatResponse(message);
    
    // Check if message is about creating a task
    const taskMatch = message.match(/create task:?\s*(.+)/i);
    if (taskMatch) {
      const taskTitle = taskMatch[1].trim();
      const taskId = uuidv4();
      const now = new Date().toISOString();

      await db.run(
        `INSERT INTO tasks (id, userId, title, description, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [taskId, userId, taskTitle, '', 'todo', now, now]
      );
    }

    // Save chat
    const chatId = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO chats (id, userId, message, response, createdAt)
       VALUES (?, ?, ?, ?, ?)`,
      [chatId, userId, message, response, now]
    );

    res.json({
      id: chatId,
      message,
      response,
      timestamp: now
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const db = await getDatabase();
    const chats = await db.all(
      'SELECT id, message, response, createdAt FROM chats WHERE userId = ? ORDER BY createdAt DESC LIMIT 50',
      req.params.userId
    );

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

async function getAIChatResponse(message: string): Promise<string> {
  // Enhanced AI responses for various requests
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('create task')) {
    return 'I can help you create a task! Just say "create task: [task name]" and I\'ll add it to your list.';
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return 'Hello! 👋 I\'m your AI assistant. I can help you create tasks, get suggestions, and manage your productivity. What would you like to do?';
  }

  if (lowerMessage.includes('help')) {
    return 'I can help you with:\n• Creating tasks: Say "create task: [name]"\n• Getting suggestions: Ask me for productivity tips\n• Task management: Organize and prioritize your work\nWhat can I help you with?';
  }

  if (lowerMessage.includes('productivity') || lowerMessage.includes('tips')) {
    return 'Here are some productivity tips:\n1. Break large tasks into smaller ones\n2. Prioritize high-impact work\n3. Take regular breaks\n4. Use the Pomodoro technique\n5. Review completed tasks for motivation';
  }

  if (lowerMessage.includes('focus') || lowerMessage.includes('concentrate')) {
    return 'To improve focus:\n• Remove distractions\n• Set a specific goal for the work session\n• Use time-blocking\n• Take breaks every 25-30 minutes\n• Organize your workspace';
  }

  // Default response
  return await getTaskSuggestion(message, '', 'todo');
}

export default router;
