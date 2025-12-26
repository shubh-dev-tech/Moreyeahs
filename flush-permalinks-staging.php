<?php
/**
 * Simple Permalink Flush for Staging
 * 
 * Run this script to flush permalinks and fix 404 issues on staging
 */

// Load WordPress
require_once('wp-load.php');

// Re-register custom post types
if (function_exists('register_case_study_post_type')) {
    register_case_study_post_type();
}

// Flush rewrite rules
flush_rewrite_rules(true);

echo "✓ Permalinks flushed successfully!\n";
echo "✓ Custom post types re-registered\n";
echo "✓ Rewrite rules updated\n\n";

echo "Now test your case study URLs:\n";
echo "- Case Studies Archive: " . home_url('/case-study/') . "\n";
echo "- REST API: " . home_url('/wp-json/wp/v2/case_study') . "\n";
?>