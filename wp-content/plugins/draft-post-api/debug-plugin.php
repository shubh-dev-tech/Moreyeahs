<?php
/**
 * Debug script for Draft Post API Plugin
 * 
 * Add this to your WordPress site to debug the plugin
 * Access via: /wp-content/plugins/draft-post-api/debug-plugin.php
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is logged in and has admin privileges
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    wp_die('Access denied. Please log in as an administrator.');
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Draft Post API Debug</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .debug-section { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #0073aa; }
        .success { border-left-color: #46b450; }
        .error { border-left-color: #dc3232; }
        .warning { border-left-color: #ffb900; }
        pre { background: #fff; padding: 10px; border: 1px solid #ddd; overflow-x: auto; }
        h2 { color: #23282d; }
    </style>
</head>
<body>
    <h1>Draft Post API Plugin Debug Information</h1>

    <?php
    // Check if plugin file exists
    $plugin_file = __DIR__ . '/draft-post-api.php';
    echo '<div class="debug-section ' . (file_exists($plugin_file) ? 'success' : 'error') . '">';
    echo '<h2>Plugin File Check</h2>';
    echo '<p>Plugin file exists: ' . (file_exists($plugin_file) ? 'YES' : 'NO') . '</p>';
    echo '<p>Plugin path: ' . $plugin_file . '</p>';
    echo '</div>';

    // Check if plugin is active
    $active_plugins = get_option('active_plugins', array());
    $plugin_basename = 'draft-post-api/draft-post-api.php';
    $is_active = in_array($plugin_basename, $active_plugins);
    
    echo '<div class="debug-section ' . ($is_active ? 'success' : 'error') . '">';
    echo '<h2>Plugin Activation Status</h2>';
    echo '<p>Plugin is active: ' . ($is_active ? 'YES' : 'NO') . '</p>';
    echo '<p>Plugin basename: ' . $plugin_basename . '</p>';
    echo '<p>Active plugins:</p>';
    echo '<pre>' . print_r($active_plugins, true) . '</pre>';
    echo '</div>';

    // Check if class exists
    echo '<div class="debug-section ' . (class_exists('DraftPostAPI') ? 'success' : 'error') . '">';
    echo '<h2>Plugin Class Check</h2>';
    echo '<p>DraftPostAPI class exists: ' . (class_exists('DraftPostAPI') ? 'YES' : 'NO') . '</p>';
    echo '</div>';

    // Check REST API routes
    $rest_server = rest_get_server();
    $routes = $rest_server->get_routes();
    $draft_routes = array();
    
    foreach ($routes as $route => $handlers) {
        if (strpos($route, '/draft-api/v1') === 0) {
            $draft_routes[$route] = $handlers;
        }
    }
    
    echo '<div class="debug-section ' . (!empty($draft_routes) ? 'success' : 'error') . '">';
    echo '<h2>REST API Routes Check</h2>';
    echo '<p>Draft API routes found: ' . count($draft_routes) . '</p>';
    if (!empty($draft_routes)) {
        echo '<p>Available routes:</p>';
        echo '<pre>' . print_r(array_keys($draft_routes), true) . '</pre>';
    } else {
        echo '<p style="color: red;">No draft-api routes found!</p>';
    }
    echo '</div>';

    // Test REST API endpoint
    echo '<div class="debug-section">';
    echo '<h2>REST API Test</h2>';
    
    $test_url = home_url('/wp-json/draft-api/v1/create-post');
    echo '<p>Test URL: <a href="' . $test_url . '" target="_blank">' . $test_url . '</a></p>';
    
    // Try to make a test request
    $response = wp_remote_get($test_url);
    if (is_wp_error($response)) {
        echo '<p style="color: red;">Error: ' . $response->get_error_message() . '</p>';
    } else {
        $response_code = wp_remote_retrieve_response_code($response);
        $response_body = wp_remote_retrieve_body($response);
        echo '<p>Response code: ' . $response_code . '</p>';
        echo '<p>Response body:</p>';
        echo '<pre>' . htmlspecialchars($response_body) . '</pre>';
    }
    echo '</div>';

    // WordPress and server info
    echo '<div class="debug-section">';
    echo '<h2>WordPress Information</h2>';
    echo '<p>WordPress version: ' . get_bloginfo('version') . '</p>';
    echo '<p>Site URL: ' . home_url() . '</p>';
    echo '<p>REST API URL: ' . rest_url() . '</p>';
    echo '<p>Current user can edit posts: ' . (current_user_can('edit_posts') ? 'YES' : 'NO') . '</p>';
    echo '</div>';

    // Rewrite rules check
    global $wp_rewrite;
    echo '<div class="debug-section">';
    echo '<h2>Rewrite Rules</h2>';
    echo '<p>Permalink structure: ' . get_option('permalink_structure') . '</p>';
    echo '<p>Rewrite rules flushed: You may need to go to Settings > Permalinks and click "Save Changes"</p>';
    echo '</div>';
    ?>

    <div class="debug-section warning">
        <h2>Troubleshooting Steps</h2>
        <ol>
            <li><strong>Activate the plugin:</strong> Go to WordPress Admin > Plugins and activate "Draft Post API"</li>
            <li><strong>Flush rewrite rules:</strong> Go to Settings > Permalinks and click "Save Changes"</li>
            <li><strong>Check permissions:</strong> Make sure you're logged in and have edit_posts capability</li>
            <li><strong>Test with POST method:</strong> The create-post endpoint only accepts POST requests, not GET</li>
            <li><strong>Check for plugin conflicts:</strong> Temporarily deactivate other plugins to test</li>
        </ol>
    </div>

    <div class="debug-section">
        <h2>Quick Test</h2>
        <p>Try this JavaScript in your browser console:</p>
        <pre>
fetch('<?php echo home_url('/wp-json/draft-api/v1/create-post'); ?>', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Test Draft Post',
        content: 'This is a test post created via API'
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
        </pre>
    </div>

</body>
</html>