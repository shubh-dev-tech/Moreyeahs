<?php
/**
 * Validate ACF JSON File
 * 
 * This script validates the ACF JSON file for the Service Details Section
 */

echo "=== ACF JSON Validation ===\n\n";

$json_file = 'wp-content/themes/twentytwentyfive-child/acf-json/group_service_details_section.json';

if (!file_exists($json_file)) {
    echo "❌ Error: ACF JSON file not found at: {$json_file}\n";
    exit(1);
}

echo "📁 Checking file: {$json_file}\n";

// Read and validate JSON
$json_content = file_get_contents($json_file);
$json_data = json_decode($json_content, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo "❌ JSON Error: " . json_last_error_msg() . "\n";
    exit(1);
}

echo "✅ JSON syntax is valid.\n\n";

// Check required fields
$required_keys = ['key', 'title', 'fields', 'location'];
foreach ($required_keys as $key) {
    if (isset($json_data[$key])) {
        echo "✅ Required key '{$key}' is present.\n";
    } else {
        echo "❌ Missing required key: {$key}\n";
    }
}

echo "\n";

// Display field group info
echo "📋 Field Group Details:\n";
echo "   Key: {$json_data['key']}\n";
echo "   Title: {$json_data['title']}\n";
echo "   Fields count: " . count($json_data['fields']) . "\n";

echo "\n📝 Fields:\n";
foreach ($json_data['fields'] as $field) {
    echo "   - {$field['name']} ({$field['type']}): {$field['label']}\n";
    
    // Check for sub_fields (repeater fields)
    if (isset($field['sub_fields']) && is_array($field['sub_fields'])) {
        foreach ($field['sub_fields'] as $sub_field) {
            echo "     └─ {$sub_field['name']} ({$sub_field['type']}): {$sub_field['label']}\n";
        }
    }
}

echo "\n📍 Location Rules:\n";
foreach ($json_data['location'] as $location_group) {
    foreach ($location_group as $rule) {
        echo "   - {$rule['param']} {$rule['operator']} {$rule['value']}\n";
    }
}

echo "\n=== Validation Complete ===\n";
?>