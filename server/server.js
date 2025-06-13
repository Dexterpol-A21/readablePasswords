const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// CORS configuration SIMPLIFICADA para arreglar el error
app.use(cors({
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'http://localhost:5500', 
        'http://127.0.0.1:5500',
        'https://readablepasswords.onrender.com',
        'https://lightslategrey-tarsier-553107.hostingersite.com',
        'https://www.lightslategrey-tarsier-553107.hostingersite.com',
        'http://lightslategrey-tarsier-553107.hostingersite.com',
        'http://www.lightslategrey-tarsier-553107.hostingersite.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Middleware adicional para headers CORS
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'http://localhost:5500', 
        'http://127.0.0.1:5500',
        'https://readablepasswords.onrender.com',
        'https://lightslategrey-tarsier-553107.hostingersite.com',
        'https://www.lightslategrey-tarsier-553107.hostingersite.com',
        'http://lightslategrey-tarsier-553107.hostingersite.com',
        'http://www.lightslategrey-tarsier-553107.hostingersite.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Encryption utilities
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;

// Validate encryption key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    console.error('❌ ENCRYPTION_KEY must be exactly 32 characters long');
    process.exit(1);
}

function encrypt(text) {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt password');
    }
}

function decrypt(text) {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = textParts.join(':');
        const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt password');
    }
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Register user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login user
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT id, username, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get saved passwords
app.get('/api/passwords', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, label, password_encrypted, phonetic_text, strength_score, created_at FROM saved_passwords WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.userId]
        );

        const passwords = result.rows.map(row => ({
            id: row.id,
            label: row.label,
            password: decrypt(row.password_encrypted),
            phoneticText: row.phonetic_text,
            strengthScore: row.strength_score,
            createdAt: row.created_at
        }));

        res.json(passwords);
    } catch (error) {
        console.error('Get passwords error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save password
app.post('/api/passwords', authenticateToken, async (req, res) => {
    try {
        const { label, password, phoneticText, strengthScore } = req.body;

        // Validate input
        if (!label || !password) {
            return res.status(400).json({ error: 'Label and password are required' });
        }

        console.log('Saving password for user:', req.user.userId);
        console.log('Label:', label);
        console.log('Password length:', password.length);

        const encryptedPassword = encrypt(password);
        console.log('Password encrypted successfully');

        const result = await pool.query(
            'INSERT INTO saved_passwords (user_id, label, password_encrypted, phonetic_text, strength_score) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
            [req.user.userId, label, encryptedPassword, phoneticText || '', strengthScore || 0]
        );

        console.log('Password saved to database with ID:', result.rows[0].id);

        res.status(201).json({
            message: 'Password saved successfully',
            id: result.rows[0].id,
            createdAt: result.rows[0].created_at
        });
    } catch (error) {
        console.error('Save password error:', error);
        res.status(500).json({ error: 'Failed to save password: ' + error.message });
    }
});

// Delete password
app.delete('/api/passwords/:id', authenticateToken, async (req, res) => {
    try {
        const passwordId = req.params.id;

        const result = await pool.query(
            'DELETE FROM saved_passwords WHERE id = $1 AND user_id = $2',
            [passwordId, req.user.userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Password not found' });
        }

        res.json({ message: 'Password deleted successfully' });
    } catch (error) {
        console.error('Delete password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ 
            status: 'OK', 
            database: 'Connected',
            timestamp: result.rows[0].now,
            server: 'Running'
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ 
            status: 'Error', 
            database: 'Disconnected',
            error: error.message,
            server: 'Running'
        });
    }
});

// Serve the main app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/app.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../app.html'));
});

// Admin endpoints (solo para desarrollo)
if (process.env.NODE_ENV === 'development') {
    
    // Ver todos los usuarios
    app.get('/api/admin/users', async (req, res) => {
        try {
            const users = await pool.query(`
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    u.created_at,
                    COUNT(sp.id) as password_count
                FROM users u
                LEFT JOIN saved_passwords sp ON u.id = sp.user_id
                GROUP BY u.id, u.username, u.email, u.created_at
                ORDER BY u.created_at DESC
            `);
            
            res.json({
                total: users.rows.length,
                users: users.rows
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    
    // Ver contraseñas de un usuario específico
    app.get('/api/admin/users/:userId/passwords', async (req, res) => {
        try {
            const { userId } = req.params;
            
            const passwords = await pool.query(`
                SELECT 
                    id,
                    label,
                    strength_score,
                    created_at
                FROM saved_passwords 
                WHERE user_id = $1 
                ORDER BY created_at DESC
            `, [userId]);
            
            res.json({
                userId: parseInt(userId),
                total: passwords.rows.length,
                passwords: passwords.rows
            });
        } catch (error) {
            console.error('Get user passwords error:', error);
            res.status(500).json({ error: 'Server error' });
        }
    });
    
    console.log('🔧 Admin endpoints enabled in development mode');
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, '../')}`);
    console.log(`🌐 CORS enabled for production domains`);
    console.log(`🔗 Allowed origins: lightslategrey-tarsier-553107.hostingersite.com`);
    
    // Validate encryption key
    console.log(`🔐 Encryption key length: ${ENCRYPTION_KEY ? ENCRYPTION_KEY.length : 'NOT SET'} characters`);
    
    // Test database connection and create tables if needed
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('✅ Database connected successfully');
        console.log('📅 Current database time:', result.rows[0].now);
        
        // Check if tables exist, create them if they don't
        await createTablesIfNotExist();
        
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
});

async function createTablesIfNotExist() {
    try {
        console.log('🔧 Checking database tables...');
        
        // Check if users table exists
        const usersTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            );
        `);
        
        if (!usersTable.rows[0].exists) {
            console.log('📋 Creating users table...');
            await pool.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Users table created');
        }
        
        // Check if saved_passwords table exists
        const passwordsTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'saved_passwords'
            );
        `);
        
        if (!passwordsTable.rows[0].exists) {
            console.log('📋 Creating saved_passwords table...');
            await pool.query(`
                CREATE TABLE saved_passwords (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    label VARCHAR(100) NOT NULL,
                    password_encrypted TEXT NOT NULL,
                    phonetic_text TEXT,
                    strength_score INTEGER DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('✅ Saved_passwords table created');
        }
        
        console.log('✅ All database tables are ready');
        
    } catch (error) {
        console.error('❌ Error creating tables:', error.message);
    }
}
