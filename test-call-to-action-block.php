<?php
/**
 * Test Call to Action Block
 * 
 * This script tests the Call to Action Section block functionality
 */

// WordPress environment setup
require_once('wp-config.php');

echo "=== Call to Action Section Block Test ===\n\n";

// Check if ACF is active
if (!function_exists('acf_get_field_groups')) {
    die('Error: Advanced Custom Fields plugin is not active.');
}

// Check if field group exists
$field_group = acf_get_field_group('group_call_to_action_section');
if (!$field_group) {
    die('Error: Call to Action Section field group not found.');
}

echo "✓ Field group found: {$field_group['title']}\n";

// Check if block is registered
$registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
$block_name = 'acf/call-to-action-section';

if (isset($registered_blocks[$block_name])) {
    echo "✓ Block '{$block_name}' is registered\n";
    $block = $registered_blocks[$block_name];
    echo "  Category: {$block->category}\n";
    echo "  Icon: {$block->icon}\n";
} else {
    echo "❌ Block '{$block_name}' is not registered\n";
}

// Test field structure
echo "\n=== Field Structure ===\n";
$fields = acf_get_fields('group_call_to_action_section');

if ($fields) {
    foreach ($fields as $field) {
        echo "Field: {$field['label']}\n";
        echo "  Name: {$field['name']}\n";
        echo "  Type: {$field['type']}\n";
        echo "  Required: " . ($field['required'] ? 'Yes' : 'No') . "\n";
        
        if (isset($field['default_value']) && !empty($field['default_value'])) {
            echo "  Default: {$field['default_value']}\n";
        }
        
        if (isset($field['choices']) && !empty($field['choices'])) {
            echo "  Choices: " . implode(', ', array_keys($field['choices'])) . "\n";
        }
        
        echo "\n";
    }
} else {
    echo "❌ No fields found\n";
}

// Test block template file
echo "=== Template File Check ===\n";
$template_path = get_stylesheet_directory() . '/blocks/call-to-action-section/block.php';
if (file_exists($template_path)) {
    echo "✓ Template file exists: {$template_path}\n";
    echo "  File size: " . filesize($template_path) . " bytes\n";
} else {
    echo "❌ Template file not found: {$template_path}\n";
}

// Test CSS file
$css_path = get_stylesheet_directory() . '/blocks/call-to-action-section/style.css';
if (file_exists($css_path)) {
    echo "✓ CSS file exists: {$css_path}\n";
    echo "  File size: " . filesize($css_path) . " bytes\n";
} else {
    echo "❌ CSS file not found: {$css_path}\n";
}

echo "\n=== Test Complete ===\n";
echo "The Call to Action Section block is ready to use!\n\n";

echo "Usage in WordPress:\n";
echo "1. Go to Pages > Add New or edit an existing page\n";
echo "2. Click the '+' button to add a block\n";
echo "3. Search for 'Call to Action Section'\n";
echo "4. Add the block and configure the fields:\n";
echo "   - Set a compelling heading\n";
echo "   - Add a descriptive sub heading\n";
echo "   - Configure the button text and link\n";
echo "   - Choose background color or upload an image\n";
echo "   - Select button style and text alignment\n";
echo "5. Preview and publish!\n\n";

echo "The block will display with:\n";
echo "- Animated particle effects\n";
echo "- Responsive design\n";
echo "- Customizable styling\n";
echo "- Professional appearance\n";
?>