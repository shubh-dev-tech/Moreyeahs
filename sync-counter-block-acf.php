<?php
/**
 * Sync Counter Block ACF Fields
 * 
 * This script syncs the counter block ACF fields to include the new background color option.
 * Run this after updating the ACF JSON files.
 */

// WordPress environment setup
require_once('wp-config.php');
require_once(ABSPATH . 'wp-admin/includes/admin.php');

// Check if ACF is active
if (!function_exists('acf_get_field_groups')) {
    die('ACF (Advanced Custom Fields) plugin is not active or installed.');
}

echo "=== Counter Block ACF Field Sync ===\n";

try {
    // Get the counter block field group
    $field_groups = acf_get_field_groups();
    $counter_block_group = null;
    
    foreach ($field_groups as $group) {
        if ($group['key'] === 'group_counter_block') {
            $counter_block_group = $group;
            break;
        }
    }
    
    if (!$counter_block_group) {
        echo "❌ Counter block field group not found.\n";
        exit(1);
    }
    
    echo "✅ Found counter block field group: {$counter_block_group['title']}\n";
    
    // Check if background_color field exists
    $fields = acf_get_fields($counter_block_group['key']);
    $background_color_exists = false;
    
    foreach ($fields as $field) {
        if ($field['name'] === 'background_color') {
            $background_color_exists = true;
            break;
        }
    }
    
    if ($background_color_exists) {
        echo "✅ Background color field already exists.\n";
    } else {
        echo "⚠️  Background color field not found. Please sync ACF fields from JSON.\n";
        echo "Go to WordPress Admin > Custom Fields > Tools > Sync Available\n";
    }
    
    // Verify the field group location
    $locations = $counter_block_group['location'];
    $correct_location = false;
    
    foreach ($locations as $location_group) {
        foreach ($location_group as $rule) {
            if ($rule['param'] === 'block' && $rule['value'] === 'acf/counter-block') {
                $correct_location = true;
                break 2;
            }
        }
    }
    
    if ($correct_location) {
        echo "✅ Field group is correctly assigned to counter-block.\n";
    } else {
        echo "❌ Field group location is not set correctly.\n";
    }
    
    echo "\n=== Summary ===\n";
    echo "Counter Block ACF configuration:\n";
    echo "- Field Group: {$counter_block_group['title']}\n";
    echo "- Key: {$counter_block_group['key']}\n";
    echo "- Fields: " . count($fields) . "\n";
    echo "- Background Color Field: " . ($background_color_exists ? 'Present' : 'Missing') . "\n";
    echo "- Block Location: " . ($correct_location ? 'Correct' : 'Incorrect') . "\n";
    
    if (!$background_color_exists) {
        echo "\n⚠️  Action Required:\n";
        echo "1. Go to WordPress Admin > Custom Fields > Tools\n";
        echo "2. Click 'Sync Available' to sync the updated field group\n";
        echo "3. The background color field should appear in the counter block editor\n";
    } else {
        echo "\n✅ Counter block is ready to use with background color option!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>