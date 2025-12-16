<?php
/**
 * Custom REST API Endpoints for Headless WordPress
 * 
 * Provides endpoints for:
 * - Menus by location
 * - Site settings (logo, favicon, etc.)
 * - Footer widgets
 */

if (!defined('ABSPATH')) exit;

/**
 * Register custom REST API routes
 */
add_action('rest_api_init', function () {
    // Menu endpoints
    register_rest_route('wp/v2', '/menus', [
        'methods' => 'GET',
        'callback' => 'get_all_menus_rest',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route('wp/v2', '/menus/(?P<location>[a-zA-Z0-9-_]+)', [
        'methods' => 'GET',
        'callback' => 'get_menu_by_location_rest',
        'permission_callback' => '__return_true'
    ]);

    // Site settings endpoint
    register_rest_route('wp/v2', '/site-settings', [
        'methods' => 'GET',
        'callback' => 'get_site_settings_rest',
        'permission_callback' => '__return_true'
    ]);

    // Footer widgets endpoint
    register_rest_route('wp/v2', '/footer-widgets', [
        'methods' => 'GET',
        'callback' => 'get_footer_widgets_rest',
        'permission_callback' => '__return_true'
    ]);

    // Mega menu endpoint
    register_rest_route('wp/v2', '/mega-menus', [
        'methods' => 'GET',
        'callback' => 'get_mega_menus_rest',
        'permission_callback' => '__return_true'
    ]);

    // Post types endpoint for dynamic dropdown
    register_rest_route('wp/v2', '/post-types', [
        'methods' => 'GET',
        'callback' => 'get_public_post_types_rest',
        'permission_callback' => '__return_true'
    ]);

    // Pages with ACF blocks endpoint
    register_rest_route('wp/v2', '/pages-with-blocks/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods' => 'GET',
        'callback' => 'get_page_with_acf_blocks_rest',
        'permission_callback' => '__return_true'
    ]);

    // Debug endpoint for ACF blocks
    register_rest_route('wp/v2', '/debug-acf/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods' => 'GET',
        'callback' => 'debug_acf_blocks_rest',
        'permission_callback' => '__return_true'
    ]);

    // Simple ACF test endpoint
    register_rest_route('wp/v2', '/test-acf/(?P<page_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'test_acf_data_rest',
        'permission_callback' => '__return_true'
    ]);

    // Test image expansion endpoint
    register_rest_route('wp/v2', '/test-image/(?P<image_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'test_image_expansion_rest',
        'permission_callback' => '__return_true'
    ]);

    // Debug endpoint for navigation-next-block transformation
    register_rest_route('wp/v2', '/test-navigation-transform', [
        'methods' => 'GET',
        'callback' => 'test_navigation_transform_rest',
        'permission_callback' => '__return_true'
    ]);

    // Debug endpoint for full-width-left-text-section block
    register_rest_route('wp/v2', '/test-full-width-block/(?P<page_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'test_full_width_block_rest',
        'permission_callback' => '__return_true'
    ]);
});

/**
 * Get all registered menus
 */
function get_all_menus_rest() {
    $menus = get_terms('nav_menu', ['hide_empty' => true]);
    $result = [];

    foreach ($menus as $menu) {
        $result[] = [
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'count' => $menu->count,
            'items' => get_menu_items_formatted($menu->term_id)
        ];
    }

    return rest_ensure_response($result);
}

/**
 * Get menu by location
 */
function get_menu_by_location_rest($request) {
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
        'items' => get_menu_items_formatted($menu->term_id)
    ];

    return rest_ensure_response($result);
}

/**
 * Format menu items with hierarchy
 */
function get_menu_items_formatted($menu_id) {
    $items = wp_get_nav_menu_items($menu_id);
    
    if (!$items) {
        return [];
    }

    // Build a hierarchical structure
    $menu_items = [];
    $child_items = [];

    // First pass: separate parents and children
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

    // Second pass: attach children to parents
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
function get_site_settings_rest() {
    $logo_id = get_theme_mod('custom_logo');
    $logo = null;

    if ($logo_id) {
        $logo_data = wp_get_attachment_image_src($logo_id, 'full');
        $logo_meta = wp_get_attachment_metadata($logo_id);
        
        if ($logo_data) {
            $logo = [
                'url' => $logo_data[0],
                'width' => $logo_data[1],
                'height' => $logo_data[2],
                'alt' => get_post_meta($logo_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name')
            ];
        }
    }

    // Get favicon
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
function get_footer_widgets_rest() {
    $footer_data = array();

    // Get widget data for each column
    for ( $i = 1; $i <= 5; $i++ ) {
        $sidebar_id = 'footer-column-' . $i;

        if ( is_active_sidebar( $sidebar_id ) ) {
            ob_start();
            dynamic_sidebar( $sidebar_id );
            $content = ob_get_clean();

            // Parse the widget content using helper function from functions.php
            $widget_data = twentytwentyfive_parse_footer_widget_content( $content, $sidebar_id );

            if ( $widget_data ) {
                $footer_data[ 'column' . $i ] = $widget_data;
            }
        }
    }

    // Get copyright text
    $copyright_left  = get_option( 'footer_copyright_left', '' );
    $copyright_right = get_option( 'footer_copyright_right', '' );

    // Replace {year} placeholder with current year
    $current_year    = gmdate( 'Y' );
    $copyright_left  = str_replace( '{year}', $current_year, $copyright_left );
    $copyright_right = str_replace( '{year}', $current_year, $copyright_right );

    $footer_data['copyrightLeft']  = $copyright_left;
    $footer_data['copyrightRight'] = $copyright_right;

    return rest_ensure_response( $footer_data );
}

/**
 * Add CORS headers for REST API
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

        // Add custom allowed origin from wp-config
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

/**
 * Get all mega menus
 */
function get_mega_menus_rest() {
    $args = [
        'post_type' => 'mega_menu',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ];

    $menus = get_posts($args);
    $result = [];

    foreach ($menus as $menu) {
        $menu_type = get_field('menu_type', $menu->ID);
        $main_heading = get_field('main_heading', $menu->ID);
        $categories = get_field('menu_categories', $menu->ID);
        $featured = get_field('featured_content', $menu->ID);

        $result[] = [
            'id' => $menu->ID,
            'slug' => $menu->post_name,
            'title' => $menu->post_title,
            'menu_type' => $menu_type,
            'main_heading' => $main_heading,
            'categories' => $categories ?: [],
            'featured_content' => $featured ?: null
        ];
    }

    return rest_ensure_response($result);
}

/**
 * Get public post types for dynamic dropdown
 */
function get_public_post_types_rest() {
    $post_types = get_post_types([
        'public' => true,
        'show_in_rest' => true
    ], 'objects');

    $result = [];
    
    foreach ($post_types as $post_type) {
        // Skip attachment post type
        if ($post_type->name === 'attachment') {
            continue;
        }
        
        $result[] = [
            'slug' => $post_type->name,
            'name' => $post_type->labels->name,
            'rest_base' => $post_type->rest_base ?: $post_type->name
        ];
    }

    return rest_ensure_response($result);
}

/**
 * Helper function to expand image field data
 */
function expand_image_field($image_id) {
    if (!$image_id || !is_numeric($image_id)) {
        return null;
    }
    
    $attachment = get_post($image_id);
    if (!$attachment || $attachment->post_type !== 'attachment') {
        return null;
    }
    
    $image_data = wp_get_attachment_image_src($image_id, 'full');
    if (!$image_data) {
        return null;
    }
    
    // Get different sizes
    $thumbnail = wp_get_attachment_image_src($image_id, 'thumbnail');
    $medium = wp_get_attachment_image_src($image_id, 'medium');
    $large = wp_get_attachment_image_src($image_id, 'large');
    
    return [
        'id' => intval($image_id),
        'url' => $image_data[0],
        'width' => intval($image_data[1]),
        'height' => intval($image_data[2]),
        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true) ?: '',
        'title' => $attachment->post_title ?: '',
        'caption' => $attachment->post_excerpt ?: '',
        'description' => $attachment->post_content ?: '',
        'mime_type' => $attachment->post_mime_type ?: '',
        'sizes' => [
            'thumbnail' => $thumbnail ? [
                'url' => $thumbnail[0],
                'width' => intval($thumbnail[1]),
                'height' => intval($thumbnail[2])
            ] : null,
            'medium' => $medium ? [
                'url' => $medium[0],
                'width' => intval($medium[1]),
                'height' => intval($medium[2])
            ] : null,
            'large' => $large ? [
                'url' => $large[0],
                'width' => intval($large[1]),
                'height' => intval($large[2])
            ] : null,
            'full' => [
                'url' => $image_data[0],
                'width' => intval($image_data[1]),
                'height' => intval($image_data[2])
            ]
        ]
    ];
}

/**
 * Transform navigation-next-block flattened data to structured array
 */
function transform_navigation_next_block_data($data) {
    // Transform regions
    if (isset($data['regions']) && is_numeric($data['regions'])) {
        $regions_count = intval($data['regions']);
        $regions = [];
        
        for ($i = 0; $i < $regions_count; $i++) {
            $name_key = "regions_{$i}_name";
            $link_key = "regions_{$i}_link";
            
            if (isset($data[$name_key])) {
                $region = [
                    'name' => $data[$name_key]
                ];
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $region['link'] = $data[$link_key];
                }
                
                $regions[] = $region;
            }
        }
        
        $data['regions'] = $regions;
        
        // Clean up flattened keys
        for ($i = 0; $i < $regions_count; $i++) {
            unset($data["regions_{$i}_name"]);
            unset($data["regions_{$i}_link"]);
            unset($data["_regions_{$i}_name"]);
            unset($data["_regions_{$i}_link"]);
        }
    }
    // Handle regions array that's already structured (ensure it's properly formatted)
    elseif (isset($data['regions']) && is_array($data['regions'])) {
        // Regions are already structured, no transformation needed
        // Just ensure each region has the required fields
        foreach ($data['regions'] as $index => $region) {
            if (!isset($region['name'])) {
                // Remove invalid regions
                unset($data['regions'][$index]);
            }
        }
        // Re-index array to remove gaps
        $data['regions'] = array_values($data['regions']);
    }
    
    return $data;
}

/**
 * Transform counter-block flattened data to structured array
 */
function transform_counter_block_data($data) {
    // Transform counters
    if (isset($data['counters']) && is_numeric($data['counters'])) {
        $counters_count = intval($data['counters']);
        $counters = [];
        
        for ($i = 0; $i < $counters_count; $i++) {
            $number_key = "counters_{$i}_number";
            $prefix_key = "counters_{$i}_prefix";
            $suffix_key = "counters_{$i}_suffix";
            $label_key = "counters_{$i}_label";
            
            if (isset($data[$number_key])) {
                $counter = [
                    'number' => $data[$number_key]
                ];
                
                if (isset($data[$prefix_key]) && !empty($data[$prefix_key])) {
                    $counter['prefix'] = $data[$prefix_key];
                }
                
                if (isset($data[$suffix_key]) && !empty($data[$suffix_key])) {
                    $counter['suffix'] = $data[$suffix_key];
                }
                
                if (isset($data[$label_key]) && !empty($data[$label_key])) {
                    $counter['label'] = $data[$label_key];
                }
                
                $counters[] = $counter;
            }
        }
        
        $data['counters'] = $counters;
        
        // Clean up flattened keys
        for ($i = 0; $i < $counters_count; $i++) {
            unset($data["counters_{$i}_number"]);
            unset($data["counters_{$i}_prefix"]);
            unset($data["counters_{$i}_suffix"]);
            unset($data["counters_{$i}_label"]);
            unset($data["_counters_{$i}_number"]);
            unset($data["_counters_{$i}_prefix"]);
            unset($data["_counters_{$i}_suffix"]);
            unset($data["_counters_{$i}_label"]);
        }
    }
    
    return $data;
}

/**
 * Transform news-block flattened data to structured array
 */
function transform_news_block_data($data) {
    // Transform sub_headings
    if (isset($data['sub_headings']) && is_numeric($data['sub_headings'])) {
        $sub_headings_count = intval($data['sub_headings']);
        $sub_headings = [];
        
        for ($i = 0; $i < $sub_headings_count; $i++) {
            $text_key = "sub_headings_{$i}_text";
            $link_key = "sub_headings_{$i}_link";
            
            if (isset($data[$text_key])) {
                $sub_heading = [
                    'text' => $data[$text_key]
                ];
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $sub_heading['link'] = $data[$link_key];
                }
                
                $sub_headings[] = $sub_heading;
            }
        }
        
        $data['sub_headings'] = $sub_headings;
        
        // Clean up flattened keys
        for ($i = 0; $i < $sub_headings_count; $i++) {
            unset($data["sub_headings_{$i}_text"]);
            unset($data["sub_headings_{$i}_link"]);
            unset($data["_sub_headings_{$i}_text"]);
            unset($data["_sub_headings_{$i}_link"]);
        }
    }
    
    // Transform additional_items
    if (isset($data['additional_items']) && is_numeric($data['additional_items'])) {
        $additional_items_count = intval($data['additional_items']);
        $additional_items = [];
        
        for ($i = 0; $i < $additional_items_count; $i++) {
            $title_key = "additional_items_{$i}_title";
            $link_key = "additional_items_{$i}_link";
            $date_key = "additional_items_{$i}_date";
            $image_key = "additional_items_{$i}_image";
            
            if (isset($data[$title_key])) {
                $item = [
                    'title' => $data[$title_key]
                ];
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $item['link'] = $data[$link_key];
                }
                
                if (isset($data[$date_key]) && !empty($data[$date_key])) {
                    $item['date'] = $data[$date_key];
                }
                
                if (isset($data[$image_key]) && !empty($data[$image_key])) {
                    // Check if image is already expanded (array) or just an ID (numeric)
                    if (is_array($data[$image_key])) {
                        // Image is already expanded
                        $item['image'] = $data[$image_key];
                    } elseif (is_numeric($data[$image_key])) {
                        // Image is just an ID, expand it
                        $expanded_image = expand_image_field($data[$image_key]);
                        if ($expanded_image) {
                            $item['image'] = $expanded_image;
                        }
                    }
                }
                
                $additional_items[] = $item;
            }
        }
        
        $data['additional_items'] = $additional_items;
        
        // Clean up flattened keys
        for ($i = 0; $i < $additional_items_count; $i++) {
            unset($data["additional_items_{$i}_title"]);
            unset($data["additional_items_{$i}_link"]);
            unset($data["additional_items_{$i}_date"]);
            unset($data["additional_items_{$i}_image"]);
            unset($data["_additional_items_{$i}_title"]);
            unset($data["_additional_items_{$i}_link"]);
            unset($data["_additional_items_{$i}_date"]);
            unset($data["_additional_items_{$i}_image"]);
        }
    }
    
    // Expand background_image if it's just an ID
    if (isset($data['background_image']) && !empty($data['background_image'])) {
        if (is_numeric($data['background_image'])) {
            $expanded_image = expand_image_field($data['background_image']);
            if ($expanded_image) {
                $data['background_image'] = $expanded_image;
            }
        }
        // If it's already an array, leave it as is
    }
    
    return $data;
}

/**
 * Transform testimonial-block flattened data to structured array
 */
function transform_testimonial_block_data($data) {
    // Transform testimonials
    if (isset($data['testimonials']) && is_numeric($data['testimonials'])) {
        $testimonials_count = intval($data['testimonials']);
        $testimonials = [];
        
        for ($i = 0; $i < $testimonials_count; $i++) {
            $quote_key = "testimonials_{$i}_quote";
            $author_name_key = "testimonials_{$i}_author_name";
            $author_title_key = "testimonials_{$i}_author_title";
            $author_image_key = "testimonials_{$i}_author_image";
            
            if (isset($data[$quote_key]) || isset($data[$author_name_key])) {
                $testimonial = [];
                
                if (isset($data[$quote_key]) && !empty($data[$quote_key])) {
                    $testimonial['quote'] = $data[$quote_key];
                }
                
                if (isset($data[$author_name_key]) && !empty($data[$author_name_key])) {
                    $testimonial['author_name'] = $data[$author_name_key];
                }
                
                if (isset($data[$author_title_key]) && !empty($data[$author_title_key])) {
                    $testimonial['author_title'] = $data[$author_title_key];
                }
                
                if (isset($data[$author_image_key]) && !empty($data[$author_image_key])) {
                    // Check if image is already expanded (array) or just an ID (numeric)
                    if (is_array($data[$author_image_key])) {
                        // Image is already expanded
                        $testimonial['author_image'] = $data[$author_image_key];
                    } elseif (is_numeric($data[$author_image_key])) {
                        // Image is just an ID, expand it
                        $expanded_image = expand_image_field($data[$author_image_key]);
                        if ($expanded_image) {
                            $testimonial['author_image'] = $expanded_image;
                        }
                    }
                }
                
                $testimonials[] = $testimonial;
            }
        }
        
        $data['testimonials'] = $testimonials;
        
        // Clean up flattened keys
        for ($i = 0; $i < $testimonials_count; $i++) {
            unset($data["testimonials_{$i}_quote"]);
            unset($data["testimonials_{$i}_author_name"]);
            unset($data["testimonials_{$i}_author_title"]);
            unset($data["testimonials_{$i}_author_image"]);
            unset($data["_testimonials_{$i}_quote"]);
            unset($data["_testimonials_{$i}_author_name"]);
            unset($data["_testimonials_{$i}_author_title"]);
            unset($data["_testimonials_{$i}_author_image"]);
        }
    }
    
    // Expand background_image if it's just an ID
    if (isset($data['background_image']) && !empty($data['background_image'])) {
        if (is_numeric($data['background_image'])) {
            $expanded_image = expand_image_field($data['background_image']);
            if ($expanded_image) {
                $data['background_image'] = $expanded_image;
            }
        }
        // If it's already an array, leave it as is
    }
    
    return $data;
}

/**
 * Transform investor-block flattened data to structured array
 */
function transform_investor_block_data($data) {
    // Transform results_items
    if (isset($data['results_items']) && is_numeric($data['results_items'])) {
        $results_items_count = intval($data['results_items']);
        $results_items = [];
        
        for ($i = 0; $i < $results_items_count; $i++) {
            $label_key = "results_items_{$i}_label";
            $title_key = "results_items_{$i}_title";
            $link_key = "results_items_{$i}_link";
            
            if (isset($data[$title_key])) {
                $item = [
                    'title' => $data[$title_key]
                ];
                
                if (isset($data[$label_key]) && !empty($data[$label_key])) {
                    $item['label'] = $data[$label_key];
                }
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $item['link'] = $data[$link_key];
                }
                
                $results_items[] = $item;
            }
        }
        
        $data['results_items'] = $results_items;
        
        // Clean up flattened keys
        for ($i = 0; $i < $results_items_count; $i++) {
            unset($data["results_items_{$i}_label"]);
            unset($data["results_items_{$i}_title"]);
            unset($data["results_items_{$i}_link"]);
            unset($data["_results_items_{$i}_label"]);
            unset($data["_results_items_{$i}_title"]);
            unset($data["_results_items_{$i}_link"]);
        }
    }
    
    // Transform archived_items
    if (isset($data['archived_items']) && is_numeric($data['archived_items'])) {
        $archived_items_count = intval($data['archived_items']);
        $archived_items = [];
        
        for ($i = 0; $i < $archived_items_count; $i++) {
            $label_key = "archived_items_{$i}_label";
            $title_key = "archived_items_{$i}_title";
            $link_key = "archived_items_{$i}_link";
            
            if (isset($data[$title_key])) {
                $item = [
                    'title' => $data[$title_key]
                ];
                
                if (isset($data[$label_key]) && !empty($data[$label_key])) {
                    $item['label'] = $data[$label_key];
                }
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $item['link'] = $data[$link_key];
                }
                
                $archived_items[] = $item;
            }
        }
        
        $data['archived_items'] = $archived_items;
        
        // Clean up flattened keys
        for ($i = 0; $i < $archived_items_count; $i++) {
            unset($data["archived_items_{$i}_label"]);
            unset($data["archived_items_{$i}_title"]);
            unset($data["archived_items_{$i}_link"]);
            unset($data["_archived_items_{$i}_label"]);
            unset($data["_archived_items_{$i}_title"]);
            unset($data["_archived_items_{$i}_link"]);
        }
    }
    
    // Transform event_items
    if (isset($data['event_items']) && is_numeric($data['event_items'])) {
        $event_items_count = intval($data['event_items']);
        $event_items = [];
        
        for ($i = 0; $i < $event_items_count; $i++) {
            $label_key = "event_items_{$i}_label";
            $title_key = "event_items_{$i}_title";
            $link_key = "event_items_{$i}_link";
            
            if (isset($data[$title_key])) {
                $item = [
                    'title' => $data[$title_key]
                ];
                
                if (isset($data[$label_key]) && !empty($data[$label_key])) {
                    $item['label'] = $data[$label_key];
                }
                
                if (isset($data[$link_key]) && !empty($data[$link_key])) {
                    $item['link'] = $data[$link_key];
                }
                
                $event_items[] = $item;
            }
        }
        
        $data['event_items'] = $event_items;
        
        // Clean up flattened keys
        for ($i = 0; $i < $event_items_count; $i++) {
            unset($data["event_items_{$i}_label"]);
            unset($data["event_items_{$i}_title"]);
            unset($data["event_items_{$i}_link"]);
            unset($data["_event_items_{$i}_label"]);
            unset($data["_event_items_{$i}_title"]);
            unset($data["_event_items_{$i}_link"]);
        }
    }
    
    // Expand featured_image if it's just an ID
    if (isset($data['featured_image']) && is_numeric($data['featured_image'])) {
        $expanded_image = expand_image_field($data['featured_image']);
        if ($expanded_image) {
            $data['featured_image'] = $expanded_image;
        }
    }
    
    return $data;
}

/**
 * Helper function to get ACF block data
 */
function get_acf_block_data($block, $page_id) {
    // Method 1: Check if data is already in block attributes (most common for ACF blocks)
    if (isset($block['attrs']['data']) && is_array($block['attrs']['data']) && !empty($block['attrs']['data'])) {
        $data = $block['attrs']['data'];
        
        // Expand image fields if they are just IDs
        foreach ($data as $key => $value) {
            if (is_numeric($value) && (strpos($key, 'image') !== false || strpos($key, 'icon') !== false)) {
                $expanded_image = expand_image_field($value);
                if ($expanded_image) {
                    $data[$key] = $expanded_image;
                }
            }
        }
        
        // Special handling for full-width-left-text-section block
        if (isset($block['blockName']) && $block['blockName'] === 'acf/full-width-left-text-section') {
            // Ensure right_image field is properly expanded
            if (isset($data['right_image']) && is_numeric($data['right_image'])) {
                $expanded_image = expand_image_field($data['right_image']);
                if ($expanded_image) {
                    $data['right_image'] = $expanded_image;
                }
            }
            
            // Ensure reverse_layout field is properly converted to boolean
            if (isset($data['reverse_layout'])) {
                $data['reverse_layout'] = (bool) $data['reverse_layout'];
            }
        }
        
        // Note: Block transformations are now handled in process_blocks_recursive()
        // to avoid double transformation
        
        return $data;
    }
    
    // Method 2: Try to get ACF fields using various approaches
    $acf_data = [];
    
    // Get field groups for this block type
    $field_groups = acf_get_field_groups(['block' => $block['blockName']]);
    
    if (!empty($field_groups)) {
        $field_group = $field_groups[0];
        $fields = acf_get_fields($field_group['key']);
        
        if ($fields) {
            foreach ($fields as $field) {
                $field_name = $field['name'];
                $field_key = $field['key'];
                $field_type = $field['type'];
                $value = null;
                
                // Try to get from post meta using field key
                $meta_value = get_post_meta($page_id, $field_key, true);
                if ($meta_value !== '' && $meta_value !== false) {
                    $value = $meta_value;
                } else {
                    // Try with field name
                    $meta_value = get_post_meta($page_id, $field_name, true);
                    if ($meta_value !== '' && $meta_value !== false) {
                        $value = $meta_value;
                    }
                }
                
                // Use ACF get_field function as fallback
                if ($value === null) {
                    $value = get_field($field_name, $page_id);
                }
                
                // Special handling for image fields
                if ($field_type === 'image') {
                    if (is_numeric($value)) {
                        // Image stored as ID
                        $expanded_image = expand_image_field($value);
                        if ($expanded_image) {
                            $value = $expanded_image;
                        }
                    } elseif (is_array($value) && isset($value['ID'])) {
                        // Image already expanded by ACF but ensure consistent format
                        $expanded_image = expand_image_field($value['ID']);
                        if ($expanded_image) {
                            $value = $expanded_image;
                        }
                    } elseif (is_array($value) && isset($value['url'])) {
                        // Image already in array format, keep as is but ensure consistent structure
                        $value = [
                            'id' => intval($value['id'] ?? 0),
                            'url' => $value['url'],
                            'width' => intval($value['width'] ?? 0),
                            'height' => intval($value['height'] ?? 0),
                            'alt' => $value['alt'] ?? '',
                            'title' => $value['title'] ?? '',
                            'caption' => $value['caption'] ?? '',
                            'description' => $value['description'] ?? '',
                            'mime_type' => $value['mime_type'] ?? '',
                        ];
                    }
                }
                
                // Store the value if we found something valid
                if ($value !== null && $value !== '' && $value !== false) {
                    $acf_data[$field_name] = $value;
                }
            }
        }
    }
    
    return $acf_data;
}

/**
 * Get page with ACF blocks data
 */
function get_page_with_acf_blocks_rest($request) {
    $slug = $request['slug'];
    
    // Get page by slug
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
    }
    
    // Parse blocks from content
    $blocks = parse_blocks($page->post_content);
    $processed_blocks = [];
    
    // Helper function to process blocks recursively
    function process_blocks_recursive($blocks, $page_id) {
        $processed_blocks = [];
        
        foreach ($blocks as $block) {
            if (empty($block['blockName'])) {
                continue;
            }
            
            $processed_block = [
                'blockName' => $block['blockName'],
                'attrs' => $block['attrs'],
                'innerHTML' => $block['innerHTML'],
                'innerContent' => $block['innerContent'],
                'innerBlocks' => []
            ];
            
            // Process inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                $processed_block['innerBlocks'] = process_blocks_recursive($block['innerBlocks'], $page_id);
            }
            
            // If it's an ACF block, preserve or get the ACF data
            if (strpos($block['blockName'], 'acf/') === 0) {
                // Check if data is already present in the block (from WordPress block parsing)
                if (isset($block['attrs']['data']) && !empty($block['attrs']['data'])) {
                    // Data is already there, process it with our helper function
                    $processed_block['attrs']['data'] = get_acf_block_data($block, $page_id);
                    
                    // Apply transformations for specific block types
                    switch ($block['blockName']) {
                        case 'acf/navigation-next-block':
                            $processed_block['attrs']['data'] = transform_navigation_next_block_data($processed_block['attrs']['data']);
                            break;
                        case 'acf/counter-block':
                            $processed_block['attrs']['data'] = transform_counter_block_data($processed_block['attrs']['data']);
                            break;
                        case 'acf/news-block':
                            $processed_block['attrs']['data'] = transform_news_block_data($processed_block['attrs']['data']);
                            break;
                        case 'acf/investor-block':
                            $processed_block['attrs']['data'] = transform_investor_block_data($processed_block['attrs']['data']);
                            break;
                        case 'acf/testimonial-block':
                            $processed_block['attrs']['data'] = transform_testimonial_block_data($processed_block['attrs']['data']);
                            break;
                    }

                } else {
                    // No data in block, try to get it using helper function
                    $acf_data = get_acf_block_data($block, $page_id);
                    $processed_block['attrs']['data'] = $acf_data;
                }
            }
            
            $processed_blocks[] = $processed_block;
        }
        
        return $processed_blocks;
    }
    
    $processed_blocks = process_blocks_recursive($blocks, $page->ID);
    
    $result = [
        'id' => $page->ID,
        'title' => $page->post_title,
        'slug' => $page->post_name,
        'content' => $page->post_content,
        'blocks' => $processed_blocks
    ];
    
    return rest_ensure_response($result);
}

/**
 * Debug ACF blocks data
 */
function debug_acf_blocks_rest($request) {
    $slug = $request['slug'];
    
    // Get page by slug
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
    }
    
    $debug_info = [
        'page_id' => $page->ID,
        'page_title' => $page->post_title,
        'page_slug' => $page->post_name,
        'acf_version' => defined('ACF_VERSION') ? ACF_VERSION : 'Not installed',
        'all_page_fields' => get_fields($page->ID),
        'page_meta' => get_post_meta($page->ID),
        'blocks_raw' => parse_blocks($page->post_content),
        'field_groups' => acf_get_field_groups(['post_id' => $page->ID]),
        'moreyeahs_service_field_groups' => acf_get_field_groups(['block' => 'acf/moreyeahs-service-block'])
    ];
    
    return rest_ensure_response($debug_info);
}
/**
 * Test ACF data directly
 */
function test_acf_data_rest($request) {
    $page_id = intval($request['page_id']);
    
    $page = get_post($page_id);
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
    }
    
    $test_data = [
        'page_id' => $page_id,
        'page_title' => $page->post_title,
        'acf_version' => defined('ACF_VERSION') ? ACF_VERSION : 'Not installed',
        'get_fields_result' => get_fields($page_id),
        'post_meta_all' => get_post_meta($page_id),
        'specific_field_tests' => [
            'heading' => get_field('heading', $page_id),
            'subheading' => get_field('subheading', $page_id),
            'service_sections' => get_field('service_sections', $page_id),
        ],
        'field_groups_for_page' => acf_get_field_groups(['post_id' => $page_id]),
        'field_groups_for_block' => acf_get_field_groups(['block' => 'acf/moreyeahs-service-block']),
    ];
    
    return rest_ensure_response($test_data);
}

/**
 * Test image expansion function
 */
function test_image_expansion_rest($request) {
    $image_id = intval($request['image_id']);
    
    $test_data = [
        'image_id' => $image_id,
        'expanded_image' => expand_image_field($image_id),
        'wp_get_attachment_image_src' => wp_get_attachment_image_src($image_id, 'full'),
        'get_post' => get_post($image_id),
        'attachment_url' => wp_get_attachment_url($image_id),
        'attachment_metadata' => wp_get_attachment_metadata($image_id),
    ];
    
    return rest_ensure_response($test_data);
}
/**
 * Test navigation-next-block transformation
 */
function test_navigation_transform_rest() {
    // Test data
    $test_data = [
        "regions_0_name" => "Europe",
        "_regions_0_name" => "field_navigation_next_region_name",
        "regions_0_link" => "#",
        "_regions_0_link" => "field_navigation_next_region_link",
        "regions_1_name" => "Asia Pacific",
        "_regions_1_name" => "field_navigation_next_region_name",
        "regions_1_link" => "#",
        "_regions_1_link" => "field_navigation_next_region_link",
        "regions_2_name" => "Americas",
        "_regions_2_name" => "field_navigation_next_region_name",
        "regions_2_link" => "#",
        "_regions_2_link" => "field_navigation_next_region_link",
        "regions_3_name" => "Middle East and Africa",
        "_regions_3_name" => "field_navigation_next_region_name",
        "regions_3_link" => "#",
        "_regions_3_link" => "field_navigation_next_region_link",
        "regions" => 4,
        "_regions" => "field_navigation_next_regions",
        "heading" => "Let's help you navigate your next 1",
        "_heading" => "field_navigation_next_heading",
        "button_text" => "CONTACT US",
        "_button_text" => "field_navigation_next_button_text",
        "button_link" => "#",
        "_button_link" => "field_navigation_next_button_link"
    ];

    $result = [
        'function_exists' => function_exists('transform_navigation_next_block_data'),
        'original_data' => $test_data,
        'transformed_data' => null,
        'error' => null
    ];

    if (function_exists('transform_navigation_next_block_data')) {
        try {
            $result['transformed_data'] = transform_navigation_next_block_data($test_data);
        } catch (Exception $e) {
            $result['error'] = $e->getMessage();
        }
    }

    return rest_ensure_response($result);
}

/**
 * Test full-width-left-text-section block data
 */
function test_full_width_block_rest($request) {
    $page_id = intval($request['page_id']);
    
    $page = get_post($page_id);
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
    }
    
    // Parse blocks and find full-width-left-text-section blocks
    $blocks = parse_blocks($page->post_content);
    $full_width_blocks = [];
    
    function find_full_width_blocks($blocks, &$full_width_blocks, $page_id) {
        foreach ($blocks as $block) {
            if ($block['blockName'] === 'acf/full-width-left-text-section') {
                $block_data = get_acf_block_data($block, $page_id);
                $full_width_blocks[] = [
                    'block' => $block,
                    'processed_data' => $block_data,
                    'right_image_raw' => get_field('right_image', $page_id),
                    'right_image_meta' => get_post_meta($page_id, 'right_image', true),
                ];
            }
            
            if (!empty($block['innerBlocks'])) {
                find_full_width_blocks($block['innerBlocks'], $full_width_blocks, $page_id);
            }
        }
    }
    
    find_full_width_blocks($blocks, $full_width_blocks, $page_id);
    
    $result = [
        'page_id' => $page_id,
        'page_title' => $page->post_title,
        'full_width_blocks_found' => count($full_width_blocks),
        'blocks_data' => $full_width_blocks,
        'all_acf_fields' => get_fields($page_id),
        'field_groups' => acf_get_field_groups(['block' => 'acf/full-width-left-text-section'])
    ];
    
    return rest_ensure_response($result);
}