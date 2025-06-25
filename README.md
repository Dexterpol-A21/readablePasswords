# 🔐 Readable Passwords - Generador de Contraseñas Legibles en Español

Un generador de contraseñas que crea contraseñas seguras pero pronunciables en español, siguiendo reglas fonéticas naturales del idioma.

## 🌟 Características

- **Generación fonéticamente correcta**: Sigue reglas del español para crear palabras pronunciables
- **Análisis de fortaleza**: Sistema completo de evaluación de seguridad
- **Gestión de usuarios**: Autenticación JWT segura
- **Almacenamiento encriptado**: Contraseñas guardadas con AES-256-CBC
- **Interfaz educativa**: Explicación técnica del algoritmo

## 🚀 Demo en Vivo

- **Frontend**: https://salmon-dolphin-841207.hostingersite.com
- **Backend API**: https://readablepasswords.onrender.com

## 🏗️ Arquitectura

### Frontend (Cliente)
- HTML5, CSS3, JavaScript ES6+
- Algoritmo de generación ejecutado en el cliente
- Interfaz responsive y accesible

### Backend (Servidor)
- Node.js + Express.js
- Autenticación JWT
- Encriptación AES-256-CBC
- API REST completa

### Base de Datos
- PostgreSQL en Render Cloud
- Tablas: users, saved_passwords
- Encriptación en tránsito y reposo

## 🔧 Instalación Local

```bash
# Clonar repositorio
git clone https://github.com/paulcq6173/readable-passwords.git
cd readable-passwords

# Instalar dependencias del servidor
cd server
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Ejecutar servidor
npm start

# El frontend se sirve desde el servidor en http://localhost:3000
```

## 🌐 Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# Encriptación
ENCRYPTION_KEY=clave_de_32_caracteres_exactos

# Servidor
PORT=3000
NODE_ENV=production
```

## 📊 Algoritmo de Fortaleza

El sistema evalúa contraseñas usando 6 criterios:

1. **Longitud** (30 puntos máx): 16+ caracteres = 30 puntos
2. **Diversidad** (30 puntos máx): 4 tipos de caracteres = 30 puntos
3. **Equilibrio** (15 puntos máx): Distribución balanceada
4. **Patrones** (10 puntos máx): Sin repeticiones
5. **Entropía** (15 puntos máx): 60+ bits = 15 puntos
6. **Penalizaciones** (-40 puntos máx): Patrones débiles

## 🔒 Seguridad

### Contraseñas de Usuario
- **bcrypt hashing**: Salt automático, no reversible
- **Validación**: Comparación segura sin almacenar texto plano

### Contraseñas Generadas
- **AES-256-CBC**: Encriptación simétrica reversible
- **IV único**: Vector de inicialización aleatorio por contraseña
- **Clave de 32 caracteres**: Máxima seguridad para la encriptación

## 🎯 Algoritmo de Generación

1. **Análisis fonético**: Reglas del español para combinaciones válidas
2. **Sílabas complejas**: br, cl, tr, pr para naturalidad
3. **Terminaciones**: Morfología española (-ar, -er, -ción, etc.)
4. **Seguridad inteligente**: Números y símbolos sin romper legibilidad

## 📚 Uso de la API

### Autenticación
```javascript
POST /api/register
POST /api/login
```

### Gestión de Contraseñas
```javascript
GET /api/passwords        // Listar contraseñas
POST /api/passwords       // Guardar nueva contraseña
DELETE /api/passwords/:id // Eliminar contraseña
```

### Health Check
```javascript
GET /api/health          // Estado del servidor
```

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🎓 Proyecto Académico

Desarrollado como proyecto del 3er parcial de Programación Concurrente.
Demuestra conceptos de seguridad, encriptación y arquitectura web moderna.

## 📧 Contacto

Paulo Cedeño - [GitHub](https://github.com/paulcq6173)

Link del Proyecto: [https://github.com/paulcq6173/readable-passwords](https://github.com/paulcq6173/readable-passwords)