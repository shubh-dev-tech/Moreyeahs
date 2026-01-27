<?php
/**
 * Dynamic WordPress Configuration
 * This file provides environment-aware configuration for WordPress
 * Include this at the top of your wp-config.php file
 */

// Environment Detection
function detect_wp_environment() {
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    
    // Local development
    if (strpos($host, 'localhost') !== false || strpos($host, '127.0.0.1') !== false) {
        return 'local';
    }
    
    // Staging environment
    if (strpos($host, 'staging.') !== false) {
        return 'staging';
    }
    
    // Development environment
    if (strpos($host, 'dev.') !== false) {
        return 'development';
    }
    
    // Production environment
    return 'production';
}

// Get current environment
$wp_environment = detect_wp_environment();

// Set WP_ENVIRONMENT_TYPE
if (!defined('WP_ENVIRONMENT_TYPE')) {
    define('WP_ENVIRONMENT_TYPE', $wp_environment);
}

// Dynamic URL Configuration
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Environment-specific configuration
switch ($wp_environment) {
    case 'local':
        // Local development settings
        define('WP_HOME', $protocol . $host . '/moreyeahs-new');
        define('WP_SITEURL', $protocol . $host . '/moreyeahs-new');
        
        // Database settings for local
        if (!defined('DB_NAME')) define('DB_NAME', 'moreyeahs-new');
        if (!defined('DB_USER')) define('DB_USER', 'root');
        if (!defined('DB_PASSWORD')) define('DB_PASSWORD', '');
        if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
        
        // Debug settings for local (only set if not already defined)
        if (!defined('WP_DEBUG')) define('WP_DEBUG', true);
        if (!defined('WP_DEBUG_LOG')) define('WP_DEBUG_LOG', true);
        if (!defined('WP_DEBUG_DISPLAY')) define('WP_DEBUG_DISPLAY', false);
        
        break;
        
    case 'development':
        // Development environment settings
        define('WP_HOME', $protocol . $host);
        define('WP_SITEURL', $protocol . $host);
        
        // Database settings for development
        if (!defined('DB_NAME')) define('DB_NAME', 'moreyeahs_dev');
        if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER') ?: 'root');
        if (!defined('DB_PASSWORD')) define('DB_PASSWORD', getenv('DB_PASSWORD') ?: '');
        if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
        
        // Debug settings for development (only set if not already defined)
        if (!defined('WP_DEBUG')) define('WP_DEBUG', true);
        if (!defined('WP_DEBUG_LOG')) define('WP_DEBUG_LOG', true);
        if (!defined('WP_DEBUG_DISPLAY')) define('WP_DEBUG_DISPLAY', false);
        
        break;
        
    case 'staging':
        // Staging environment settings
        define('WP_HOME', $protocol . $host);
        define('WP_SITEURL', $protocol . $host);
        
        // Database settings for staging
        if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME_STAGING') ?: 'moreyeahs_staging');
        if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER_STAGING') ?: 'root');
        if (!defined('DB_PASSWORD')) define('DB_PASSWORD', getenv('DB_PASSWORD_STAGING') ?: '');
        if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST_STAGING') ?: 'localhost');
        
        // Debug settings for staging (only set if not already defined)
        if (!defined('WP_DEBUG')) define('WP_DEBUG', false);
        if (!defined('WP_DEBUG_LOG')) define('WP_DEBUG_LOG', true);
        if (!defined('WP_DEBUG_DISPLAY')) define('WP_DEBUG_DISPLAY', false);
        
        break;
        
    case 'production':
    default:
        // Production environment settings
        define('WP_HOME', $protocol . $host);
        define('WP_SITEURL', $protocol . $host);
        
        // Database settings for production
        if (!defined('DB_NAME')) define('DB_NAME', getenv('DB_NAME_PROD') ?: 'moreyeahs_prod');
        if (!defined('DB_USER')) define('DB_USER', getenv('DB_USER_PROD') ?: 'root');
        if (!defined('DB_PASSWORD')) define('DB_PASSWORD', getenv('DB_PASSWORD_PROD') ?: '');
        if (!defined('DB_HOST')) define('DB_HOST', getenv('DB_HOST_PROD') ?: 'localhost');
        
        // Debug settings for production (only set if not already defined)
        if (!defined('WP_DEBUG')) define('WP_DEBUG', false);
        if (!defined('WP_DEBUG_LOG')) define('WP_DEBUG_LOG', false);
        if (!defined('WP_DEBUG_DISPLAY')) define('WP_DEBUG_DISPLAY', false);
        
        break;
}

// Common settings for all environments
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');
if (!defined('DB_COLLATE')) define('DB_COLLATE', '');

// CORS and media transformation functions are now handled by the mu-plugin:
// wp-content/mu-plugins/moreyeahs-dynamic-config.php

// JWT Authentication settings
if (!defined('JWT_AUTH_SECRET_KEY')) {
    $jwt_secret = getenv('JWT_AUTH_SECRET_KEY');
    if ($jwt_secret) {
        define('JWT_AUTH_SECRET_KEY', $jwt_secret);
    } else {
        // Fallback secret (change this in production!)
        define('JWT_AUTH_SECRET_KEY', '555ada25dd42bb78694f9ebe9d0b2686046f07fc2d49886ed1f197a9c626b4121c792203e6c96051754c02f0f692293d22ef55f6e09552076647b1ac1e54d942');
    }
}

// Set allowed origin for JWT
if (!defined('ALLOWED_ORIGIN')) {
    switch ($wp_environment) {
        case 'local':
            define('ALLOWED_ORIGIN', 'http://localhost:3000');
            break;
        case 'development':
        case 'staging':
        case 'production':
        default:
            define('ALLOWED_ORIGIN', 'https://moreyeahsnew.vercel.app');
            break;
    }
}

