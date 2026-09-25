import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Get all settings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all() as any[];
    const settings: Record<string, any> = {};

    rows.forEach(r => {
      try {
        settings[r.key] = JSON.parse(r.value);
      } catch {
        settings[r.key] = r.value;
      }
    });

    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch parish settings.' });
  }
});

// Admin/Editor: Update setting
router.post('/', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { key, value } = req.body;

  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and value are required.' });
  }

  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, stringValue);

    res.json({ message: `Setting '${key}' updated successfully.` });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update setting.' });
  }
});

export default router;
