import { Router } from 'express';
import { getTaskDescription, getTaskSuggestion, getTaskAnalysis } from '../ai/assistant.js';
import { getDatabase } from '../db/init.js';

const router = Router();

router.post('/assist', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { description, category } = await getTaskDescription(title);
    res.json({ description, category });
  } catch (error) {
    console.error('Error in AI assist:', error);
    res.status(500).json({ error: 'AI assistance failed' });
  }
});

router.post('/suggestion', async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const suggestion = await getTaskSuggestion(title, description || '', status || 'todo');
    res.json({ suggestion });
  } catch (error) {
    console.error('Error getting suggestion:', error);
    res.status(500).json({ error: 'Failed to get suggestion' });
  }
});

router.get('/analysis', async (req, res) => {
  try {
    const db = await getDatabase();
    const tasks = await db.all('SELECT title, status, priority FROM tasks');

    const analysis = await getTaskAnalysis(tasks);
    res.json({ analysis });
  } catch (error) {
    console.error('Error getting analysis:', error);
    res.status(500).json({ error: 'Failed to get analysis' });
  }
});

export default router;
