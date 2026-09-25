import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email (or username) and password are required.' });
  }

  try {
    const rawInput = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    // 1. Find user by exact email match
    let user = db.prepare('SELECT * FROM users WHERE LOWER(TRIM(email)) = ?').get(rawInput) as any;

    // 2. If not found by exact email, allow convenient alias (admin, editor, finance) or prefix match
    if (!user) {
      if (rawInput === 'admin' || rawInput.startsWith('admin@')) {
        user = db.prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1").get() as any;
      } else if (rawInput === 'editor' || rawInput.startsWith('editor@')) {
        user = db.prepare("SELECT * FROM users WHERE role = 'editor' LIMIT 1").get() as any;
      } else if (rawInput === 'finance' || rawInput.startsWith('finance@')) {
        user = db.prepare("SELECT * FROM users WHERE role = 'viewer' LIMIT 1").get() as any;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password. Please verify your credentials.' });
    }

    // 3. Verify password via bcrypt against stored password hash
    let isMatch = false;
    try {
      isMatch = bcrypt.compareSync(cleanPassword, user.password_hash);
    } catch {
      isMatch = false;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email/username or password. Please verify your credentials.' });
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: payload
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// List users (Admin only)
router.get('/users', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  try {
    const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC').all();
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// Add user (Admin only)
router.post('/users', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  if (!['admin', 'editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Role must be admin, editor, or viewer.' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const password_hash = bcrypt.hashSync(password, salt);

    const result = db.prepare(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    ).run(name, email.toLowerCase().trim(), password_hash, role);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: result.lastInsertRowid,
        name,
        email: email.toLowerCase().trim(),
        role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

export default router;
