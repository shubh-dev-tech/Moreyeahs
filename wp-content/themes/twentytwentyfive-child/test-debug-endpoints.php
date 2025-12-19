<?php
/**
 * Debug REST API Endpoints Registration
 * This file helps debug why some endpoints are not being registered
 */

if (!defined('ABSPATH')) exit;

// Add debug logging for REST API registration
add_action('rest_api_init', function() {
    error_log('DEBUG: rest_api_init action fired');
    
    // Test a simple endpoint first
    $result = register_rest_route('wp/v2', '/debug-test', [
        'methods' => 'GET',
        'callback' => function() {
            return rest_ensure_response(['status' => 'debug endpoint working', 'time' => current_time('mysql')]);
        },
        'permission_callback' => '__return_true'
    ]);
    
    error_log('DEBUG: Simple test endpoint registration result: ' . ($result ? 'SUCCESS' : 'FAILED'));
    
    // Try to register site-settings endpoint with error handling
    try {
        $site_settings_result = register_rest_route('wp/v2', '/site-settings-debug', [
            'methods' => 'POST',
            'callback' => 'debug_site_settings_rest',
            'permission_callback' => '__return_true'
        ]);
        error_log('DEBUG: Site settings endpoint registration result: ' . ($site_settings_result ? 'SUCCESS' : 'FAILED'));
    } catch (Exception $e) {
        error_log('DEBUG: Site settings endpoint registration error: ' . $e->getMessage());
    }
    
    // Check if required functions exist
    $functions_to_check = [
        'get_site_settings_rest',
        'get_mega_menus_rest',
        'get_footer_widgets_rest',
        'get_page_with_acf_blocks_rest',
        'get_posts_data_rest',
        'get_categories_data_rest'
    ];
    
    foreach ($functions_to_check as $function_name) {
        $exists = function_exists($function_name);
        error_log("DEBUG: Function {$function_name} exists: " . ($exists ? 'YES' : 'NO'));
    }
    
}, 5); // Run early to see if it's a priority issue

// Simple debug callback function
function debug_site_settings_rest() {
    return rest_ensure_response([
        'debug' => true,
        'message' => 'Debug site settings endpoint working',
        'functions_exist' => [
            'get_site_settings_rest' => function_exists('get_site_settings_rest'),
            'get_bloginfo' => function_exists('get_bloginfo'),
            'get_theme_mod' => function_exists('get_theme_mod'),
        ]
    ]);
}

// Add a hook to check what's happening during WordPress init
add_action('init', function() {
    error_log('DEBUG: WordPress init action fired');
    error_log('DEBUG: Active theme: ' . get_stylesheet());
    error_log('DEBUG: Template directory: ' . get_template_directory());
    error_log('DEBUG: Stylesheet directory: ' . get_stylesheet_directory());
    
    // Check if ACF is loaded
    error_log('DEBUG: ACF loaded: ' . (class_exists('ACF') ? 'YES' : 'NO'));
    error_log('DEBUG: ACF version: ' . (defined('ACF_VERSION') ? ACF_VERSION : 'Not defined'));
});

// Add error logging for any PHP errors
add_action('wp_loaded', function() {
    error_log('DEBUG: WordPress fully loaded');
});
?>