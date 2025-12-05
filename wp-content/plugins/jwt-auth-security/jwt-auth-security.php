<?php
/**
 * Plugin Name: JWT Auth Security
 * Description: JWT authentication with nonce security for headless WordPress
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) exit;

class JWT_Auth_Security {
    private $secret_key;
    private $token_expiry = 3600; // 1 hour
    
    public function __construct() {
        $this->secret_key = defined('JWT_AUTH_SECRET_KEY') ? JWT_AUTH_SECRET_KEY : wp_salt('auth');
        
        add_action('rest_api_init', [$this, 'register_routes']);
        add_filter('rest_pre_dispatch', [$this, 'validate_token'], 10, 3);
        add_action('init', [$this, 'add_cors_headers']);
    }
    
    public function add_cors_headers() {
        $allowed_origin = defined('ALLOWED_ORIGIN') ? ALLOWED_ORIGIN : '*';
        
        header("Access-Control-Allow-Origin: $allowed_origin");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
        
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
    
    public function register_routes() {
        // Authentication endpoint
        register_rest_route('jwt-auth/v1', '/token', [
            'methods' => 'POST',
            'callback' => [$this, 'generate_token'],
            'permission_callback' => '__return_true'
        ]);
        
        // Token validation endpoint
        register_rest_route('jwt-auth/v1', '/validate', [
            'methods' => 'POST',
            'callback' => [$this, 'validate_token_endpoint'],
            'permission_callback' => '__return_true'
        ]);
        
        // Refresh token endpoint
        register_rest_route('jwt-auth/v1', '/refresh', [
            'methods' => 'POST',
            'callback' => [$this, 'refresh_token'],
            'permission_callback' => '__return_true'
        ]);
        
        // Get nonce endpoint
        register_rest_route('jwt-auth/v1', '/nonce', [
            'methods' => 'GET',
            'callback' => [$this, 'get_nonce'],
            'permission_callback' => '__return_true'
        ]);
    }
    
    public function generate_token($request) {
        $username = $request->get_param('username');
        $password = $request->get_param('password');
        
        if (empty($username) || empty($password)) {
            return new WP_Error('missing_credentials', 'Username and password are required', ['status' => 400]);
        }
        
        $user = wp_authenticate($username, $password);
        
        if (is_wp_error($user)) {
            return new WP_Error('invalid_credentials', 'Invalid username or password', ['status' => 401]);
        }
        
        $token = $this->create_token($user);
        $nonce = wp_create_nonce('wp_rest');
        
        return [
            'success' => true,
            'token' => $token,
            'nonce' => $nonce,
            'user' => [
                'id' => $user->ID,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'display_name' => $user->display_name,
                'roles' => $user->roles
            ],
            'expires_in' => $this->token_expiry
        ];
    }
    
    private function create_token($user) {
        $issued_at = time();
        $expiration = $issued_at + $this->token_expiry;
        
        $payload = [
            'iss' => get_bloginfo('url'),
            'iat' => $issued_at,
            'exp' => $expiration,
            'user_id' => $user->ID,
            'username' => $user->user_login
        ];
        
        return $this->encode_jwt($payload);
    }
    
    private function encode_jwt($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64_header = $this->base64_url_encode($header);
        $base64_payload = $this->base64_url_encode($payload);
        
        $signature = hash_hmac('sha256', "$base64_header.$base64_payload", $this->secret_key, true);
        $base64_signature = $this->base64_url_encode($signature);
        
        return "$base64_header.$base64_payload.$base64_signature";
    }
    
    private function decode_jwt($token) {
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return false;
        }
        
        list($base64_header, $base64_payload, $base64_signature) = $parts;
        
        $signature = $this->base64_url_decode($base64_signature);
        $expected_signature = hash_hmac('sha256', "$base64_header.$base64_payload", $this->secret_key, true);
        
        if (!hash_equals($signature, $expected_signature)) {
            return false;
        }
        
        $payload = json_decode($this->base64_url_decode($base64_payload), true);
        
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
    
    private function base64_url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64_url_decode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
    
    public function validate_token($result, $server, $request) {
        // Skip validation for WordPress admin and login pages
        if (is_admin() || strpos($_SERVER['REQUEST_URI'], 'wp-login.php') !== false) {
            return $result;
        }
        
        // Skip validation for public endpoints
        $public_routes = [
            '/jwt-auth/v1/token',
            '/jwt-auth/v1/nonce',
            '/jwt-auth/v1/validate',
            '/jwt-auth/v1/refresh',
            '/wp/v2/posts',
            '/wp/v2/pages',
            '/wp/v2/categories',
            '/wp/v2/tags',
            '/wp/v2/media',
            '/wp/v2/menus',
            '/wp/v2/site-settings',
            '/wp/v2/footer-widgets'
        ];
        
        $route = $request->get_route();
        
        // Allow all GET requests to public routes
        foreach ($public_routes as $public_route) {
            if (strpos($route, $public_route) === 0 && $request->get_method() === 'GET') {
                return $result;
            }
        }
        
        // Allow all requests to jwt-auth endpoints
        if (strpos($route, '/jwt-auth/v1/') === 0) {
            return $result;
        }
        
        // Get token from Authorization header
        $auth_header = $request->get_header('authorization');
        
        if (!$auth_header) {
            // If no token, allow the request to continue (WordPress will handle permissions)
            return $result;
        }
        
        $token = str_replace('Bearer ', '', $auth_header);
        $payload = $this->decode_jwt($token);
        
        if (!$payload) {
            return new WP_Error('invalid_token', 'Invalid or expired token', ['status' => 401]);
        }
        
        // Validate nonce for write operations
        if (in_array($request->get_method(), ['POST', 'PUT', 'DELETE', 'PATCH'])) {
            $nonce = $request->get_header('X-WP-Nonce');
            
            if ($nonce && !wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_Error('invalid_nonce', 'Invalid nonce', ['status' => 403]);
            }
        }
        
        // Set current user
        wp_set_current_user($payload['user_id']);
        
        return $result;
    }
    
    public function validate_token_endpoint($request) {
        $token = $request->get_param('token');
        
        if (!$token) {
            return new WP_Error('no_token', 'Token is required', ['status' => 400]);
        }
        
        $payload = $this->decode_jwt($token);
        
        if (!$payload) {
            return ['valid' => false, 'message' => 'Invalid or expired token'];
        }
        
        return [
            'valid' => true,
            'user_id' => $payload['user_id'],
            'expires_at' => $payload['exp']
        ];
    }
    
    public function refresh_token($request) {
        $token = $request->get_param('token');
        
        if (!$token) {
            return new WP_Error('no_token', 'Token is required', ['status' => 400]);
        }
        
        $payload = $this->decode_jwt($token);
        
        if (!$payload) {
            return new WP_Error('invalid_token', 'Invalid token', ['status' => 401]);
        }
        
        $user = get_user_by('id', $payload['user_id']);
        
        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
        }
        
        $new_token = $this->create_token($user);
        $nonce = wp_create_nonce('wp_rest');
        
        return [
            'success' => true,
            'token' => $new_token,
            'nonce' => $nonce,
            'expires_in' => $this->token_expiry
        ];
    }
    
    public function get_nonce() {
        return [
            'nonce' => wp_create_nonce('wp_rest'),
            'expires_in' => 86400 // 24 hours
        ];
    }
}

new JWT_Auth_Security();
