const crypto = require('crypto');

// Generar clave de encriptación de 32 caracteres
const encryptionKey = crypto.randomBytes(16).toString('hex');
console.log('🔑 Nueva ENCRYPTION_KEY (32 caracteres):');
console.log(encryptionKey);
console.log('📏 Longitud:', encryptionKey.length);

// Generar JWT secret más seguro
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Nuevo JWT_SECRET:');
console.log(jwtSecret);
