<?php
/**
 * MoreYeahs Dynamic Configuration Plugin
 * Must-use plugin to handle environment-specific functionality
 * 
 * This file is automatically loaded by WordPress and handles:
 * - CORS headers for Next.js integration
 * - Media URL transformation
 * - REST API response transformation
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// CORS settings for Next.js integration
function moreyeahs_add_cors_headers() {
    $allowed_origins = [
        'http://localhost:3000',
        'https://moreyeahsnew.vercel.app',
        'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost')
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

// Add CORS headers for API requests
add_action('rest_api_init', 'moreyeahs_add_cors_headers');

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        moreyeahs_add_cors_headers();
        exit(0);
    }
});

// Media URL transformation for different environments
function moreyeahs_transform_media_urls($content) {
    if (empty($content)) return $content;
    
    $current_host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    
    // Determine the correct WordPress URL based on environment
    $wp_environment = defined('WP_ENVIRONMENT_TYPE') ? WP_ENVIRONMENT_TYPE : 'local';
    
    switch ($wp_environment) {
        case 'local':
            $replacement = $protocol . $current_host . '/moreyeahs-new/wp-content/uploads/';
            break;
        case 'development':
        case 'staging':
        case 'production':
        default:
            $replacement = $protocol . $current_host . '/wp-content/uploads/';
            break;
    }
    
    // Replace any WordPress media URLs with current environment URLs
    $patterns = [
        '/https?:\/\/localhost\/moreyeahs-new\/wp-content\/uploads\//',
        '/https?:\/\/localhost\/wp-content\/uploads\//',
        '/https?:\/\/dev\.moreyeahs\.com\/wp-content\/uploads\//',
        '/https?:\/\/staging\.moreyeahs\.com\/wp-content\/uploads\//',
        '/https?:\/\/moreyeahs\.com\/wp-content\/uploads\//',
        '/https?:\/\/www\.moreyeahs\.com\/wp-content\/uploads\//'
    ];
    
    foreach ($patterns as $pattern) {
        $content = preg_replace($pattern, $replacement, $content);
    }
    
    return $content;
}

// Apply media URL transformation to content
add_filter('the_content', 'moreyeahs_transform_media_urls');
add_filter('wp_get_attachment_url', 'moreyeahs_transform_media_urls');
add_filter('wp_get_attachment_image_src', function($image) {
    if (is_array($image) && isset($image[0])) {
        $image[0] = moreyeahs_transform_media_urls($image[0]);
    }
    return $image;
});

// Additional filters to catch more URL generation
add_filter('wp_calculate_image_srcset', function($sources) {
    if (is_array($sources)) {
        foreach ($sources as $width => $source) {
            if (isset($source['url'])) {
                $sources[$width]['url'] = moreyeahs_transform_media_urls($source['url']);
            }
        }
    }
    return $sources;
});

// Transform URLs in wp_get_attachment_image_attributes
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment, $size) {
    if (isset($attr['src'])) {
        $attr['src'] = moreyeahs_transform_media_urls($attr['src']);
    }
    if (isset($attr['srcset'])) {
        $attr['srcset'] = moreyeahs_transform_media_urls($attr['srcset']);
    }
    return $attr;
}, 10, 3);

// Transform site icon URL (used for favicon, logo, etc.)
add_filter('get_site_icon_url', 'moreyeahs_transform_media_urls');

// Catch-all filter for any option that might contain media URLs
add_filter('option_site_logo', function($value) {
    if (is_numeric($value)) {
        // If it's an attachment ID, get the URL and transform it
        $url = wp_get_attachment_url($value);
        return $url ? moreyeahs_transform_media_urls($url) : $value;
    }
    return is_string($value) ? moreyeahs_transform_media_urls($value) : $value;
});

// Transform custom logo URL
add_filter('theme_mod_custom_logo', function($value) {
    if (is_numeric($value)) {
        return $value; // Keep attachment ID as-is, URL transformation happens elsewhere
    }
    return is_string($value) ? moreyeahs_transform_media_urls($value) : $value;
});

// Transform any URL in JSON-LD schema (for SEO plugins like Yoast)
add_filter('wpseo_json_ld_output', function($data) {
    if (is_array($data)) {
        array_walk_recursive($data, function(&$value) {
            if (is_string($value) && strpos($value, 'wp-content/uploads') !== false) {
                $value = moreyeahs_transform_media_urls($value);
            }
        });
    }
    return $data;
});

// Transform REST API responses
add_filter('rest_prepare_post', function($response, $post, $request) {
    $data = $response->get_data();
    
    // Transform featured media URLs
    if (isset($data['featured_media_src_url'])) {
        $data['featured_media_src_url'] = moreyeahs_transform_media_urls($data['featured_media_src_url']);
    }
    
    // Transform content URLs
    if (isset($data['content']['rendered'])) {
        $data['content']['rendered'] = moreyeahs_transform_media_urls($data['content']['rendered']);
    }
    
    // Transform excerpt URLs
    if (isset($data['excerpt']['rendered'])) {
        $data['excerpt']['rendered'] = moreyeahs_transform_media_urls($data['excerpt']['rendered']);
    }
    
    $response->set_data($data);
    return $response;
}, 10, 3);

// Transform attachment URLs in REST API
add_filter('rest_prepare_attachment', function($response, $post, $request) {
    $data = $response->get_data();
    
    if (isset($data['source_url'])) {
        $data['source_url'] = moreyeahs_transform_media_urls($data['source_url']);
    }
    
    if (isset($data['media_details']['sizes'])) {
        foreach ($data['media_details']['sizes'] as $size => $details) {
            if (isset($details['source_url'])) {
                $data['media_details']['sizes'][$size]['source_url'] = moreyeahs_transform_media_urls($details['source_url']);
            }
        }
    }
    
    $response->set_data($data);
    return $response;
}, 10, 3);

// Add environment info to REST API for debugging
add_action('rest_api_init', function() {
    register_rest_route('moreyeahs/v1', '/environment', [
        'methods' => 'GET',
        'callback' => function() {
            $wp_environment = defined('WP_ENVIRONMENT_TYPE') ? WP_ENVIRONMENT_TYPE : 'unknown';
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
            
            // Get the correct WordPress URL based on WP_HOME or site URL
            $wordpress_url = defined('WP_HOME') ? WP_HOME : (defined('WP_SITEURL') ? WP_SITEURL : $protocol . $host);
            
            return [
                'environment' => $wp_environment,
                'host' => $host,
                'protocol' => $protocol,
                'wordpress_url' => $wordpress_url,
                'wp_home' => defined('WP_HOME') ? WP_HOME : 'not set',
                'wp_siteurl' => defined('WP_SITEURL') ? WP_SITEURL : 'not set'
            ];
        },
        'permission_callback' => '__return_true'
    ]);
});