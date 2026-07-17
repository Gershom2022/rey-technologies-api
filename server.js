const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db/pool');
const requireAuth = require('./middleware/auth');
const emailService = require('./services/emailService');
const { inquirySchema, loginSchema, newsletterSchema } = require('./validation');
const logger = require('./logger');
require('dotenv').config();

const app = express();

// =====================
// CORS - MUST BE FIRST
// =====================
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

// =====================
// SECURITY MIDDLEWARE
// =====================

// 1. Helmet - Security headers
app.use(helmet());

// 2. Compression - Gzip compression for better performance
app.use(compression());

// 3. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Stricter limit for contact form
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 submissions per hour
    message: {
        success: false,
        error: 'Too many contact form submissions. Please try again later.'
    }
});
app.use('/api/inquiries', contactLimiter);

// Stricter limit for newsletter
const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 subscriptions per hour
    message: {
        success: false,
        error: 'Too many subscription attempts. Please try again later.'
    }
});
app.use('/api/newsletter', newsletterLimiter);

// Stricter limit for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 failed login attempts
    message: {
        success: false,
        error: 'Too many login attempts. Please try again later.'
    },
    skipSuccessfulRequests: true,
});
app.use('/api/auth/login', loginLimiter);

app.use(express.json());

// =====================
// LOGGING MIDDLEWARE
// =====================

// Log all requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});

// =====================
// ROOT ENDPOINT
// =====================

app.get('/', (req, res) => {
    res.send('Rey Technologies API is Running');
});

// =====================
// CONTACT FORM INQUIRIES
// =====================

// --- Create inquiry (public) ---
app.post('/api/inquiries', async (req, res) => {
    const { name, email, message, phone, subject } = req.body;

    // Validate input
    const { error } = inquirySchema.validate({ name, email, message, phone, subject });
    if (error) {
        logger.warn('Validation failed:', { error: error.details[0].message, email });
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO inquiries (name, email, message, phone, subject, status)
             VALUES ($1, $2, $3, $4, $5, 'pending')
             RETURNING *`,
            [name, email, message, phone || null, subject || null]
        );

        logger.info('New inquiry created:', { id: result.rows[0].id, email });

        // Send emails (fire and forget)
        emailService.sendContactNotification({
            name,
            email,
            message,
            phone,
            subject,
        }).catch(err => logger.error('Admin notification email failed:', err));

        emailService.sendConfirmationEmail(email, name, {
            name,
            email,
            phone,
            subject,
            message
        }).catch(err => logger.error('Confirmation email failed:', err));

        res.status(201).json({
            success: true,
            inquiry: result.rows[0],
            message: 'Your inquiry has been received. We\'ll respond within 24 hours.'
        });
    } catch (err) {
        logger.error('Error creating inquiry:', err);
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
        
        logger.info('Inquiries fetched', { count: result.rows.length });
        res.json({ success: true, inquiries: result.rows });
    } catch (err) {
        logger.error('Error fetching inquiries:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch inquiries' 
        });
    }
});

// --- Update inquiry fully (admin only) ---
app.put('/api/inquiries/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, subject, message, status } = req.body;

    // Validate input
    const { error } = inquirySchema.validate({ name, email, message, phone, subject });
    if (error) {
        logger.warn('Validation failed on update:', { error: error.details[0].message, id });
        return res.status(400).json({
            success: false,
            error: error.details[0].message
        });
    }

    try {
        // Check if inquiry exists
        const checkResult = await pool.query(
            'SELECT id FROM inquiries WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Inquiry not found'
            });
        }

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

        logger.info('Inquiry updated:', { id, status, updatedBy: req.admin?.username });

        res.json({ 
            success: true, 
            inquiry: result.rows[0],
            message: 'Inquiry updated successfully'
        });
    } catch (err) {
        logger.error('Error updating inquiry:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to update inquiry' 
        });
    }
});

// --- Mark inquiry as contacted (admin only) ---
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
        
        logger.info('Inquiry marked as contacted:', { id, updatedBy: req.admin?.username });

        res.json({ 
            success: true, 
            inquiry: result.rows[0],
            message: 'Inquiry marked as contacted'
        });
    } catch (err) {
        logger.error('Error updating inquiry status:', err);
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
        
        logger.info('Inquiry deleted:', { id, deletedBy: req.admin?.username });

        res.json({ 
            success: true,
            message: 'Inquiry deleted successfully'
        });
    } catch (err) {
        logger.error('Error deleting inquiry:', err);
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

    // Validate input
    const { error } = newsletterSchema.validate({ email });
    if (error) {
        logger.warn('Newsletter validation failed:', { error: error.details[0].message });
        return res.status(400).json({ 
            success: false, 
            error: error.details[0].message 
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO newsletter_subscribers (email)
             VALUES ($1)
             RETURNING *`,
            [email]
        );

        logger.info('Newsletter subscription:', { email });

        emailService.sendNewsletterWelcome(email)
            .catch(err => logger.error('Newsletter welcome email failed:', err));

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
        logger.error('Error subscribing to newsletter:', err);
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
        logger.error('Error tracking service view:', err);
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
        logger.error('Error fetching analytics summary:', err);
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

    // Validate input
    const { error } = loginSchema.validate({ username, password });
    if (error) {
        logger.warn('Login validation failed:', { username, error: error.details[0].message });
        return res.status(400).json({ 
            success: false, 
            error: error.details[0].message 
        });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM admins WHERE username = $1`,
            [username]
        );

        const admin = result.rows[0];

        if (!admin) {
            logger.warn('Login failed - user not found:', { username });
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid credentials' 
            });
        }

        const passwordMatches = await bcrypt.compare(password, admin.password_hash);

        if (!passwordMatches) {
            logger.warn('Login failed - wrong password:', { username });
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

        logger.info('Login successful:', { username });

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
        logger.error('Error during login:', err);
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

// 404 handler for undefined routes
app.use((req, res) => {
    logger.warn('Route not found:', { url: req.url, method: req.method });
    res.status(404).json({ 
        success: false, 
        error: 'Endpoint not found' 
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Global error:', err);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
});

// =====================
// START SERVER
// =====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.SENDGRID_API_KEY ? 'SendGrid (Production)' : 'SMTP (Development)'}`);
    console.log(`🔒 Security: Helmet, Rate Limiting, Compression enabled`);
    console.log(`📝 Logging: Winston enabled`);
    console.log(`✅ Validation: Joi enabled`);
});