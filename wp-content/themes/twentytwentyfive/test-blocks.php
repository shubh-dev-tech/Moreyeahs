<?php
/**
 * Test Block Registration
 * Access via: http://your-site.com/wp-content/themes/twentytwentyfive/test-blocks.php
 */

require_once('../../../wp-load.php');

echo '<h1>ACF Block Registration Test</h1>';

// Check if ACF is active
if (!function_exists('acf_get_block_types')) {
    die('<p style="color:red;">ACF Pro is NOT active!</p>');
}

echo '<p style="color:green;">✓ ACF Pro is active</p>';

// Get all registered ACF blocks
$block_types = acf_get_block_types();

echo '<h2>Registered ACF Blocks (' . count($block_types) . '):</h2>';

if (empty($block_types)) {
    echo '<p style="color:red;">No ACF blocks are registered!</p>';
    echo '<p>This means the block registration code in functions.php is not running.</p>';
} else {
    echo '<table border="1" cellpadding="10" style="border-collapse: collapse;">';
    echo '<tr><th>Block Name</th><th>Title</th><th>Category</th><th>Template Path</th></tr>';
    
    foreach ($block_types as $block) {
        $name = isset($block['name']) ? $block['name'] : 'N/A';
        $title = isset($block['title']) ? $block['title'] : 'N/A';
        $category = isset($block['category']) ? $block['category'] : 'N/A';
        $template = isset($block['render_template']) ? $block['render_template'] : 'N/A';
        
        // Highlight promo-block
        $style = (strpos($name, 'promo-block') !== false) ? 'background-color: #90EE90;' : '';
        
        echo '<tr style="' . $style . '">';
        echo '<td><strong>' . esc_html($name) . '</strong></td>';
        echo '<td>' . esc_html($title) . '</td>';
        echo '<td>' . esc_html($category) . '</td>';
        echo '<td>' . esc_html($template) . '</td>';
        echo '</tr>';
    }
    
    echo '</table>';
}

// Check if promo-block is registered
echo '<h2>Promo Block Status:</h2>';
$promo_block_found = false;

foreach ($block_types as $block) {
    if (isset($block['name']) && strpos($block['name'], 'promo-block') !== false) {
        $promo_block_found = true;
        echo '<p style="color:green; font-size: 18px;">✓ Promo Block IS registered!</p>';
        echo '<pre>';
        print_r($block);
        echo '</pre>';
        break;
    }
}

if (!$promo_block_found) {
    echo '<p style="color:red; font-size: 18px;">✗ Promo Block is NOT registered!</p>';
    echo '<p>Possible issues:</p>';
    echo '<ul>';
    echo '<li>The block registration code is not running</li>';
    echo '<li>There might be a PHP error in functions.php</li>';
    echo '<li>The acf/init hook is not firing</li>';
    echo '</ul>';
}

// Check field groups
echo '<h2>ACF Field Groups:</h2>';
$field_groups = acf_get_field_groups();

if (empty($field_groups)) {
    echo '<p style="color:red;">No field groups found!</p>';
} else {
    echo '<table border="1" cellpadding="10" style="border-collapse: collapse;">';
    echo '<tr><th>Key</th><th>Title</th><th>Active</th></tr>';
    
    foreach ($field_groups as $group) {
        $style = (strpos($group['key'], 'promo') !== false) ? 'background-color: #90EE90;' : '';
        echo '<tr style="' . $style . '">';
        echo '<td>' . esc_html($group['key']) . '</td>';
        echo '<td>' . esc_html($group['title']) . '</td>';
        echo '<td>' . ($group['active'] ? 'Yes' : 'No') . '</td>';
        echo '</tr>';
    }
    
    echo '</table>';
}

// Check if template file exists
echo '<h2>Template File Check:</h2>';
$template_path = get_template_directory() . '/blocks/promo-block.php';
if (file_exists($template_path)) {
    echo '<p style="color:green;">✓ Template file exists: ' . $template_path . '</p>';
} else {
    echo '<p style="color:red;">✗ Template file NOT found: ' . $template_path . '</p>';
}

echo '<hr>';
echo '<p><strong>Next Steps:</strong></p>';
echo '<ol>';
echo '<li>If Promo Block is registered above, go to WordPress editor and search for "Promo"</li>';
echo '<li>If NOT registered, check for PHP errors in functions.php</li>';
echo '<li>Delete this test file after checking</li>';
echo '</ol>';
?>
