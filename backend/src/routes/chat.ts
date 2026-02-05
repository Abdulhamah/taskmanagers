import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import { getDatabase } from '../db/init.js';

dotenv.config();

const router = Router();

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'sk-test-key'
});

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

    // Get AI response from Claude
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
  try {
    const response = await client.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 500,
      system: `You are TaskMaster AI, a helpful productivity assistant integrated with a task management app. 
You help users create, organize, and manage their tasks. When users say "create task: [task name]", acknowledge that the task will be created.
Provide actionable advice for productivity, task management, and focus. Be concise and friendly.`,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      return content.text;
    }
    return 'I had trouble processing your request. Please try again.';
  } catch (error) {
    console.error('Claude API error:', error);
    return 'I\'m having trouble connecting to AI right now. Please try again later.';
  }
}

export default router;
