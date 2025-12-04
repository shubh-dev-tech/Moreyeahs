# Quick Setup Guide

## PowerShell Execution Policy Fix

If you get "running scripts is disabled" error, run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use Command Prompt (cmd) instead of PowerShell for npm commands.

## Installation Steps

1. **Navigate to project directory:**
   ```bash
   cd nextjs-wordpress
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update with your WordPress URL and site details

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Navigate to http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Type Check

```bash
npm run type-check
```

## Lint

```bash
npm run lint
```

## WordPress Requirements

See `WORDPRESS_SETUP.md` for complete WordPress configuration guide.

Required plugins:
- WPGraphQL
- Yoast SEO
- WPGraphQL for Yoast SEO

## Deployment

See `DEPLOYMENT.md` for deployment instructions.

Quick deploy to Vercel:
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## Troubleshooting

### npm commands not working in PowerShell

Use Command Prompt (cmd) or fix execution policy (see above).

### GraphQL errors

- Verify WordPress URL in `.env`
- Check WPGraphQL plugin is activated
- Test endpoint: `https://your-site.com/graphql`

### Build errors

- Run `npm run type-check` to find TypeScript errors
- Verify all environment variables are set
- Check WordPress is accessible

## Next Steps

1. Configure WordPress (see WORDPRESS_SETUP.md)
2. Create sample posts with SEO data
3. Test locally
4. Deploy to Vercel
5. Submit sitemap to search engines
