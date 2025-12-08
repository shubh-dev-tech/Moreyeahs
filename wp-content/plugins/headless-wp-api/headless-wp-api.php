<?php
/**
 * Plugin Name: Headless WordPress API
 * Description: REST API endpoints for headless WordPress (menus, site settings, footer)
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) exit;

/**
 * Register custom REST API routes
 */
add_action('rest_api_init', function () {
    // Menu endpoints
    register_rest_route('wp/v2', '/menus', [
        'methods' => 'GET',
        'callback' => 'hwapi_get_all_menus',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('wp/v2', '/menus/(?P<location>[a-zA-Z0-9-_]+)', [
        'methods' => 'GET',
        'callback' => 'hwapi_get_menu_by_location',
        'permission_callback' => '__return_true'
    ]);

    // Site settings endpoint
    register_rest_route('wp/v2', '/site-settings', [
        'methods' => 'GET',
        'callback' => 'hwapi_get_site_settings',
        'permission_callback' => '__return_true'
    ]);

    // Footer widgets endpoint
    register_rest_route('wp/v2', '/footer-widgets', [
        'methods' => 'GET',
        'callback' => 'hwapi_get_footer_widgets',
        'permission_callback' => '__return_true'
    ]);
});

/**
 * Get all registered menus
 */
function hwapi_get_all_menus() {
    $menus = get_terms('nav_menu', ['hide_empty' => true]);
    $result = [];

    foreach ($menus as $menu) {
        $result[] = [
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'count' => $menu->count,
            'items' => hwapi_get_menu_items($menu->term_id)
        ];
    }

    return rest_ensure_response($result);
}

/**
 * Get menu by location
 */
function hwapi_get_menu_by_location($request) {
    $location = $request['location'];
    $locations = get_nav_menu_locations();

    if (!isset($locations[$location])) {
        return new WP_Error('no_menu', 'No menu found for this location', ['status' => 404]);
    }

    $menu_id = $locations[$location];
    $menu = wp_get_nav_menu_object($menu_id);

    if (!$menu) {
        return new WP_Error('no_menu', 'Menu not found', ['status' => 404]);
    }

    $result = [
        'id' => $menu->term_id,
        'name' => $menu->name,
        'slug' => $menu->slug,
        'location' => $location,
        'items' => hwapi_get_menu_items($menu->term_id)
    ];

    return rest_ensure_response($result);
}

/**
 * Format menu items with hierarchy
 */
function hwapi_get_menu_items($menu_id) {
    $items = wp_get_nav_menu_items($menu_id);
    
    if (!$items) {
        return [];
    }

    $menu_items = [];
    $child_items = [];

    foreach ($items as $item) {
        $menu_item = [
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'target' => $item->target ?: '_self',
            'classes' => implode(' ', $item->classes),
            'parent' => $item->menu_item_parent,
            'children' => []
        ];

        if ($item->menu_item_parent == 0) {
            $menu_items[$item->ID] = $menu_item;
        } else {
            $child_items[$item->ID] = $menu_item;
        }
    }

    foreach ($child_items as $child_id => $child) {
        $parent_id = $child['parent'];
        if (isset($menu_items[$parent_id])) {
            $menu_items[$parent_id]['children'][] = $child;
        }
    }

    return array_values($menu_items);
}

/**
 * Get site settings including logo and favicon
 */
function hwapi_get_site_settings() {
    $logo_id = get_theme_mod('custom_logo');
    $logo = null;

    if ($logo_id) {
        $logo_data = wp_get_attachment_image_src($logo_id, 'full');
        
        if ($logo_data) {
            $logo = [
                'url' => $logo_data[0],
                'width' => $logo_data[1],
                'height' => $logo_data[2],
                'alt' => get_post_meta($logo_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name')
            ];
        }
    }

    $favicon_id = get_option('site_icon');
    $favicon = null;

    if ($favicon_id) {
        $favicon = [
            'url' => wp_get_attachment_url($favicon_id),
            'width' => 512,
            'height' => 512,
            'sizes' => [
                '32' => wp_get_attachment_image_url($favicon_id, [32, 32]),
                '180' => wp_get_attachment_image_url($favicon_id, [180, 180]),
                '192' => wp_get_attachment_image_url($favicon_id, [192, 192]),
                '512' => wp_get_attachment_image_url($favicon_id, [512, 512]),
            ]
        ];
    }

    $settings = [
        'title' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'url' => get_bloginfo('url'),
        'logo' => $logo,
        'favicon' => $favicon
    ];

    return rest_ensure_response($settings);
}

/**
 * Get footer widgets
 */
function hwapi_get_footer_widgets() {
    $footer_data = [
        'column1' => hwapi_get_footer_column('footer-1'),
        'column2' => hwapi_get_footer_column('footer-2'),
        'column3' => hwapi_get_footer_column('footer-3'),
        'column4' => hwapi_get_footer_column('footer-4'),
        'column5' => hwapi_get_footer_column('footer-5'),
        'copyrightLeft' => get_theme_mod('footer_copyright_left', ''),
        'copyrightRight' => get_theme_mod('footer_copyright_right', ''),
    ];

    return rest_ensure_response($footer_data);
}

/**
 * Get footer column data
 */
function hwapi_get_footer_column($sidebar_id) {
    if (!is_active_sidebar($sidebar_id)) {
        return null;
    }

    ob_start();
    dynamic_sidebar($sidebar_id);
    $content = ob_get_clean();

    return [
        'id' => $sidebar_id,
        'title' => '',
        'content' => $content
    ];
}

/**
 * Add CORS headers
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = get_http_origin();
        $allowed_origins = [
            'http://localhost:3000',
            'http://localhost:3001',
            get_site_url()
        ];

        if (defined('ALLOWED_ORIGIN')) {
            $allowed_origins[] = ALLOWED_ORIGIN;
        }

        if ($origin && in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        }

        return $value;
    });
}, 15);
