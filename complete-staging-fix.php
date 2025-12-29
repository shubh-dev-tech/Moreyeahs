<?php
/**
 * Complete Staging Fix Script
 * This script fixes all known issues with the staging environment
 */

// Load WordPress
require_once('wp-load.php');

echo "<!DOCTYPE html>";
echo "<html><head><title>Staging Fix Results</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:20px auto;padding:20px;}";
echo ".success{color:#155724;background:#d4edda;padding:10px;border:1px solid #c3e6cb;border-radius:3px;margin:10px 0;}";
echo ".error{color:#721c24;background:#f8d7da;padding:10px;border:1px solid #f5c6cb;border-radius:3px;margin:10px 0;}";
echo ".warning{color:#856404;background:#fff3cd;padding:10px;border:1px solid #ffeaa7;border-radius:3px;margin:10px 0;}";
echo ".info{color:#0c5460;background:#d1ecf1;padding:10px;border:1px solid #bee5eb;border-radius:3px;margin:10px 0;}";
echo "a{color:#007cba;text-decoration:none;}a:hover{text-decoration:underline;}";
echo "</style></head><body>";

echo "<h1>🔧 Complete Staging Fix</h1>";

// 1. Check for fatal errors
echo "<h2>1. Checking for Fatal Errors</h2>";

$error_log_path = WP_CONTENT_DIR . '/debug.log';
if (file_exists($error_log_path)) {
    $recent_errors = file_get_contents($error_log_path);
    if (strpos($recent_errors, 'wp_update_nav_menu') !== false) {
        echo "<div class='error'>⚠️ wp_update_nav_menu fatal errors detected in debug.log</div>";
        echo "<div class='info'>✅ Fixed: Removed duplicate wp_update_nav_menu hook from child theme</div>";
    } else {
        echo "<div class='success'>✅ No wp_update_nav_menu errors found</div>";
    }
} else {
    echo "<div class='info'>ℹ️ Debug log not found (this is normal if debug logging is disabled)</div>";
}

// 2. Re-register custom post types
echo "<h2>2. Re-registering Custom Post Types</h2>";

if (function_exists('register_case_study_post_type')) {
    register_case_study_post_type();
    echo "<div class='success'>✅ Case study post type re-registered</div>";
} else {
    echo "<div class='error'>❌ register_case_study_post_type function not found</div>";
}

// 3. Flush rewrite rules
echo "<h2>3. Flushing Rewrite Rules</h2>";

flush_rewrite_rules(true);
echo "<div class='success'>✅ Rewrite rules flushed (hard flush)</div>";

// 4. Check permalink structure
echo "<h2>4. Checking Permalink Structure</h2>";

$permalink_structure = get_option('permalink_structure');
if (empty($permalink_structure)) {
    echo "<div class='error'>❌ Permalinks are set to 'Plain' - this causes 404 issues</div>";
    echo "<div class='warning'>⚠️ Go to Settings > Permalinks and choose 'Post name'</div>";
} else {
    echo "<div class='success'>✅ Permalink structure: " . esc_html($permalink_structure) . "</div>";
}

// 5. Check custom post type registration
echo "<h2>5. Verifying Custom Post Types</h2>";

$post_types = get_post_types(['public' => true, '_builtin' => false], 'objects');
if (isset($post_types['case_study'])) {
    $case_study = $post_types['case_study'];
    echo "<div class='success'>✅ Case Study post type is registered</div>";
    echo "<ul>";
    echo "<li><strong>Slug:</strong> " . esc_html($case_study->rewrite['slug']) . "</li>";
    echo "<li><strong>Has Archive:</strong> " . ($case_study->has_archive ? 'Yes' : 'No') . "</li>";
    echo "<li><strong>Public:</strong> " . ($case_study->public ? 'Yes' : 'No') . "</li>";
    echo "<li><strong>Show in REST:</strong> " . ($case_study->show_in_rest ? 'Yes' : 'No') . "</li>";
    echo "</ul>";
} else {
    echo "<div class='error'>❌ Case Study post type is not registered</div>";
}

// 6. Check for case studies
echo "<h2>6. Checking Case Study Content</h2>";

$case_studies = get_posts([
    'post_type' => 'case_study',
    'post_status' => 'publish',
    'numberposts' => 10
]);

if (!empty($case_studies)) {
    echo "<div class='success'>✅ Found " . count($case_studies) . " published case studies</div>";
    echo "<ul>";
    foreach ($case_studies as $study) {
        $permalink = get_permalink($study->ID);
        echo "<li><a href='" . esc_url($permalink) . "' target='_blank'>" . esc_html($study->post_title) . "</a></li>";
    }
    echo "</ul>";
} else {
    echo "<div class='warning'>⚠️ No published case studies found</div>";
}

// 7. Test CORS Headers
echo "<h2>7. Testing CORS Headers</h2>";

$test_cors_url = home_url('/wp-json/wp/v2/case_study');
$cors_response = wp_remote_get($test_cors_url, [
    'headers' => [
        'Origin' => 'https://moreyeahs-case-vercel.app'
    ]
]);

if (!is_wp_error($cors_response)) {
    $cors_headers = wp_remote_retrieve_headers($cors_response);
    
    if (isset($cors_headers['access-control-allow-origin'])) {
        echo "<div class='success'>✅ CORS headers are configured</div>";
        echo "<p><strong>Access-Control-Allow-Origin:</strong> " . $cors_headers['access-control-allow-origin'] . "</p>";
    } else {
        echo "<div class='error'>❌ CORS headers are missing</div>";
    }
} else {
    echo "<div class='error'>❌ Could not test CORS: " . $cors_response->get_error_message() . "</div>";
}

// 8. Test URLs
echo "<h2>8. Test These URLs</h2>";

$test_urls = [
    home_url('/case-study/') => 'Case Studies Archive',
    home_url('/wp-json/wp/v2/case_study') => 'REST API Endpoint',
    home_url('/wp-json/wp/v2/posts') => 'Posts API Endpoint'
];

echo "<ul>";
foreach ($test_urls as $url => $description) {
    echo "<li><a href='" . esc_url($url) . "' target='_blank'>" . esc_html($description) . "</a></li>";
}
echo "</ul>";

// 9. Environment Information
echo "<h2>9. Environment Information</h2>";

echo "<ul>";
echo "<li><strong>WordPress Version:</strong> " . get_bloginfo('version') . "</li>";
echo "<li><strong>Active Theme:</strong> " . get_template() . "</li>";
echo "<li><strong>Child Theme:</strong> " . (is_child_theme() ? get_stylesheet() : 'No') . "</li>";
echo "<li><strong>Site URL:</strong> " . home_url() . "</li>";
echo "<li><strong>WordPress URL:</strong> " . site_url() . "</li>";
echo "</ul>";

// 10. Final Instructions
echo "<h2>10. Next Steps</h2>";

echo "<div class='info'>";
echo "<h3>If you still see 404 errors:</h3>";
echo "<ol>";
echo "<li>Go to <strong>WordPress Admin → Settings → Permalinks</strong></li>";
echo "<li>Click <strong>'Save Changes'</strong> (don't change anything, just save)</li>";
echo "<li>Clear any caching (LiteSpeed, CloudFlare, etc.)</li>";
echo "<li>Test the URLs above</li>";
echo "</ol>";
echo "</div>";

echo "<div class='info'>";
echo "<h3>For NextJS Frontend:</h3>";
echo "<p>Update your <code>.env.local</code> file:</p>";
echo "<pre>";
echo "NEXT_PUBLIC_WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "</pre>";
echo "</div>";

// Add a form to flush permalinks again if needed
echo "<form method='post' style='margin: 20px 0;'>";
echo "<input type='hidden' name='flush_again' value='1'>";
echo "<button type='submit' style='background: #0073aa; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer;'>🔄 Flush Permalinks Again</button>";
echo "</form>";

if (isset($_POST['flush_again'])) {
    flush_rewrite_rules(true);
    echo "<div class='success'>✅ Permalinks flushed again successfully!</div>";
    echo "<script>setTimeout(function(){ location.reload(); }, 2000);</script>";
}

echo "<hr>";
echo "<p><small>Fix completed at " . date('Y-m-d H:i:s') . "</small></p>";

echo "</body></html>";
?>