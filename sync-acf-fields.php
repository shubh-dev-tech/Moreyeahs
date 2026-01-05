<?php
/**
 * Sync ACF Fields - Force WordPress to recognize new field groups
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

echo "=== Syncing ACF Field Groups ===\n\n";

// Check if ACF is active
if (!function_exists('acf_get_field_groups')) {
    echo "❌ ACF is not active\n";
    exit;
}

// Force sync our specific field group
$json_file = get_stylesheet_directory() . '/acf-json/group_text_image_alternating_block.json';

if (file_exists($json_file)) {
    echo "✅ Found JSON file: $json_file\n";
    
    $json_data = json_decode(file_get_contents($json_file), true);
    
    if ($json_data) {
        echo "✅ JSON data loaded successfully\n";
        echo "Field group key: " . $json_data['key'] . "\n";
        echo "Field group title: " . $json_data['title'] . "\n";
        
        // Check if field group already exists
        $existing_group = acf_get_field_group($json_data['key']);
        
        if ($existing_group) {
            echo "⚠️  Field group already exists, updating...\n";
        } else {
            echo "✅ Creating new field group...\n";
        }
        
        // Import/update the field group
        if (function_exists('acf_import_field_group')) {
            $result = acf_import_field_group($json_data);
            if ($result) {
                echo "✅ Field group imported successfully!\n";
            } else {
                echo "❌ Failed to import field group\n";
            }
        } else {
            echo "❌ acf_import_field_group function not available\n";
        }
        
    } else {
        echo "❌ Failed to parse JSON data\n";
    }
} else {
    echo "❌ JSON file not found: $json_file\n";
}

// Clear ACF cache
if (function_exists('acf_flush_cache')) {
    acf_flush_cache();
    echo "✅ ACF cache cleared\n";
}

// Trigger ACF init
do_action('acf/init');
echo "✅ ACF init triggered\n";

echo "\n=== Sync Complete ===\n";
echo "Now go to WordPress Admin and refresh the page editor.\n";
echo "The 'Text Image Alternating Block' should now be available.\n";
?>