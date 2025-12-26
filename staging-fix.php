<?php
/**
 * Staging Environment Fix Script
 * 
 * This script addresses common issues when moving from localhost to staging:
 * 1. Fatal error in wp_update_nav_menu hook
 * 2. 404 errors due to permalink/rewrite rules
 * 3. Custom post type registration issues
 * 4. ACF field synchronization
 * 
 * Run this script once on staging to fix the issues.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    require_once('../../../wp-load.php');
}

echo "<h1>Staging Environment Fix</h1>";
echo "<div style='font-family: Arial, sans-serif; max-width: 800px; margin: 20px;'>";

// 1. Check and fix the wp_update_nav_menu hook issue
echo "<h2>1. Checking wp_update_nav_menu Hook</h2>";

$functions_file = get_template_directory() . '-child/functions.php';
if (file_exists($functions_file)) {
    $content = file_get_contents($functions_file);
    
    // Check if the hook has the correct parameters
    if (strpos($content, "add_action('wp_update_nav_menu', function(\$menu_id, \$menu_data = null)") !== false) {
        echo "<p style='color: green;'>✓ wp_update_nav_menu hook is correctly configured with 2 parameters</p>";
    } else if (strpos($content, "add_action('wp_update_nav_menu', function(\$menu_id)") !== false) {
        echo "<p style='color: red;'>✗ wp_update_nav_menu hook has incorrect parameters (causing fatal error)</p>";
        echo "<p><strong>Fix:</strong> The hook callback needs to accept 2 parameters: \$menu_id and \$menu_data</p>";
    } else {
        echo "<p style='color: orange;'>? wp_update_nav_menu hook not found in functions.php</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Child theme functions.php not found</p>";
}

// 2. Flush rewrite rules
echo "<h2>2. Flushing Rewrite Rules</h2>";

// Re-register custom post types
if (function_exists('register_case_study_post_type')) {
    register_case_study_post_type();
    echo "<p style='color: green;'>✓ Case study post type re-registered</p>";
} else {
    echo "<p style='color: red;'>✗ register_case_study_post_type function not found</p>";
}

// Flush rewrite rules
flush_rewrite_rules(true);
echo "<p style='color: green;'>✓ Rewrite rules flushed (hard flush)</p>";

// 3. Check permalink structure
echo "<h2>3. Checking Permalink Structure</h2>";

$permalink_structure = get_option('permalink_structure');
if (empty($permalink_structure)) {
    echo "<p style='color: red;'>✗ Permalinks are set to 'Plain' - this may cause 404 issues</p>";
    echo "<p><strong>Recommendation:</strong> Go to Settings > Permalinks and choose 'Post name' or 'Custom Structure'</p>";
} else {
    echo "<p style='color: green;'>✓ Permalink structure: " . esc_html($permalink_structure) . "</p>";
}

// 4. Check custom post type registration
echo "<h2>4. Checking Custom Post Types</h2>";

$post_types = get_post_types(['public' => true, '_builtin' => false], 'objects');
if (isset($post_types['case_study'])) {
    $case_study = $post_types['case_study'];
    echo "<p style='color: green;'>✓ Case Study post type is registered</p>";
    echo "<p>- Slug: " . esc_html($case_study->rewrite['slug']) . "</p>";
    echo "<p>- Has Archive: " . ($case_study->has_archive ? 'Yes' : 'No') . "</p>";
    echo "<p>- Public: " . ($case_study->public ? 'Yes' : 'No') . "</p>";
    echo "<p>- Show in REST: " . ($case_study->show_in_rest ? 'Yes' : 'No') . "</p>";
} else {
    echo "<p style='color: red;'>✗ Case Study post type is not registered</p>";
}

// 5. Check for case studies
echo "<h2>5. Checking Case Study Content</h2>";

$case_studies = get_posts([
    'post_type' => 'case_study',
    'post_status' => 'publish',
    'numberposts' => 5
]);

if (!empty($case_studies)) {
    echo "<p style='color: green;'>✓ Found " . count($case_studies) . " published case studies</p>";
    foreach ($case_studies as $study) {
        $permalink = get_permalink($study->ID);
        echo "<p>- <a href='" . esc_url($permalink) . "' target='_blank'>" . esc_html($study->post_title) . "</a></p>";
    }
} else {
    echo "<p style='color: orange;'>? No published case studies found</p>";
}

// 6. Check ACF fields
echo "<h2>6. Checking ACF Integration</h2>";

if (function_exists('acf_get_field_groups')) {
    $field_groups = acf_get_field_groups();
    $case_study_groups = array_filter($field_groups, function($group) {
        return strpos($group['title'], 'Case Study') !== false || 
               (isset($group['location']) && 
                is_array($group['location']) && 
                json_encode($group['location']) !== false && 
                strpos(json_encode($group['location']), 'case_study') !== false);
    });
    
    if (!empty($case_study_groups)) {
        echo "<p style='color: green;'>✓ Found " . count($case_study_groups) . " ACF field groups for case studies</p>";
        foreach ($case_study_groups as $group) {
            echo "<p>- " . esc_html($group['title']) . "</p>";
        }
    } else {
        echo "<p style='color: orange;'>? No ACF field groups found for case studies</p>";
    }
} else {
    echo "<p style='color: red;'>✗ ACF is not active or available</p>";
}

// 7. Test CORS Headers
echo "<h2>7. Testing CORS Headers</h2>";

$test_cors_url = home_url('/wp-json/wp/v2/case_study');
$cors_response = wp_remote_get($test_cors_url, [
    'headers' => [
        'Origin' => 'http://localhost:3000'
    ]
]);

if (!is_wp_error($cors_response)) {
    $cors_headers = wp_remote_retrieve_headers($cors_response);
    
    $required_cors_headers = [
        'access-control-allow-origin' => 'Access-Control-Allow-Origin',
        'access-control-allow-methods' => 'Access-Control-Allow-Methods',
        'access-control-allow-headers' => 'Access-Control-Allow-Headers'
    ];
    
    $cors_ok = true;
    foreach ($required_cors_headers as $header_key => $header_name) {
        if (isset($cors_headers[$header_key])) {
            echo "<p style='color: green;'>✓ {$header_name}: {$cors_headers[$header_key]}</p>";
        } else {
            echo "<p style='color: red;'>✗ {$header_name}: Missing</p>";
            $cors_ok = false;
        }
    }
    
    if ($cors_ok) {
        echo "<p style='color: green; font-weight: bold;'>✓ CORS headers are properly configured!</p>";
    } else {
        echo "<p style='color: red; font-weight: bold;'>✗ CORS headers are missing - NextJS frontend will have issues</p>";
    }
} else {
    echo "<p style='color: red;'>✗ Could not test CORS headers: " . $cors_response->get_error_message() . "</p>";
}

// 8. Test URLs
echo "<h2>7. Testing URLs</h2>";

$test_urls = [
    home_url('/case-study/') => 'Case Studies Archive',
    home_url('/wp-json/wp/v2/case_study') => 'REST API Endpoint'
];

// 8. Test URLs
echo "<h2>8. Testing URLs</h2>";

$test_urls = [
    home_url('/case-study/') => 'Case Studies Archive',
    home_url('/wp-json/wp/v2/case_study') => 'REST API Endpoint'
];

foreach ($test_urls as $url => $description) {
    echo "<p>- <a href='" . esc_url($url) . "' target='_blank'>" . esc_html($description) . "</a></p>";
}

// 9. Environment check
echo "<h2>9. Environment Information</h2>";

echo "<p><strong>WordPress Version:</strong> " . get_bloginfo('version') . "</p>";
echo "<p><strong>Active Theme:</strong> " . get_template() . "</p>";
echo "<p><strong>Child Theme:</strong> " . (is_child_theme() ? get_stylesheet() : 'No') . "</p>";
echo "<p><strong>Site URL:</strong> " . home_url() . "</p>";
echo "<p><strong>WordPress URL:</strong> " . site_url() . "</p>";

// 10. Recommendations
echo "<h2>10. Staging Setup Recommendations</h2>";

echo "<div style='background: #f0f8ff; padding: 15px; border-left: 4px solid #0073aa; margin: 20px 0;'>";
echo "<h3>To fix the 404 and CORS issues on staging:</h3>";
echo "<ol>";
echo "<li><strong>Fix the fatal error:</strong> Update the wp_update_nav_menu hook in functions.php to accept 2 parameters</li>";
echo "<li><strong>Add CORS headers:</strong> Enable CORS in functions.php for NextJS frontend access</li>";
echo "<li><strong>Flush permalinks:</strong> Go to Settings > Permalinks and click 'Save Changes'</li>";
echo "<li><strong>Check .htaccess:</strong> Ensure the .htaccess file has proper WordPress rewrite rules</li>";
echo "<li><strong>Verify database:</strong> Make sure all case study posts were imported correctly</li>";
echo "<li><strong>Test URLs:</strong> Visit the case study archive and individual case study pages</li>";
echo "<li><strong>Test CORS:</strong> Use the test-cors-fix.php script to verify API access</li>";
echo "</ol>";
echo "</div>";

echo "<div style='background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;'>";
echo "<h3>If issues persist:</h3>";
echo "<ul>";
echo "<li>Check server error logs for PHP errors</li>";
echo "<li>Verify file permissions (folders: 755, files: 644)</li>";
echo "<li>Ensure all plugins are active and compatible</li>";
echo "<li>Check if mod_rewrite is enabled on the server</li>";
echo "<li>Test CORS with browser developer tools</li>";
echo "<li>Verify NextJS environment variables are correct</li>";
echo "</ul>";
echo "</div>";

echo "<div style='background: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0;'>";
echo "<h3>NextJS Frontend Configuration:</h3>";
echo "<p>Update your .env.local file:</p>";
echo "<pre>";
echo "NEXT_PUBLIC_WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "WORDPRESS_API_URL=" . home_url('/wp-json/wp/v2') . "\n";
echo "</pre>";
echo "<p><a href='" . home_url('/test-cors-fix.php') . "' target='_blank' style='background: #17a2b8; color: white; padding: 8px 16px; text-decoration: none; border-radius: 3px;'>→ Test CORS Configuration</a></p>";
echo "</div>";

echo "</div>";

// Add a button to flush permalinks again
echo "<form method='post' style='margin: 20px;'>";
echo "<input type='hidden' name='flush_permalinks' value='1'>";
echo "<button type='submit' style='background: #0073aa; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer;'>Flush Permalinks Again</button>";
echo "</form>";

if (isset($_POST['flush_permalinks'])) {
    flush_rewrite_rules(true);
    echo "<div style='background: #d4edda; color: #155724; padding: 10px; border: 1px solid #c3e6cb; border-radius: 3px; margin: 20px;'>";
    echo "✓ Permalinks flushed successfully!";
    echo "</div>";
}
?>