<?php
/**
 * Plugin Status Checker
 * Visit: https://dev.moreyeahs.com/wp-content/plugins/draft-post-api/check-plugin-status.php
 */

// Include WordPress
require_once('../../../wp-load.php');

echo "<h2>Plugin Status Check</h2>";

// Check if plugin is active
$active_plugins = get_option('active_plugins');
$plugin_file = 'draft-post-api/draft-post-api.php';

echo "<p><strong>Plugin File:</strong> " . $plugin_file . "</p>";
echo "<p><strong>Plugin Active:</strong> " . (in_array($plugin_file, $active_plugins) ? 'YES' : 'NO') . "</p>";

// Check if class exists
echo "<p><strong>SecureDraftPostAPI Class Exists:</strong> " . (class_exists('SecureDraftPostAPI') ? 'YES' : 'NO') . "</p>";
echo "<p><strong>JWT_Helper Class Exists:</strong> " . (class_exists('JWT_Helper') ? 'YES' : 'NO') . "</p>";

// Check REST API routes
$rest_server = rest_get_server();
$routes = $rest_server->get_routes();
$draft_routes = array();

foreach ($routes as $route => $handlers) {
    if (strpos($route, '/draft-api/v1') === 0) {
        $draft_routes[$route] = $handlers;
    }
}

echo "<p><strong>Draft API Routes Found:</strong> " . count($draft_routes) . "</p>";

if (!empty($draft_routes)) {
    echo "<h3>Registered Routes:</h3>";
    echo "<ul>";
    foreach ($draft_routes as $route => $handlers) {
        echo "<li>" . $route . "</li>";
    }
    echo "</ul>";
} else {
    echo "<p style='color: red;'><strong>No draft-api routes found!</strong></p>";
}

// Check permalink structure
echo "<p><strong>Permalink Structure:</strong> " . get_option('permalink_structure') . "</p>";

// Test basic REST API
echo "<p><strong>REST API URL Root:</strong> " . rest_url() . "</p>";
echo "<p><strong>Site URL:</strong> " . site_url() . "</p>";

// Check if we can access basic WP REST API
$wp_routes_count = 0;
foreach ($routes as $route => $handlers) {
    if (strpos($route, '/wp/v2') === 0) {
        $wp_routes_count++;
    }
}
echo "<p><strong>WordPress Core REST Routes:</strong> " . $wp_routes_count . "</p>";
?>