<?php
/**
 * REST API Routes
 * 
 * All custom REST API endpoints for the theme
 * Extracted from functions.php for better organization
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Include this file in functions.php with:
// require_once get_stylesheet_directory() . '/inc/rest-api-routes.php';

/**
 * Register all custom REST API routes
 */
add_action('rest_api_init', function() {
    // Simple test endpoint
    register_rest_route('wp/v2', '/simple-test', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_simple_test_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Site settings endpoint
    register_rest_route('wp/v2', '/site-settings', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_site_settings_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Pages with blocks endpoint
    register_rest_route('wp/v2', '/pages-with-blocks/(?P<slug>[a-zA-Z0-9-_]+)', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_pages_with_blocks_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Posts with ACF blocks endpoint
    register_rest_route('wp/v2', '/posts-with-acf-blocks/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_posts_with_acf_blocks_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Posts data endpoint
    register_rest_route('wp/v2', '/posts-data', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_posts_data_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Categories data endpoint
    register_rest_route('wp/v2', '/categories-data', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_categories_data_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Footer settings endpoint
    register_rest_route('wp/v2', '/footer-settings', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_footer_settings_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Test services data endpoint
    register_rest_route('wp/v2', '/test-services-data/(?P<post_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_test_services_data_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Debug services ACF endpoint
    register_rest_route('wp/v2', '/debug-services-acf/(?P<post_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_debug_services_acf_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Debug ACF endpoint
    register_rest_route('wp/v2', '/debug-acf/(?P<post_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_debug_acf_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Process gallery endpoint
    register_rest_route('wp/v2', '/process-gallery', [
        'methods' => 'POST',
        'callback' => 'twentytwentyfive_child_process_gallery_callback',
        'permission_callback' => '__return_true'
    ]);
    
    // Partnership gallery endpoint
    register_rest_route('wp/v2', '/partnership-gallery/(?P<id>\d+)', [
        'methods' => 'GET',
        'callback' => 'twentytwentyfive_child_partnership_gallery_callback',
        'permission_callback' => '__return_true'
    ]);
});

/**
 * Simple test endpoint callback
 */
function twentytwentyfive_child_simple_test_callback() {
    return rest_ensure_response([
        'message' => 'Simple test endpoint working from rest-api-routes.php',
        'time' => current_time('mysql'),
        'theme' => get_stylesheet()
    ]);
}

/**
 * Site settings endpoint callback
 */
function twentytwentyfive_child_site_settings_callback() {
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
}

/**
 * Pages with blocks endpoint callback
 * This is a complex callback - keeping the inline implementation from functions.php
 */
function twentytwentyfive_child_pages_with_blocks_callback($request) {
    $slug = $request['slug'];
    $page = get_page_by_path($slug);
    
    if (!$page) {
        return new WP_Error('page_not_found', 'Page not found', ['status' => 404]);
    }
    
    $post_id = $page->ID;
    $blocks = parse_blocks($page->post_content);
    
    // Process ACF blocks to include field data - ENHANCED FOR NESTED BLOCKS
    $processed_blocks = [];
    
    // Function to extract ACF data from block attributes
    $extract_acf_data_from_attrs = function($block_data) {
        $processed_data = [];
        
        // Handle specializations section specifically
        if (isset($block_data['left_items']) && is_numeric($block_data['left_items'])) {
            $left_count = intval($block_data['left_items']);
            $left_items = [];
            
            for ($i = 0; $i < $left_count; $i++) {
                $item = [];
                $item['heading'] = $block_data["left_items_{$i}_heading"] ?? '';
                $item['subheading'] = $block_data["left_items_{$i}_subheading"] ?? '';
                $item['heading_color'] = $block_data["left_items_{$i}_heading_color"] ?? '#333333';
                $item['subheading_color'] = $block_data["left_items_{$i}_subheading_color"] ?? '#666666';
                
                // Process image
                $image_id = $block_data["left_items_{$i}_image"] ?? null;
                if ($image_id) {
                    $item['image'] = process_acf_image_field($image_id);
                }
                
                if (!empty($item['heading'])) {
                    $left_items[] = $item;
                }
            }
            $processed_data['left_items'] = $left_items;
        }
        
        if (isset($block_data['right_paragraphs']) && is_numeric($block_data['right_paragraphs'])) {
            $right_count = intval($block_data['right_paragraphs']);
            $right_paragraphs = [];
            
            for ($i = 0; $i < $right_count; $i++) {
                $paragraph = [];
                $paragraph['text'] = $block_data["right_paragraphs_{$i}_text"] ?? '';
                $paragraph['color'] = $block_data["right_paragraphs_{$i}_color"] ?? '#666666';
                
                if (!empty($paragraph['text'])) {
                    $right_paragraphs[] = $paragraph;
                }
            }
            $processed_data['right_paragraphs'] = $right_paragraphs;
        }
        
        // Handle services section service_items repeater - ENHANCED
        if (isset($block_data['service_items'])) {
            $service_items = [];
            
            // Check if it's already an array (proper ACF data)
            if (is_array($block_data['service_items']) && !is_numeric($block_data['service_items'])) {
                $service_items = $block_data['service_items'];
                
                // Process images in the array
                foreach ($service_items as &$item) {
                    if (isset($item['image']) && $item['image']) {
                        $item['image'] = process_acf_image_field($item['image']);
                    }
                }
            }
            // Handle numeric count format
            elseif (is_numeric($block_data['service_items'])) {
                $service_count = intval($block_data['service_items']);
                
                for ($i = 0; $i < $service_count; $i++) {
                    $item = [];
                    $item['heading'] = $block_data["service_items_{$i}_heading"] ?? '';
                    $item['description'] = $block_data["service_items_{$i}_description"] ?? '';
                    $item['heading_color'] = $block_data["service_items_{$i}_heading_color"] ?? '#333333';
                    $item['description_color'] = $block_data["service_items_{$i}_description_color"] ?? '#666666';
                    
                    // Process image
                    $image_id = $block_data["service_items_{$i}_image"] ?? null;
                    if ($image_id) {
                        $item['image'] = process_acf_image_field($image_id);
                    }
                    
                    if (!empty($item['heading'])) {
                        $service_items[] = $item;
                    }
                }
            }
            
            $processed_data['service_items'] = $service_items;
        }
        
        // Handle fits-together-section steps repeater - ENHANCED
        if (isset($block_data['steps'])) {
            $steps = [];
            
            // Check if it's already an array (proper ACF data)
            if (is_array($block_data['steps']) && !is_numeric($block_data['steps'])) {
                $steps = $block_data['steps'];
                
                // Process images in the array if this is fits-together-section
                foreach ($steps as &$step) {
                    if (isset($step['icon']) && $step['icon']) {
                        $step['icon'] = process_acf_image_field($step['icon']);
                    }
                }
            }
            // Handle numeric count format
            elseif (is_numeric($block_data['steps'])) {
                $steps_count = intval($block_data['steps']);
                
                for ($i = 0; $i < $steps_count; $i++) {
                    $step = [];
                    
                    // Check if this is new-stepper block (has label and section_id)
                    if (isset($block_data["steps_{$i}_label"])) {
                        $step['label'] = $block_data["steps_{$i}_label"] ?? '';
                        $step['section_id'] = $block_data["steps_{$i}_section_id"] ?? '';
                    } else {
                        // This is fits-together-section (has step_number, title, etc.)
                        $step['step_number'] = $block_data["steps_{$i}_step_number"] ?? "Step " . ($i + 1);
                        $step['step_number_color'] = $block_data["steps_{$i}_step_number_color"] ?? '#0EA5E9';
                        $step['title'] = $block_data["steps_{$i}_title"] ?? '';
                        $step['title_color'] = $block_data["steps_{$i}_title_color"] ?? '#1F2937';
                        $step['subtitle'] = $block_data["steps_{$i}_subtitle"] ?? '';
                        $step['subtitle_color'] = $block_data["steps_{$i}_subtitle_color"] ?? '#6B7280';
                        
                        // Process icon
                        $icon_id = $block_data["steps_{$i}_icon"] ?? null;
                        if ($icon_id) {
                            $step['icon'] = process_acf_image_field($icon_id);
                        }
                    }
                    
                    // Add step if it has required data
                    if (!empty($step['label']) || !empty($step['title'])) {
                        $steps[] = $step;
                    }
                }
            }
            
            $processed_data['steps'] = $steps;
        }
        
        // Copy other fields
        foreach ($block_data as $key => $value) {
            if (!isset($processed_data[$key]) && !preg_match('/^(left_items_\d+_|right_paragraphs_\d+_|service_items_\d+_|steps_\d+_|_)/', $key)) {
                $processed_data[$key] = $value;
            }
        }
        
        return $processed_data;
    };
    
    // Recursive function to process blocks and their inner blocks
    $process_block_recursive = function($block) use (&$process_block_recursive, $extract_acf_data_from_attrs, $post_id) {
        // Process current block if it's an ACF block
        if (strpos($block['blockName'], 'acf/') === 0) {
            if (isset($block['attrs']['data'])) {
                // Extract and process the ACF data
                $block['attrs']['data'] = $extract_acf_data_from_attrs($block['attrs']['data']);
            }
            
            // ENHANCED: For services section, get ACF data directly from post
            if ($block['blockName'] === 'acf/services-section') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this post
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields) {
                        foreach ($all_fields as $field_name => $field_value) {
                            if ($field_name === 'service_items' && is_array($field_value)) {
                                // Process service items
                                $processed_items = [];
                                foreach ($field_value as $item) {
                                    $processed_item = $item;
                                    if (isset($item['image']) && $item['image']) {
                                        $processed_item['image'] = process_acf_image_field($item['image']);
                                    }
                                    $processed_items[] = $processed_item;
                                }
                                $direct_acf_data['service_items'] = $processed_items;
                            } else {
                                $direct_acf_data[$field_name] = $field_value;
                            }
                        }
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
            
            // ENHANCED: For specializations section, get ACF data directly from post
            if ($block['blockName'] === 'acf/specializations-section') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this post
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields) {
                        foreach ($all_fields as $field_name => $field_value) {
                            if ($field_name === 'left_items' && is_array($field_value)) {
                                // Process left items
                                $processed_items = [];
                                foreach ($field_value as $item) {
                                    $processed_item = $item;
                                    if (isset($item['image']) && $item['image']) {
                                        $processed_item['image'] = process_acf_image_field($item['image']);
                                    }
                                    $processed_items[] = $processed_item;
                                }
                                $direct_acf_data['left_items'] = $processed_items;
                            } else {
                                $direct_acf_data[$field_name] = $field_value;
                            }
                        }
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
            
            // ENHANCED: For fits-together-section, get ACF data directly from post
            if ($block['blockName'] === 'acf/fits-together-section') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this post
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields) {
                        foreach ($all_fields as $field_name => $field_value) {
                            if ($field_name === 'steps' && is_array($field_value)) {
                                // Process steps
                                $processed_steps = [];
                                foreach ($field_value as $step) {
                                    $processed_step = $step;
                                    if (isset($step['icon']) && $step['icon']) {
                                        $processed_step['icon'] = process_acf_image_field($step['icon']);
                                    }
                                    $processed_steps[] = $processed_step;
                                }
                                $direct_acf_data['steps'] = $processed_steps;
                            } else {
                                $direct_acf_data[$field_name] = $field_value;
                            }
                        }
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
            
            // ENHANCED: For faq-section, get ACF data directly from post
            if ($block['blockName'] === 'acf/faq-section') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this post
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields) {
                        foreach ($all_fields as $field_name => $field_value) {
                            if ($field_name === 'faq_items' && is_array($field_value)) {
                                // Process FAQ items - no special processing needed for text fields
                                $direct_acf_data['faq_items'] = $field_value;
                            } elseif ($field_name === 'background_image' && $field_value) {
                                // Process background image
                                $direct_acf_data['background_image'] = process_acf_image_field($field_value);
                            } else {
                                $direct_acf_data[$field_name] = $field_value;
                            }
                        }
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
            
            // ENHANCED: For partnership-gallery, get ACF data directly from post
            if ($block['blockName'] === 'acf/partnership-gallery') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this post
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields) {
                        foreach ($all_fields as $field_name => $field_value) {
                            if ($field_name === 'gallery_images' && is_array($field_value)) {
                                // Process gallery images using the dedicated function
                                $direct_acf_data['gallery_images'] = process_acf_gallery_field($field_value);
                            } else {
                                $direct_acf_data[$field_name] = $field_value;
                            }
                        }
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
            
            // ENHANCED: For new-stepper, get ACF data directly from post
            if ($block['blockName'] === 'acf/new-stepper') {
                $direct_acf_data = [];
                
                // Get all ACF fields for this block
                if (function_exists('get_fields')) {
                    $all_fields = get_fields($post_id);
                    if ($all_fields && isset($all_fields['steps']) && is_array($all_fields['steps'])) {
                        $direct_acf_data['steps'] = $all_fields['steps'];
                    }
                }
                
                // Merge direct ACF data with existing block data
                if (!empty($direct_acf_data)) {
                    $block['attrs']['data'] = array_merge($block['attrs']['data'] ?? [], $direct_acf_data);
                }
            }
        }
        
        // Process inner blocks recursively
        if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $processed_inner_blocks = [];
            foreach ($block['innerBlocks'] as $inner_block) {
                $processed_inner_blocks[] = $process_block_recursive($inner_block);
            }
            $block['innerBlocks'] = $processed_inner_blocks;
        }
        
        return $block;
    };
    
    foreach ($blocks as $block) {
        $processed_blocks[] = $process_block_recursive($block);
    }
    
    return rest_ensure_response([
        'id' => $page->ID,
        'title' => $page->post_title,
        'slug' => $page->post_name,
        'content' => $page->post_content,
        'blocks' => $processed_blocks
    ]);
}

// NOTE: The remaining callback functions (posts_with_acf_blocks, posts_data, categories_data, etc.)
// are still defined in functions.php. They can be moved here gradually if needed.
// For now, this file contains the main REST route registrations and key callbacks.

/**
 * Placeholder callbacks for endpoints still in functions.php
 * These will be gradually migrated from functions.php
 */
function twentytwentyfive_child_posts_with_acf_blocks_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_posts_data_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_categories_data_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_footer_settings_callback($request) {
    // Check if footer settings function exists
    if (!function_exists('get_footer_settings_data')) {
        return new WP_Error('function_not_found', 'Footer settings function not found', ['status' => 500]);
    }
    
    try {
        $footer_data = get_footer_settings_data();
        return rest_ensure_response($footer_data);
    } catch (Exception $e) {
        return new WP_Error('footer_settings_error', 'Error retrieving footer settings: ' . $e->getMessage(), ['status' => 500]);
    }
}

function twentytwentyfive_child_test_services_data_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_debug_services_acf_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_debug_acf_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_process_gallery_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}

function twentytwentyfive_child_partnership_gallery_callback($request) {
    // Implementation in functions.php - to be migrated
    return new WP_Error('not_implemented', 'This endpoint is still in functions.php', ['status' => 501]);
}
