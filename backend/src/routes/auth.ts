import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/init.js';

const router = Router();

// Simple password hash (in production, use bcrypt)
const hashPassword = (password: string) => Buffer.from(password).toString('base64');
const verifyPassword = (password: string, hash: string) => hashPassword(password) === hash;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = await getDatabase();
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const userId = uuidv4();
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    await db.run(
      `INSERT INTO users (id, name, email, password, company, role, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, passwordHash, company || null, role || null, now, now]
    );

    res.status(201).json({
      id: userId,
      name,
      email,
      company,
      role
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const user = await db.get('SELECT id, name, email, company, role, createdAt FROM users WHERE id = ?', req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
