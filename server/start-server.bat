@echo off
cls
echo ================================
echo   Readable Passwords Server
echo ================================
echo.
echo Checking if dependencies are installed...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
echo ================================
echo.

node server.js

pause
