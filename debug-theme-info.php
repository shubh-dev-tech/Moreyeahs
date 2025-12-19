<?php
/**
 * Debug script to check theme information
 */

require_once 'wp-config.php';
require_once 'wp-load.php';

echo "=== WordPress Theme Debug Info ===\n";
echo "Active Theme: " . get_stylesheet() . "\n";
echo "Parent Theme: " . get_template() . "\n";
echo "Theme Directory: " . get_stylesheet_directory() . "\n";
echo "Template Directory: " . get_template_directory() . "\n";

// Check if REST API endpoints file exists
$child_rest_api = get_stylesheet_directory() . '/inc/rest-api-endpoints.php';
echo "Child REST API file exists: " . (file_exists($child_rest_api) ? 'YES' : 'NO') . "\n";
echo "Child REST API file path: " . $child_rest_api . "\n";

$parent_rest_api = get_template_directory() . '/inc/rest-api-endpoints.php';
echo "Parent REST API file exists: " . (file_exists($parent_rest_api) ? 'YES' : 'NO') . "\n";
echo "Parent REST API file path: " . $parent_rest_api . "\n";

// Check if functions are defined
$functions_to_check = [
    'get_all_menus_rest',
    'get_site_settings_rest',
    'get_categories_data_rest',
    'get_posts_data_rest'
];

echo "\n=== Function Definitions ===\n";
foreach ($functions_to_check as $func) {
    echo "$func: " . (function_exists($func) ? 'DEFINED' : 'NOT DEFINED') . "\n";
}

// Check REST API routes
echo "\n=== REST API Routes ===\n";
$rest_server = rest_get_server();
$routes = $rest_server->get_routes();

$custom_routes = [];
foreach ($routes as $route => $handlers) {
    if (strpos($route, '/wp/v2/') === 0 && !in_array($route, ['/wp/v2/posts', '/wp/v2/pages', '/wp/v2/categories'])) {
        $custom_routes[] = $route;
    }
}

if (empty($custom_routes)) {
    echo "No custom routes found\n";
} else {
    foreach ($custom_routes as $route) {
        echo "Found route: $route\n";
    }
}
?>