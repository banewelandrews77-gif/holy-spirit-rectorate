import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// --- ANNOUNCEMENTS ---

// Get all announcements (Public)
router.get('/announcements', (req, res) => {
  const { church_id, category, search } = req.query;

  try {
    let query = `
      SELECT a.*, u.name as author_name 
      FROM announcements a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (church_id && church_id !== 'all') {
      query += ' AND (a.church_id = ? OR a.church_id = "all")';
      params.push(church_id);
    }

    if (category && category !== 'all') {
      query += ' AND a.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY a.is_pinned DESC, a.published_at DESC';

    const announcements = db.prepare(query).all(...params);
    res.json({ announcements });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// Create Announcement (Admin/Editor)
router.post('/announcements', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { title, content, church_id = 'all', category = 'general', is_pinned = 0 } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const result = db.prepare(`
      INSERT INTO announcements (title, slug, content, church_id, category, is_pinned, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, slug, content, church_id, category, is_pinned ? 1 : 0, req.user?.id);

    const created = db.prepare('SELECT * FROM announcements WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Announcement created', announcement: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

// Update Announcement (Admin/Editor)
router.put('/announcements/:id', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, church_id, category, is_pinned } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    db.prepare(`
      UPDATE announcements 
      SET title = COALESCE(?, title),
          content = COALESCE(?, content),
          church_id = COALESCE(?, church_id),
          category = COALESCE(?, category),
          is_pinned = COALESCE(?, is_pinned)
      WHERE id = ?
    `).run(title, content, church_id, category, is_pinned, id);

    const updated = db.prepare('SELECT * FROM announcements WHERE id = ?').get(id);
    res.json({ message: 'Announcement updated', announcement: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
});

// Delete Announcement (Admin/Editor)
router.delete('/announcements/:id', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
});

// --- EVENTS ---

// Get all events (Public)
router.get('/events', (req, res) => {
  const { church_id, category } = req.query;

  try {
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: any[] = [];

    if (church_id && church_id !== 'all') {
      query += " AND (church_id = ? OR church_id = 'all')";
      params.push(church_id);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY start_date ASC';

    const events = db.prepare(query).all(...params);
    res.json({ events });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// Create Event (Admin/Editor)
router.post('/events', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { title, church_id = 'all', category = 'mass', description, location, start_date, end_date, time_info, is_featured = 0 } = req.body;

  if (!title || !description || !location || !start_date || !time_info) {
    return res.status(400).json({ error: 'Missing required event fields.' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO events (title, church_id, category, description, location, start_date, end_date, time_info, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, church_id, category, description, location, start_date, end_date || null, time_info, is_featured ? 1 : 0);

    const created = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Event created successfully', event: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create event.' });
  }
});

// Update Event (Admin/Editor)
router.put('/events/:id', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, church_id, category, description, location, start_date, end_date, time_info, is_featured } = req.body;

  try {
    const existing = db.prepare('SELECT * FROM events WHERE id = ?').get(id) as any;
    if (!existing) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    const updatedTitle = title !== undefined ? title : existing.title;
    const updatedChurchId = church_id !== undefined ? church_id : existing.church_id;
    const updatedCategory = category !== undefined ? category : existing.category;
    const updatedDescription = description !== undefined ? description : existing.description;
    const updatedLocation = location !== undefined ? location : existing.location;
    const updatedStartDate = start_date !== undefined ? start_date : existing.start_date;
    const updatedEndDate = end_date !== undefined ? end_date : existing.end_date;
    const updatedTimeInfo = time_info !== undefined ? time_info : existing.time_info;
    const updatedIsFeatured = is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured;

    db.prepare(`
      UPDATE events
      SET title = ?,
          church_id = ?,
          category = ?,
          description = ?,
          location = ?,
          start_date = ?,
          end_date = ?,
          time_info = ?,
          is_featured = ?
      WHERE id = ?
    `).run(
      updatedTitle,
      updatedChurchId,
      updatedCategory,
      updatedDescription,
      updatedLocation,
      updatedStartDate,
      updatedEndDate,
      updatedTimeInfo,
      updatedIsFeatured,
      id
    );

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    res.json({ message: 'Event updated successfully', event: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update event.' });
  }
});

// Delete Event (Admin/Editor)
router.delete('/events/:id', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
    res.json({ message: 'Event deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// --- BULLETINS ---

// List bulletins (Public)
router.get('/bulletins', (req, res) => {
  try {
    const bulletins = db.prepare('SELECT * FROM bulletins ORDER BY published_at DESC').all();
    res.json({ bulletins });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch bulletins.' });
  }
});

// Create bulletin (Admin/Editor)
router.post('/bulletins', authenticateToken, requireRole(['admin', 'editor']), (req: AuthRequest, res: Response) => {
  const { title, week_label, summary, download_url } = req.body;
  if (!title || !week_label || !download_url) {
    return res.status(400).json({ error: 'Title, week label, and download URL are required.' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO bulletins (title, week_label, summary, download_url)
      VALUES (?, ?, ?, ?)
    `).run(title, week_label, summary || '', download_url);

    const created = db.prepare('SELECT * FROM bulletins WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ message: 'Bulletin uploaded successfully', bulletin: created });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to upload bulletin.' });
  }
});

export default router;
