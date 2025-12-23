<?php
/**
 * Plugin Name: Draft Post API
 * Plugin URI: https://example.com
 * Description: A WordPress plugin that provides a POST API endpoint for creating posts in draft mode
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: draft-post-api
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main plugin class
 */
class DraftPostAPI {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_action('rest_api_init', array($this, 'add_cors_headers'));
    }
    
    /**
     * Register REST API routes
     */
    public function register_rest_routes() {
        // Create draft post endpoint
        register_rest_route('draft-api/v1', '/create-post', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_draft_post'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'title' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => 'Post title',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'content' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'Post content',
                    'sanitize_callback' => 'wp_kses_post'
                ),
                'excerpt' => array(
                    'required' => false,
                    'type' => 'string',
                    'description' => 'Post excerpt',
                    'sanitize_callback' => 'sanitize_textarea_field'
                ),
                'categories' => array(
                    'required' => false,
                    'type' => 'array',
                    'description' => 'Array of category IDs or names',
                    'items' => array(
                        'type' => array('integer', 'string')
                    )
                ),
                'tags' => array(
                    'required' => false,
                    'type' => 'array',
                    'description' => 'Array of tag names',
                    'items' => array(
                        'type' => 'string'
                    )
                ),
                'featured_image' => array(
                    'required' => false,
                    'type' => 'integer',
                    'description' => 'Featured image attachment ID'
                ),
                'author' => array(
                    'required' => false,
                    'type' => 'integer',
                    'description' => 'Author user ID'
                ),
                'meta' => array(
                    'required' => false,
                    'type' => 'object',
                    'description' => 'Custom meta fields as key-value pairs'
                )
            )
        ));
        
        // Get draft posts endpoint
        register_rest_route('draft-api/v1', '/draft-posts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_draft_posts'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'per_page' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 10,
                    'description' => 'Number of posts per page'
                ),
                'page' => array(
                    'required' => false,
                    'type' => 'integer',
                    'default' => 1,
                    'description' => 'Page number'
                ),
                'author' => array(
                    'required' => false,
                    'type' => 'integer',
                    'description' => 'Filter by author ID'
                )
            )
        ));
        
        // Update draft post endpoint
        register_rest_route('draft-api/v1', '/update-post/(?P<id>\d+)', array(
            'methods' => 'PUT',
            'callback' => array($this, 'update_draft_post'),
            'permission_callback' => array($this, 'check_permissions'),
            'args' => array(
                'title' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'content' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'wp_kses_post'
                ),
                'excerpt' => array(
                    'required' => false,
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_textarea_field'
                ),
                'status' => array(
                    'required' => false,
                    'type' => 'string',
                    'enum' => array('draft', 'publish', 'private'),
                    'description' => 'Post status'
                ),
                'categories' => array(
                    'required' => false,
                    'type' => 'array',
                    'items' => array(
                        'type' => array('integer', 'string')
                    )
                ),
                'tags' => array(
                    'required' => false,
                    'type' => 'array',
                    'items' => array(
                        'type' => 'string'
                    )
                ),
                'featured_image' => array(
                    'required' => false,
                    'type' => 'integer'
                ),
                'meta' => array(
                    'required' => false,
                    'type' => 'object'
                )
            )
        ));
        
        // Delete draft post endpoint
        register_rest_route('draft-api/v1', '/delete-post/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_draft_post'),
            'permission_callback' => array($this, 'check_permissions')
        ));
    }
    
    /**
     * Create a new draft post
     */
    public function create_draft_post($request) {
        $params = $request->get_params();
        
        // Prepare post data
        $post_data = array(
            'post_title' => $params['title'],
            'post_content' => isset($params['content']) ? $params['content'] : '',
            'post_excerpt' => isset($params['excerpt']) ? $params['excerpt'] : '',
            'post_status' => 'draft',
            'post_type' => 'post',
            'post_author' => isset($params['author']) ? intval($params['author']) : get_current_user_id()
        );
        
        // Insert the post
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return new WP_Error(
                'post_creation_failed',
                'Failed to create post: ' . $post_id->get_error_message(),
                array('status' => 500)
            );
        }
        
        // Handle categories
        if (isset($params['categories']) && !empty($params['categories'])) {
            $category_ids = $this->process_categories($params['categories']);
            if (!empty($category_ids)) {
                wp_set_post_categories($post_id, $category_ids);
            }
        }
        
        // Handle tags
        if (isset($params['tags']) && !empty($params['tags'])) {
            wp_set_post_tags($post_id, $params['tags']);
        }
        
        // Handle featured image
        if (isset($params['featured_image']) && is_numeric($params['featured_image'])) {
            set_post_thumbnail($post_id, intval($params['featured_image']));
        }
        
        // Handle custom meta fields
        if (isset($params['meta']) && is_array($params['meta'])) {
            foreach ($params['meta'] as $key => $value) {
                update_post_meta($post_id, sanitize_key($key), $value);
            }
        }
        
        // Get the created post data
        $post = get_post($post_id);
        $response_data = $this->format_post_response($post);
        
        return rest_ensure_response($response_data);
    }
    
    /**
     * Get draft posts
     */
    public function get_draft_posts($request) {
        $params = $request->get_params();
        
        $args = array(
            'post_type' => 'post',
            'post_status' => 'draft',
            'posts_per_page' => intval($params['per_page']),
            'paged' => intval($params['page'])
        );
        
        if (isset($params['author']) && is_numeric($params['author'])) {
            $args['author'] = intval($params['author']);
        }
        
        $posts = get_posts($args);
        $formatted_posts = array();
        
        foreach ($posts as $post) {
            $formatted_posts[] = $this->format_post_response($post);
        }
        
        // Get total count for pagination
        $total_args = $args;
        $total_args['posts_per_page'] = -1;
        $total_posts = get_posts($total_args);
        $total_count = count($total_posts);
        
        $response = rest_ensure_response($formatted_posts);
        $response->header('X-WP-Total', $total_count);
        $response->header('X-WP-TotalPages', ceil($total_count / intval($params['per_page'])));
        
        return $response;
    }
    
    /**
     * Update a draft post
     */
    public function update_draft_post($request) {
        $post_id = intval($request['id']);
        $params = $request->get_params();
        
        // Check if post exists
        $post = get_post($post_id);
        if (!$post) {
            return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
        }
        
        // Prepare update data
        $update_data = array('ID' => $post_id);
        
        if (isset($params['title'])) {
            $update_data['post_title'] = $params['title'];
        }
        
        if (isset($params['content'])) {
            $update_data['post_content'] = $params['content'];
        }
        
        if (isset($params['excerpt'])) {
            $update_data['post_excerpt'] = $params['excerpt'];
        }
        
        if (isset($params['status'])) {
            $update_data['post_status'] = $params['status'];
        }
        
        // Update the post
        $result = wp_update_post($update_data);
        
        if (is_wp_error($result)) {
            return new WP_Error(
                'post_update_failed',
                'Failed to update post: ' . $result->get_error_message(),
                array('status' => 500)
            );
        }
        
        // Handle categories
        if (isset($params['categories'])) {
            $category_ids = $this->process_categories($params['categories']);
            wp_set_post_categories($post_id, $category_ids);
        }
        
        // Handle tags
        if (isset($params['tags'])) {
            wp_set_post_tags($post_id, $params['tags']);
        }
        
        // Handle featured image
        if (isset($params['featured_image'])) {
            if (is_numeric($params['featured_image'])) {
                set_post_thumbnail($post_id, intval($params['featured_image']));
            } else {
                delete_post_thumbnail($post_id);
            }
        }
        
        // Handle custom meta fields
        if (isset($params['meta']) && is_array($params['meta'])) {
            foreach ($params['meta'] as $key => $value) {
                update_post_meta($post_id, sanitize_key($key), $value);
            }
        }
        
        // Get updated post data
        $updated_post = get_post($post_id);
        $response_data = $this->format_post_response($updated_post);
        
        return rest_ensure_response($response_data);
    }
    
    /**
     * Delete a draft post
     */
    public function delete_draft_post($request) {
        $post_id = intval($request['id']);
        
        // Check if post exists
        $post = get_post($post_id);
        if (!$post) {
            return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
        }
        
        // Delete the post
        $result = wp_delete_post($post_id, true); // true = force delete, skip trash
        
        if (!$result) {
            return new WP_Error(
                'post_deletion_failed',
                'Failed to delete post',
                array('status' => 500)
            );
        }
        
        return rest_ensure_response(array(
            'deleted' => true,
            'id' => $post_id,
            'message' => 'Post deleted successfully'
        ));
    }
    
    /**
     * Check permissions for API access
     */
    public function check_permissions($request) {
        // For development/testing, allow public access
        // Comment out the return true line below for production use
        return true;
        
        // Production permission check (uncomment for production)
        // if (current_user_can('edit_posts')) {
        //     return true;
        // }
        
        // return new WP_Error(
        //     'rest_forbidden',
        //     'You do not have permission to access this endpoint',
        //     array('status' => 403)
        // );
    }
    
    /**
     * Process categories (convert names to IDs if needed)
     */
    private function process_categories($categories) {
        $category_ids = array();
        
        foreach ($categories as $category) {
            if (is_numeric($category)) {
                // Category ID provided
                $category_ids[] = intval($category);
            } else {
                // Category name provided, get or create category
                $term = get_term_by('name', $category, 'category');
                if ($term) {
                    $category_ids[] = $term->term_id;
                } else {
                    // Create new category
                    $new_term = wp_insert_term($category, 'category');
                    if (!is_wp_error($new_term)) {
                        $category_ids[] = $new_term['term_id'];
                    }
                }
            }
        }
        
        return $category_ids;
    }
    
    /**
     * Format post response data
     */
    private function format_post_response($post) {
        $featured_image = null;
        $featured_image_id = get_post_thumbnail_id($post->ID);
        
        if ($featured_image_id) {
            $image_data = wp_get_attachment_image_src($featured_image_id, 'full');
            if ($image_data) {
                $featured_image = array(
                    'id' => intval($featured_image_id),
                    'url' => $image_data[0],
                    'width' => intval($image_data[1]),
                    'height' => intval($image_data[2]),
                    'alt' => get_post_meta($featured_image_id, '_wp_attachment_image_alt', true)
                );
            }
        }
        
        return array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'content' => $post->post_content,
            'excerpt' => $post->post_excerpt,
            'status' => $post->post_status,
            'date' => $post->post_date,
            'modified' => $post->post_modified,
            'author' => array(
                'id' => intval($post->post_author),
                'name' => get_the_author_meta('display_name', $post->post_author),
                'email' => get_the_author_meta('user_email', $post->post_author)
            ),
            'featured_image' => $featured_image,
            'categories' => wp_get_post_categories($post->ID, array('fields' => 'all')),
            'tags' => wp_get_post_tags($post->ID, array('fields' => 'names')),
            'permalink' => get_permalink($post->ID),
            'edit_link' => get_edit_post_link($post->ID, 'raw')
        );
    }
    
    /**
     * Add CORS headers for cross-origin requests
     */
    public function add_cors_headers() {
        add_filter('rest_pre_serve_request', function($value) {
            $origin = get_http_origin();
            $allowed_origins = array(
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:8000',
                get_site_url()
            );
            
            // Add custom allowed origin from wp-config if defined
            if (defined('ALLOWED_ORIGIN')) {
                $allowed_origins[] = ALLOWED_ORIGIN;
            }
            
            if ($origin && in_array($origin, $allowed_origins)) {
                header('Access-Control-Allow-Origin: ' . $origin);
                header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
                header('Access-Control-Allow-Credentials: true');
                header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, Accept');
            }
            
            return $value;
        }, 15);
    }
}

// Initialize the plugin
function init_draft_post_api() {
    new DraftPostAPI();
}
add_action('plugins_loaded', 'init_draft_post_api');

/**
 * Activation hook
 */
register_activation_hook(__FILE__, function() {
    // Initialize the plugin to register routes
    init_draft_post_api();
    // Flush rewrite rules to ensure REST routes work
    flush_rewrite_rules();
});

/**
 * Deactivation hook
 */
register_deactivation_hook(__FILE__, function() {
    // Flush rewrite rules on deactivation
    flush_rewrite_rules();
});

/**
 * Debug function to check if routes are registered
 */
function debug_draft_api_routes() {
    if (current_user_can('manage_options') && isset($_GET['debug_draft_api'])) {
        $rest_server = rest_get_server();
        $routes = $rest_server->get_routes();
        $draft_routes = array();
        
        foreach ($routes as $route => $handlers) {
            if (strpos($route, '/draft-api/v1') === 0) {
                $draft_routes[$route] = $handlers;
            }
        }
        
        wp_die('<pre>' . print_r($draft_routes, true) . '</pre>');
    }
}
add_action('init', 'debug_draft_api_routes');