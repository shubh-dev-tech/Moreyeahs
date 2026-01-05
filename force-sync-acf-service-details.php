<?php
/**
 * Force Sync Service Details Section ACF Fields
 * 
 * This script forces WordPress to recognize and sync the ACF field group
 */

// WordPress environment setup
require_once 'wp-config.php';

// Set up WordPress admin environment
define('WP_ADMIN', true);
require_once ABSPATH . 'wp-admin/includes/admin.php';

echo "=== Force Sync Service Details Section ACF Fields ===\n\n";

// Check if ACF is active
if (!class_exists('ACF') || !function_exists('acf_get_field_groups')) {
    echo "❌ Error: Advanced Custom Fields plugin is not active.\n";
    echo "   Please install and activate ACF Pro plugin.\n";
    exit(1);
}

echo "✅ ACF is active.\n\n";

// Check current theme
$current_theme = wp_get_theme();
echo "🎨 Current theme: {$current_theme->get('Name')}\n";
echo "   Template: {$current_theme->get_template()}\n";
echo "   Stylesheet: {$current_theme->get_stylesheet()}\n\n";

// Path to ACF JSON file
$json_file = get_stylesheet_directory() . '/acf-json/group_service_details_section.json';
echo "📁 Looking for ACF JSON file: {$json_file}\n";

if (!file_exists($json_file)) {
    echo "❌ ACF JSON file not found!\n";
    echo "   Expected location: {$json_file}\n";
    exit(1);
}

echo "✅ ACF JSON file found.\n\n";

// Read and validate JSON
$json_content = file_get_contents($json_file);
$field_group_data = json_decode($json_content, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ Invalid JSON: " . json_last_error_msg() . "\n";
    exit(1);
}

echo "✅ JSON is valid.\n";
echo "   Field Group Key: {$field_group_data['key']}\n";
echo "   Field Group Title: {$field_group_data['title']}\n";
echo "   Fields Count: " . count($field_group_data['fields']) . "\n\n";

// Check if field group already exists
$existing_group = acf_get_field_group($field_group_data['key']);

if ($existing_group) {
    echo "ℹ️  Field group already exists in database.\n";
    echo "   ID: {$existing_group['ID']}\n";
    echo "   Title: {$existing_group['title']}\n";
    echo "   Active: " . ($existing_group['active'] ? 'Yes' : 'No') . "\n\n";
    
    // Update the existing field group
    echo "🔄 Updating existing field group...\n";
    $field_group_data['ID'] = $existing_group['ID'];
    $result = acf_update_field_group($field_group_data);
    
    if ($result) {
        echo "✅ Field group updated successfully.\n";
    } else {
        echo "❌ Failed to update field group.\n";
    }
} else {
    echo "ℹ️  Field group does not exist in database. Creating new one...\n";
    
    // Import the field group
    $result = acf_import_field_group($field_group_data);
    
    if ($result) {
        echo "✅ Field group imported successfully.\n";
    } else {
        echo "❌ Failed to import field group.\n";
    }
}

echo "\n";

// Force refresh ACF cache
if (function_exists('acf_get_store')) {
    $store = acf_get_store('field-groups');
    if ($store) {
        $store->reset();
        echo "✅ ACF field groups cache cleared.\n";
    }
}

// Clear WordPress cache
wp_cache_flush();
echo "✅ WordPress cache cleared.\n\n";

// Verify the field group is now available
$field_group = acf_get_field_group($field_group_data['key']);
if ($field_group) {
    echo "✅ Field group is now available:\n";
    echo "   Key: {$field_group['key']}\n";
    echo "   Title: {$field_group['title']}\n";
    echo "   Active: " . ($field_group['active'] ? 'Yes' : 'No') . "\n";
    
    // Get fields
    $fields = acf_get_fields($field_group);
    if ($fields) {
        echo "   Fields: " . count($fields) . "\n";
        foreach ($fields as $field) {
            echo "     - {$field['name']} ({$field['type']})\n";
        }
    }
} else {
    echo "❌ Field group still not available after sync.\n";
}

echo "\n";

// Check if block is registered
if (function_exists('acf_get_block_types')) {
    $blocks = acf_get_block_types();
    $service_block = null;
    
    foreach ($blocks as $block_name => $block_config) {
        if ($block_name === 'acf/service-details-section') {
            $service_block = $block_config;
            break;
        }
    }
    
    if ($service_block) {
        echo "✅ Service Details Section block is registered:\n";
        echo "   Name: {$service_block['name']}\n";
        echo "   Title: {$service_block['title']}\n";
        echo "   Category: {$service_block['category']}\n";
    } else {
        echo "❌ Service Details Section block is NOT registered.\n";
        echo "   Check functions.php for block registration.\n";
    }
} else {
    echo "❌ ACF block functions not available.\n";
}

echo "\n=== Sync Complete ===\n";
echo "The Service Details Section block should now be available in the WordPress block editor.\n";
echo "Look for it in the 'Formatting' category.\n\n";

echo "🔧 If the block still doesn't appear:\n";
echo "1. Clear browser cache and refresh the editor\n";
echo "2. Check WordPress admin > Custom Fields > Field Groups\n";
echo "3. Verify the field group is active\n";
echo "4. Check for PHP errors in the error log\n";
echo "5. Try deactivating and reactivating ACF plugin\n";
?>