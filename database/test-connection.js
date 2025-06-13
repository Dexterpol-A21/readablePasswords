const { Pool } = require('pg');
require('dotenv').config({ path: '../server/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');
        console.log('📡 Database URL:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));
        
        // Test basic connection
        const result = await pool.query('SELECT NOW() as current_time, version()');
        console.log('✅ Database connected successfully!');
        console.log('📅 Current time:', result.rows[0].current_time);
        console.log('🗄️  Database version:', result.rows[0].version.split(' ')[0]);
        
        // Test if tables exist
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('\n📋 Tables found:');
        if (tables.rows.length === 0) {
            console.log('  ⚠️  No tables found. You may need to run the schema.sql file.');
        } else {
            tables.rows.forEach(row => {
                console.log(`  ✓ ${row.table_name}`);
            });
        }
        
        // Test if users table exists and has the right structure
        if (tables.rows.some(row => row.table_name === 'users')) {
            const userColumns = await pool.query(`
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'users' 
                ORDER BY ordinal_position
            `);
            
            console.log('\n👤 Users table structure:');
            userColumns.rows.forEach(row => {
                const nullable = row.is_nullable === 'YES' ? '(nullable)' : '(required)';
                console.log(`  - ${row.column_name}: ${row.data_type} ${nullable}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n🔧 Troubleshooting tips:');
        console.log('1. Check if the DATABASE_URL is correct');
        console.log('2. Verify the database server is running');
        console.log('3. Ensure your IP is whitelisted (if using external service)');
        console.log('4. Check if SSL/TLS is properly configured');
    } finally {
        await pool.end();
    }
}

testConnection();
