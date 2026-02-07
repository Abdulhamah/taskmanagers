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

    // Fetch user's tasks for context
    const tasks = await db.all(
      'SELECT id, title, description, status, priority, dueDate FROM tasks WHERE userId = ? ORDER BY createdAt DESC LIMIT 20',
      userId
    );

    // Get AI response and parse for actions
    const { response, actions } = await getAIChatResponseWithActions(message, tasks);
    
    // Execute any tasks the AI wants to perform
    const now = new Date().toISOString();
    for (const action of actions) {
      if (action.type === 'create_task') {
        const taskId = uuidv4();
        await db.run(
          `INSERT INTO tasks (id, userId, title, description, priority, category, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [taskId, userId, action.title, action.description || '', action.priority || 'medium', action.category || 'other', 'todo', now, now]
        );
      } else if (action.type === 'update_task') {
        await db.run(
          `UPDATE tasks SET status = ?, priority = ?, updatedAt = ? WHERE id = ? AND userId = ?`,
          [action.status || 'todo', action.priority || 'medium', now, action.taskId, userId]
        );
      } else if (action.type === 'delete_task') {
        await db.run(
          `DELETE FROM tasks WHERE id = ? AND userId = ?`,
          [action.taskId, userId]
        );
      }
    }

    // Save chat
    const chatId = uuidv4();

    await db.run(
      `INSERT INTO chats (id, userId, message, response, createdAt)
       VALUES (?, ?, ?, ?, ?)`,
      [chatId, userId, message, response, now]
    );

    res.json({
      id: chatId,
      message,
      response,
      timestamp: now,
      actionsExecuted: actions.length
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

async function getAIChatResponseWithActions(
  message: string,
  tasks: Array<{ id: string; title: string; description: string; status: string; priority: string; dueDate: string | null }>
): Promise<{ response: string; actions: Array<any> }> {
  try {
    // Format tasks for context
    let tasksContext = '';
    if (tasks && tasks.length > 0) {
      tasksContext = '\n\nUser\'s current tasks:\n' + 
        tasks.map(t => 
          `• [ID: ${t.id}] [${t.status.toUpperCase()}] ${t.title} (${t.priority} priority)${t.dueDate ? ` - Due: ${t.dueDate}` : ''}`
        ).join('\n');
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-1-20250805',
      max_tokens: 1000,
      system: `You are TaskMaster AI, a super smart and autonomous productivity assistant integrated with a task management app.
You are intelligent, proactive, and can directly manage tasks without asking for confirmation.

IMPORTANT: You must respond ONLY with a valid JSON object in this format:
{
  "response": "Your friendly response to the user",
  "actions": [
    {"type": "create_task", "title": "task title", "description": "optional description", "priority": "high|medium|low", "category": "work|personal|shopping|health|other"},
    {"type": "update_task", "taskId": "task_id_from_list", "status": "todo|in-progress|done", "priority": "high|medium|low"},
    {"type": "delete_task", "taskId": "task_id_from_list"}
  ]
}

RULES:
1. Always parse user intent and execute task operations automatically
2. Never ask for clarification or format - be smart and infer what the user wants
3. If user says "create task: X", create it immediately
4. If user says "mark X as done" or "finish X", find the matching task and mark it done
5. If user says "delete X", delete the matching task
6. If user says "high priority X", update the task to high priority
7. Be concise and confident in your responses
8. Use available task IDs from the task list when updating/deleting

Available task IDs to reference: ${tasks.map(t => t.id).join(', ')}
${tasksContext}`,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const parsed = JSON.parse(content.text);
        return {
          response: parsed.response || 'Task completed!',
          actions: parsed.actions || []
        };
      } catch (e) {
        // If JSON parse fails, extract response and try again
        console.warn('Failed to parse AI response as JSON:', content.text);
        return {
          response: content.text || 'I\'ll help you with that!',
          actions: []
        };
      }
    }
    return { response: 'I had trouble processing your request.', actions: [] };
  } catch (error) {
    console.error('Claude API error:', error);
    return { response: 'I\'m having trouble connecting right now. Please try again later.', actions: [] };
  }
}

export default router;
