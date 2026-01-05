<?php
/**
 * Sync Call to Action Section ACF Fields
 * 
 * This script ensures the Call to Action Section ACF field group is properly synced
 * Run this after creating the block to ensure fields are available
 */

// WordPress environment setup
require_once('wp-config.php');
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// Check if ACF is active
if (!function_exists('acf_get_field_groups')) {
    die('Error: Advanced Custom Fields plugin is not active or not found.');
}

echo "=== Call to Action Section ACF Field Sync ===\n\n";

// Define the field group key
$field_group_key = 'group_call_to_action_section';

// Check if field group exists
$existing_group = acf_get_field_group($field_group_key);

if ($existing_group) {
    echo "✓ Field group '{$field_group_key}' already exists\n";
    echo "  Title: {$existing_group['title']}\n";
    echo "  Status: " . ($existing_group['active'] ? 'Active' : 'Inactive') . "\n\n";
} else {
    echo "⚠ Field group '{$field_group_key}' not found in database\n";
    echo "  Attempting to sync from JSON...\n\n";
}

// Path to the ACF JSON file
$json_file = get_stylesheet_directory() . '/acf-json/group_call_to_action_section.json';
$alt_json_file = __DIR__ . '/wp-content/themes/twentytwentyfive-child/acf-json/group_call_to_action_section.json';

// Check which JSON file exists
if (file_exists($json_file)) {
    $json_path = $json_file;
} elseif (file_exists($alt_json_file)) {
    $json_path = $alt_json_file;
} else {
    die("Error: ACF JSON file not found at expected locations:\n- {$json_file}\n- {$alt_json_file}\n");
}

echo "📁 Found JSON file: {$json_path}\n";

// Read and decode JSON
$json_content = file_get_contents($json_path);
$field_group_data = json_decode($json_content, true);

if (!$field_group_data) {
    die("Error: Could not decode JSON file or file is empty\n");
}

echo "✓ JSON file loaded successfully\n";
echo "  Field group title: {$field_group_data['title']}\n";
echo "  Number of fields: " . count($field_group_data['fields']) . "\n\n";

// Import or update the field group
try {
    if (function_exists('acf_import_field_group')) {
        $result = acf_import_field_group($field_group_data);
        if ($result) {
            echo "✅ Field group imported successfully!\n";
        } else {
            echo "❌ Field group import failed\n";
        }
    } else {
        // Fallback: use acf_update_field_group
        $result = acf_update_field_group($field_group_data);
        if ($result) {
            echo "✅ Field group updated successfully!\n";
        } else {
            echo "❌ Field group update failed\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error during import: " . $e->getMessage() . "\n";
}

// Verify the import
echo "\n=== Verification ===\n";
$imported_group = acf_get_field_group($field_group_key);

if ($imported_group) {
    echo "✓ Field group is now available in database\n";
    echo "  ID: {$imported_group['ID']}\n";
    echo "  Title: {$imported_group['title']}\n";
    echo "  Status: " . ($imported_group['active'] ? 'Active' : 'Inactive') . "\n";
    
    // Get fields
    $fields = acf_get_fields($field_group_key);
    if ($fields) {
        echo "  Fields (" . count($fields) . "):\n";
        foreach ($fields as $field) {
            echo "    - {$field['label']} ({$field['name']}) - {$field['type']}\n";
        }
    }
} else {
    echo "❌ Field group still not found after import\n";
}

// Check block registration
echo "\n=== Block Registration Check ===\n";
$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
$block_name = 'acf/call-to-action-section';

if (isset($registered_blocks[$block_name])) {
    echo "✓ Block '{$block_name}' is registered\n";
} else {
    echo "⚠ Block '{$block_name}' is not registered yet\n";
    echo "  Make sure to add the block registration to functions.php\n";
}

echo "\n=== Summary ===\n";
echo "Call to Action Section block setup is complete!\n";
echo "You can now use this block in the WordPress editor.\n\n";

echo "Block features:\n";
echo "- Customizable background color and image\n";
echo "- Adjustable overlay opacity\n";
echo "- Main heading and sub heading\n";
echo "- Button with multiple styles (primary, secondary, outline)\n";
echo "- Text alignment options (left, center, right)\n";
echo "- Animated particle effects\n";
echo "- Responsive design\n";
echo "- Full width and wide alignment support\n\n";

echo "Next steps:\n";
echo "1. Go to WordPress admin > Pages/Posts\n";
echo "2. Add a new block and search for 'Call to Action Section'\n";
echo "3. Configure the fields as needed\n";
echo "4. Preview and publish!\n";
?>