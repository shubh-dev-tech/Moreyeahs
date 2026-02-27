@echo off
REM Production Fix Script for "originalFactory.call" Error
REM Run this on your production server to fix the issue
REM This is the Windows version

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Next.js Production Fix Script (Windows)
echo ==========================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%
echo.

REM Get current directory
cd /d "%~dp0"
echo [OK] Working directory: %CD%
echo.

REM Step 1: Clean node_modules and cache
echo [STEP 1] Removing old node_modules and cache...
if exist node_modules (
    echo Deleting node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json del package-lock.json
if exist .next (
    echo Deleting .next build cache...
    rmdir /s /q .next
)
if exist yarn.lock del yarn.lock
echo [OK] Cleaned old dependencies and build cache
echo.

REM Step 2: Install dependencies with npm ci
echo [STEP 2] Installing dependencies (this may take a few minutes)...
npm ci
if errorlevel 1 (
    echo [ERROR] npm ci failed!
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully
echo.

REM Step 3: Verify critical packages
echo [STEP 3] Verifying critical packages...
npm list html2canvas >nul 2>&1
if errorlevel 1 (
    echo [WARNING] html2canvas not found, installing...
    npm install html2canvas --save
) else (
    echo [OK] html2canvas is installed
)

npm list jspdf >nul 2>&1
if errorlevel 1 (
    echo [WARNING] jspdf not found, installing...
    npm install jspdf --save
) else (
    echo [OK] jspdf is installed
)
echo.

REM Step 4: Build the project
echo [STEP 4] Building Next.js project...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed! Check the output above for errors.
    pause
    exit /b 1
)
echo [OK] Build completed successfully
echo.

REM Step 5: Verify build artifacts
echo [STEP 5] Verifying build artifacts...
if exist .next (
    echo [OK] .next directory exists
    REM Get directory size (approximate)
    dir /s .next | find "File(s)" | for /f "tokens=3" %%A in ('findstr /r "File"') do (
        echo [OK] Build directory verified
    )
) else (
    echo [ERROR] .next directory not found!
    pause
    exit /b 1
)
echo.

REM Step 6: Check for common issues
echo [STEP 6] Running diagnostic checks...

if exist .env.production (
    echo [OK] .env.production file exists
) else (
    if exist .env.production.example (
        echo [WARNING] .env.production file is missing!
        echo Creating .env.production from .env.production.example...
        copy .env.production.example .env.production
        echo [WARNING] IMPORTANT: Edit .env.production with your production values!
    ) else (
        echo [ERROR] .env.production file is missing!
    )
)

REM Check package.json for critical dependencies
findstr /M "html2canvas" package.json >nul
if errorlevel 1 (
    echo [ERROR] html2canvas not found in package.json!
) else (
    echo [OK] html2canvas in package.json
)

findstr /M "jspdf" package.json >nul
if errorlevel 1 (
    echo [ERROR] jspdf not found in package.json!
) else (
    echo [OK] jspdf in package.json
)
echo.

REM Final summary
echo.
echo ==========================================
echo [SUCCESS] PRODUCTION FIX COMPLETED!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit .env.production with your production values
echo 2. Verify configuration:
echo    - NEXT_PUBLIC_SITE_URL should point to your production domain
echo    - NEXT_PUBLIC_WORDPRESS_URL should point to your WordPress instance
echo 3. Start the application:
echo    npm start
echo    OR with PM2:
echo    pm2 start npm --name "moreyeahs" -- start
echo 4. Monitor logs for any errors:
echo    pm2 logs moreyeahs
echo.
echo If you still see the 'originalFactory.call' error:
echo    1. Check the browser console for specific error messages
echo    2. Verify node_modules has html2canvas and jspdf:
echo       npm list html2canvas jspdf
echo    3. Check disk space: Run Explorer and check drive space
echo    4. Clear browser cache and refresh the page
echo.

pause
