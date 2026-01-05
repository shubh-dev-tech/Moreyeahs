<?php
/**
 * Sync Image Gallery Section ACF Fields
 * 
 * This script syncs the ACF field group for the Image Gallery Section block.
 * Run this after creating or updating the ACF JSON file.
 */

// WordPress environment setup
require_once('wp-config.php');
require_once(ABSPATH . 'wp-settings.php');

// Check if ACF is active
if (!function_exists('acf_import_field_group')) {
    die('ACF Pro is not active. Please activate ACF Pro plugin first.');
}

echo "Starting Image Gallery Section ACF field sync...\n";

// Path to the ACF JSON file
$acf_json_file = get_stylesheet_directory() . '/acf-json/group_image_gallery_section.json';

if (!file_exists($acf_json_file)) {
    die("ACF JSON file not found: $acf_json_file\n");
}

// Read and decode the JSON file
$json_content = file_get_contents($acf_json_file);
$field_group = json_decode($json_content, true);

if (!$field_group) {
    die("Failed to decode JSON file or invalid JSON format.\n");
}

echo "Found field group: " . $field_group['title'] . "\n";

// Check if field group already exists
$existing_group = acf_get_field_group($field_group['key']);

if ($existing_group) {
    echo "Field group already exists. Updating...\n";
    
    // Update the existing field group
    $field_group['ID'] = $existing_group['ID'];
    $result = acf_update_field_group($field_group);
    
    if ($result) {
        echo "✓ Field group updated successfully!\n";
    } else {
        echo "✗ Failed to update field group.\n";
    }
} else {
    echo "Creating new field group...\n";
    
    // Import the field group
    $result = acf_import_field_group($field_group);
    
    if ($result) {
        echo "✓ Field group imported successfully!\n";
    } else {
        echo "✗ Failed to import field group.\n";
    }
}

// Verify the fields were created
echo "\nVerifying field creation...\n";

$fields = acf_get_fields($field_group['key']);
if ($fields && count($fields) > 0) {
    echo "✓ Found " . count($fields) . " fields in the group:\n";
    foreach ($fields as $field) {
        echo "  - " . $field['label'] . " (" . $field['name'] . ")\n";
    }
} else {
    echo "✗ No fields found in the group.\n";
}

// Check if block is registered
echo "\nChecking block registration...\n";

if (function_exists('acf_get_block_types')) {
    $block_types = acf_get_block_types();
    $block_found = false;
    
    foreach ($block_types as $block_type) {
        if ($block_type['name'] === 'acf/image-gallery-section') {
            echo "✓ Block 'image-gallery-section' is registered.\n";
            $block_found = true;
            break;
        }
    }
    
    if (!$block_found) {
        echo "⚠ Block 'image-gallery-section' is not registered yet.\n";
        echo "Make sure to add it to your theme's ACF blocks registration.\n";
    }
} else {
    echo "⚠ Cannot check block registration (ACF function not available).\n";
}

echo "\n=== Image Gallery Section ACF Sync Complete ===\n";
echo "Next steps:\n";
echo "1. Go to WordPress Admin > Custom Fields > Field Groups\n";
echo "2. Verify the 'Image Gallery Section' field group is present\n";
echo "3. Create a new page/post and add the 'Image Gallery Section' block\n";
echo "4. Test the block functionality\n";

?>