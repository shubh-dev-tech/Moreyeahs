<?php
/**
 * Import More Years Service Block ACF Field Group
 * 
 * Run this file once to import the More Years Service Block field group into ACF.
 * Access via: your-site.com/wp-content/themes/twentytwentyfive/import-moreyeahs-service-block.php
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if ACF is active
if (!function_exists('acf_add_local_field_group')) {
    die('ACF Pro is not active. Please install and activate ACF Pro first.');
}

// Path to the JSON file
$json_file = __DIR__ . '/acf-json/group_moreyeahs_service_block.json';

if (!file_exists($json_file)) {
    die('JSON file not found: ' . $json_file);
}

// Read and decode JSON
$json_data = file_get_contents($json_file);
$field_group = json_decode($json_data, true);

if (!$field_group) {
    die('Failed to decode JSON file.');
}

// Import the field group
acf_import_field_group($field_group);

echo '<h1>Success!</h1>';
echo '<p>More Years Service Block field group has been imported successfully.</p>';
echo '<p><a href="' . admin_url('post.php?post=' . acf_get_field_group_post($field_group['key'])->ID . '&action=edit') . '">View Field Group</a></p>';
echo '<p><a href="' . admin_url('edit.php?post_type=page') . '">Go to Pages</a></p>';
echo '<hr>';
echo '<p><strong>Next Steps:</strong></p>';
echo '<ol>';
echo '<li>Delete this import file for security</li>';
echo '<li>Register the block in your theme\'s functions.php</li>';
echo '<li>Create the block template file</li>';
echo '<li>Add the More Years Service Block to any page using the block editor</li>';
echo '</ol>';

echo '<hr>';
echo '<p><strong>Block Registration Code (add to functions.php):</strong></p>';
echo '<pre style="background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto;">';
echo htmlspecialchars('
// More Years Service Block
acf_register_block_type(array(
    \'name\'              => \'moreyeahs-service-block\',
    \'title\'             => __(\'More Years Service\'),
    \'description\'       => __(\'A service block with heading, subheading, and repeatable service sections with borders.\'),
    \'render_template\'   => \'blocks/moreyeahs-service.php\',
    \'category\'          => \'formatting\',
    \'icon\'              => \'grid-view\',
    \'keywords\'          => array(\'moreyeahs\', \'service\', \'offerings\', \'sections\'),
    \'supports\'          => array(
        \'align\' => true,
        \'mode\' => false,
    ),
));
');
echo '</pre>';
?>