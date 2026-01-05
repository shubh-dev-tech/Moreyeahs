<?php
/**
 * Debug ACF Block Registration
 * 
 * This script helps debug ACF block registration issues
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

echo "=== ACF Block Registration Debug ===\n\n";

// Check if ACF is active
if (!function_exists('acf_register_block_type')) {
    echo "❌ ACF is not active or acf_register_block_type function doesn't exist\n";
    exit;
}

echo "✅ ACF is active\n";

// Check if our ACF blocks file is being loaded
$acf_blocks_file = get_stylesheet_directory() . '/inc/acf-blocks.php';
if (file_exists($acf_blocks_file)) {
    echo "✅ ACF blocks file exists: $acf_blocks_file\n";
} else {
    echo "❌ ACF blocks file not found: $acf_blocks_file\n";
}

// Check if our block directory exists
$block_dir = get_stylesheet_directory() . '/blocks/text-image-alternating-block';
if (is_dir($block_dir)) {
    echo "✅ Block directory exists: $block_dir\n";
    
    // Check block files
    $block_php = $block_dir . '/block.php';
    $block_css = $block_dir . '/style.css';
    
    if (file_exists($block_php)) {
        echo "✅ Block PHP template exists\n";
    } else {
        echo "❌ Block PHP template missing\n";
    }
    
    if (file_exists($block_css)) {
        echo "✅ Block CSS file exists\n";
    } else {
        echo "❌ Block CSS file missing\n";
    }
} else {
    echo "❌ Block directory not found: $block_dir\n";
}

// Check ACF JSON file
$acf_json_file = get_stylesheet_directory() . '/acf-json/group_text_image_alternating_block.json';
if (file_exists($acf_json_file)) {
    echo "✅ ACF JSON file exists: $acf_json_file\n";
} else {
    echo "❌ ACF JSON file not found: $acf_json_file\n";
}

// Force ACF to sync field groups
if (function_exists('acf_get_field_groups')) {
    echo "\n=== Syncing ACF Field Groups ===\n";
    
    // Get all field groups
    $field_groups = acf_get_field_groups();
    $found_our_group = false;
    
    foreach ($field_groups as $group) {
        if ($group['key'] === 'group_text_image_alternating_block') {
            $found_our_group = true;
            echo "✅ Found our field group: " . $group['title'] . "\n";
            break;
        }
    }
    
    if (!$found_our_group) {
        echo "❌ Our field group not found in ACF\n";
        echo "💡 Try going to WordPress Admin > Custom Fields > Field Groups and sync the field group\n";
    }
}

// Check registered blocks
if (function_exists('get_dynamic_block_names')) {
    echo "\n=== Registered Blocks ===\n";
    $blocks = get_dynamic_block_names();
    $found_our_block = false;
    
    foreach ($blocks as $block) {
        if (strpos($block, 'text-image-alternating') !== false) {
            $found_our_block = true;
            echo "✅ Found our block: $block\n";
        }
    }
    
    if (!$found_our_block) {
        echo "❌ Our block not found in registered blocks\n";
        echo "💡 The block registration might not be working\n";
    }
}

echo "\n=== Recommendations ===\n";
echo "1. Go to WordPress Admin > Custom Fields > Field Groups\n";
echo "2. Look for 'Text Image Alternating Block' field group\n";
echo "3. If you see a 'Sync available' notice, click 'Sync'\n";
echo "4. Clear any caching plugins\n";
echo "5. Try refreshing the page editor\n";

echo "\n=== Debug Complete ===\n";
?>