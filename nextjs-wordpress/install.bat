@echo off
echo ========================================
echo Next.js WordPress Headless CMS Setup
echo ========================================
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo Please check your Node.js installation.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy .env.example to .env
echo 2. Update .env with your WordPress URL
echo 3. Run: npm run dev
echo.
pause
