import { Router, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed MIME types
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg'
};

// POST /api/upload - Direct Image Upload (Admin & Editor only)
router.post('/', authenticateToken, requireRole(['admin', 'editor']), async (req: AuthRequest, res: Response) => {
  try {
    const { image, filename } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    // Parse base64 data URL
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image format. Expected valid Base64 data URL.' });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    const extension = ALLOWED_TYPES[mimeType];
    if (!extension) {
      return res.status(400).json({ 
        error: `Unsupported image type: ${mimeType}. Please upload JPG, PNG, WebP, or GIF.` 
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Max 15MB limit
    if (buffer.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image size exceeds 15MB limit.' });
    }

    // Sanitize filename and create unique timestamped name
    const rawName = (filename || 'image')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 40);
    const uniqueFilename = `${Date.now()}_${rawName}${extension}`;
    const destinationPath = path.join(uploadsDir, uniqueFilename);

    fs.writeFileSync(destinationPath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: publicUrl,
      filename: uniqueFilename,
      size: buffer.length,
      mimeType
    });
  } catch (err: any) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload image. Server error.' });
  }
});

export default router;
