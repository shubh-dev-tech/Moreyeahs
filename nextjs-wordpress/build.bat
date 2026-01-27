@echo off
echo ========================================
echo Building Next.js WordPress Project
echo ========================================
echo.

echo Running type check...
call npm run type-check

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Type check failed!
    pause
    exit /b 1
)

echo.
echo Running build...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build successful!
echo ========================================
echo.
echo To start production server, run: npm start
echo.
pause
