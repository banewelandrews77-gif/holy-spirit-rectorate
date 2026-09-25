import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// Public: Get gallery items
router.get('/', (req, res) => {
  const { album, church_id } = req.query;

  try {
    let query = 'SELECT * FROM gallery WHERE 1=1';
    const params: any[] = [];

    if (album && album !== 'all') {
      query += ' AND album = ?';
      params.push(album);
    }

    if (church_id && church_id !== 'all') {
      query += ' AND (church_id = ? OR church_id = "all")';
      params.push(church_id);
    }

    query += ' ORDER BY created_at DESC';

    const items = db.prepare(query).all(...params);
    const albums = db.prepare('SELECT DISTINCT album FROM gallery ORDER BY album ASC').all().map((r: any) => r.album);

    res.json({ items, albums });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch gallery items.' });
  }
});

// Admin/Editor: Add gallery item
router.post('/', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { title, album, media_type = 'image', media_url, thumbnail_url, caption, church_id = 'all' } = req.body;

  if (!title || !album || !media_url) {
    return res.status(400).json({ error: 'Title, album, and media URL are required.' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO gallery (title, album, media_type, media_url, thumbnail_url, caption, church_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, album, media_type, media_url, thumbnail_url || media_url, caption || '', church_id);

    const created = db.prepare('SELECT * FROM gallery WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Gallery item added', item: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add gallery item.' });
  }
});

// Admin/Editor: Delete gallery item
router.delete('/:id', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(id);
    res.json({ message: 'Gallery item deleted.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
});

export default router;
