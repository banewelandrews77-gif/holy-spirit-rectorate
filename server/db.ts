import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'parish.db');
export const db = new Database(dbPath);

// Enable Foreign Keys and WAL mode for high performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'editor', 'viewer')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_number TEXT UNIQUE NOT NULL,
      donor_name TEXT NOT NULL,
      donor_email TEXT NOT NULL,
      donor_phone TEXT,
      church_id TEXT NOT NULL,
      fund_category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'GHS',
      frequency TEXT NOT NULL DEFAULT 'one-time',
      payment_method TEXT NOT NULL,
      momo_network TEXT,
      status TEXT NOT NULL DEFAULT 'completed',
      transaction_ref TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_donations_receipt ON donations(receipt_number);
    CREATE INDEX IF NOT EXISTS idx_donations_church ON donations(church_id);
    CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(created_at);

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content TEXT NOT NULL,
      church_id TEXT NOT NULL DEFAULT 'all',
      category TEXT NOT NULL DEFAULT 'general',
      is_pinned INTEGER NOT NULL DEFAULT 0,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      author_id INTEGER,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      church_id TEXT NOT NULL DEFAULT 'all',
      category TEXT NOT NULL DEFAULT 'mass',
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      time_info TEXT NOT NULL,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bulletins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      week_label TEXT NOT NULL,
      summary TEXT,
      download_url TEXT NOT NULL,
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      album TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      media_url TEXT NOT NULL,
      thumbnail_url TEXT,
      caption TEXT,
      church_id TEXT NOT NULL DEFAULT 'all',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      sender_phone TEXT,
      church_id TEXT NOT NULL DEFAULT 'holy-spirit',
      category TEXT NOT NULL DEFAULT 'general',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      intention_date TEXT,
      status TEXT NOT NULL DEFAULT 'unread',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
