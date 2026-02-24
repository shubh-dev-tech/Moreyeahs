# Production Deployment Checklist

## Critical: Fixing the "originalFactory.call" Runtime Error

### Root Cause
The error `TypeError: Cannot read properties of undefined (reading 'call')(evaluating 'originalFactory.call')` occurs when:
1. **Missing dependencies** - `node_modules` folder not present on production server with `html2canvas` and `jspdf` packages
2. **Corrupted build** - `.next` folder out of sync with source code
3. **Stale build artifacts** - Old compiled code referencing packages that aren't available

### Solution: Deploy These Steps

#### On Your Production Server (inetpub\wwwroot\Moreyeahs or similar):

```bash
# 1. Navigate to the project directory
cd /path/to/nextjs-wordpress

# 2. Clean install dependencies (this is the CRITICAL step)
npm ci
# OR if using npm install:
npm install --force

# 3. Clear the Next.js cache
rm -rf .next
# On Windows PowerShell:
Remove-Item -Path .next -Recurse -Force

# 4. Rebuild the project
npm run build

# 5. Start the production server
npm start
# OR use a process manager like PM2:
pm2 start npm --name "moreyeahs" -- start
```

#### Environment Configuration Checklist:

- [ ] `.env.production` exists in `/nextjs-wordpress`
- [ ] `NODE_ENV=production` is set
- [ ] `NEXT_PUBLIC_SITE_URL` points to your production domain
- [ ] `NEXT_PUBLIC_WORDPRESS_URL` points to correct WordPress instance
- [ ] All required variables from `.env.production.example` are configured

#### Server Requirements:

- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm or yarn installed (`npm -v`)
- [ ] Sufficient disk space for node_modules (~500MB)
- [ ] Proper file permissions on the deployment directory
- [ ] Port 3000 (or configured port) is accessible

### Changes Made to Fix This Issue:

1. **Enhanced Error Handling** in `src/utils/pdfGenerator.ts`:
   - Better null checks for dynamically imported modules
   - More descriptive error messages about missing dependencies
   - Graceful fallback instead of immediate crash

2. **What was fixed**:
   ```typescript
   // BEFORE: Would crash if module load fails
   const html2canvasModule = await import('html2canvas');
   return html2canvasModule.default; // Could fail silently
   
   // AFTER: Properly validates module and provides clear error
   const html2canvasModule = await import('html2canvas');
   if (!html2canvasModule || !html2canvasModule.default) {
     throw new Error('html2canvas module is invalid or corrupted');
   }
   return html2canvasModule.default;
   ```

### Verification Steps After Deployment:

1. **Test the build**:
   ```bash
   npm run build
   # Should complete without errors
   ```

2. **Check node_modules**:
   ```bash
   ls -la node_modules | grep -E "html2canvas|jspdf"
   # Should show both packages
   ```

3. **Test the application**:
   - Visit your production site
   - Navigate to a case study page
   - Try the PDF download feature
   - Check browser console for errors

4. **Check server logs**:
   ```bash
   pm2 logs moreyeahs
   # Should show no module resolution errors
   ```

### If Problem Persists:

1. **Re-verify dependencies**:
   ```bash
   npm list html2canvas jspdf
   ```

2. **Check for version conflicts**:
   ```bash
   # View package versions
   npm ls
   ```

3. **Try a complete clean installation**:
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run build
   npm start
   ```

4. **Check .next build output**:
   - Verify _.next/static/chunks_ contains properly bundled code
   - Look for any missing module warnings during build

### Prevention Tips:

- [ ] Use `npm ci` instead of `npm install` for exact version reproducibility
- [ ] Always run full build before deployment
- [ ] Keep `.next` folder in sync with source code (rebuild after code changes)
- [ ] Monitor server disk space (node_modules can grow)
- [ ] Use production-grade process manager (PM2, systemd, etc.)
- [ ] Set up automated error monitoring (Sentry, LogRocket, etc.)

### Emergency Rollback:

If the deployment breaks everything:
```bash
# Revert to last working version
git checkout HEAD~1
npm ci
npm run build
npm start
```

---

## Additional Production Best Practices

### Environment Configuration
- ✅ Use `.env.production` (never commit secrets to git)
- ✅ Rotate JWT_AUTH_SECRET_KEY for security
- ✅ Set ALLOWED_ORIGIN to exact production domain
- ✅ Use HTTPS URLs for WORDPRESS_URL

### Performance
- ✅ Enable image optimization in next.config.js
- ✅ Configure CDN/caching headers
- ✅ Monitor bundle size
- ✅ Set up ISR (Incremental Static Regeneration) if needed

### Security
- ✅ Enable authentication middleware if using protected routes
- ✅ Set security headers (already configured in vercel.json)
- ✅ Keep dependencies updated
- ✅ Monitor for vulnerabilities: `npm audit`

### Monitoring
- ✅ Set up error logging
- ✅ Monitor server performance
- ✅ Set up uptime monitoring
- ✅ Regular log rotation

---

**Last Updated**: February 2026
**Document Status**: Critical - Required for production deployment
