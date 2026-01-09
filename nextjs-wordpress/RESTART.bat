@echo off
echo ========================================
echo Restarting Next.js with Clean Cache
echo ========================================
echo.

echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Cleaning cache...
if exist .next rmdir /s /q .next
echo Cache cleared!

echo.
echo Starting Next.js dev server...
echo.
echo ========================================
echo Visit this URL:
echo ========================================
echo Homepage:   http://localhost:3000
echo ========================================
echo.

npm run dev
