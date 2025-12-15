@echo off
echo Testing Vercel Environment Configuration...
echo.

REM Set Vercel environment variables
set NEXT_PUBLIC_ENVIRONMENT=vercel
set NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
set WORDPRESS_API_URL=https://dev.moreyeahs.com/graphql
set WORDPRESS_REST_API_URL=https://dev.moreyeahs.com/wp-json
set VERCEL=1

echo Environment Variables Set:
echo NEXT_PUBLIC_ENVIRONMENT=%NEXT_PUBLIC_ENVIRONMENT%
echo NEXT_PUBLIC_WORDPRESS_URL=%NEXT_PUBLIC_WORDPRESS_URL%
echo WORDPRESS_API_URL=%WORDPRESS_API_URL%
echo.

echo Starting development server with Vercel environment...
echo This will simulate how your app will behave on Vercel.
echo.
echo Press Ctrl+C to stop the server.
echo.

npm run dev