# Starting Development Environment

## Quick Start

### 1. Start WordPress (XAMPP)
Make sure XAMPP Apache and MySQL are running.

### 2. Start Next.js Development Server

```bash
cd nextjs-wordpress
npm run dev
```

The Next.js app will be available at: `http://localhost:3000`

## Useful Commands

### Install Dependencies
```bash
npm install
```

### Build for Production
```bash
npm run build
npm start
```

### Type Check
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

## Troubleshooting

### Port 3000 Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
```

### Clear Next.js Cache
```bash
# Windows
rmdir /s /q .next
npm run dev

# Or use the provided batch file
RESTART.bat
```

### WordPress REST API Not Working
1. Check if Apache is running in XAMPP
2. Visit: `http://localhost/moreyeahs-new/wp-json/`
3. You should see a JSON response with available endpoints

### CORS Errors
Make sure your `.env` file has the correct WordPress URL:
```
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/moreyeahs-new
```

## Environment Variables

Create a `.env.local` file for local development overrides (this file is gitignored):

```env
# Override any .env values here for local development
WORDPRESS_API_URL=http://localhost/moreyeahs-new/graphql
NEXT_PUBLIC_WORDPRESS_URL=http://localhost/moreyeahs-new
```

## WordPress Admin

Access WordPress admin at: `http://localhost/moreyeahs-new/wp-admin`

### Important Settings to Check:
1. **Permalinks:** Settings > Permalinks (should NOT be "Plain")
2. **Menus:** Appearance > Menus (create and assign menus)
3. **Logo/Favicon:** Appearance > Site Appearance
4. **ACF Blocks:** Should be automatically registered
