const { Pool } = require('pg');
require('dotenv').config({ path: '../server/.env' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function queryUsers() {
    try {
        console.log('🔍 Consultando usuarios guardados...\n');
        
        // Consultar todos los usuarios
        const users = await pool.query(`
            SELECT 
                id,
                username,
                email,
                created_at,
                updated_at
            FROM users 
            ORDER BY created_at DESC
        `);
        
        if (users.rows.length === 0) {
            console.log('📭 No hay usuarios registrados todavía.');
            return;
        }
        
        console.log(`👥 Total de usuarios: ${users.rows.length}\n`);
        
        // Mostrar usuarios en formato tabla
        console.log('ID | Usuario      | Email                    | Fecha Registro');
        console.log('---|--------------|--------------------------|------------------');
        
        users.rows.forEach(user => {
            const id = user.id.toString().padEnd(2);
            const username = user.username.padEnd(12);
            const email = user.email.padEnd(24);
            const date = new Date(user.created_at).toLocaleDateString('es-ES');
            
            console.log(`${id} | ${username} | ${email} | ${date}`);
        });
        
        // Consultar contraseñas guardadas por usuario
        console.log('\n📱 Contraseñas guardadas por usuario:');
        console.log('Usuario      | Contraseñas Guardadas');
        console.log('-------------|----------------------');
        
        for (const user of users.rows) {
            const passwordCount = await pool.query(`
                SELECT COUNT(*) as count 
                FROM saved_passwords 
                WHERE user_id = $1
            `, [user.id]);
            
            const username = user.username.padEnd(12);
            const count = passwordCount.rows[0].count;
            console.log(`${username} | ${count}`);
        }
        
    } catch (error) {
        console.error('❌ Error consultando usuarios:', error.message);
    } finally {
        await pool.end();
    }
}

// Ejecutar consulta
queryUsers();
