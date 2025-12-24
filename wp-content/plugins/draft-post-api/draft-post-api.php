<?php
/**
 * Plugin Name: Secure Draft Post API
 * Plugin URI: https://example.com
 * Description: A secure WordPress plugin with JWT authentication for creating draft posts only
 * Version: 2.0.0
 * Author: Your Name
 * License: GPL v2 or later
 * Text Domain: draft-post-api
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define JWT secret key (should be in wp-config.php for production)
if (!defined('JWT_SECRET_KEY')) {
    define('JWT_SECRET_KEY', 'your-super-secret-jwt-key-change-this-in-production');
}

/**
 * JWT Helper Class
 */
class JWT_Helper {
    
    /**
     * Generate JWT token
     */
    public static function generate_token($user_id, $expiration = null) {
        if (!$expiration) {
            $expiration = time() + (24 * 60 * 60); // 24 hours
        }
        
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $user_id,
            'exp' => $expiration,
            'iat' => time()
        ]);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, JWT_SECRET_KEY, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    /**
     * Validate JWT token
     */
    public static function validate_token($token) {
        if (!$token) {
            return false;
        }
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $parts;
        
        // Verify signature
        $valid_signature = hash_hmac('sha256', $header . "." . $payload, JWT_SECRET_KEY, true);
        $valid_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($valid_signature));
        
        if (!hash_equals($signature, $valid_signature)) {
            return false;
        }
        
        // Decode payload with proper padding
        $payload_padded = str_pad(str_replace(['-', '_'], ['+', '/'], $payload), strlen($payload) % 4, '=', STR_PAD_RIGHT);
        $payload_data = json_decode(base64_decode($payload_padded), true);
        
        if (!$payload_data) {
            return false;
        }
        
        // Check expiration
        if (isset($payload_data['exp']) && $payload_data['exp'] < time()) {
            return false;
        }
        
        return $payload_data;
    }
    
    /**
     * Get token from request headers
     */
    public static function get_token_from_request($request) {
        $auth_header = $request->get_header('Authorization');
        
        if (!$auth_header) {
            return null;
        }
        
        if (strpos($auth_header, 'Bearer ') === 0) {
            return substr($auth_header, 7);
        }
        
        return null;
    }
}

/**
 * Main plugin class
 */
class SecureDraftPostAPI {
    
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
        // Authentication endpoint
        register_rest_route('draft-api/v1', '/auth', array(
            'methods' => 'POST',
            'callback' => array($this, 'authenticate_user'),
            'permission_callback' => '__return_true',
            'args' => array(
                'username' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => 'Username or email',
                    'sanitize_callback' => 'sanitize_text_field'
                ),
                'password' => array(
                    'required' => true,
                    'type' => 'string',
                    'description' => 'User password'
                )
            )
        ));
        
        // Create draft post endpoint (ONLY endpoint for post operations)
        register_rest_route('draft-api/v1', '/create-draft', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_draft_post'),
            'permission_callback' => array($this, 'check_jwt_permissions'),
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
                'meta' => array(
                    'required' => false,
                    'type' => 'object',
                    'description' => 'Custom meta fields as key-value pairs'
                )
            )
        ));
        
        // Get user's draft posts endpoint (read-only)
        register_rest_route('draft-api/v1', '/my-drafts', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_user_draft_posts'),
            'permission_callback' => array($this, 'check_jwt_permissions'),
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
                )
            )
        ));
        
        // Debug endpoint to test JWT validation
        register_rest_route('draft-api/v1', '/debug-token', array(
            'methods' => 'GET',
            'callback' => array($this, 'debug_token'),
            'permission_callback' => '__return_true'
        ));
    }
    
    /**
     * Authenticate user and return JWT token
     */
    public function authenticate_user($request) {
        $params = $request->get_params();
        $username = $params['username'];
        $password = $params['password'];
        
        // Authenticate user
        $user = wp_authenticate($username, $password);
        
        if (is_wp_error($user)) {
            return new WP_Error(
                'authentication_failed',
                'Invalid username or password',
                array('status' => 401)
            );
        }
        
        // Check if user can create posts
        if (!user_can($user->ID, 'edit_posts')) {
            return new WP_Error(
                'insufficient_permissions',
                'User does not have permission to create posts',
                array('status' => 403)
            );
        }
        
        // Generate JWT token
        $token = JWT_Helper::generate_token($user->ID);
        
        return rest_ensure_response(array(
            'success' => true,
            'token' => $token,
            'user' => array(
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'display_name' => $user->display_name
            ),
            'expires_in' => 24 * 60 * 60 // 24 hours in seconds
        ));
    }
    
    /**
     * Check JWT permissions
     */
    public function check_jwt_permissions($request) {
        $token = JWT_Helper::get_token_from_request($request);
        
        if (!$token) {
            return new WP_Error(
                'no_token',
                'Authorization token is required',
                array('status' => 401)
            );
        }
        
        $payload = JWT_Helper::validate_token($token);
        
        if (!$payload) {
            return new WP_Error(
                'invalid_token',
                'Invalid or expired token',
                array('status' => 401)
            );
        }
        
        // Check if user still exists and has permissions
        $user = get_user_by('ID', $payload['user_id']);
        if (!$user || !user_can($user->ID, 'edit_posts')) {
            return new WP_Error(
                'insufficient_permissions',
                'User does not have permission to access this endpoint',
                array('status' => 403)
            );
        }
        
        // Store user ID in request for use in callbacks
        $request->set_param('authenticated_user_id', $payload['user_id']);
        
        return true;
    }
    
    /**
     * Create a new draft post (ONLY operation allowed)
     */
    public function create_draft_post($request) {
        $params = $request->get_params();
        $user_id = $request->get_param('authenticated_user_id');
        
        // Prepare post data - ALWAYS create as draft
        $post_data = array(
            'post_title' => $params['title'],
            'post_content' => isset($params['content']) ? $params['content'] : '',
            'post_excerpt' => isset($params['excerpt']) ? $params['excerpt'] : '',
            'post_status' => 'draft', // FORCED to draft only
            'post_type' => 'post',
            'post_author' => $user_id // Use authenticated user ID
        );
        
        // Insert the post
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return new WP_Error(
                'post_creation_failed',
                'Failed to create draft post: ' . $post_id->get_error_message(),
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
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Draft post created successfully',
            'post' => $response_data
        ));
    }
    
    /**
     * Get authenticated user's draft posts (read-only)
     */
    public function get_user_draft_posts($request) {
        $params = $request->get_params();
        $user_id = $request->get_param('authenticated_user_id');
        
        $args = array(
            'post_type' => 'post',
            'post_status' => 'draft',
            'posts_per_page' => intval($params['per_page']),
            'paged' => intval($params['page']),
            'author' => $user_id // Only get authenticated user's drafts
        );
        
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
        
        $response = rest_ensure_response(array(
            'success' => true,
            'posts' => $formatted_posts,
            'pagination' => array(
                'total' => $total_count,
                'pages' => ceil($total_count / intval($params['per_page'])),
                'current_page' => intval($params['page']),
                'per_page' => intval($params['per_page'])
            )
        ));
        
        return $response;
    }
    
    /**
     * Debug token validation
     */
    public function debug_token($request) {
        $token = JWT_Helper::get_token_from_request($request);
        
        if (!$token) {
            return rest_ensure_response(array(
                'error' => 'No token provided',
                'headers' => $request->get_headers(),
                'auth_header' => $request->get_header('Authorization')
            ));
        }
        
        $parts = explode('.', $token);
        $payload = JWT_Helper::validate_token($token);
        
        return rest_ensure_response(array(
            'token_received' => $token,
            'token_parts_count' => count($parts),
            'jwt_secret_defined' => defined('JWT_SECRET_KEY'),
            'jwt_secret_value' => JWT_SECRET_KEY,
            'validation_result' => $payload,
            'current_time' => time(),
            'token_parts' => $parts
        ));
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
function init_secure_draft_post_api() {
    new SecureDraftPostAPI();
}
add_action('plugins_loaded', 'init_secure_draft_post_api');

/**
 * Activation hook
 */
register_activation_hook(__FILE__, function() {
    // Initialize the plugin to register routes
    init_secure_draft_post_api();
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
function debug_secure_draft_api_routes() {
    if (current_user_can('manage_options') && isset($_GET['debug_secure_draft_api'])) {
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
add_action('init', 'debug_secure_draft_api_routes');