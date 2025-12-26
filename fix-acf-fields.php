<?php
/**
 * Fix ACF Fields - Force synchronization of case study template fields
 * 
 * Run this file once to fix the ACF field saving issue
 * Visit: http://your-site.com/fix-acf-fields.php
 */

// Include WordPress
require_once('wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('Access denied. Please log in as administrator.');
}

echo "<h1>ACF Fields Fix</h1>";

// Step 1: Check if ACF is active
if (!function_exists('acf_get_field_groups')) {
    echo "<p style='color: red;'>❌ ACF is not active. Please activate Advanced Custom Fields plugin.</p>";
    exit;
}

echo "<p>✅ ACF is active</p>";

// Step 2: Force sync field groups
echo "<h2>Synchronizing Field Groups...</h2>";

// Get all field groups that need sync
$sync = array();
if (function_exists('acf_get_field_groups')) {
    $field_groups = acf_get_field_groups();
    
    foreach ($field_groups as $field_group) {
        $local_field_group = acf_maybe_get_field_group($field_group['key'], true);
        if ($local_field_group && !$field_group['ID']) {
            $sync[$field_group['key']] = $local_field_group;
        }
    }
}

if (empty($sync)) {
    echo "<p>✅ All field groups are already synchronized</p>";
} else {
    echo "<p>Found " . count($sync) . " field groups to sync:</p>";
    
    foreach ($sync as $key => $field_group) {
        echo "<p>- Syncing: " . $field_group['title'] . "</p>";
        
        // Import the field group
        if (function_exists('acf_import_field_group')) {
            $result = acf_import_field_group($field_group);
            if ($result) {
                echo "<p style='color: green;'>✅ Successfully synced: " . $field_group['title'] . "</p>";
            } else {
                echo "<p style='color: red;'>❌ Failed to sync: " . $field_group['title'] . "</p>";
            }
        }
    }
}

// Step 3: Verify the case study template field group
echo "<h2>Verifying Case Study Template Fields...</h2>";

$case_study_group = acf_get_field_group('group_case_study_template');
if ($case_study_group) {
    echo "<p>✅ Case Study Template field group found</p>";
    echo "<p>Title: " . $case_study_group['title'] . "</p>";
    echo "<p>Status: " . ($case_study_group['active'] ? 'Active' : 'Inactive') . "</p>";
    
    // Get fields in the group
    $fields = acf_get_fields($case_study_group);
    if ($fields) {
        echo "<p>✅ Found " . count($fields) . " fields in the group:</p>";
        echo "<ul>";
        foreach ($fields as $field) {
            echo "<li>" . $field['label'] . " (" . $field['name'] . ")</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>❌ No fields found in the group</p>";
    }
} else {
    echo "<p style='color: red;'>❌ Case Study Template field group not found</p>";
}

// Step 4: Test with a case study post
echo "<h2>Testing with Case Study Posts...</h2>";

$case_studies = get_posts(array(
    'post_type' => 'case_study',
    'post_status' => 'any',
    'numberposts' => 1
));

if ($case_studies) {
    $case_study = $case_studies[0];
    echo "<p>Testing with case study: " . $case_study->post_title . " (ID: " . $case_study->ID . ")</p>";
    
    // Try to get a field value
    $header_section = get_field('header_section', $case_study->ID);
    if ($header_section) {
        echo "<p>✅ ACF fields are working - found header section data</p>";
    } else {
        echo "<p style='color: orange;'>⚠️ No field data found - this is normal for new posts</p>";
        
        // Try to set default values
        echo "<p>Setting default values...</p>";
        $result = update_field('header_section', array(
            'title' => 'Test Case Study',
            'subtitle' => 'Test subtitle'
        ), $case_study->ID);
        
        if ($result) {
            echo "<p>✅ Successfully set default values</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to set default values</p>";
        }
    }
} else {
    echo "<p>No case studies found to test with</p>";
}

// Step 5: Instructions
echo "<h2>Next Steps:</h2>";
echo "<ol>";
echo "<li>Go to WordPress Admin > Custom Fields > Field Groups</li>";
echo "<li>Look for 'Case Study Template' field group</li>";
echo "<li>If you see a 'Sync available' notice, click 'Sync'</li>";
echo "<li>Go to Case Studies > Add New</li>";
echo "<li>Fill out the fields and click Update/Publish</li>";
echo "<li>The fields should now save properly</li>";
echo "</ol>";

echo "<h2>Troubleshooting:</h2>";
echo "<p>If fields still don't save:</p>";
echo "<ul>";
echo "<li>Check WordPress error logs</li>";
echo "<li>Deactivate and reactivate ACF plugin</li>";
echo "<li>Go to ACF > Tools > Export and re-import the field group</li>";
echo "<li>Check file permissions on the acf-json folder</li>";
echo "</ul>";

echo "<p><strong>After running this script, try creating/editing a case study again.</strong></p>";
?>