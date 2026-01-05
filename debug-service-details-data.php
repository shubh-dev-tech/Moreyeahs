<?php
/**
 * Debug Service Details Section Data
 * 
 * This script checks what ACF data is actually stored for the Service Details Section
 */

// WordPress environment setup
require_once 'wp-config.php';

echo "=== Service Details Section Data Debug ===\n\n";

// Find a page/post with the service details section block
$posts = get_posts([
    'post_type' => ['post', 'page'],
    'post_status' => 'publish',
    'posts_per_page' => -1,
    'meta_query' => [
        [
            'key' => 'services',
            'compare' => 'EXISTS'
        ]
    ]
]);

if (empty($posts)) {
    echo "❌ No posts found with 'services' ACF field.\n";
    echo "   Please create a page/post with the Service Details Section block first.\n";
    exit(1);
}

$post = $posts[0];
echo "✅ Found post with services field: {$post->post_title} (ID: {$post->ID})\n\n";

// Check if the post content contains the service details section block
$content = $post->post_content;
if (strpos($content, 'acf/service-details-section') === false) {
    echo "⚠️  Post content doesn't contain 'acf/service-details-section' block.\n";
    echo "   This might be a different ACF field with the same name.\n\n";
}

// Get all ACF fields for this post
echo "📋 All ACF fields for this post:\n";
$all_fields = get_fields($post->ID);
if ($all_fields) {
    foreach ($all_fields as $field_name => $field_value) {
        echo "  {$field_name}: ";
        if (is_array($field_value)) {
            echo "Array with " . count($field_value) . " items\n";
            if ($field_name === 'services') {
                foreach ($field_value as $i => $service) {
                    echo "    Service {$i}:\n";
                    foreach ($service as $key => $value) {
                        echo "      {$key}: " . (is_array($value) ? json_encode($value) : $value) . "\n";
                    }
                }
            }
        } else {
            echo $field_value . "\n";
        }
    }
} else {
    echo "  No ACF fields found\n";
}

echo "\n";

// Get raw post meta
echo "🔧 Raw post meta (ACF related):\n";
$all_meta = get_post_meta($post->ID);
foreach ($all_meta as $meta_key => $meta_values) {
    if (strpos($meta_key, 'services') !== false || strpos($meta_key, 'field_') !== false) {
        echo "  {$meta_key}: " . implode(', ', $meta_values) . "\n";
    }
}

echo "\n";

// Test get_field specifically for services
echo "🎯 Testing get_field('services') directly:\n";
$services = get_field('services', $post->ID);
if ($services) {
    echo "✅ get_field('services') returned data:\n";
    echo "   Type: " . gettype($services) . "\n";
    if (is_array($services)) {
        echo "   Count: " . count($services) . "\n";
        foreach ($services as $i => $service) {
            echo "   Service {$i}:\n";
            foreach ($service as $key => $value) {
                echo "     {$key}: " . (is_array($value) ? json_encode($value) : $value) . "\n";
            }
        }
    } else {
        echo "   Value: {$services}\n";
    }
} else {
    echo "❌ get_field('services') returned empty/false\n";
}

echo "\n";

// Test the REST API endpoint
echo "🌐 Testing REST API response:\n";
$rest_request = new WP_REST_Request('GET', '/wp/v2/pages/' . $post->ID);
$rest_server = rest_get_server();
$rest_response = $rest_server->dispatch($rest_request);

if ($rest_response->is_error()) {
    echo "❌ REST API error: " . $rest_response->get_error_message() . "\n";
} else {
    $rest_data = $rest_response->get_data();
    
    // Parse blocks from REST API content
    $rest_blocks = parse_blocks($rest_data['content']['rendered']);
    
    foreach ($rest_blocks as $i => $block) {
        if ($block['blockName'] === 'acf/service-details-section') {
            echo "✅ Found Service Details Section block in REST API\n";
            echo "   Block attrs: " . json_encode($block['attrs'], JSON_PRETTY_PRINT) . "\n";
            
            if (isset($block['attrs']['data'])) {
                $data = $block['attrs']['data'];
                echo "   Services in data: ";
                if (isset($data['services'])) {
                    if (is_array($data['services'])) {
                        echo "Array with " . count($data['services']) . " items\n";
                        foreach ($data['services'] as $j => $service) {
                            echo "     Service {$j}: " . json_encode($service) . "\n";
                        }
                    } else {
                        echo "Not an array: " . $data['services'] . "\n";
                    }
                } else {
                    echo "Not found in data\n";
                }
            } else {
                echo "   No data in attrs\n";
            }
            break;
        }
    }
}

echo "\n=== Debug Complete ===\n";
?>