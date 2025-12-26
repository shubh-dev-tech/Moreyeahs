# Case Study Setup - Quick Start Script
# Run this after installing the theme

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Case Study CPT - Quick Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
$currentPath = Get-Location
Write-Host "Current directory: $currentPath" -ForegroundColor Yellow
Write-Host ""

# Instructions
Write-Host "SETUP STEPS:" -ForegroundColor Green
Write-Host ""

Write-Host "1. WordPress Admin Steps:" -ForegroundColor Yellow
Write-Host "   - Go to WordPress Admin Dashboard" -ForegroundColor White
Write-Host "   - Navigate to: Plugins > Installed Plugins" -ForegroundColor White
Write-Host "   - Verify 'Advanced Custom Fields PRO' is activated" -ForegroundColor White
Write-Host ""

Write-Host "2. Sync ACF Fields:" -ForegroundColor Yellow
Write-Host "   - Go to: Custom Fields > Tools" -ForegroundColor White
Write-Host "   - Click 'Sync Available' tab" -ForegroundColor White
Write-Host "   - Sync all 'Case Study' field groups" -ForegroundColor White
Write-Host ""

Write-Host "3. Save Permalinks:" -ForegroundColor Yellow
Write-Host "   - Go to: Settings > Permalinks" -ForegroundColor White
Write-Host "   - Click 'Save Changes' (no changes needed)" -ForegroundColor White
Write-Host "   - This flushes rewrite rules for the new post type" -ForegroundColor White
Write-Host ""

Write-Host "4. Test Case Study Creation:" -ForegroundColor Yellow
Write-Host "   - Go to: Case Studies > Add New" -ForegroundColor White
Write-Host "   - Add blocks: Case Study Header, Case Study Layout" -ForegroundColor White
Write-Host "   - Inside Layout: Add Left Sidebar and content blocks" -ForegroundColor White
Write-Host ""

Write-Host "5. Verify REST API:" -ForegroundColor Yellow
Write-Host "   - Open browser and visit:" -ForegroundColor White
Write-Host "   http://localhost/wp-json/wp/v2/case-studies" -ForegroundColor Cyan
Write-Host "   - Should return JSON array (may be empty initially)" -ForegroundColor White
Write-Host ""

Write-Host "6. Next.js Setup:" -ForegroundColor Yellow
Write-Host "   - Navigate to nextjs-wordpress directory" -ForegroundColor White
Write-Host "   - Verify .env.local has:" -ForegroundColor White
Write-Host "     NEXT_PUBLIC_WORDPRESS_URL=http://localhost" -ForegroundColor Cyan
Write-Host "   - Run: npm run dev" -ForegroundColor White
Write-Host "   - Visit: http://localhost:3000/case-study/[your-slug]" -ForegroundColor Cyan
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Available Blocks" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$blocks = @(
    "Case Study Header",
    "Case Study Layout",
    "Case Study Left Sidebar",
    "Meet the Client",
    "Case Study Content Section",
    "Case Study Quote",
    "Case Study CTA"
)

foreach ($block in $blocks) {
    Write-Host "  ✓ $block" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Useful URLs" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "WordPress Admin:" -ForegroundColor Yellow
Write-Host "  http://localhost/wp-admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Case Studies Archive:" -ForegroundColor Yellow
Write-Host "  http://localhost/case-studies/" -ForegroundColor Cyan
Write-Host ""
Write-Host "REST API Endpoints:" -ForegroundColor Yellow
Write-Host "  http://localhost/wp-json/wp/v2/case-studies" -ForegroundColor Cyan
Write-Host "  http://localhost/wp-json/wp/v2/case-studies/{slug}" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next.js Dev Server:" -ForegroundColor Yellow
Write-Host "  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Troubleshooting" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Problem: Blocks not showing" -ForegroundColor Red
Write-Host "Solution: Sync ACF fields in Custom Fields > Tools" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: 404 on single page" -ForegroundColor Red
Write-Host "Solution: Save permalinks in Settings > Permalinks" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: Styles not loading" -ForegroundColor Red
Write-Host "Solution: Clear browser cache (Ctrl+Shift+R)" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: REST API 404" -ForegroundColor Red
Write-Host "Solution: Save permalinks and check post type registration" -ForegroundColor Green
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Documentation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Full guide: CASE-STUDY-COMPLETE-GUIDE.md" -ForegroundColor Yellow
Write-Host ""

Write-Host "Setup complete! Follow the steps above to activate." -ForegroundColor Green
Write-Host ""
