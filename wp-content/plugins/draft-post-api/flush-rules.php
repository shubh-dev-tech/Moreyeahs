<?php
/**
 * Flush Rewrite Rules
 * Visit: https://dev.moreyeahs.com/wp-content/plugins/draft-post-api/flush-rules.php
 */

// Include WordPress
require_once('../../../wp-load.php');

echo "<h2>Flushing Rewrite Rules</h2>";

// Initialize the plugin
if (function_exists('init_secure_draft_post_api')) {
    init_secure_draft_post_api();
    echo "<p>✓ Plugin initialized</p>";
} else {
    echo "<p style='color: red;'>✗ Plugin function not found</p>";
}

// Flush rewrite rules
flush_rewrite_rules();
echo "<p>✓ Rewrite rules flushed</p>";

// Check routes again
$rest_server = rest_get_server();
$routes = $rest_server->get_routes();
$draft_routes = array();

foreach ($routes as $route => $handlers) {
    if (strpos($route, '/draft-api/v1') === 0) {
        $draft_routes[$route] = $handlers;
    }
}

echo "<p><strong>Draft API Routes After Flush:</strong> " . count($draft_routes) . "</p>";

if (!empty($draft_routes)) {
    echo "<h3>Available Routes:</h3>";
    echo "<ul>";
    foreach ($draft_routes as $route => $handlers) {
        $methods = array();
        foreach ($handlers as $handler) {
            if (isset($handler['methods'])) {
                if (is_array($handler['methods'])) {
                    $methods = array_merge($methods, array_keys($handler['methods']));
                } else {
                    $methods[] = $handler['methods'];
                }
            }
        }
        echo "<li><strong>" . $route . "</strong> - Methods: " . implode(', ', array_unique($methods)) . "</li>";
    }
    echo "</ul>";
    
    echo "<h3>Test URLs:</h3>";
    echo "<ul>";
    echo "<li><a href='" . rest_url('draft-api/v1/auth') . "' target='_blank'>" . rest_url('draft-api/v1/auth') . "</a> (POST for auth)</li>";
    echo "<li><a href='" . rest_url('draft-api/v1/debug-token') . "' target='_blank'>" . rest_url('draft-api/v1/debug-token') . "</a> (GET for debug)</li>";
    echo "</ul>";
} else {
    echo "<p style='color: red;'><strong>Still no routes found! There might be an issue with the plugin.</strong></p>";
}
?>