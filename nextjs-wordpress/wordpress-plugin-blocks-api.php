<?php
/**
 * Plugin Name: Next.js Blocks API
 * Description: Custom REST API endpoint to return WordPress pages with parsed block data for Next.js
 * Version: 1.0.0
 * Author: Moreyeahs
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API endpoint for pages with blocks
 */
add_action('rest_api_init', function () {
    register_rest_route('wp/v2', '/pages-with-blocks/(?P<slug>[a-zA-Z0-9-]+)', array(
        'methods' => 'GET',
        'callback' => 'get_page_with_blocks',
        'permission_callback' => '__return_true',
        'args' => array(
            'slug' => array(
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_title',
            ),
        ),
    ));
});

/**
 * Get page with parsed blocks
 */
function get_page_with_blocks($request) {
    $slug = $request->get_param('slug');
    
    // Get page by slug
    $args = array(
        'name' => $slug,
        'post_type' => 'page',
        'post_status' => 'publish',
        'posts_per_page' => 1,
    );
    
    $query = new WP_Query($args);
    
    if (!$query->have_posts()) {
        return new WP_Error('no_page', 'Page not found', array('status' => 404));
    }
    
    $post = $query->posts[0];
    
    // Parse blocks from post content
    $blocks = parse_blocks($post->post_content);
    
    // Process blocks to include ACF data
    $processed_blocks = process_blocks_with_acf($blocks);
    
    // Get Yoast SEO data if available
    $yoast_meta = array();
    if (class_exists('WPSEO_Meta')) {
        $yoast_meta = array(
            'title' => get_post_meta($post->ID, '_yoast_wpseo_title', true),
            'description' => get_post_meta($post->ID, '_yoast_wpseo_metadesc', true),
        );
    }
    
    // Return page data with blocks
    return array(
        'id' => $post->ID,
        'slug' => $post->post_name,
        'title' => $post->post_title,
        'content' => $post->post_content,
        'blocks' => $processed_blocks,
        'yoast' => $yoast_meta,
    );
}

/**
 * Process blocks and include ACF data
 */
function process_blocks_with_acf($blocks) {
    $processed = array();
    
    foreach ($blocks as $block) {
        // Skip empty blocks
        if (empty($block['blockName'])) {
            continue;
        }
        
        $processed_block = array(
            'blockName' => $block['blockName'],
            'attrs' => isset($block['attrs']) ? $block['attrs'] : array(),
            'innerHTML' => isset($block['innerHTML']) ? $block['innerHTML'] : '',
            'innerContent' => isset($block['innerContent']) ? $block['innerContent'] : array(),
            'innerBlocks' => array(),
        );
        
        // Process ACF blocks
        if (strpos($block['blockName'], 'acf/') === 0) {
            $processed_block['attrs']['data'] = get_acf_block_data($block);
        }
        
        // Recursively process inner blocks
        if (!empty($block['innerBlocks'])) {
            $processed_block['innerBlocks'] = process_blocks_with_acf($block['innerBlocks']);
        }
        
        $processed[] = $processed_block;
    }
    
    return $processed;
}

/**
 * Get ACF data for a block
 */
function get_acf_block_data($block) {
    if (!function_exists('get_fields')) {
        return array();
    }
    
    // Get block ID from attrs
    $block_id = isset($block['attrs']['id']) ? $block['attrs']['id'] : '';
    
    if (empty($block_id)) {
        return array();
    }
    
    // Get ACF fields for this block
    $fields = get_fields("block_{$block_id}");
    
    if (!$fields) {
        $fields = array();
    }
    
    // Process image fields to include full URLs
    $fields = process_acf_images($fields);
    
    return $fields;
}

/**
 * Process ACF image fields to include full URLs
 */
function process_acf_images($data) {
    if (!is_array($data)) {
        return $data;
    }
    
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            // Check if this is an ACF image array
            if (isset($value['ID']) && isset($value['url'])) {
                // This is an image field, ensure URL is absolute
                $data[$key]['url'] = wp_get_attachment_url($value['ID']);
                $data[$key]['alt'] = get_post_meta($value['ID'], '_wp_attachment_image_alt', true);
                
                // Get image dimensions
                $image_meta = wp_get_attachment_metadata($value['ID']);
                if ($image_meta) {
                    $data[$key]['width'] = isset($image_meta['width']) ? $image_meta['width'] : 0;
                    $data[$key]['height'] = isset($image_meta['height']) ? $image_meta['height'] : 0;
                }
            } else {
                // Recursively process nested arrays
                $data[$key] = process_acf_images($value);
            }
        }
    }
    
    return $data;
}
