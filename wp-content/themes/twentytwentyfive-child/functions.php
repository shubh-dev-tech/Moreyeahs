<?php
/**
 * Twenty Twenty-Five Child Theme Functions
 * 
 * This file preserves all parent theme functionality while allowing customizations
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue parent and child theme styles
 */
function twentytwentyfive_child_enqueue_styles() {
    // Get parent theme version for cache busting
    $parent_style = 'twentytwentyfive-style';
    $parent_theme = wp_get_theme('twentytwentyfive');
    
    // Enqueue parent theme stylesheet
    wp_enqueue_style($parent_style, 
        get_template_directory_uri() . '/style.css',
        array(),
        $parent_theme->get('Version')
    );
    
    // Enqueue child theme stylesheet
    wp_enqueue_style('twentytwentyfive-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array($parent_style),
        wp_get_theme()->get('Version')
    );
    
    // Enqueue Case Study styles
    if (is_singular('case_study') || is_post_type_archive('case_study')) {
        wp_enqueue_style('case-study-styles',
            get_stylesheet_directory_uri() . '/assets/css/case-study.css',
            array(),
            wp_get_theme()->get('Version')
        );
    }
}
add_action('wp_enqueue_scripts', 'twentytwentyfive_child_enqueue_styles');

/**
 * Copy all ACF field groups from parent theme
 * This ensures all your custom blocks continue to work
 */
function twentytwentyfive_child_copy_acf_fields() {
    $parent_acf_path = get_template_directory() . '/acf-json';
    $child_acf_path = get_stylesheet_directory() . '/acf-json';
    
    // Create ACF JSON directory in child theme if it doesn't exist
    if (!file_exists($child_acf_path)) {
        wp_mkdir_p($child_acf_path);
    }
    
    // Copy ACF JSON files from parent to child theme
    if (is_dir($parent_acf_path)) {
        $files = glob($parent_acf_path . '/*.json');
        foreach ($files as $file) {
            $filename = basename($file);
            $destination = $child_acf_path . '/' . $filename;
            if (!file_exists($destination)) {
                copy($file, $destination);
            }
        }
    }
}
add_action('after_setup_theme', 'twentytwentyfive_child_copy_acf_fields');

/**
 * Include parent theme's custom functionality
 * This preserves all your custom blocks and API endpoints
 */
function twentytwentyfive_child_include_parent_functions() {
    $parent_inc_path = get_template_directory() . '/inc';
    
    // Include ACF blocks functionality from child theme
    $child_acf_blocks = get_stylesheet_directory() . '/inc/acf-blocks.php';
    if (file_exists($child_acf_blocks)) {
        require_once $child_acf_blocks;
    } elseif (file_exists($parent_inc_path . '/acf-blocks.php')) {
        require_once $parent_inc_path . '/acf-blocks.php';
    }
    
    // Include case study template manager
    $case_study_template = get_stylesheet_directory() . '/inc/case-study-template.php';
    if (file_exists($case_study_template)) {
        require_once $case_study_template;
    }
    
    // Include case study admin interface
    $case_study_admin = get_stylesheet_directory() . '/inc/case-study-admin.php';
    if (file_exists($case_study_admin)) {
        require_once $case_study_admin;
    }
    
    // Include footer settings
    $footer_settings = get_stylesheet_directory() . '/inc/footer-settings.php';
    if (file_exists($footer_settings)) {
        require_once $footer_settings;
    }
    
    // Include test endpoint first
    $test_endpoint = get_stylesheet_directory() . '/test-endpoint.php';
    if (file_exists($test_endpoint)) {
        require_once $test_endpoint;
    }
    
    // Include debug endpoints for troubleshooting
    $debug_endpoint = get_stylesheet_directory() . '/test-debug-endpoints.php';
    if (file_exists($debug_endpoint)) {
        require_once $debug_endpoint;
    }
    
    // Include theme active test
    $theme_test = get_stylesheet_directory() . '/test-theme-active.php';
    if (file_exists($theme_test)) {
        require_once $theme_test;
    }
    
    // Include REST API endpoints from child theme only (to avoid function conflicts)
    $child_rest_api = get_stylesheet_directory() . '/inc/rest-api-endpoints.php';
    if (file_exists($child_rest_api)) {
        require_once $child_rest_api;
    }
    
    // Add REST API endpoints directly in functions.php to avoid file loading issues
    add_action('rest_api_init', function() {
        // Simple test endpoint
        register_rest_route('wp/v2', '/simple-test', [
            'methods' => 'GET',
            'callback' => function() {
                return rest_ensure_response([
                    'message' => 'Simple test endpoint working from child theme functions.php',
                    'time' => current_time('mysql'),
                    'theme' => get_stylesheet()
                ]);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Site settings endpoint
        register_rest_route('wp/v2', '/site-settings', [
            'methods' => 'POST',
            'callback' => function() {
                $settings = [
                    'title' => get_bloginfo('name'),
                    'description' => get_bloginfo('description'),
                    'url' => get_bloginfo('url'),
                    'logo' => null,
                    'favicon' => null
                ];
                
                // Get logo
                $logo_id = get_theme_mod('custom_logo') ?: get_option('custom_logo_id');
                if ($logo_id) {
                    $logo_data = wp_get_attachment_image_src($logo_id, 'full');
                    if ($logo_data) {
                        $settings['logo'] = [
                            'id' => intval($logo_id),
                            'url' => $logo_data[0],
                            'width' => intval($logo_data[1]),
                            'height' => intval($logo_data[2]),
                            'alt' => get_post_meta($logo_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name')
                        ];
                    }
                }
                
                // Get favicon
                $favicon_id = get_option('site_icon');
                if ($favicon_id) {
                    $favicon_url = wp_get_attachment_url($favicon_id);
                    if ($favicon_url) {
                        $settings['favicon'] = [
                            'id' => intval($favicon_id),
                            'url' => $favicon_url,
                            'width' => 512,
                            'height' => 512
                        ];
                    }
                }
                
                return rest_ensure_response($settings);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Pages with blocks endpoint
        register_rest_route('wp/v2', '/pages-with-blocks/(?P<slug>[a-zA-Z0-9-_]+)', [
            'methods' => 'POST',
            'callback' => function($request) {
                $slug = $request['slug'];
                $page = get_page_by_path($slug);
                
                if (!$page) {
                    return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
                }
                
                $blocks = parse_blocks($page->post_content);
                
                // Process ACF blocks to include field data
                $processed_blocks = [];
                foreach ($blocks as $block) {
                    if (strpos($block['blockName'], 'acf/') === 0) {
                        // This is an ACF block - get the field data using the block ID
                        $block_id = $block['attrs']['id'] ?? null;
                        if ($block_id && function_exists('get_fields')) {
                            // Get fields specific to this block instance
                            $acf_fields = get_fields($block_id);
                            
                            // If no block-specific fields, try getting from the page
                            if (!$acf_fields) {
                                $acf_fields = get_fields($page->ID);
                            }
                            
                            if ($acf_fields) {
                                // Process gallery fields to ensure they have full image data
                                foreach ($acf_fields as $field_name => $value) {
                                    // Check if this is a gallery field and process it
                                    if ((strpos($field_name, 'gallery') !== false || strpos($field_name, 'images') !== false) && is_array($value)) {
                                        $acf_fields[$field_name] = process_acf_gallery_field($value);
                                    }
                                }
                                $block['attrs']['data'] = $acf_fields;
                            }
                        }
                    }
                    $processed_blocks[] = $block;
                }
                
                return rest_ensure_response([
                    'id' => $page->ID,
                    'title' => $page->post_title,
                    'slug' => $page->post_name,
                    'content' => $page->post_content,
                    'blocks' => $processed_blocks
                ]);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Posts with ACF blocks endpoint
        register_rest_route('wp/v2', '/posts-with-acf-blocks/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => function($request) {
                $post_id = $request['id'];
                $post = get_post($post_id);
                
                if (!$post) {
                    return new WP_Error('post_not_found', 'Post not found', ['status' => 404]);
                }
                
                $blocks = parse_blocks($post->post_content);
                
                // Process ACF blocks to include field data
                $processed_blocks = [];
                foreach ($blocks as $block) {
                    if (strpos($block['blockName'], 'acf/') === 0) {
                        // This is an ACF block - get the field data using the block ID
                        $block_id = $block['attrs']['id'] ?? null;
                        if ($block_id && function_exists('get_fields')) {
                            // Get fields specific to this block instance
                            $acf_fields = get_fields($block_id);
                            
                            // If no block-specific fields, try getting from the post
                            if (!$acf_fields) {
                                $acf_fields = get_fields($post_id);
                            }
                            
                            if ($acf_fields && is_array($acf_fields)) {
                                // Process the fields to ensure proper data types
                                $processed_fields = [];
                                foreach ($acf_fields as $field_name => $value) {
                                    // Handle gallery fields specifically
                                    if ((strpos($field_name, 'gallery') !== false || strpos($field_name, 'images') !== false) && is_array($value)) {
                                        // Use our new processing function
                                        $processed_fields[$field_name] = process_acf_gallery_field($value);
                                    } elseif (is_array($value) && isset($value['ID'])) {
                                        // This is likely an image field - convert to consistent format
                                        $image_data = wp_get_attachment_image_src($value['ID'], 'full');
                                        if ($image_data) {
                                            $processed_fields[$field_name] = [
                                                'id' => intval($value['ID']),
                                                'url' => $image_data[0],
                                                'width' => intval($image_data[1]),
                                                'height' => intval($image_data[2]),
                                                'alt' => $value['alt'] ?? ''
                                            ];
                                        } else {
                                            $processed_fields[$field_name] = $value;
                                        }
                                    } else {
                                        // For all other field types, use as-is
                                        $processed_fields[$field_name] = $value;
                                    }
                                }
                                $block['attrs']['data'] = $processed_fields;
                            }
                        }
                    }
                    $processed_blocks[] = $block;
                }
                
                return rest_ensure_response([
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'slug' => $post->post_name,
                    'content' => $post->post_content,
                    'blocks' => $processed_blocks,
                    'acf_fields' => function_exists('get_fields') ? get_fields($post_id) : null
                ]);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Posts data endpoint
        register_rest_route('wp/v2', '/posts-data', [
            'methods' => 'POST',
            'callback' => function($request) {
                $params = $request->get_json_params() ?: [];
                
                $args = [
                    'post_type' => isset($params['post_type']) ? sanitize_text_field($params['post_type']) : 'post',
                    'post_status' => 'publish',
                    'posts_per_page' => isset($params['per_page']) ? intval($params['per_page']) : 10,
                    'orderby' => isset($params['orderby']) ? sanitize_text_field($params['orderby']) : 'date',
                    'order' => isset($params['order']) ? sanitize_text_field($params['order']) : 'DESC',
                ];
                
                // Add category filter if provided
                if (isset($params['categories']) && !empty($params['categories'])) {
                    $args['cat'] = intval($params['categories']);
                }
                
                $posts = get_posts($args);
                $formatted_posts = [];
                
                foreach ($posts as $post) {
                    // Get featured image
                    $featured_image = null;
                    if (has_post_thumbnail($post->ID)) {
                        $featured_image = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), 'full');
                    }
                    
                    $formatted_posts[] = [
                        'id' => $post->ID,
                        'title' => [
                            'rendered' => $post->post_title
                        ],
                        'excerpt' => [
                            'rendered' => $post->post_excerpt ?: wp_trim_words($post->post_content, 55, '...')
                        ],
                        'link' => get_permalink($post->ID),
                        'date' => $post->post_date,
                        'featured_media' => get_post_thumbnail_id($post->ID),
                        'categories' => wp_get_post_categories($post->ID, ['fields' => 'ids']),
                        '_embedded' => [
                            'wp:featuredmedia' => $featured_image ? [[
                                'source_url' => $featured_image[0],
                                'alt_text' => get_post_meta(get_post_thumbnail_id($post->ID), '_wp_attachment_image_alt', true)
                            ]] : []
                        ]
                    ];
                }
                
                return rest_ensure_response($formatted_posts);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Categories data endpoint
        register_rest_route('wp/v2', '/categories-data', [
            'methods' => 'POST',
            'callback' => function($request) {
                $categories = get_terms([
                    'taxonomy' => 'category',
                    'hide_empty' => false,
                ]);
                
                $formatted_categories = [];
                foreach ($categories as $category) {
                    $formatted_categories[] = [
                        'id' => $category->term_id,
                        'name' => $category->name,
                        'slug' => $category->slug,
                        'description' => $category->description,
                        'count' => $category->count,
                    ];
                }
                
                return rest_ensure_response($formatted_categories);
            },
            'permission_callback' => '__return_true'
        ]);
        
        // Footer settings endpoint (replaces footer-widgets)
        register_rest_route('wp/v2', '/footer-settings', [
            'methods' => 'POST',
            'callback' => function($request) {
                if (function_exists('get_footer_settings_data')) {
                    return rest_ensure_response(get_footer_settings_data());
                }
                return rest_ensure_response([]);
            },
            'permission_callback' => '__return_true'
        ]);
    });
}
add_action('after_setup_theme', 'twentytwentyfive_child_include_parent_functions');

/**
 * Set ACF JSON load and save paths to child theme
 * This ensures field groups are managed in the child theme
 */
function twentytwentyfive_child_acf_json_load_point($paths) {
    // Remove original path to prevent duplicates
    unset($paths[0]);
    
    // Add child theme path first (highest priority)
    $paths[] = get_stylesheet_directory() . '/acf-json';
    
    // Add parent theme path as fallback only if child theme doesn't have the file
    $parent_path = get_template_directory() . '/acf-json';
    if (is_dir($parent_path)) {
        $paths[] = $parent_path;
    }
    
    return $paths;
}
add_filter('acf/settings/load_json', 'twentytwentyfive_child_acf_json_load_point');

function twentytwentyfive_child_acf_json_save_point($path) {
    // Always save to child theme
    return get_stylesheet_directory() . '/acf-json';
}
add_filter('acf/settings/save_json', 'twentytwentyfive_child_acf_json_save_point');

// Add your custom functions below this line

/**
 * Register Case Study Custom Post Type
 */
function register_case_study_post_type() {
    $labels = array(
        'name'                  => _x('Case Studies', 'Post type general name', 'twentytwentyfive'),
        'singular_name'         => _x('Case Study', 'Post type singular name', 'twentytwentyfive'),
        'menu_name'             => _x('Case Studies', 'Admin Menu text', 'twentytwentyfive'),
        'name_admin_bar'        => _x('Case Study', 'Add New on Toolbar', 'twentytwentyfive'),
        'add_new'               => __('Add New', 'twentytwentyfive'),
        'add_new_item'          => __('Add New Case Study', 'twentytwentyfive'),
        'new_item'              => __('New Case Study', 'twentytwentyfive'),
        'edit_item'             => __('Edit Case Study', 'twentytwentyfive'),
        'view_item'             => __('View Case Study', 'twentytwentyfive'),
        'all_items'             => __('All Case Studies', 'twentytwentyfive'),
        'search_items'          => __('Search Case Studies', 'twentytwentyfive'),
        'parent_item_colon'     => __('Parent Case Studies:', 'twentytwentyfive'),
        'not_found'             => __('No case studies found.', 'twentytwentyfive'),
        'not_found_in_trash'    => __('No case studies found in Trash.', 'twentytwentyfive'),
        'featured_image'        => _x('Case Study Featured Image', 'Overrides the "Featured Image" phrase', 'twentytwentyfive'),
        'set_featured_image'    => _x('Set featured image', 'Overrides the "Set featured image" phrase', 'twentytwentyfive'),
        'remove_featured_image' => _x('Remove featured image', 'Overrides the "Remove featured image" phrase', 'twentytwentyfive'),
        'use_featured_image'    => _x('Use as featured image', 'Overrides the "Use as featured image" phrase', 'twentytwentyfive'),
        'archives'              => _x('Case Study archives', 'The post type archive label', 'twentytwentyfive'),
        'insert_into_item'      => _x('Insert into case study', 'Overrides the "Insert into post" phrase', 'twentytwentyfive'),
        'uploaded_to_this_item' => _x('Uploaded to this case study', 'Overrides the "Uploaded to this post" phrase', 'twentytwentyfive'),
        'filter_items_list'     => _x('Filter case studies list', 'Screen reader text for the filter links', 'twentytwentyfive'),
        'items_list_navigation' => _x('Case studies list navigation', 'Screen reader text for the pagination', 'twentytwentyfive'),
        'items_list'            => _x('Case studies list', 'Screen reader text for the items list', 'twentytwentyfive'),
    );

    $args = array(
        'labels'                => $labels,
        'description'           => __('Case Studies showcase client success stories', 'twentytwentyfive'),
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'show_in_nav_menus'     => true,
        'show_in_admin_bar'     => true,
        'show_in_rest'          => true,
        'rest_base'             => 'case_study',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-portfolio',
        'capability_type'       => 'post',
        'map_meta_cap'          => true,
        'has_archive'           => true,
        'rewrite'               => array(
            'slug'       => 'case-study',
            'with_front' => false,
        ),
        'query_var'             => true,
        'hierarchical'          => false,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'revisions'),
        'taxonomies'            => array('category', 'post_tag'), // Add default taxonomies
        'can_export'            => true,
        'delete_with_user'      => false,
    );

    register_post_type('case_study', $args);
}
add_action('init', 'register_case_study_post_type', 0);

/**
 * Flush rewrite rules on theme activation
 */
function case_study_flush_rewrites() {
    register_case_study_post_type();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'case_study_flush_rewrites');

/**
 * Also flush on theme switch to ensure proper registration
 */
add_action('after_switch_theme', function() {
    register_case_study_post_type();
    flush_rewrite_rules();
});

/**
 * Add ACF fields to REST API for case studies
 */
function add_acf_to_case_study_rest() {
    if (!function_exists('get_fields')) {
        return;
    }
    
    register_rest_field('case_study', 'acf_fields', array(
        'get_callback' => function($post) {
            return get_fields($post['id']);
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'add_acf_to_case_study_rest');

/**
 * Add ACF fields to REST API for all post types
 */
function add_acf_to_rest_api() {
    if (!function_exists('get_fields')) {
        return;
    }
    
    $post_types = get_post_types(['public' => true], 'names');
    
    foreach ($post_types as $post_type) {
        register_rest_field($post_type, 'acf_fields', array(
            'get_callback' => function($post) {
                $fields = get_fields($post['id']);
                
                if (!$fields) {
                    return [];
                }
                
                // Process gallery fields to ensure they have full image data
                foreach ($fields as $field_name => $value) {
                    // Check if this is a gallery field (contains 'gallery' or 'images' in name and is array)
                    if ((strpos($field_name, 'gallery') !== false || strpos($field_name, 'images') !== false) && is_array($value)) {
                        // Use our processing function to convert IDs to full image objects
                        $fields[$field_name] = process_acf_gallery_field($value);
                    }
                }
                
                return $fields;
            },
            'schema' => null,
        ));
    }
}
add_action('rest_api_init', 'add_acf_to_rest_api');

/**
 * Register Child Theme Specific ACF Blocks
 */
function twentytwentyfive_child_register_acf_blocks() {
    // Check if ACF function exists
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    // Case Study Header Block
    acf_register_block_type(array(
        'name'              => 'case-study-header',
        'title'             => __('Case Study Header', 'twentytwentyfive'),
        'description'       => __('Header section with gradient background, logo, title, and subtitle', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'cover-image',
        'keywords'          => array('case study', 'header', 'gradient', 'logo', 'title'),
        'render_template'   => 'blocks/case-study-header/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-header/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Case Study Layout Block (Main Container)
    acf_register_block_type(array(
        'name'              => 'case-study-layout',
        'title'             => __('Case Study Layout', 'twentytwentyfive'),
        'description'       => __('Main layout container with left sidebar and right content area', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'layout',
        'keywords'          => array('case study', 'layout', 'sidebar', 'content'),
        'render_template'   => 'blocks/case-study-layout/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-layout/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Case Study Left Sidebar Block
    acf_register_block_type(array(
        'name'              => 'case-study-left-sidebar',
        'title'             => __('Case Study Left Sidebar', 'twentytwentyfive'),
        'description'       => __('Left sidebar with repeater sections for client info, profile, focus areas, and technology', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'admin-page',
        'keywords'          => array('case study', 'sidebar', 'client', 'profile', 'technology'),
        'render_template'   => 'blocks/case-study-left-sidebar/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-left-sidebar/style.css',
        'supports'          => array(
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Meet the Client Block
    acf_register_block_type(array(
        'name'              => 'meet-the-client',
        'title'             => __('Meet the Client', 'twentytwentyfive'),
        'description'       => __('Client profile block with image, name, designation, company, and content', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'businessman',
        'keywords'          => array('case study', 'client', 'profile', 'meet'),
        'render_template'   => 'blocks/meet-the-client/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/meet-the-client/style.css',
        'supports'          => array(
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Case Study Content Section Block
    acf_register_block_type(array(
        'name'              => 'case-study-content-section',
        'title'             => __('Case Study Content Section', 'twentytwentyfive'),
        'description'       => __('Reusable content section with icon, title, content, quotes, and bullet points', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'editor-alignleft',
        'keywords'          => array('case study', 'content', 'section', 'challenges', 'solution'),
        'render_template'   => 'blocks/case-study-content-section/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-content-section/style.css',
        'supports'          => array(
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Case Study Quote Block
    acf_register_block_type(array(
        'name'              => 'case-study-quote',
        'title'             => __('Case Study Quote', 'twentytwentyfive'),
        'description'       => __('Standalone quote block with custom styling', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'format-quote',
        'keywords'          => array('case study', 'quote', 'testimonial'),
        'render_template'   => 'blocks/case-study-quote/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-quote/style.css',
        'supports'          => array(
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Case Study CTA Block
    acf_register_block_type(array(
        'name'              => 'case-study-cta',
        'title'             => __('Case Study CTA', 'twentytwentyfive'),
        'description'       => __('Call-to-action section with buttons and links', 'twentytwentyfive'),
        'category'          => 'case-study',
        'icon'              => 'button',
        'keywords'          => array('case study', 'cta', 'call to action', 'button'),
        'render_template'   => 'blocks/case-study-cta/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/case-study-cta/style.css',
        'supports'          => array(
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));

    // Roadmap Block
    acf_register_block_type(array(
        'name'              => 'roadmap-block',
        'title'             => __('Roadmap Block', 'twentytwentyfive'),
        'description'       => __('Roadmap section with sticky left content and scrollable right steps with counters', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'list-view',
        'keywords'          => array('roadmap', 'timeline', 'steps', 'sticky', 'scroll', 'counter'),
        'render_template'   => 'blocks/roadmap-block/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/roadmap-block/style.css',
        'enqueue_script'    => get_stylesheet_directory_uri() . '/blocks/roadmap-block/script.js',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading'          => 'ROADMAP',
                    'subheading'       => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                    'background_color' => '#1a0b2e',
                    'roadmap_steps'    => array(
                        array(
                            'heading'    => 'REGISTRATION',
                            'subheading' => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                        ),
                        array(
                            'heading'    => 'START A NEW PROJECT',
                            'subheading' => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                        ),
                    ),
                ),
            ),
        ),
    ));

    // Infinity Testimonial Both Side Block
    acf_register_block_type(array(
        'name'              => 'infinity-testimonial-both-side',
        'title'             => __('Infinity Testimonial Both Side', 'twentytwentyfive'),
        'description'       => __('Advanced testimonial block with infinite scroll, video support, rating section, and directional control', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'format-quote',
        'keywords'          => array('testimonial', 'infinity', 'scroll', 'video', 'rating', 'reviews', 'slider'),
        'render_template'   => 'blocks/infinity-testimonial-both-side/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/infinity-testimonial-both-side/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'show_rating'      => true,
                    'rating_text'      => 'Rated 4/5 by over 1 Lakh users',
                    'rating_stars'     => 4,
                    'heading'          => 'Words of praise from others about our presence.',
                    'scroll_direction' => 'left_to_right',
                    'testimonials'     => array(
                        array(
                            'content_type'   => 'text',
                            'quote'          => 'Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.',
                            'author_name'    => 'Isabella Rodriguez',
                            'author_title'   => 'CEO and Co-founder',
                            'author_company' => 'ABC Company',
                        ),
                        array(
                            'content_type'   => 'text',
                            'quote'          => 'Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.',
                            'author_name'    => 'Gabrielle Williams',
                            'author_title'   => 'CEO and Co-founder',
                            'author_company' => 'ABC Company',
                        ),
                    ),
                ),
            ),
        ),
    ));

    // Video Section Block
    acf_register_block_type(array(
        'name'              => 'video-section',
        'title'             => __('Video Section', 'twentytwentyfive'),
        'description'       => __('Video section with heading, sub heading, custom button, and background options', 'twentytwentyfive'),
        'category'          => 'media',
        'icon'              => 'video-alt3',
        'keywords'          => array('video', 'section', 'media', 'button', 'heading', 'background'),
        'render_template'   => 'blocks/video-section/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/video-section/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading'     => 'Follow Your Heart Rescue.',
                    'sub_heading' => 'Pet Supplies & Toy Drive',
                    'button_text' => 'Watch Our Story',
                ),
            ),
        ),
    ));

    // Text Image Alternating Block
    acf_register_block_type(array(
        'name'              => 'text-image-alternating-block',
        'title'             => __('Text Image Alternating Block', 'twentytwentyfive'),
        'description'       => __('Dynamic block with background image, heading, subheading, and alternating text-image content sections', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'align-pull-left',
        'keywords'          => array('text', 'image', 'alternating', 'dynamic', 'content', 'sections'),
        'render_template'   => 'blocks/text-image-alternating-block/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/text-image-alternating-block/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'main_heading' => 'What "We Mean Solution" Really Means',
                    'main_subheading' => 'Every solution we build is accountable to performance, scalability and business value.',
                    'content_sections' => array(
                        array(
                            'text_content' => 'We don\'t sell technology — we solve business problems.',
                            'layout_type' => 'text-left',
                        ),
                        array(
                            'text_content' => 'We design for outcomes, not just delivery.',
                            'layout_type' => 'text-right',
                        ),
                    ),
                ),
            ),
        ),
    ));

    // Service Details Section Block
    acf_register_block_type(array(
        'name'              => 'service-details-section',
        'title'             => __('Service Details Section', 'twentytwentyfive'),
        'description'       => __('Display services in a responsive grid with icons, titles, descriptions, and customizable background', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'grid-view',
        'keywords'          => array('service', 'details', 'grid', 'responsive', 'icons', 'solutions'),
        'render_template'   => 'blocks/service-details-section/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/service-details-section/style.css',
        'enqueue_script'    => '',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading'     => 'What We Mean by Solutions',
                    'sub_heading' => 'We bring you powerful advantages to navigate your digital transformation',
                    'background_color' => '#f8f9fa',
                    'grid_columns' => '3',
                    'services'    => array(
                        array(
                            'service_title' => 'Data Science & AI',
                            'service_description' => "• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization",
                        ),
                        array(
                            'service_title' => 'Data Engineering',
                            'service_description' => "• Cloud data pipelines\n• Modern data platforms\n• Real-time analytics",
                        ),
                        array(
                            'service_title' => 'DevOps & Cloud Engineering',
                            'service_description' => "• CI/CD\n• Cloud migration\n• Infrastructure automation",
                        ),
                    ),
                ),
            ),
        ),
    ));

    // Call to Action Section Block
    acf_register_block_type(array(
        'name'              => 'call-to-action-section',
        'title'             => __('Call to Action Section', 'twentytwentyfive'),
        'description'       => __('Display a call to action with customizable background, heading, subheading, and button with particle effects', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'megaphone',
        'keywords'          => array('cta', 'call to action', 'button', 'banner', 'hero', 'particles'),
        'render_template'   => 'blocks/call-to-action-section/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/call-to-action-section/style.css',
        'enqueue_script'    => '',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading'         => 'Let\'s Solve What\'s Next',
                    'sub_heading'     => 'Tell us your challenge. We\'ll design the solution.',
                    'button_text'     => 'Talk to Our Experts',
                    'button_link'     => '#contact',
                    'button_style'    => 'primary',
                    'text_alignment'  => 'center',
                    'background_color' => '#1a1a2e',
                    'overlay_opacity' => 0.7,
                ),
            ),
        ),
    ));

    // Full One by Two Section Block
    acf_register_block_type(array(
        'name'              => 'full-one-by-two-section',
        'title'             => __('Full One by Two Section', 'twentytwentyfive'),
        'description'       => __('Full-width section with content on one half and image on the other half, with reverse layout option', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'columns',
        'keywords'          => array('full', 'one', 'two', 'section', 'image', 'content', 'reverse', 'layout', 'highlights'),
        'render_template'   => 'blocks/full-one-by-two-section/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/full-one-by-two-section/style.css',
        'enqueue_script'    => '',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading'         => 'From Processes to Power Moves',
                    'sub_heading'     => 'We replace fragmented workflows and manual dependencies with intelligent, scalable digital systems.',
                    'highlight_text'  => 'Highlights',
                    'highlight_points' => array(
                        array('point_text' => 'Faster time to market'),
                        array('point_text' => 'Lower operational risk'),
                        array('point_text' => 'Predictable scalability'),
                        array('point_text' => 'Data-focused decisions'),
                    ),
                    'button_text'     => 'See How',
                    'button_link'     => '#',
                    'background_color' => '#1a5f4f',
                    'text_color'      => '#ffffff',
                    'reverse_layout'  => false,
                ),
            ),
        ),
    ));

    // Partnership Gallery Block
    acf_register_block_type(array(
        'name'              => 'partnership-gallery',
        'title'             => __('Partnership Gallery', 'twentytwentyfive'),
        'description'       => __('Flexible partnership gallery with multiple layout options, infinite slider, and customizable styling', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'images-alt2',
        'keywords'          => array('partnership', 'gallery', 'partners', 'logos', 'slider', 'grid'),
        'render_template'   => 'blocks/partnership-gallery/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/partnership-gallery/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'heading' => 'Cloud & Platform Partnerships',
                    'sub_heading' => 'We partner with leading technology companies to deliver comprehensive solutions.',
                    'layout_type' => 'grid',
                    'columns_count' => '4',
                    'enable_slider' => false,
                    'image_style' => 'contain',
                    'image_hover_effect' => 'scale',
                    'background_color' => '#f8f9fa',
                    'text_color' => '#333333'
                ),
            ),
        ),
    ));

    // Footer Section Block
    acf_register_block_type(array(
        'name'              => 'footer-section',
        'title'             => __('Footer Section', 'twentytwentyfive'),
        'description'       => __('Dynamic footer section with customizable columns, social links, and branding', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'admin-links',
        'keywords'          => array('footer', 'links', 'social', 'contact', 'navigation', 'branding'),
        'render_template'   => 'blocks/footer-section/footer-section.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/footer-section/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'company_description' => 'We are committed to making meaningful contributions to the environment and society. As a global technology leader, MoreYeahs aims to automate digital literacy and foster sustainable, self-sufficient communities.',
                    'follow_us_text' => 'Follow Us',
                    'copyright_text' => '© 2025 MoreYeahs. All rights reserved.',
                    'background_color' => '#f8f9fa',
                    'text_color' => '#333333'
                ),
            ),
        ),
    ));
}
add_action('acf/init', 'twentytwentyfive_child_register_acf_blocks');

/**
 * Add Case Study block category
 */
function case_study_block_categories($categories) {
    return array_merge(
        $categories,
        array(
            array(
                'slug'  => 'case-study',
                'title' => __('Case Study Blocks', 'twentytwentyfive'),
                'icon'  => 'portfolio',
            ),
        )
    );
}
add_filter('block_categories_all', 'case_study_block_categories', 10, 2);

/**
 * Logo Persistence Across Theme Changes
 * Fixes the issue where logo becomes null when switching between parent and child themes
 */

/**
 * Preserve logo when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get logo from the old theme
    $old_logo = get_theme_mod('custom_logo');
    
    if ($old_logo && get_post($old_logo)) {
        // Store in option for the new theme to pick up
        update_option('custom_logo_id', $old_logo);
        
        // Also set it immediately in the new theme
        set_theme_mod('custom_logo', $old_logo);
    }
}, 10, 3);

/**
 * Restore logo after theme activation
 */
add_action('after_switch_theme', function() {
    $option_logo = get_option('custom_logo_id');
    $theme_logo = get_theme_mod('custom_logo');
    
    // If theme doesn't have logo but option does, restore it
    if (!$theme_logo && $option_logo && get_post($option_logo)) {
        set_theme_mod('custom_logo', $option_logo);
    }
    
    // If theme has logo but option doesn't, sync it
    if ($theme_logo && !$option_logo && get_post($theme_logo)) {
        update_option('custom_logo_id', $theme_logo);
    }
});

/**
 * Sync logo between theme mod and option when logo is updated
 */
add_action('customize_save_after', function() {
    $logo_id = get_theme_mod('custom_logo');
    if ($logo_id) {
        update_option('custom_logo_id', $logo_id);
    }
});

/**
 * Enhanced logo handling for appearance settings page
 */
add_action('admin_init', function() {
    // Sync logo when appearance settings are saved
    if (isset($_POST['appearance_settings_nonce']) && wp_verify_nonce($_POST['appearance_settings_nonce'], 'save_appearance_settings')) {
        if (isset($_POST['custom_logo'])) {
            $logo_id = absint($_POST['custom_logo']);
            if ($logo_id && get_post($logo_id)) {
                // Save to both locations
                set_theme_mod('custom_logo', $logo_id);
                update_option('custom_logo_id', $logo_id);
            } elseif (empty($_POST['custom_logo'])) {
                // Remove from both locations
                remove_theme_mod('custom_logo');
                delete_option('custom_logo_id');
            }
        }
    }
});
/**
 * Menu Persistence Across Theme Changes
 * Fixes the issue where menu assignments become lost when switching between parent and child themes
 */

/**
 * Preserve menu assignments when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get menu assignments from the old theme
    $old_locations = get_theme_mod('nav_menu_locations', []);
    
    if (!empty($old_locations)) {
        // Store in options for the new theme to pick up
        foreach ($old_locations as $location => $menu_id) {
            if ($menu_id && wp_get_nav_menu_object($menu_id)) {
                update_option("nav_menu_location_{$location}", $menu_id);
            }
        }
        
        // Also set them immediately in the new theme
        set_theme_mod('nav_menu_locations', $old_locations);
    }
}, 10, 3);

/**
 * Restore menu assignments after theme activation
 */
add_action('after_switch_theme', function() {
    $registered_locations = get_registered_nav_menus();
    $theme_locations = get_theme_mod('nav_menu_locations', []);
    $updated = false;
    
    foreach ($registered_locations as $location => $description) {
        $option_menu_id = get_option("nav_menu_location_{$location}");
        $theme_menu_id = isset($theme_locations[$location]) ? $theme_locations[$location] : null;
        
        // If theme doesn't have assignment but option does, restore it
        if (!$theme_menu_id && $option_menu_id && wp_get_nav_menu_object($option_menu_id)) {
            $theme_locations[$location] = $option_menu_id;
            $updated = true;
        }
        
        // If theme has assignment but option doesn't, sync it
        if ($theme_menu_id && !$option_menu_id && wp_get_nav_menu_object($theme_menu_id)) {
            update_option("nav_menu_location_{$location}", $theme_menu_id);
        }
    }
    
    if ($updated) {
        set_theme_mod('nav_menu_locations', $theme_locations);
    }
});

// wp_update_nav_menu hook removed - already handled by parent theme

/**
 * Force ACF field group synchronization
 * This ensures the case study template fields are properly loaded
 */
function force_acf_field_sync() {
    if (!function_exists('acf_get_field_groups')) {
        return;
    }
    
    // Check if case study template field group exists
    $field_group = acf_get_field_group('group_case_study_template');
    
    if (!$field_group) {
        // Try to sync from JSON
        $json_file = get_stylesheet_directory() . '/acf-json/group_case_study_template.json';
        if (file_exists($json_file)) {
            $json_data = json_decode(file_get_contents($json_file), true);
            if ($json_data && function_exists('acf_import_field_group')) {
                acf_import_field_group($json_data);
            }
        }
    }
}
add_action('acf/init', 'force_acf_field_sync');

/**
 * Ensure ACF fields are available in REST API
 */
function add_acf_to_case_study_rest_api() {
    if (!function_exists('get_fields')) {
        return;
    }
    
    register_rest_field('case_study', 'acf_fields', array(
        'get_callback' => function($post) {
            $fields = get_fields($post['id']);
            return $fields ? $fields : array();
        },
        'schema' => null,
    ));
}
add_action('rest_api_init', 'add_acf_to_case_study_rest_api');

/**
 * Debug ACF field saving
 */
function debug_acf_save($post_id) {
    if (get_post_type($post_id) === 'case_study') {
        error_log('ACF Save Debug - Post ID: ' . $post_id);
        error_log('ACF Save Debug - POST data: ' . print_r($_POST, true));
    }
}
add_action('acf/save_post', 'debug_acf_save', 1);

/**
 * Enable CORS for REST API
 * This allows your NextJS frontend to access the WordPress REST API
 */
function enable_cors_for_rest_api() {
    // Get the origin of the request
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Define allowed origins (add your NextJS frontend URLs)
    $allowed_origins = array(
        'http://localhost:3000',
        'https://localhost:3000',
        'http://127.0.0.1:3000',
        'https://127.0.0.1:3000',
        'https://moreyeahs-case-vercel.app',
        'https://www.moreyeahs-case-vercel.app',
        // Add your staging/production NextJS URLs here
    );
    
    // Check if the origin is allowed
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        // For development, you might want to allow all origins
        // Remove this in production for security
        header('Access-Control-Allow-Origin: *');
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, Accept');
    header('Access-Control-Allow-Credentials: true');
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}

// Add CORS headers to REST API requests
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        enable_cors_for_rest_api();
        return $value;
    });
});

// Also add CORS headers to regular requests (for non-REST API endpoints)
add_action('init', function() {
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        enable_cors_for_rest_api();
    }
});

/**
 * Process ACF Gallery Field - Convert image IDs to full image objects
 * This function is critical for the Partnership Gallery block to work properly
 */
function process_acf_gallery_field($gallery_images) {
    if (!$gallery_images || !is_array($gallery_images)) {
        return [];
    }
    
    // Debug logging
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Processing ACF gallery field:');
        error_log('Input: ' . print_r($gallery_images, true));
    }
    
    $processed_images = [];
    
    foreach ($gallery_images as $image) {
        // If image is already processed (has url and sizes), use as-is
        if (is_array($image) && isset($image['url']) && isset($image['sizes'])) {
            $processed_images[] = $image;
            continue;
        }
        
        // If image is just an ID (number or string), process it
        $image_id = null;
        if (is_numeric($image)) {
            $image_id = intval($image);
        } elseif (is_array($image) && isset($image['ID'])) {
            $image_id = intval($image['ID']);
        } elseif (is_array($image) && isset($image['id'])) {
            $image_id = intval($image['id']);
        }
        
        if ($image_id) {
            // Get full image data from WordPress
            $image_data = wp_get_attachment_image_src($image_id, 'full');
            $image_meta = wp_get_attachment_metadata($image_id);
            $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
            $image_post = get_post($image_id);
            
            if ($image_data && $image_post) {
                $processed_image = [
                    'id' => $image_id,
                    'url' => $image_data[0],
                    'width' => $image_data[1],
                    'height' => $image_data[2],
                    'alt' => $image_alt ?: $image_post->post_title,
                    'title' => $image_post->post_title,
                    'caption' => $image_post->post_excerpt,
                    'description' => $image_post->post_content,
                    'sizes' => []
                ];
                
                // Generate different image sizes
                $image_sizes = ['thumbnail', 'medium', 'medium_large', 'large', 'full'];
                foreach ($image_sizes as $size) {
                    $size_data = wp_get_attachment_image_src($image_id, $size);
                    if ($size_data) {
                        $processed_image['sizes'][$size] = $size_data[0];
                    }
                }
                
                // Ensure we have at least the full size
                if (empty($processed_image['sizes'])) {
                    $processed_image['sizes']['full'] = $image_data[0];
                    $processed_image['sizes']['large'] = $image_data[0];
                    $processed_image['sizes']['medium'] = $image_data[0];
                    $processed_image['sizes']['thumbnail'] = $image_data[0];
                }
                
                $processed_images[] = $processed_image;
                
                // Debug logging
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log('Processed image ID ' . $image_id . ': ' . print_r($processed_image, true));
                }
            }
        }
    }
    
    // Debug logging
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('Final processed images: ' . print_r($processed_images, true));
    }
    
    return $processed_images;
}

/**
 * Add Partnership Gallery REST API endpoint
 * This endpoint processes ACF gallery fields and returns full image objects
 */
add_action('rest_api_init', function() {
    register_rest_route('wp/v2', '/partnership-gallery/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => function($request) {
            $post_id = $request['id'];
            $post = get_post($post_id);
            
            if (!$post) {
                return new WP_Error('post_not_found', 'Post not found', ['status' => 404]);
            }
            
            // Get ACF fields for this post
            $acf_fields = function_exists('get_fields') ? get_fields($post_id) : [];
            
            // Process gallery images if they exist
            if (isset($acf_fields['gallery_images']) && is_array($acf_fields['gallery_images'])) {
                $acf_fields['gallery_images'] = process_acf_gallery_field($acf_fields['gallery_images']);
            }
            
            return rest_ensure_response([
                'id' => $post->ID,
                'title' => $post->post_title,
                'slug' => $post->post_name,
                'acf_fields' => $acf_fields,
                'processed_at' => current_time('mysql')
            ]);
        },
        'permission_callback' => '__return_true'
    ]);
});

