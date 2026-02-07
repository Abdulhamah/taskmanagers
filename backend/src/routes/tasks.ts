import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/init.js';
import nodemailer from 'nodemailer';

const router = Router();

// Email transporter configuration
let transporter: any;

async function getEmailTransporter() {
  if (transporter) return transporter;

  const email = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (email && password) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: email, pass: password }
    });
  } else {
    transporter = await nodemailer.createTestAccount().then(testAccount => {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    });
  }

  return transporter;
}

router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const { userId } = req.query;
    
    let tasks;
    if (userId) {
      // Filter tasks by userId if provided
      tasks = await db.all('SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC', userId);
    } else {
      // Return all tasks if no userId provided (for backward compatibility)
      tasks = await db.all('SELECT * FROM tasks ORDER BY createdAt DESC');
    }
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, title, description, priority, status, dueDate, category, reminderDate } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = await getDatabase();
    
    // If userId is provided, verify user exists
    let ownerUserId = userId;
    if (ownerUserId) {
      const user = await db.get('SELECT id FROM users WHERE id = ?', ownerUserId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO tasks (id, userId, title, description, priority, status, dueDate, category, reminderDate, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ownerUserId || null, title, description || '', priority || 'medium', status || 'todo', dueDate || null, category || 'work', reminderDate || null, now, now]
    );

    const task = await db.get('SELECT * FROM tasks WHERE id = ?', id);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, category, reminderDate } = req.body;
    const db = await getDatabase();
    const now = new Date().toISOString();

    await db.run(
      `UPDATE tasks
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           priority = COALESCE(?, priority),
           status = COALESCE(?, status),
           dueDate = COALESCE(?, dueDate),
           category = COALESCE(?, category),
           reminderDate = COALESCE(?, reminderDate),
           updatedAt = ?
       WHERE id = ?`,
      [title, description, priority, status, dueDate, category, reminderDate, now, req.params.id]
    );

    const task = await db.get('SELECT * FROM tasks WHERE id = ?', req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    await db.run('DELETE FROM tasks WHERE id = ?', req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Send task reminders
router.post('/send-reminders/:userId', async (req, res) => {
  try {
    const db = await getDatabase();
    const { userId } = req.params;
    const now = new Date();

    // Get tasks with reminder dates that haven't been sent yet
    const tasks = await db.all(
      `SELECT t.*, u.email, u.name FROM tasks t
       JOIN users u ON t.userId = u.id
       WHERE t.userId = ? AND t.reminderDate IS NOT NULL 
       AND t.reminderSent = 0
       AND datetime(t.reminderDate) <= datetime(?)`,
      [userId, now.toISOString()]
    );

    if (tasks.length === 0) {
      return res.json({ message: 'No reminders to send', count: 0 });
    }

    const transporter = await getEmailTransporter();
    const sentEmails = [];

    for (const task of tasks) {
      const taskDateTime = new Date(task.reminderDate);
      const formattedDate = taskDateTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const mailOptions = {
        from: process.env.GMAIL_EMAIL || '"TaskMasters" <noreply@taskmanagers.org>',
        to: task.email,
        subject: `📌 Task Reminder: ${task.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; background: #1e293b; padding: 40px 20px; }
              .header { text-align: center; color: #c7d2fe; margin-bottom: 30px; }
              .content { background: #0f172a; padding: 30px; border-left: 4px solid #818cf8; border-radius: 8px; }
              .task-title { font-size: 24px; font-weight: bold; color: #fff; margin: 20px 0; }
              .task-detail { color: #cbd5e1; margin: 15px 0; line-height: 1.6; }
              .label { color: #94a3b8; font-weight: 600; font-size: 12px; text-transform: uppercase; margin-top: 15px; }
              .value { color: #e2e8f0; font-size: 16px; margin: 8px 0; }
              .priority-high { color: #ef4444; font-weight: bold; }
              .priority-medium { color: #f59e0b; font-weight: bold; }
              .priority-low { color: #10b981; font-weight: bold; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
              .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
              .divider { height: 1px; background: #334155; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; color: #c7d2fe;">⏰ Task Reminder</h1>
              </div>
              
              <div class="content">
                <p style="color: #cbd5e1; margin-top: 0;">Hi <strong>${task.name}</strong>,</p>
                <p style="color: #cbd5e1;">Your task is coming up! Here's a quick reminder:</p>
                
                <div class="task-title">📋 ${task.title}</div>
                
                ${task.description ? `
                <div class="label">Description</div>
                <div class="value">${task.description}</div>
                ` : ''}
                
                <div class="divider"></div>
                
                <div class="label">Priority</div>
                <div class="value"><span class="priority-${task.priority}">${task.priority.toUpperCase()}</span></div>
                
                <div class="label">Category</div>
                <div class="value">${task.category.charAt(0).toUpperCase() + task.category.slice(1)}</div>
                
                <div class="label">Reminder Date</div>
                <div class="value">📅 ${formattedDate}</div>
                
                ${task.dueDate ? `
                <div class="label">Due Date</div>
                <div class="value">📌 ${new Date(task.dueDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                ` : ''}
                
                <a href="http://localhost:5173/tasks" class="cta-button">View Task</a>
              </div>
              
              <div class="footer">
                <p>This is an automated reminder from TaskMasters.</p>
                <p>© 2026 TaskMasters | taskmanagers.org | All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        
        // Mark task as reminder sent
        await db.run('UPDATE tasks SET reminderSent = 1 WHERE id = ?', task.id);
        
        if (info.testUrl) {
          sentEmails.push({
            taskId: task.id,
            taskTitle: task.title,
            email: task.email,
            previewUrl: info.testUrl
          });
        } else {
          sentEmails.push({
            taskId: task.id,
            taskTitle: task.title,
            email: task.email,
            status: 'sent'
          });
        }
      } catch (mailError) {
        console.error(`Failed to send reminder for task ${task.id}:`, mailError);
      }
    }

    res.json({
      message: `Sent ${sentEmails.length} task reminder(s)`,
      count: sentEmails.length,
      reminders: sentEmails
    });
  } catch (error) {
    console.error('Error sending reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});

// Get upcoming reminders for a user
router.get('/reminders/:userId', async (req, res) => {
  try {
    const db = await getDatabase();
    const { userId } = req.params;
    const now = new Date().toISOString();

    const reminders = await db.all(
      `SELECT id, title, reminderDate, dueDate, reminderSent, priority, category
       FROM tasks
       WHERE userId = ? AND reminderDate IS NOT NULL
       ORDER BY reminderDate ASC`,
      userId
    );

    const upcoming = reminders.map((r: any) => ({
      ...r,
      isUpcoming: new Date(r.reminderDate) > new Date(now),
      isSent: r.reminderSent === 1
    }));

    res.json(upcoming);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

export default router;
