# Fix PowerShell Execution Policy Error

## The Error

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because 
running scripts is disabled on this system.
```

## Solutions (Choose One)

### Solution 1: Use Command Prompt (Easiest)

Instead of PowerShell, use Command Prompt (cmd):

1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project: `cd C:\xampp\htdocs\moreyeahs-new\nextjs-wordpress`
4. Run: `npm install`

### Solution 2: Fix PowerShell (Recommended)

**Option A: Current User Only (No Admin Required)**

Open PowerShell and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Option B: System-Wide (Requires Admin)**

1. Right-click PowerShell
2. Select "Run as Administrator"
3. Run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

### Solution 3: Bypass for Single Command

```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### Solution 4: Use Batch Files

We've included batch files that work without PowerShell:

```cmd
install.bat    # Install dependencies
build.bat      # Build project
```

## Verify Fix

After applying a solution, test:

```bash
npm --version
```

Should display npm version without errors.

## What This Does

- **RemoteSigned**: Allows local scripts, requires signature for downloaded scripts
- **CurrentUser**: Only affects your user account
- **Safe**: This is a standard setting for development

## Still Having Issues?

### Check Node.js Installation

```cmd
node --version
npm --version
```

Both should display version numbers.

### Reinstall Node.js

1. Download from https://nodejs.org/
2. Install LTS version
3. Restart computer
4. Try again

### Use Git Bash

If you have Git installed:
1. Open Git Bash
2. Navigate to project
3. Run `npm install`

## Security Note

The `RemoteSigned` policy is safe for development and is the recommended setting for developers on Windows. It allows you to run local scripts while still protecting against unsigned scripts from the internet.

## Alternative: Use WSL

For a Linux-like experience on Windows:

1. Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install
2. Install Ubuntu from Microsoft Store
3. Use Linux commands directly

## Quick Reference

```bash
# Check current policy
Get-ExecutionPolicy

# Set for current user (recommended)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Set for all users (requires admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned

# Bypass for one command
powershell -ExecutionPolicy Bypass -Command "your-command"

# Use Command Prompt instead
cmd
```

## After Fixing

Once fixed, you can run:

```bash
cd nextjs-wordpress
npm install
npm run dev
```

Your development server will start at http://localhost:3000
