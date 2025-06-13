# Readable Passwords - Setup Instructions

## Prerequisites
- Node.js installed
- PostgreSQL database (already configured)

## Setup Steps

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Start the Server
```bash
cd server
npm start
```
Or double-click `start-server.bat`

### 3. Access the Application
- Open your browser and go to: http://localhost:3000
- Or open `index.html` with Live Server (make sure server is running first)

## Troubleshooting

### "Error de conexión"
- Make sure the server is running on port 3000
- Check if you installed dependencies with `npm install`
- Verify the database connection in the server console

### Registration/Login Issues
- Check the server console for error messages
- Make sure the database is accessible

## Usage

1. **Register**: Create a new account with username, email, and password
2. **Login**: Use your email and password to access the app
3. **Generate Passwords**: Use the password generator in the app
4. **Save Passwords**: Save generated passwords with labels

## Database
- The app uses PostgreSQL hosted on Render
- All passwords are encrypted before storage
- User authentication uses JWT tokens
