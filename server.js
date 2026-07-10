const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db/pool');
const requireAuth = require('./middleware/auth');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Rey Technologies API is Running');
});

// --- Contact form inquiries ---
app.post('/api/inquiries', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and message are required'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inquiries (name, email, message)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, email, message]
        );
        res.status(201).json({ success: true, inquiry: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Get all inquiries (admin only) ---
app.get('/api/inquiries', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM inquiries ORDER BY created_at DESC`
        );
        res.json({ success: true, inquiries: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Mark an inquiry as contacted (admin only) ---
app.patch('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE inquiries SET status = 'contacted' WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Inquiry not found' });
        }
        res.json({ success: true, inquiry: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Delete an inquiry (admin only) ---
app.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM inquiries WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Inquiry not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Newsletter subscribers ---
app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO newsletter_subscribers (email)
             VALUES ($1)
             RETURNING *`,
            [email]
        );
        res.status(201).json({ success: true, subscriber: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ success: false, error: 'This email is already subscribed' });
        }
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Analytics: track a service view ---
app.post('/api/analytics/track', async (req, res) => {
    const { serviceId, serviceTitle } = req.body;

    if (!serviceId || !serviceTitle) {
        return res.status(400).json({ success: false, error: 'serviceId and serviceTitle are required' });
    }

    try {
        await pool.query(
            `INSERT INTO service_views (service_id, service_title) VALUES ($1, $2)`,
            [serviceId, serviceTitle]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Analytics: summary for dashboard charts (admin only) ---
app.get('/api/analytics/summary', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT service_id, service_title, COUNT(*) AS views
             FROM service_views
             GROUP BY service_id, service_title
             ORDER BY views DESC`
        );
        res.json({ success: true, summary: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Auth: admin login ---
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM admins WHERE username = $1`,
            [username]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const passwordMatches = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ success: true, token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
});

// --- Auth: verify token / get current admin ---
app.get('/api/admin/me', requireAuth, async (req, res) => {
    res.json({ success: true, admin: req.admin });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});