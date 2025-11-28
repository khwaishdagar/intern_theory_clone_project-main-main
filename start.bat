@echo off
echo ========================================
echo   InternTheory Project Startup
echo ========================================
echo.

REM Check if MongoDB container exists
docker ps -a --filter "name=intern-theory-mongo" --format "{{.Names}}" > nul 2>&1
if errorlevel 1 (
    echo Starting MongoDB container...
    docker run -d -p 27017:27017 --name intern-theory-mongo mongo:6
    echo Waiting for MongoDB to initialize...
    timeout /t 10 /nobreak >nul
) else (
    echo Starting existing MongoDB container...
    docker start intern-theory-mongo > nul 2>&1
    timeout /t 3 /nobreak >nul
)

REM Start Backend
echo.
echo [1/2] Starting Backend Server...
echo ----------------------------------------
cd backend
start "InternTheory Backend" cmd /k "npm start"
echo Backend starting on http://localhost:5000
timeout /t 5 /nobreak >nul

REM Start Frontend
echo.
echo [2/2] Starting Frontend Server...
echo ----------------------------------------
cd ..
start "InternTheory Frontend" cmd /k "npx http-server . -p 3000"
echo Frontend starting on http://localhost:3000

echo.
echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo   Backend API:  http://localhost:5000
echo   Frontend Web: http://localhost:3000
echo   MongoDB:      localhost:27017
echo ========================================
echo.
echo Opening application in browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000/index.html

echo.
echo Setup complete! All servers are running.
echo Close the Backend and Frontend windows to stop the servers.
echo.
pause

