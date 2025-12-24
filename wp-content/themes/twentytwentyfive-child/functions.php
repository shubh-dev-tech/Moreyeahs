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
    
    // Include ACF blocks functionality
    if (file_exists($parent_inc_path . '/acf-blocks.php')) {
        require_once $parent_inc_path . '/acf-blocks.php';
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
                
                return rest_ensure_response([
                    'id' => $page->ID,
                    'title' => $page->post_title,
                    'slug' => $page->post_name,
                    'content' => $page->post_content,
                    'blocks' => $blocks
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
    });
}
add_action('after_setup_theme', 'twentytwentyfive_child_include_parent_functions');

/**
 * Set ACF JSON load and save paths to child theme
 * This ensures field groups are managed in the child theme
 */
function twentytwentyfive_child_acf_json_load_point($paths) {
    // Remove original path
    unset($paths[0]);
    
    // Add child theme path
    $paths[] = get_stylesheet_directory() . '/acf-json';
    
    // Add parent theme path as fallback
    $paths[] = get_template_directory() . '/acf-json';
    
    return $paths;
}
add_filter('acf/settings/load_json', 'twentytwentyfive_child_acf_json_load_point');

function twentytwentyfive_child_acf_json_save_point($path) {
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

/**
 * Sync menu assignments when they are updated
 */
add_action('wp_update_nav_menu', function($menu_id, $menu_data = null) {
    // Sync current assignments to options
    $locations = get_theme_mod('nav_menu_locations', []);
    foreach ($locations as $location => $assigned_menu_id) {
        update_option("nav_menu_location_{$location}", $assigned_menu_id);
    }
}, 10, 2);