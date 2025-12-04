<?php
/**
 * Theme Functions for ACF Blocks Integration
 * Add this code to your WordPress theme's functions.php
 */

// Register ACF Blocks
add_action('acf/init', 'register_acf_blocks');

function register_acf_blocks() {
    if (function_exists('acf_register_block_type')) {
        
        // Hero Block
        acf_register_block_type(array(
            'name'              => 'hero',
            'title'             => __('Hero'),
            'description'       => __('A custom hero block with background image and CTA.'),
            'render_template'   => 'blocks/hero.php',
            'category'          => 'formatting',
            'icon'              => 'cover-image',
            'keywords'          => array('hero', 'banner', 'header'),
            'supports'          => array(
                'align' => true,
                'mode' => false,
                'jsx' => true
            ),
        ));
        
        // CTA Block
        acf_register_block_type(array(
            'name'              => 'cta',
            'title'             => __('Call to Action'),
            'description'       => __('A custom CTA block with button.'),
            'render_template'   => 'blocks/cta.php',
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('cta', 'call to action', 'button'),
            'supports'          => array(
                'align' => true,
            ),
        ));
        
        // Image Text Block
        acf_register_block_type(array(
            'name'              => 'image-text',
            'title'             => __('Image + Text'),
            'description'       => __('Image with text content side by side.'),
            'render_template'   => 'blocks/image-text.php',
            'category'          => 'formatting',
            'icon'              => 'align-pull-left',
            'keywords'          => array('image', 'text', 'media'),
        ));
        
        // Content Block
        acf_register_block_type(array(
            'name'              => 'content',
            'title'             => __('Content Block'),
            'description'       => __('A custom content block with heading and rich text.'),
            'render_template'   => 'blocks/content.php',
            'category'          => 'formatting',
            'icon'              => 'text',
            'keywords'          => array('content', 'text', 'wysiwyg'),
        ));
        
        // Moreyeahs Heading Test Block
        acf_register_block_type(array(
            'name'              => 'moreyeahs-heading-test',
            'title'             => __('Moreyeahs Heading Test'),
            'description'       => __('A custom heading block with color and alignment options.'),
            'render_template'   => 'blocks/moreyeahs-heading-test.php',
            'category'          => 'formatting',
            'icon'              => 'heading',
            'keywords'          => array('moreyeahs', 'heading', 'test', 'title'),
            'supports'          => array(
                'align' => true,
            ),
        ));
        
        // Full Width Left Text Section Block
        acf_register_block_type(array(
            'name'              => 'full-width-left-text-section',
            'title'             => __('Full Width Left Text Section'),
            'description'       => __('A full-width section with left-aligned text content and right image.'),
            'render_template'   => 'blocks/full-width-left-text-section.php',
            'category'          => 'formatting',
            'icon'              => 'align-wide',
            'keywords'          => array('full width', 'text', 'section', 'case studies'),
            'supports'          => array(
                'align' => array('wide', 'full'),
                'mode' => false,
            ),
        ));
    }
}

// Enable Gutenberg blocks in REST API
add_filter('rest_prepare_post', 'add_blocks_to_rest_api', 10, 2);
add_filter('rest_prepare_page', 'add_blocks_to_rest_api', 10, 2);

function add_blocks_to_rest_api($response, $post) {
    if (has_blocks($post->post_content)) {
        $blocks = parse_blocks($post->post_content);
        $response->data['blocks'] = $blocks;
    }
    return $response;
}

// Expose ACF blocks to GraphQL
add_filter('graphql_blocks_allowed_block_types', function($allowed_blocks) {
    $allowed_blocks[] = 'acf/hero';
    $allowed_blocks[] = 'acf/cta';
    $allowed_blocks[] = 'acf/image-text';
    $allowed_blocks[] = 'acf/content';
    $allowed_blocks[] = 'acf/moreyeahs-heading-test';
    $allowed_blocks[] = 'acf/full-width-left-text-section';
    return $allowed_blocks;
});

// Add ACF data to block attributes in GraphQL
add_filter('graphql_resolve_block', function($block_data, $block) {
    if (strpos($block['blockName'], 'acf/') === 0) {
        $block_data['attributes']['data'] = get_fields();
    }
    return $block_data;
}, 10, 2);

// Enable ACF fields in GraphQL
add_filter('graphql_acf_get_root_id', function($id, $root) {
    return $root->ID ?? $id;
}, 10, 2);

// Register Navigation Menus
add_action('after_setup_theme', 'register_navigation_menus');

function register_navigation_menus() {
    register_nav_menus(array(
        'primary' => __('Primary Menu'),
        'second-menu' => __('Second Menu (Side Burger Menu)'),
        'footer' => __('Footer Menu'),
    ));
}

// Add menus to REST API
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/menus', array(
        'methods' => 'GET',
        'callback' => 'get_all_menus',
        'permission_callback' => '__return_true'
    ));
    
    register_rest_route('wp/v2', '/menus/(?P<location>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'get_menu_by_location',
        'permission_callback' => '__return_true'
    ));
});

function get_all_menus() {
    $menus = wp_get_nav_menus();
    $menu_data = array();
    
    foreach ($menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $menu_data[] = array(
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'items' => format_menu_items($menu_items)
        );
    }
    
    return rest_ensure_response($menu_data);
}

function get_menu_by_location($request) {
    $location = $request['location'];
    $locations = get_nav_menu_locations();
    
    if (!isset($locations[$location])) {
        return new WP_Error('no_menu', 'No menu found at this location', array('status' => 404));
    }
    
    $menu_id = $locations[$location];
    $menu_items = wp_get_nav_menu_items($menu_id);
    $menu = wp_get_nav_menu_object($menu_id);
    
    return rest_ensure_response(array(
        'id' => $menu->term_id,
        'name' => $menu->name,
        'slug' => $menu->slug,
        'location' => $location,
        'items' => format_menu_items($menu_items)
    ));
}

function format_menu_items($menu_items) {
    if (!$menu_items) return array();
    
    $formatted_items = array();
    $menu_item_parents = array();
    
    foreach ($menu_items as $item) {
        $menu_item_parents[$item->ID] = $item->menu_item_parent;
        
        $formatted_item = array(
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'target' => $item->target ?: '_self',
            'parent' => $item->menu_item_parent,
            'order' => $item->menu_order,
            'classes' => implode(' ', $item->classes),
            'children' => array()
        );
        
        $formatted_items[$item->ID] = $formatted_item;
    }
    
    // Build hierarchical structure
    $hierarchical_items = array();
    foreach ($formatted_items as $item) {
        if ($item['parent'] == 0) {
            $hierarchical_items[] = $item;
        } else {
            if (isset($formatted_items[$item['parent']])) {
                $formatted_items[$item['parent']]['children'][] = $item;
            }
        }
    }
    
    // Update parent items with children
    foreach ($hierarchical_items as &$item) {
        if (isset($formatted_items[$item['id']]['children'])) {
            $item['children'] = $formatted_items[$item['id']]['children'];
        }
    }
    
    return $hierarchical_items;
}

// Add CORS headers for Next.js
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
