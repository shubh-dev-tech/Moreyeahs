<?php
/**
 * Simple Permalink Flush Script
 * Run this to fix 404 errors on staging
 */

// Load WordPress
require_once('wp-load.php');

echo "<h1>Flushing Permalinks</h1>";
echo "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 20px;'>";

// Re-register custom post types first
if (function_exists('register_case_study_post_type')) {
    register_case_study_post_type();
    echo "<p style='color: green;'>✓ Case study post type re-registered</p>";
} else {
    echo "<p style='color: orange;'>? register_case_study_post_type function not found</p>";
}

// Flush rewrite rules
flush_rewrite_rules(true);
echo "<p style='color: green;'>✓ Permalinks flushed successfully!</p>";

// Test URLs
echo "<h2>Test These URLs:</h2>";
echo "<ul>";
echo "<li><a href='" . home_url('/case-study/') . "' target='_blank'>Case Studies Archive</a></li>";
echo "<li><a href='" . home_url('/wp-json/wp/v2/case_study') . "' target='_blank'>REST API Endpoint</a></li>";
echo "</ul>";

echo "<p><strong>If you still get 404 errors:</strong></p>";
echo "<ol>";
echo "<li>Go to WordPress Admin → Settings → Permalinks</li>";
echo "<li>Click 'Save Changes' (don't change anything, just save)</li>";
echo "<li>Check that your .htaccess file has WordPress rewrite rules</li>";
echo "</ol>";

echo "</div>";
?>