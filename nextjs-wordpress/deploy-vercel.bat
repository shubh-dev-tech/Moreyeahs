@echo off
echo Deploying to Vercel with dev.moreyeahs.com data source...
echo.

REM Set environment variables for this deployment
set NEXT_PUBLIC_ENVIRONMENT=vercel
set NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
set WORDPRESS_API_URL=https://dev.moreyeahs.com/graphql
set WORDPRESS_REST_API_URL=https://dev.moreyeahs.com/wp-json

echo Environment: %NEXT_PUBLIC_ENVIRONMENT%
echo WordPress URL: %NEXT_PUBLIC_WORDPRESS_URL%
echo.

REM Build the project first
echo Building project...
npm run build

if %ERRORLEVEL% neq 0 (
    echo Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo.
echo Build successful! Ready to deploy to Vercel.
echo.
echo To deploy:
echo 1. Install Vercel CLI: npm i -g vercel
echo 2. Login to Vercel: vercel login
echo 3. Deploy: vercel --prod
echo.
echo Or use the Vercel dashboard to connect your repository.
echo.
pause