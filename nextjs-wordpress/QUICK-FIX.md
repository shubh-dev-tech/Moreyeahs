# Production Error Fix - Quick Guide

## The Error You're Seeing
```
TypeError: Cannot read properties of undefined (reading 'call')
(evaluating 'originalFactory.call')
```

This happens when the application tries to use PDF generation libraries (`html2canvas` and `jspdf`) that aren't properly installed on your production server.

## Why It Happens Locally But Not on Server
- **Local machine**: `node_modules` folder is present with all dependencies installed
- **Production server**: `node_modules` folder is either missing or incomplete
- **Result**: When the app tries to generate a PDF, it crashes because the required libraries aren't available

## Quick Fix (5 Minutes)

### On Your Production Server:

**If using Windows (Most Likely):**
1. Navigate to: `C:\inetpub\wwwroot\Moreyeahs\nextjs-wordpress` (or your install path)
2. Double-click: `fix-production.bat`
3. Wait for it to complete
4. Restart your Node.js application

**If using Linux/Mac:**
```bash
cd /path/to/nextjs-wordpress
bash fix-production.sh
```

### What the Script Does:
1. ✓ Removes old, potentially corrupted dependencies
2. ✓ Installs all required packages (including html2canvas and jspdf)
3. ✓ Rebuilds the Next.js application
4. ✓ Verifies everything is set up correctly

## Manual Fix (If Script Doesn't Work)

Run these commands on your production server:

```bash
# Go to your Next.js folder
cd C:\inetpub\wwwroot\Moreyeahs\nextjs-wordpress

# Remove old files
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path .next -Recurse -Force
Remove-Item -Path package-lock.json -Force

# Install dependencies
npm install

# Rebuild
npm run build

# Start the app
npm start
```

## Verify the Fix Works

1. Go to your production site
2. Navigate to any case study
3. Try downloading the PDF
4. If it works without errors = ✓ Fixed!

## If Problem Persists

1. **Check if node_modules was installed:**
   ```powershell
   dir node_modules | findstr html2canvas
   ```
   Should show `html2canvas` folder

2. **Check if .next build exists:**
   - Folder: `C:\inetpub\wwwroot\Moreyeahs\nextjs-wordpress\.next`
   - Should exist and contain `static` folder

3. **Check Application Logs:**
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Look for error messages
   - Share error with your development team

## Prevention for Next Time

- After any code changes, run: `npm run build`
- Always run `npm ci` (not just `npm install`) on production
- Keep `.next` folder in sync with source code
- Test PDF download feature after each deployment

## Still Not Working?

Contact your development team with this information:
- The error message from browser console
- Output from: `npm list html2canvas jspdf`
- Available disk space: `Check Local Disk C: Properties`
- Node.js version: `node -v` in command prompt

---

**Time to fix**: 5-15 minutes  
**Risk level**: Very Low (can be easily rolled back)  
**Impact**: Fixes PDF download feature on production
