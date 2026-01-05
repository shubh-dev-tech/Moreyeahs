<?php
/**
 * Debug Functions.php File
 * 
 * This script checks for PHP syntax errors in the functions.php file
 */

echo "=== Functions.php Debug Test ===\n\n";

$functions_file = 'wp-content/themes/twentytwentyfive-child/functions.php';

if (!file_exists($functions_file)) {
    echo "❌ Error: functions.php file not found at: {$functions_file}\n";
    exit(1);
}

echo "📁 Checking file: {$functions_file}\n";

// Check PHP syntax
$output = [];
$return_code = 0;
exec("php -l \"{$functions_file}\" 2>&1", $output, $return_code);

if ($return_code === 0) {
    echo "✅ PHP syntax is valid.\n";
} else {
    echo "❌ PHP syntax errors found:\n";
    foreach ($output as $line) {
        echo "   {$line}\n";
    }
    exit(1);
}

echo "\n";

// Try to include the file and check for errors
echo "🔍 Testing file inclusion...\n";

// Capture any errors
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    // Set up minimal WordPress environment
    if (!defined('ABSPATH')) {
        define('ABSPATH', dirname(__FILE__) . '/');
    }
    
    if (!defined('WP_DEBUG')) {
        define('WP_DEBUG', true);
    }
    
    // Mock WordPress functions that might be called
    if (!function_exists('get_stylesheet_directory')) {
        function get_stylesheet_directory() {
            return dirname(__FILE__) . '/wp-content/themes/twentytwentyfive-child';
        }
    }
    
    if (!function_exists('get_stylesheet_directory_uri')) {
        function get_stylesheet_directory_uri() {
            return 'http://localhost/wp-content/themes/twentytwentyfive-child';
        }
    }
    
    if (!function_exists('get_template_directory')) {
        function get_template_directory() {
            return dirname(__FILE__) . '/wp-content/themes/twentytwentyfive';
        }
    }
    
    if (!function_exists('__')) {
        function __($text, $domain = 'default') {
            return $text;
        }
    }
    
    if (!function_exists('add_action')) {
        function add_action($hook, $callback, $priority = 10, $args = 1) {
            // Mock function
            return true;
        }
    }
    
    if (!function_exists('add_filter')) {
        function add_filter($hook, $callback, $priority = 10, $args = 1) {
            // Mock function
            return true;
        }
    }
    
    if (!function_exists('acf_register_block_type')) {
        function acf_register_block_type($args) {
            echo "   📦 Block registered: {$args['name']} - {$args['title']}\n";
            return true;
        }
    }
    
    // Include the functions file
    include $functions_file;
    
    echo "✅ File included successfully without fatal errors.\n";
    
} catch (ParseError $e) {
    echo "❌ Parse Error: " . $e->getMessage() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
} catch (Error $e) {
    echo "❌ Fatal Error: " . $e->getMessage() . "\n";
    echo "   Line: " . $e->getLine() . "\n";
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
}

$output_content = ob_get_clean();
if (!empty($output_content)) {
    echo "\n📝 Output/Warnings:\n";
    echo $output_content;
}

echo "\n=== Debug Complete ===\n";
?>