<?php
/**
 * Test Text Image Alternating Block Data
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

echo "=== Testing Text Image Alternating Block ===\n\n";

// Create a test page with our block
$test_content = '<!-- wp:acf/text-image-alternating-block {"id":"block_67798b8e4c123","name":"acf/text-image-alternating-block","data":{"main_heading":"What \"We Mean Solution\" Really Means","main_subheading":"Every solution we build is accountable to performance, scalability and business value.","content_sections":[{"layout_type":"text-left","text_content":"We don\'t sell technology — we solve business problems.","section_image":{"url":"https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image","alt":"Sample Image"}},{"layout_type":"text-right","text_content":"We design for outcomes, not just delivery.","section_image":{"url":"https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image+2","alt":"Sample Image 2"}}]},"mode":"preview"} /-->';

$test_post_id = wp_insert_post(array(
    'post_title' => 'Test Text Image Alternating Block - ' . date('Y-m-d H:i:s'),
    'post_content' => $test_content,
    'post_status' => 'publish',
    'post_type' => 'page'
));

if ($test_post_id) {
    echo "✅ Created test page ID: $test_post_id\n";
    echo "URL: " . get_permalink($test_post_id) . "\n\n";
    
    // Parse the blocks
    $blocks = parse_blocks($test_content);
    echo "=== Parsed Blocks ===\n";
    foreach ($blocks as $i => $block) {
        echo "Block $i:\n";
        echo "  Name: " . ($block['blockName'] ?? 'NULL') . "\n";
        echo "  Attrs: " . json_encode($block['attrs'], JSON_PRETTY_PRINT) . "\n";
        echo "  Data: " . json_encode($block['attrs']['data'] ?? [], JSON_PRETTY_PRINT) . "\n";
        echo "\n";
    }
    
    // Test REST API response
    echo "=== REST API Test ===\n";
    $rest_url = home_url('/wp-json/wp/v2/pages/' . $test_post_id);
    echo "REST URL: $rest_url\n";
    
    $response = wp_remote_get($rest_url);
    if (!is_wp_error($response)) {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['content']['rendered'])) {
            echo "✅ REST API content retrieved\n";
            $rest_blocks = parse_blocks($data['content']['rendered']);
            echo "REST Blocks count: " . count($rest_blocks) . "\n";
            
            foreach ($rest_blocks as $i => $block) {
                if ($block['blockName'] === 'acf/text-image-alternating-block') {
                    echo "Found our block in REST response:\n";
                    echo "  Data: " . json_encode($block['attrs']['data'] ?? [], JSON_PRETTY_PRINT) . "\n";
                }
            }
        } else {
            echo "❌ No content in REST response\n";
        }
    } else {
        echo "❌ REST API error: " . $response->get_error_message() . "\n";
    }
    
    // Test ACF fields directly
    echo "\n=== ACF Fields Test ===\n";
    $main_heading = get_field('main_heading', $test_post_id);
    $main_subheading = get_field('main_subheading', $test_post_id);
    $content_sections = get_field('content_sections', $test_post_id);
    
    echo "Main Heading: " . ($main_heading ?: 'NULL') . "\n";
    echo "Main Subheading: " . ($main_subheading ?: 'NULL') . "\n";
    echo "Content Sections: " . (is_array($content_sections) ? count($content_sections) . " sections" : 'NULL') . "\n";
    
    if (is_array($content_sections)) {
        foreach ($content_sections as $i => $section) {
            echo "Section $i:\n";
            echo "  Layout: " . ($section['layout_type'] ?? 'NULL') . "\n";
            echo "  Text: " . ($section['text_content'] ?? 'NULL') . "\n";
            echo "  Image URL: " . ($section['section_image']['url'] ?? 'NULL') . "\n";
        }
    }
    
    echo "\n=== Test Complete ===\n";
    echo "Visit the page URL above to see the block in action.\n";
    echo "Check your NextJS frontend to see if the data is being passed correctly.\n";
    
} else {
    echo "❌ Failed to create test page\n";
}
?>