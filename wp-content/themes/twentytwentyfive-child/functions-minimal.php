<?php
/**
 * Minimal Child Theme Functions - For Testing
 */

// Test if this file is being loaded
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/minimal-test', [
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response([
                'message' => 'Minimal child theme functions loaded',
                'time' => current_time('mysql')
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
});
?>