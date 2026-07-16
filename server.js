const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db/pool');
const requireAuth = require('./middleware/auth');
const emailService = require('./services/emailService');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:3000', 
        'https://rey-technologies.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.send('Rey Technologies API is Running');
});

// =====================
// CONTACT FORM INQUIRIES
// =====================

// --- Create inquiry (public) ---
app.post('/api/inquiries', async (req, res) => {
    const { name, email, message, phone, subject } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email, and message are required'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inquiries (name, email, message, phone, subject, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
            [name, email, message, phone || null, subject || null]
        );

        // Send emails (fire and forget)
        emailService.sendContactNotification({
            name,
            email,
            message,
            phone,
            subject,
        }).catch(err => console.error('Admin notification email failed:', err));

        emailService.sendConfirmationEmail(email, name, {
            name,
            email,
            phone,
            subject,
            message
        }).catch(err => console.error('Confirmation email failed:', err));

        res.status(201).json({
            success: true,
            inquiry: result.rows[0],
            message: 'Your inquiry has been received. We\'ll respond within 24 hours.'
        });
    } catch (err) {
        console.error('Error creating inquiry:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Something went wrong. Please try again later.' 
        });
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
        console.error('Error fetching inquiries:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch inquiries' 
        });
    }
});

// --- Update inquiry fully (admin only) - PUT ---
app.put('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, subject, message, status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE inquiries 
             SET name = $1, 
                 email = $2, 
                 phone = $3, 
                 subject = $4, 
                 message = $5, 
                 status = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [name, email, phone || null, subject || null, message, status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Inquiry not found' 
            });
        }

        res.json({ 
            success: true, 
            inquiry: result.rows[0],
            message: 'Inquiry updated successfully'
        });
    } catch (err) {
        console.error('Error updating inquiry:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update inquiry' 
        });
    }
});

// --- Mark inquiry as contacted (admin only) - PATCH ---
app.patch('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE inquiries 
             SET status = 'contacted', updated_at = CURRENT_TIMESTAMP 
             WHERE id = $1 
             RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Inquiry not found' 
            });
        }
        res.json({ 
            success: true, 
            inquiry: result.rows[0],
            message: 'Inquiry marked as contacted'
        });
    } catch (err) {
        console.error('Error updating inquiry:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update inquiry' 
        });
    }
});

// --- Delete inquiry (admin only) ---
app.delete('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `DELETE FROM inquiries WHERE id = $1 RETURNING *`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Inquiry not found' 
            });
        }
        res.json({ 
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting inquiry:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to delete inquiry' 
        });
    }
});

// =====================
// NEWSLETTER SUBSCRIBERS
// =====================

app.post('/api/newsletter', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false, 
            error: 'Email is required' 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO newsletter_subscribers (email)
             VALUES ($1)
             RETURNING *`,
            [email]
        );

        emailService.sendNewsletterWelcome(email)
            .catch(err => console.error('Newsletter welcome email failed:', err));

        res.status(201).json({
            success: true,
            subscriber: result.rows[0],
            message: 'You\'ve been successfully subscribed!'
        });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ 
                success: false, 
                error: 'This email is already subscribed' 
            });
        }
        console.error('Error subscribing to newsletter:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Something went wrong' 
        });
    }
});

// =====================
// ANALYTICS
// =====================

app.post('/api/analytics/track', async (req, res) => {
    const { serviceId, serviceTitle } = req.body;

    if (!serviceId || !serviceTitle) {
        return res.status(400).json({ 
            success: false, 
            error: 'serviceId and serviceTitle are required' 
        });
    }

    try {
        await pool.query(
            `INSERT INTO service_views (service_id, service_title) 
             VALUES ($1, $2)`,
            [serviceId, serviceTitle]
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Error tracking service view:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to track view' 
        });
    }
});

app.get('/api/analytics/summary', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT service_id, service_title, COUNT(*) AS views
             FROM service_views
             GROUP BY service_id, service_title
             ORDER BY views DESC
             LIMIT 10`
        );
        res.json({ 
            success: true, 
            summary: result.rows 
        });
    } catch (err) {
        console.error('Error fetching analytics summary:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch analytics' 
        });
    }
});

// =====================
// AUTHENTICATION
// =====================

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            error: 'Username and password are required' 
        });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM admins WHERE username = $1`,
            [username]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        const passwordMatches = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatches) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ 
            success: true, 
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                role: 'admin'
            }
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Login failed. Please try again.' 
        });
    }
});

app.get('/api/admin/me', requireAuth, async (req, res) => {
    res.json({ 
        success: true, 
        admin: req.admin 
    });
});

// =====================
// ERROR HANDLING
// =====================

app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found' 
    });
});

app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
    });
});

// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.SENDGRID_API_KEY ? 'SendGrid (Production)' : 'SMTP (Development)'}`);
});