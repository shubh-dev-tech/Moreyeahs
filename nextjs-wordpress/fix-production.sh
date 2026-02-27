#!/bin/bash
# Production Fix Script for "originalFactory.call" Error
# Run this on your production server to fix the issue

set -e  # Exit on any error

echo "=========================================="
echo "Next.js Production Fix Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

print_status "Node.js version: $(node -v)"
print_status "npm version: $(npm -v)"
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_status "Working directory: $(pwd)"
echo ""

# Step 1: Clean node_modules and cache
print_warning "Step 1: Removing old node_modules and cache..."
rm -rf node_modules package-lock.json .next yarn.lock
print_status "Cleaned old dependencies and build cache"
echo ""

# Step 2: Install dependencies with npm ci (clean install)
print_warning "Step 2: Installing dependencies (this may take a few minutes)..."
npm ci --verbose
print_status "Dependencies installed successfully"
echo ""

# Step 3: Verify critical packages
print_warning "Step 3: Verifying critical packages..."
if npm list html2canvas &>/dev/null; then
    print_status "html2canvas is installed"
else
    print_error "html2canvas is NOT installed!"
    npm install html2canvas --save
fi

if npm list jspdf &>/dev/null; then
    print_status "jspdf is installed"
else
    print_error "jspdf is NOT installed!"
    npm install jspdf --save
fi
echo ""

# Step 4: Build the project
print_warning "Step 4: Building Next.js project..."
npm run build 2>&1 | tail -20
if [ ${PIPESTATUS[0]} -eq 0 ]; then
    print_status "Build completed successfully"
else
    print_error "Build failed! Check the output above for errors."
    exit 1
fi
echo ""

# Step 5: Verify build artifacts
print_warning "Step 5: Verifying build artifacts..."
if [ -d ".next" ]; then
    print_status ".next directory exists"
    BUILD_SIZE=$(du -sh .next | cut -f1)
    print_status "Build size: $BUILD_SIZE"
else
    print_error ".next directory not found!"
    exit 1
fi
echo ""

# Step 6: Check for common issues
print_warning "Step 6: Running diagnostic checks..."

# Check if environment file exists
if [ -f ".env.production" ]; then
    print_status ".env.production file exists"
else
    print_warning ".env.production file is missing!"
    if [ -f ".env.production.example" ]; then
        print_status "Creating .env.production from .env.production.example"
        cp .env.production.example .env.production
        print_warning "IMPORTANT: Edit .env.production with your production values!"
    fi
fi

# Check package.json for critical dependencies
if grep -q "html2canvas" package.json && grep -q "jspdf" package.json; then
    print_status "All critical dependencies are in package.json"
else
    print_error "Missing critical dependencies in package.json!"
fi
echo ""

# Final summary
echo "=========================================="
echo -e "${GREEN}✓ PRODUCTION FIX COMPLETED${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env.production with your production values (if not already done)"
echo "2. Verify configuration:"
echo "   - NEXT_PUBLIC_SITE_URL should point to your production domain"
echo "   - NEXT_PUBLIC_WORDPRESS_URL should point to your WordPress instance"
echo "3. Start the application:"
echo "   npm start"
echo "   OR with PM2:"
echo "   pm2 start npm --name \"moreyeahs\" -- start"
echo "4. Monitor logs for any errors:"
echo "   pm2 logs moreyeahs"
echo ""
print_warning "If you still see the 'originalFactory.call' error:"
echo "   1. Check the browser console for specific error messages"
echo "   2. Verify node_modules has html2canvas and jspdf installed"
echo "   3. Check disk space: df -h"
echo "   4. Run: npm ls html2canvas jspdf html2canvas"
echo ""

exit 0
