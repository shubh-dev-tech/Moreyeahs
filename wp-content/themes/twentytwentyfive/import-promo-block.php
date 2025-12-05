<?php
/**
 * Manual Import Script for Promo Block ACF Fields
 * 
 * Instructions:
 * 1. Access this file via browser: http://your-site.com/wp-content/themes/twentytwentyfive/import-promo-block.php
 * 2. Or run via WP-CLI: wp eval-file wp-content/themes/twentytwentyfive/import-promo-block.php
 * 3. Delete this file after successful import
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if ACF is active
if (!function_exists('acf_import_field_group')) {
    die('ACF Pro is not active!');
}

// Read the JSON file
$json_file = __DIR__ . '/acf-json/group_promo_block.json';

if (!file_exists($json_file)) {
    die('JSON file not found at: ' . $json_file);
}

$json_content = file_get_contents($json_file);
$field_group = json_decode($json_content, true);

if (!$field_group) {
    die('Invalid JSON format!');
}

// Check if field group already exists
$existing = acf_get_field_group($field_group['key']);

if ($existing) {
    echo '<h2>Field Group Already Exists</h2>';
    echo '<p>The Promo Block field group is already registered.</p>';
    echo '<p>Key: ' . $field_group['key'] . '</p>';
    echo '<p>Title: ' . $field_group['title'] . '</p>';
    echo '<hr>';
    echo '<p><strong>Next Steps:</strong></p>';
    echo '<ol>';
    echo '<li>Go to WordPress Admin → Custom Fields → Field Groups</li>';
    echo '<li>Look for "Promo Block"</li>';
    echo '<li>Edit any page and click the + button</li>';
    echo '<li>Search for "Promo Block"</li>';
    echo '</ol>';
} else {
    // Import the field group
    $result = acf_import_field_group($field_group);
    
    if ($result) {
        echo '<h2>Success!</h2>';
        echo '<p>Promo Block field group has been imported successfully!</p>';
        echo '<p>Key: ' . $field_group['key'] . '</p>';
        echo '<p>Title: ' . $field_group['title'] . '</p>';
        echo '<hr>';
        echo '<p><strong>Next Steps:</strong></p>';
        echo '<ol>';
        echo '<li>Go to WordPress Admin → Custom Fields → Field Groups</li>';
        echo '<li>Verify "Promo Block" is listed</li>';
        echo '<li>Edit any page and click the + button</li>';
        echo '<li>Search for "Promo Block" - it should now appear!</li>';
        echo '<li><strong>Delete this import file for security</strong></li>';
        echo '</ol>';
    } else {
        echo '<h2>Import Failed</h2>';
        echo '<p>Could not import the field group. Please check error logs.</p>';
    }
}

echo '<hr>';
echo '<h3>Field Group Details:</h3>';
echo '<pre>';
print_r($field_group);
echo '</pre>';
?>
