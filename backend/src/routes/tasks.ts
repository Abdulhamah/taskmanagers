import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/init.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const tasks = await db.all('SELECT * FROM tasks ORDER BY createdAt DESC');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, title, description, priority, status, dueDate, category } = req.body;

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
      `INSERT INTO tasks (id, userId, title, description, priority, status, dueDate, category, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ownerUserId || null, title, description || '', priority || 'medium', status || 'todo', dueDate || null, category || 'work', now, now]
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
    const { title, description, priority, status, dueDate, category } = req.body;
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
           updatedAt = ?
       WHERE id = ?`,
      [title, description, priority, status, dueDate, category, now, req.params.id]
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

export default router;
