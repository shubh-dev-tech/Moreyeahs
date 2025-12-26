<?php
/**
 * Debug ACF Save Issues
 * 
 * This script helps diagnose why ACF fields aren't saving
 * Visit: http://your-site.com/debug-acf-save.php
 */

// Include WordPress
require_once('wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('Access denied. Please log in as administrator.');
}

echo "<h1>ACF Save Debug</h1>";

// Check ACF status
echo "<h2>1. ACF Status</h2>";
if (function_exists('acf_get_field_groups')) {
    echo "✅ ACF is active<br>";
    echo "ACF Version: " . (defined('ACF_VERSION') ? ACF_VERSION : 'Unknown') . "<br>";
} else {
    echo "❌ ACF is not active<br>";
    exit;
}

// Check field group
echo "<h2>2. Field Group Status</h2>";
$field_group = acf_get_field_group('group_case_study_template');
if ($field_group) {
    echo "✅ Case Study Template field group found<br>";
    echo "Active: " . ($field_group['active'] ? 'Yes' : 'No') . "<br>";
    echo "ID: " . ($field_group['ID'] ?: 'Not in database') . "<br>";
} else {
    echo "❌ Field group not found<br>";
    
    // Try to load from JSON
    $json_file = get_stylesheet_directory() . '/acf-json/group_case_study_template.json';
    if (file_exists($json_file)) {
        echo "📁 JSON file exists: $json_file<br>";
        $json_data = json_decode(file_get_contents($json_file), true);
        if ($json_data) {
            echo "✅ JSON data is valid<br>";
            
            // Try to import
            if (function_exists('acf_import_field_group')) {
                $result = acf_import_field_group($json_data);
                if ($result) {
                    echo "✅ Successfully imported field group<br>";
                } else {
                    echo "❌ Failed to import field group<br>";
                }
            }
        } else {
            echo "❌ Invalid JSON data<br>";
        }
    } else {
        echo "❌ JSON file not found<br>";
    }
}

// Check case study post type
echo "<h2>3. Post Type Status</h2>";
if (post_type_exists('case_study')) {
    echo "✅ Case study post type exists<br>";
    
    // Check if it supports custom fields
    $post_type_object = get_post_type_object('case_study');
    if ($post_type_object && in_array('custom-fields', $post_type_object->supports)) {
        echo "✅ Post type supports custom fields<br>";
    } else {
        echo "⚠️ Post type may not support custom fields<br>";
    }
} else {
    echo "❌ Case study post type not found<br>";
}

// Test field saving
echo "<h2>4. Field Save Test</h2>";
$case_studies = get_posts(array(
    'post_type' => 'case_study',
    'post_status' => 'any',
    'numberposts' => 1
));

if ($case_studies) {
    $post_id = $case_studies[0]->ID;
    echo "Testing with post ID: $post_id<br>";
    
    // Try to save a simple field
    $test_value = array(
        'title' => 'Test Title - ' . date('Y-m-d H:i:s'),
        'subtitle' => 'Test Subtitle'
    );
    
    $result = update_field('header_section', $test_value, $post_id);
    if ($result) {
        echo "✅ Successfully saved test field<br>";
        
        // Try to retrieve it
        $retrieved = get_field('header_section', $post_id);
        if ($retrieved && $retrieved['title'] === $test_value['title']) {
            echo "✅ Successfully retrieved test field<br>";
        } else {
            echo "❌ Failed to retrieve test field<br>";
            echo "Retrieved: " . print_r($retrieved, true) . "<br>";
        }
    } else {
        echo "❌ Failed to save test field<br>";
    }
} else {
    echo "No case studies found to test with<br>";
}

// Check database tables
echo "<h2>5. Database Status</h2>";
global $wpdb;

$postmeta_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} WHERE meta_key LIKE 'header_section%'");
echo "ACF postmeta entries: $postmeta_count<br>";

$acf_fields_count = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = 'acf-field'");
echo "ACF field definitions: $acf_fields_count<br>";

// Check permissions
echo "<h2>6. File Permissions</h2>";
$acf_json_dir = get_stylesheet_directory() . '/acf-json';
if (is_dir($acf_json_dir)) {
    echo "ACF JSON directory exists<br>";
    if (is_writable($acf_json_dir)) {
        echo "✅ ACF JSON directory is writable<br>";
    } else {
        echo "❌ ACF JSON directory is not writable<br>";
    }
} else {
    echo "❌ ACF JSON directory not found<br>";
}

echo "<h2>Solutions to Try:</h2>";
echo "<ol>";
echo "<li><strong>Go to WordPress Admin > Custom Fields > Field Groups</strong></li>";
echo "<li>Look for 'Case Study Template' - if you see 'Sync available', click it</li>";
echo "<li>If not there, go to <strong>Custom Fields > Tools > Import</strong></li>";
echo "<li>Select the JSON file: wp-content/themes/twentytwentyfive-child/acf-json/group_case_study_template.json</li>";
echo "<li>After import, try editing a case study again</li>";
echo "</ol>";

echo "<h2>Alternative Solution:</h2>";
echo "<p>If the above doesn't work, try this manual approach:</p>";
echo "<ol>";
echo "<li>Go to <strong>Custom Fields > Field Groups > Add New</strong></li>";
echo "<li>Create a new field group called 'Case Study Template'</li>";
echo "<li>Set location rule: Post Type is equal to Case Study</li>";
echo "<li>Add a simple text field called 'test_field'</li>";
echo "<li>Save and test if it saves properly</li>";
echo "<li>If it works, you can then import the full template</li>";
echo "</ol>";
?>