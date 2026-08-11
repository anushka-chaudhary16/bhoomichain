const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./auth');
const simulator = require('../chaincode/simulator');

const JWT_SECRET = process.env.JWT_SECRET || 'bhoomichain_secret_key';

// POST /api/auth/register
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user });
  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lands
router.get('/lands', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, u.name as owner_name, u.email as owner_email 
      FROM lands l 
      JOIN users u ON l.owner_id = u.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lands
router.post('/lands', authenticateToken, async (req, res) => {
  try {
    const { location, area, coordinates } = req.body;
    if (!location || !area || !coordinates) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await pool.query(
      'INSERT INTO lands (owner_id, location, area, coordinates) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, location, area, coordinates]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lands/transfer
router.post('/lands/transfer', authenticateToken, async (req, res) => {
  try {
    const { land_id, buyer_email } = req.body;
    if (!land_id || !buyer_email) return res.status(400).json({ error: 'Missing required fields' });

    // Find buyer
    const buyerResult = await pool.query('SELECT id FROM users WHERE email = $1', [buyer_email]);
    if (buyerResult.rows.length === 0) return res.status(404).json({ error: 'Buyer not found' });
    const buyer_id = buyerResult.rows[0].id;

    // Verify ownership
    const landResult = await pool.query('SELECT owner_id FROM lands WHERE id = $1', [land_id]);
    if (landResult.rows.length === 0) return res.status(404).json({ error: 'Land not found' });
    if (landResult.rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'You do not own this land' });

    if (buyer_id === req.user.id) return res.status(400).json({ error: 'Cannot transfer land to yourself' });

    // Create pending transaction
    const txResult = await pool.query(
      'INSERT INTO transactions (land_id, seller_id, buyer_id, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [land_id, req.user.id, buyer_id, 'pending']
    );

    res.json(txResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/transactions
router.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, s.name as seller_name, b.name as buyer_name, l.location as land_location 
      FROM transactions t
      JOIN users s ON t.seller_id = s.id
      JOIN users b ON t.buyer_id = b.id
      JOIN lands l ON t.land_id = l.id
      ORDER BY t.timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blocks
router.get('/blocks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blocks ORDER BY index ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blocks/mine
router.post('/blocks/mine', async (req, res) => {
  try {
    // 1. Get pending transactions
    const txResult = await pool.query("SELECT * FROM transactions WHERE status = 'pending'");
    const pendingTx = txResult.rows;
    if (pendingTx.length === 0) {
      return res.status(400).json({ error: 'No pending transactions to mine' });
    }

    // 2. Get previous block
    const blockResult = await pool.query("SELECT * FROM blocks ORDER BY index DESC LIMIT 1");
    const previousBlock = blockResult.rows[0];

    // 3. Mine new block
    const newBlock = simulator.mineBlock(previousBlock, pendingTx);

    // 4. Save new block to DB
    await pool.query(
      'INSERT INTO blocks (index, timestamp, previous_hash, hash, nonce, transactions) VALUES ($1, $2, $3, $4, $5, $6)',
      [newBlock.index, newBlock.timestamp, newBlock.previousHash, newBlock.hash, newBlock.nonce, JSON.stringify(newBlock.transactions)]
    );

    // 5. Update transaction status and transfer ownership
    for (const tx of pendingTx) {
      await pool.query("UPDATE transactions SET status = 'mined' WHERE id = $1", [tx.id]);
      await pool.query("UPDATE lands SET owner_id = $1 WHERE id = $2", [tx.buyer_id, tx.land_id]);
    }

    res.json(newBlock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats
router.get('/stats', async (req, res) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const landsCount = await pool.query('SELECT COUNT(*) FROM lands');
    const txCount = await pool.query('SELECT COUNT(*) FROM transactions');
    const blocksCount = await pool.query('SELECT COUNT(*) FROM blocks');

    res.json({
      users: parseInt(usersCount.rows[0].count),
      lands: parseInt(landsCount.rows[0].count),
      transactions: parseInt(txCount.rows[0].count),
      blocks: parseInt(blocksCount.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
