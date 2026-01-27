<?php
/**
 * Test REST API Routes Migration
 * 
 * This file tests that the REST API routes are working correctly after migration.
 * Access this file directly in your browser: http://your-site.com/wp-content/themes/twentytwentyfive-child/test-rest-api-routes.php
 * 
 * Or run from command line: php test-rest-api-routes.php
 */

// Load WordPress
require_once('../../../../../wp-load.php');

echo "<h1>REST API Routes Test</h1>\n";
echo "<p>Testing that REST API routes are properly registered...</p>\n";

// Get all registered REST routes
$routes = rest_get_server()->get_routes();

// Our custom routes to check
$custom_routes = [
    '/wp/v2/simple-test',
    '/wp/v2/site-settings',
    '/wp/v2/pages-with-blocks/(?P<slug>[a-zA-Z0-9-_]+)',
    '/wp/v2/posts-with-acf-blocks/(?P<id>\d+)',
    '/wp/v2/posts-data',
    '/wp/v2/categories-data',
    '/wp/v2/footer-settings',
    '/wp/v2/test-services-data/(?P<post_id>\d+)',
    '/wp/v2/debug-services-acf/(?P<post_id>\d+)',
    '/wp/v2/debug-acf/(?P<post_id>\d+)',
    '/wp/v2/process-gallery',
    '/wp/v2/partnership-gallery/(?P<id>\d+)',
];

echo "<h2>Checking Custom Routes:</h2>\n";
echo "<ul>\n";

$all_found = true;
foreach ($custom_routes as $route) {
    $found = isset($routes[$route]);
    $status = $found ? '✅ FOUND' : '❌ NOT FOUND';
    $color = $found ? 'green' : 'red';
    echo "<li style='color: $color;'>$status - $route</li>\n";
    if (!$found) {
        $all_found = false;
    }
}

echo "</ul>\n";

if ($all_found) {
    echo "<h2 style='color: green;'>✅ SUCCESS! All REST API routes are registered correctly.</h2>\n";
    echo "<p>The migration was successful. Your REST API endpoints are working.</p>\n";
} else {
    echo "<h2 style='color: red;'>❌ ERROR! Some routes are missing.</h2>\n";
    echo "<p>Please check that rest-api-routes.php is being included in functions.php.</p>\n";
}

// Test the simple endpoint
echo "<h2>Testing Simple Endpoint:</h2>\n";
$request = new WP_REST_Request('GET', '/wp/v2/simple-test');
$response = rest_get_server()->dispatch($request);
$data = $response->get_data();

if (isset($data['message'])) {
    echo "<p style='color: green;'>✅ Endpoint Response: " . esc_html($data['message']) . "</p>\n";
    echo "<pre>" . print_r($data, true) . "</pre>\n";
} else {
    echo "<p style='color: red;'>❌ Endpoint did not return expected data</p>\n";
}

echo "<hr>\n";
echo "<h3>Next Steps:</h3>\n";
echo "<ul>\n";
echo "<li>Visit <a href='" . rest_url('wp/v2/simple-test') . "'>" . rest_url('wp/v2/simple-test') . "</a> to test in browser</li>\n";
echo "<li>Check the REST API documentation in inc/REST-API-MIGRATION.md</li>\n";
echo "<li>All your endpoints should work exactly as before</li>\n";
echo "</ul>\n";
?>
