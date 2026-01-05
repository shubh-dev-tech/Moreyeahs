<?php
/**
 * Test Service Details Section Block Registration
 * 
 * This script checks if the Service Details Section block is properly registered
 */

// WordPress environment setup
require_once 'wp-config.php';
require_once ABSPATH . 'wp-admin/includes/admin.php';

echo "=== Service Details Section Block Registration Test ===\n\n";

// Check if ACF is active
if (!function_exists('acf_get_block_types')) {
    echo "❌ Error: Advanced Custom Fields plugin is not active or not found.\n";
    exit(1);
}

// Get all registered ACF blocks
$acf_blocks = acf_get_block_types();

echo "📋 All registered ACF blocks:\n";
foreach ($acf_blocks as $block_name => $block_config) {
    echo "  - {$block_name}: {$block_config['title']}\n";
}

echo "\n";

// Check specifically for our block
$service_details_block = null;
foreach ($acf_blocks as $block_name => $block_config) {
    if ($block_name === 'acf/service-details-section') {
        $service_details_block = $block_config;
        break;
    }
}

if ($service_details_block) {
    echo "✅ Service Details Section block is registered!\n";
    echo "   Name: {$service_details_block['name']}\n";
    echo "   Title: {$service_details_block['title']}\n";
    echo "   Category: {$service_details_block['category']}\n";
    echo "   Icon: {$service_details_block['icon']}\n";
    echo "   Template: {$service_details_block['render_template']}\n";
    
    // Check if template file exists
    $template_path = get_stylesheet_directory() . '/' . $service_details_block['render_template'];
    if (file_exists($template_path)) {
        echo "   ✅ Template file exists: {$template_path}\n";
    } else {
        echo "   ❌ Template file missing: {$template_path}\n";
    }
    
    // Check if CSS file exists
    if (isset($service_details_block['enqueue_style'])) {
        $css_file = str_replace(get_stylesheet_directory_uri(), get_stylesheet_directory(), $service_details_block['enqueue_style']);
        if (file_exists($css_file)) {
            echo "   ✅ CSS file exists: {$css_file}\n";
        } else {
            echo "   ❌ CSS file missing: {$css_file}\n";
        }
    }
    
} else {
    echo "❌ Service Details Section block is NOT registered.\n";
    echo "   This could be due to:\n";
    echo "   1. Block not added to functions.php\n";
    echo "   2. ACF field group not synced\n";
    echo "   3. Theme not active\n";
    echo "   4. PHP syntax error in functions.php\n";
}

echo "\n";

// Check ACF field group
if (function_exists('acf_get_field_group')) {
    $field_group = acf_get_field_group('group_service_details_section');
    if ($field_group) {
        echo "✅ ACF field group 'group_service_details_section' is registered.\n";
        echo "   Title: {$field_group['title']}\n";
        echo "   Active: " . ($field_group['active'] ? 'Yes' : 'No') . "\n";
    } else {
        echo "❌ ACF field group 'group_service_details_section' is NOT found.\n";
        echo "   You may need to sync ACF fields or import the JSON file.\n";
    }
} else {
    echo "❌ ACF function 'acf_get_field_group' not available.\n";
}

echo "\n";

// Check theme
$current_theme = wp_get_theme();
echo "🎨 Current theme: {$current_theme->get('Name')} (v{$current_theme->get('Version')})\n";

if ($current_theme->get_template() !== $current_theme->get_stylesheet()) {
    echo "   Child theme active: Yes\n";
    echo "   Parent theme: {$current_theme->get_template()}\n";
} else {
    echo "   Child theme active: No\n";
}

echo "\n=== Test Complete ===\n";
?>