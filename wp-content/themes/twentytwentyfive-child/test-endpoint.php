<?php
/**
 * Simple test endpoint to verify REST API registration is working
 */

if (!defined('ABSPATH')) exit;

// Register a simple test endpoint
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/test-endpoint', [
        'methods' => 'POST',
        'callback' => 'test_endpoint_callback',
        'permission_callback' => '__return_true'
    ]);
});

function test_endpoint_callback() {
    return rest_ensure_response([
        'message' => 'Test endpoint is working!',
        'timestamp' => current_time('mysql'),
        'method' => 'POST'
    ]);
}