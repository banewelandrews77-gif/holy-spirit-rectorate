import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

function generateReceiptNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HSR-${dateStr}-${randomChars}`;
}

const CHURCH_NAMES: Record<string, string> = {
  'holy-spirit': 'Holy Spirit Rectorate Parish',
  'st-anthony': 'St. Anthony of Padua Catholic Church',
  'st-matthew': 'St. Matthew Catholic Church'
};

const FUND_NAMES: Record<string, string> = {
  'tithe': 'Tithe & First Fruits',
  'offertory': 'Sunday Offertory',
  'building': 'Church Building & Infrastructure Fund',
  'harvest': 'Harvest & Thanksgiving',
  'intentions': 'Holy Mass Intentions Stipend',
  'welfare': 'St. Vincent de Paul & Welfare'
};

// Public: Process Donation
router.post('/', (req, res) => {
  const {
    donor_name,
    donor_email,
    donor_phone,
    church_id,
    fund_category,
    amount,
    currency = 'GHS',
    frequency = 'one-time',
    payment_method,
    momo_network,
    notes
  } = req.body;

  if (!donor_name || !donor_email || !church_id || !fund_category || !amount || !payment_method) {
    return res.status(400).json({ error: 'Missing required donation fields.' });
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Amount must be a positive number.' });
  }

  try {
    const receiptNumber = generateReceiptNumber();
    const transactionRef = (req.body.transaction_ref && String(req.body.transaction_ref).trim()) || ('TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase());

    const stmt = db.prepare(`
      INSERT INTO donations (
        receipt_number,
        donor_name,
        donor_email,
        donor_phone,
        church_id,
        fund_category,
        amount,
        currency,
        frequency,
        payment_method,
        momo_network,
        status,
        transaction_ref,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?, ?)
    `);

    stmt.run(
      receiptNumber,
      donor_name.trim(),
      donor_email.trim().toLowerCase(),
      donor_phone ? donor_phone.trim() : null,
      church_id,
      fund_category,
      numAmount,
      currency,
      frequency,
      payment_method,
      momo_network || null,
      transactionRef,
      notes ? notes.trim() : null
    );

    const donation = db.prepare('SELECT * FROM donations WHERE receipt_number = ?').get(receiptNumber) as any;

    res.status(201).json({
      message: 'Donation processed successfully. May God richly bless your offering!',
      receipt: {
        receiptNumber: donation.receipt_number,
        transactionRef: donation.transaction_ref,
        donorName: donation.donor_name,
        donorEmail: donation.donor_email,
        donorPhone: donation.donor_phone,
        churchId: donation.church_id,
        churchName: CHURCH_NAMES[donation.church_id] || 'Holy Spirit Rectorate',
        fundCategory: donation.fund_category,
        fundName: FUND_NAMES[donation.fund_category] || donation.fund_category,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        paymentMethod: donation.payment_method,
        momoNetwork: donation.momo_network,
        date: donation.created_at,
        notes: donation.notes,
        status: donation.status,
        blessing: '"Give, and it will be given to you. Good measure, pressed down, shaken together, running over..." — Luke 6:38'
      }
    });
  } catch (err: any) {
    console.error('Donation error:', err);
    res.status(500).json({ error: 'Failed to record donation transaction.' });
  }
});

// Public: Verify / Lookup Receipt
router.get('/receipt/:receiptNumber', (req, res) => {
  const { receiptNumber } = req.params;

  try {
    const donation = db.prepare('SELECT * FROM donations WHERE receipt_number = ?').get(receiptNumber) as any;

    if (!donation) {
      return res.status(404).json({ error: 'Receipt not found.' });
    }

    res.json({
      receipt: {
        receiptNumber: donation.receipt_number,
        transactionRef: donation.transaction_ref,
        donorName: donation.donor_name,
        donorEmail: donation.donor_email,
        donorPhone: donation.donor_phone,
        churchId: donation.church_id,
        churchName: CHURCH_NAMES[donation.church_id] || 'Holy Spirit Rectorate',
        fundCategory: donation.fund_category,
        fundName: FUND_NAMES[donation.fund_category] || donation.fund_category,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        paymentMethod: donation.payment_method,
        momoNetwork: donation.momo_network,
        date: donation.created_at,
        notes: donation.notes,
        status: donation.status,
        blessing: '"Give, and it will be given to you. Good measure, pressed down, shaken together, running over..." — Luke 6:38'
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error retrieving receipt.' });
  }
});

// Admin/Finance: Get Statistics & Analytics
router.get('/stats', authenticateToken, requireRole(['admin', 'editor', 'viewer']), (req: AuthRequest, res: Response) => {
  try {
    const totalDonations = db.prepare("SELECT COUNT(*) as count, SUM(amount) as total FROM donations WHERE status = 'completed'").get() as any;
    
    const byChurch = db.prepare(`
      SELECT church_id, COUNT(*) as count, SUM(amount) as total 
      FROM donations 
      WHERE status = 'completed'
      GROUP BY church_id
    `).all();

    const byFund = db.prepare(`
      SELECT fund_category, COUNT(*) as count, SUM(amount) as total 
      FROM donations 
      WHERE status = 'completed'
      GROUP BY fund_category
    `).all();

    const byMethod = db.prepare(`
      SELECT payment_method, COUNT(*) as count, SUM(amount) as total 
      FROM donations 
      WHERE status = 'completed'
      GROUP BY payment_method
    `).all();

    const recentDonations = db.prepare(`
      SELECT * FROM donations 
      ORDER BY created_at DESC 
      LIMIT 10
    `).all();

    res.json({
      overview: {
        totalAmount: totalDonations.total || 0,
        totalCount: totalDonations.count || 0,
      },
      byChurch,
      byFund,
      byMethod,
      recentDonations
    });
  } catch (err: any) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to retrieve donation statistics.' });
  }
});

// Admin/Finance: List all donations with filters & CSV export
router.get('/', authenticateToken, requireRole(['admin', 'editor', 'viewer']), (req: AuthRequest, res: Response) => {
  const { church_id, fund_category, payment_method, search, format } = req.query;

  try {
    let query = 'SELECT * FROM donations WHERE 1=1';
    const params: any[] = [];

    if (church_id && church_id !== 'all') {
      query += ' AND church_id = ?';
      params.push(church_id);
    }

    if (fund_category && fund_category !== 'all') {
      query += ' AND fund_category = ?';
      params.push(fund_category);
    }

    if (payment_method && payment_method !== 'all') {
      query += ' AND payment_method = ?';
      params.push(payment_method);
    }

    if (search) {
      query += ' AND (donor_name LIKE ? OR donor_email LIKE ? OR receipt_number LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC';

    const donations = db.prepare(query).all(...params) as any[];

    // Check if CSV export requested
    if (format === 'csv') {
      const headers = ['Receipt Number', 'Date', 'Donor Name', 'Donor Email', 'Donor Phone', 'Church', 'Fund Category', 'Amount', 'Currency', 'Payment Method', 'Status'];
      const rows = donations.map(d => [
        `"${d.receipt_number}"`,
        `"${d.created_at}"`,
        `"${d.donor_name.replace(/"/g, '""')}"`,
        `"${d.donor_email}"`,
        `"${d.donor_phone || ''}"`,
        `"${CHURCH_NAMES[d.church_id] || d.church_id}"`,
        `"${FUND_NAMES[d.fund_category] || d.fund_category}"`,
        d.amount,
        `"${d.currency}"`,
        `"${d.payment_method}"`,
        `"${d.status}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=HolySpiritRectorate_Donations_${new Date().toISOString().slice(0, 10)}.csv`);
      return res.send(csvContent);
    }

    res.json({ donations });
  } catch (err: any) {
    console.error('List donations error:', err);
    res.status(500).json({ error: 'Failed to list donations.' });
  }
});

// Admin: Delete a single donation record
router.delete('/:id', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM donations WHERE id = ?').get(id) as any;
    if (!existing) {
      return res.status(404).json({ error: 'Donation record not found.' });
    }

    db.prepare('DELETE FROM donations WHERE id = ?').run(id);

    res.json({
      message: `Donation record ${existing.receipt_number} deleted successfully.`,
      deletedId: id
    });
  } catch (err: any) {
    console.error('Delete donation error:', err);
    res.status(500).json({ error: 'Failed to delete donation record.' });
  }
});

// Admin: Purge / Clear all demo and test donations
router.post('/clear-demo', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  try {
    // Delete seeded demo records matching seed patterns
    const result = db.prepare(`
      DELETE FROM donations 
      WHERE receipt_number LIKE 'HSR-2026090%' 
         OR receipt_number LIKE 'HSR-20260910%' 
         OR receipt_number LIKE 'HSR-20260912%' 
         OR donor_name IN ('Kofi Mensah', 'Akosua Boateng', 'Emmanuel Kwame Owusu', 'Dr. Patricia Osei', 'Joseph Tetteh Quaye')
    `).run();

    res.json({
      message: `Successfully cleared ${result.changes} demo donation record(s).`,
      deletedCount: result.changes
    });
  } catch (err: any) {
    console.error('Clear demo donations error:', err);
    res.status(500).json({ error: 'Failed to clear demo donations.' });
  }
});

// Admin: Reset entire ledger to start clean (with confirmation)
router.post('/clear-all', authenticateToken, requireRole(['admin']), (req: AuthRequest, res: Response) => {
  const { confirm } = req.body;
  if (!confirm) {
    return res.status(400).json({ error: 'Confirmation required to reset entire donation ledger.' });
  }

  try {
    const result = db.prepare('DELETE FROM donations').run();
    res.json({
      message: `Entire donation ledger has been reset. Removed ${result.changes} records.`,
      deletedCount: result.changes
    });
  } catch (err: any) {
    console.error('Reset ledger error:', err);
    res.status(500).json({ error: 'Failed to reset donation ledger.' });
  }
});

export default router;
