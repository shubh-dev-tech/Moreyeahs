<?php
/**
 * Test Block Registration
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

echo "=== Testing Block Registration ===\n\n";

// Test 1: Check if ACF is active
if (function_exists('acf_register_block_type')) {
    echo "✅ ACF is active and acf_register_block_type is available\n";
} else {
    echo "❌ ACF is not active or function not available\n";
    exit;
}

// Test 2: Check if our files exist
$block_php = get_stylesheet_directory() . '/blocks/text-image-alternating-block/block.php';
$block_css = get_stylesheet_directory() . '/blocks/text-image-alternating-block/style.css';
$acf_json = get_stylesheet_directory() . '/acf-json/group_text_image_alternating_block.json';

echo "\n=== File Check ===\n";
echo "Block PHP: " . (file_exists($block_php) ? "✅ EXISTS" : "❌ MISSING") . "\n";
echo "Block CSS: " . (file_exists($block_css) ? "✅ EXISTS" : "❌ MISSING") . "\n";
echo "ACF JSON: " . (file_exists($acf_json) ? "✅ EXISTS" : "❌ MISSING") . "\n";

// Test 3: Manually register the block to test
echo "\n=== Manual Block Registration Test ===\n";

try {
    acf_register_block_type(array(
        'name'              => 'text-image-alternating-block',
        'title'             => 'Text Image Alternating Block (Test)',
        'description'       => 'Test registration of the text image alternating block',
        'category'          => 'formatting',
        'icon'              => 'align-pull-left',
        'keywords'          => array('text', 'image', 'alternating'),
        'render_template'   => 'blocks/text-image-alternating-block/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/text-image-alternating-block/style.css',
        'supports'          => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
    ));
    echo "✅ Block registered successfully in test\n";
} catch (Exception $e) {
    echo "❌ Block registration failed: " . $e->getMessage() . "\n";
}

// Test 4: Check if field group can be loaded
echo "\n=== ACF Field Group Test ===\n";

if (file_exists($acf_json)) {
    $json_data = json_decode(file_get_contents($acf_json), true);
    if ($json_data) {
        echo "✅ ACF JSON data loaded successfully\n";
        echo "Field group key: " . $json_data['key'] . "\n";
        echo "Field count: " . count($json_data['fields']) . "\n";
        
        // Try to import the field group
        if (function_exists('acf_import_field_group')) {
            try {
                acf_import_field_group($json_data);
                echo "✅ Field group imported successfully\n";
            } catch (Exception $e) {
                echo "❌ Field group import failed: " . $e->getMessage() . "\n";
            }
        }
    } else {
        echo "❌ Failed to parse ACF JSON data\n";
    }
}

echo "\n=== Test Complete ===\n";
echo "If all tests pass, the block should be available in WordPress admin.\n";
echo "Try refreshing your WordPress admin page editor.\n";
?>