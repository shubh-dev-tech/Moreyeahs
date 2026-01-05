<?php
/**
 * Debug Service Details Section API Response
 * 
 * This script tests what data is returned by WordPress REST API for the Service Details Section block
 */

// WordPress environment setup
require_once 'wp-config.php';

echo "=== Service Details Section API Debug ===\n\n";

// Create a test post with the Service Details Section block
$test_post_id = wp_insert_post([
    'post_title' => 'Service Details Test Page',
    'post_content' => '<!-- wp:acf/service-details-section {"data":{"heading":"Test Heading","sub_heading":"Test subheading","background_color":"#f8f9fa","grid_columns":"3","services":[{"service_title":"Test Service","service_description":"Test description","service_icon":{"url":"https://via.placeholder.com/64","alt":"Test"},"service_link":"#"}]}} /-->',
    'post_status' => 'publish',
    'post_type' => 'page'
]);

if (is_wp_error($test_post_id)) {
    echo "❌ Failed to create test post: " . $test_post_id->get_error_message() . "\n";
    exit(1);
}

echo "✅ Created test post with ID: {$test_post_id}\n\n";

// Parse blocks from the post content
$post = get_post($test_post_id);
$blocks = parse_blocks($post->post_content);

echo "📋 Parsed blocks:\n";
foreach ($blocks as $i => $block) {
    echo "  Block {$i}:\n";
    echo "    Name: {$block['blockName']}\n";
    echo "    Attrs: " . json_encode($block['attrs'], JSON_PRETTY_PRINT) . "\n";
    echo "    Inner HTML: " . substr($block['innerHTML'], 0, 100) . "...\n\n";
}

// Test REST API response
echo "🌐 Testing REST API response...\n";

// Simulate REST API call
$rest_request = new WP_REST_Request('GET', '/wp/v2/pages/' . $test_post_id);
$rest_server = rest_get_server();
$rest_response = $rest_server->dispatch($rest_request);

if ($rest_response->is_error()) {
    echo "❌ REST API error: " . $rest_response->get_error_message() . "\n";
} else {
    $rest_data = $rest_response->get_data();
    
    echo "✅ REST API response received\n";
    echo "   Title: {$rest_data['title']['rendered']}\n";
    echo "   Content length: " . strlen($rest_data['content']['rendered']) . " chars\n";
    
    // Parse blocks from REST API content
    $rest_blocks = parse_blocks($rest_data['content']['rendered']);
    
    echo "\n📋 REST API blocks:\n";
    foreach ($rest_blocks as $i => $block) {
        echo "  Block {$i}:\n";
        echo "    Name: {$block['blockName']}\n";
        
        if ($block['blockName'] === 'acf/service-details-section') {
            echo "    🎯 Found Service Details Section block!\n";
            echo "    Attrs: " . json_encode($block['attrs'], JSON_PRETTY_PRINT) . "\n";
            
            // Check if ACF data is included
            if (isset($block['attrs']['data'])) {
                echo "    ✅ ACF data found in attrs\n";
                $acf_data = $block['attrs']['data'];
                echo "    Heading: " . ($acf_data['heading'] ?? 'NOT SET') . "\n";
                echo "    Services count: " . (isset($acf_data['services']) ? count($acf_data['services']) : 'NOT SET') . "\n";
            } else {
                echo "    ❌ No ACF data in attrs\n";
            }
        }
        
        echo "\n";
    }
}

// Test ACF fields directly
echo "🔧 Testing ACF fields directly...\n";
$acf_fields = get_fields($test_post_id);

if ($acf_fields) {
    echo "✅ ACF fields found:\n";
    foreach ($acf_fields as $field_name => $field_value) {
        echo "  {$field_name}: " . (is_array($field_value) ? json_encode($field_value) : $field_value) . "\n";
    }
} else {
    echo "❌ No ACF fields found for post {$test_post_id}\n";
    echo "   This could mean:\n";
    echo "   1. ACF field group is not active\n";
    echo "   2. Field group location rules don't match\n";
    echo "   3. Block was not saved with ACF data\n";
}

// Clean up
wp_delete_post($test_post_id, true);
echo "\n🧹 Cleaned up test post\n";

echo "\n=== Debug Complete ===\n";

// Additional checks
echo "\n🔍 Additional Checks:\n";

// Check if ACF is properly integrated with REST API
if (function_exists('acf_get_field_groups')) {
    $field_groups = acf_get_field_groups();
    $service_details_group = null;
    
    foreach ($field_groups as $group) {
        if ($group['key'] === 'group_service_details_section') {
            $service_details_group = $group;
            break;
        }
    }
    
    if ($service_details_group) {
        echo "✅ Service Details field group found\n";
        echo "   Active: " . ($service_details_group['active'] ? 'Yes' : 'No') . "\n";
        
        // Check location rules
        $locations = $service_details_group['location'];
        echo "   Location rules:\n";
        foreach ($locations as $location_group) {
            foreach ($location_group as $rule) {
                echo "     - {$rule['param']} {$rule['operator']} {$rule['value']}\n";
            }
        }
    } else {
        echo "❌ Service Details field group not found\n";
    }
} else {
    echo "❌ ACF functions not available\n";
}

echo "\n💡 Next Steps:\n";
echo "1. Check if the block appears in WordPress editor\n";
echo "2. Add the block to a page and save\n";
echo "3. Check if ACF data is saved correctly\n";
echo "4. Test the Next.js frontend with real WordPress data\n";
?>