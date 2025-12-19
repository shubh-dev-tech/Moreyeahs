<?php
/**
 * Test if child theme is active and loading
 */

// Add a simple action to test if the child theme is loading
add_action('wp_head', function() {
    echo '<!-- Child theme is active and loading -->' . PHP_EOL;
});

// Add a REST API endpoint to test
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/theme-test', [
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response([
                'message' => 'Child theme is active',
                'stylesheet' => get_stylesheet(),
                'template' => get_template(),
                'theme_root' => get_theme_root(),
                'active_theme' => wp_get_theme()->get('Name')
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
});
?>