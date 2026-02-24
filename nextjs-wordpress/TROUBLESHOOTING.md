# Troubleshooting Guide - Production Runtime Errors

## Common Production Errors and Fixes

### Error 1: "Cannot read properties of undefined (reading 'call')"

**Cause**: Missing or corrupted node_modules dependencies

**Quick Check**:
```powershell
# Check if node_modules exists
dir node_modules

# Check specific packages
dir node_modules | findstr "html2canvas"
dir node_modules | findstr "jspdf"
```

**Fix**: Run the automated script
```bash
# Windows
.\fix-production.bat

# Linux/Mac
bash fix-production.sh
```

---

### Error 2: "Module not found: html2canvas" or "jsPDF"

**Cause**: Dependencies not installed

**Check**:
```bash
npm list html2canvas
npm list jspdf
# Should show version numbers, not "npm ERR!"
```

**Fix**:
```bash
npm install html2canvas jspdf
npm run build
npm start
```

---

### Error 3: "NEXT_PUBLIC_WORDPRESS_URL is not defined"

**Cause**: Missing environment variables

**Check**:
```bash
# Windows
dir .env*

# Linux/Mac
ls -la .env*
```

**Fix**:
```bash
# Copy example file
cp .env.production.example .env.production

# Edit with your production values
# Windows: use Notepad
notepad .env.production

# Linux/Mac: use nano or vim
nano .env.production
```

**Required variables**:
```
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_WORDPRESS_URL=https://wordpress-instance.com
WORDPRESS_REST_API_URL=https://wordpress-instance.com/wp-json
```

---

### Error 4: "Dynamic require is not supported"

**Cause**: Webpack bundling issue with dynamic imports

**Check**:
```bash
npm run build 2>&1 | grep -i "dynamic\|require"
```

**Fix**:
```bash
# Clear build cache
rm -rf .next

# Rebuild with verbose output
npm run build -- --debug

# Check for warnings in output
```

---

### Error 5: Application starts but shows blank page

**Cause**: Build error or missing assets

**Check**:
```bash
# Check build output
dir .next\static

# Check if server is actually running
netstat -ano | findstr :3000
```

**Fix**:
```bash
# Check logs
npm start 2>&1 | tee app.log

# Look for errors and stack traces
```

---

## Diagnostic Checklist

Run this when experiencing any issues:

### 1. System Check
```bash
# Check Node.js version (should be 18+)
node -v

# Check npm version
npm -v

# Check disk space
df -h  # Linux/Mac
dir    # Windows
```

### 2. Dependencies Check
```bash
# List critical dependencies
npm ls | head -20

# Check for conflicts
npm ls html2canvas jspdf

# Check for vulnerabilities
npm audit
```

### 3. Build Check
```bash
# Validate TypeScript
npm run type-check

# Validate lint
npm run lint

# Full rebuild
npm run build 2>&1 | tail -50
```

### 4. Environment Check
```bash
# Verify environment file
cat .env.production

# Check required variables
grep "NEXT_PUBLIC_SITE_URL" .env.production
grep "WORDPRESS_API_URL" .env.production
```

### 5. Runtime Check
```bash
# Start with verbose logging
NODE_DEBUG=* npm start 2>&1 | head -100

# Check server port
netstat -ano | findstr :3000

# Check application logs
pm2 logs moreyeahs  # If using PM2
```

---

## Log Analysis Guide

### Finding Errors in Next.js Logs

**Look for these keywords**:
- `Error` - Actual errors
- `Cannot find module` - Missing dependency
- `undefined` - Null reference error
- `ENOENT` - File not found
- `EACCES` - Permission denied
- `ECONNREFUSED` - Cannot connect (network issue)

### Common Log Patterns

**Missing dependency**:
```
Error: Cannot find module 'html2canvas'
```
→ Run: `npm install html2canvas`

**Build failed**:
```
error - generated client manifest
error - Failed to compile
```
→ Run: `rm -rf .next && npm run build`

**Port already in use**:
```
Error: listen EADDRINUSE :::3000
```
→ Run: `lsof -i :3000 && kill <PID>` (Linux/Mac) or `netstat -ano | findstr :3000` (Windows)

**Environment file error**:
```
Error: Cannot read properties of undefined (reading 'url')
```
→ Check: `.env.production` exists and has WORDPRESS_API_URL

---

## Performance Diagnosis

### High Memory Usage
```bash
# Check memory
free -h  # Linux/Mac
wmic OS get TotalVisibleMemorySize  # Windows

# Check Node process memory
ps aux | grep node
# or in Windows Task Manager: Look for node.exe process
```

**Fix**:
- Increase available RAM
- Enable compression in next.config.js
- Check for memory leaks in components

### Slow Build Time
```bash
# Time the build
time npm run build

# Check for large dependencies
npm ls | wc -l
du -sh node_modules
```

**Fix**:
- Clear cache: `npm run build -- --clean`
- Check for unnecessary dependencies
- Use `npm ci` instead of `npm install`

---

## Recovery Procedures

### Scenario 1: Application Won't Start

```bash
# 1. Check for errors
npm start 2>&1 | head -100

# 2. Clear cache
rm -rf .next

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm ci

# 4. Full rebuild
npm run build

# 5. Try starting again
npm start
```

### Scenario 2: Deployment Broke Everything

```bash
# 1. Check last working version (if using git)
git log --oneline | head -5

# 2. Revert to previous version
git checkout HEAD~1

# 3. Reinstall everything
npm ci
npm run build
npm start

# 4. If that works, identify what broke in new version
git diff HEAD..HEAD~1
```

### Scenario 3: Out of Disk Space

```bash
# Check space
df -h

# Delete unnecessary files
rm -rf .next node_modules .git/objects/pack/*.keep
npm cache clean --force

# Reinstall if needed
npm ci
npm run build
```

---

## Getting Help

When contacting support, include:

1. **Error Message**: Copy exactly from console
2. **Where It Happens**: Which page/feature triggers the error
3. **Environment**: Local, UAT, or Production
4. **Reproduction Steps**: How to reproduce
5. **Logs**: Output from `npm start` or server logs
6. **System Info**:
   ```bash
   node -v
   npm -v
   npm list html2canvas jspdf
   ```

---

## Prevention

### Regular Maintenance
```bash
# Weekly
npm audit fix

# Monthly
npm upgrade
npm run build

# Before each deployment
npm ci
npm run build
npm run type-check
npm run lint
```

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor server logs
- Set up alerts for high error rates
- Regular health checks

---

**Last Updated**: February 2026
**Document Version**: 1.0
