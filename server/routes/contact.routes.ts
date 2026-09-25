import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Submit message or Mass intention
router.post('/', (req, res) => {
  const { sender_name, sender_email, sender_phone, church_id = 'holy-spirit', category = 'general', subject, message, intention_date } = req.body;

  if (!sender_name || !sender_email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO messages (sender_name, sender_email, sender_phone, church_id, category, subject, message, intention_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unread')
    `).run(sender_name.trim(), sender_email.trim().toLowerCase(), sender_phone || null, church_id, category, subject.trim(), message.trim(), intention_date || null);

    res.status(201).json({
      message: 'Thank you. Your message has been received by the parish office. Peace be with you!',
      messageId: result.lastInsertRowid
    });
  } catch (err: any) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Failed to submit message.' });
  }
});

// Admin/Staff: Get messages
router.get('/', authenticateToken, requireRole(['admin', 'editor', 'viewer']), (req: AuthRequest, res: Response) => {
  const { status, category, church_id } = req.query;

  try {
    let query = 'SELECT * FROM messages WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (church_id && church_id !== 'all') {
      query += ' AND church_id = ?';
      params.push(church_id);
    }

    query += ' ORDER BY created_at DESC';

    const messages = db.prepare(query).all(...params);
    res.json({ messages });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve messages.' });
  }
});

// Admin/Staff: Update status (mark responded or archived)
router.patch('/:id/status', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['unread', 'responded', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status.' });
  }

  try {
    db.prepare('UPDATE messages SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: 'Status updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update message status.' });
  }
});

// Admin: Delete message
router.delete('/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    res.json({ message: 'Message deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

export default router;
