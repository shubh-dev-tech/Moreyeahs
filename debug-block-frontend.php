<?php
/**
 * Debug Block Frontend - Create a simple test page
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

// Create a simple test page with our block
$test_content = '<!-- wp:acf/text-image-alternating-block {"id":"block_debug_123","name":"acf/text-image-alternating-block","data":{"main_heading":"Debug Test Heading","main_subheading":"This is a debug test subheading","background_image":{"url":"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop","alt":"Space Background"},"content_sections":[{"layout_type":"text-left","text_content":"This is the first test section with text on the left.","section_image":{"url":"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop","alt":"Technology Image"}},{"layout_type":"text-right","text_content":"This is the second test section with text on the right.","section_image":{"url":"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop","alt":"Business Image"}}]},"mode":"preview"} /-->';

// Check if test page already exists
$existing_page = get_page_by_title('Debug Text Image Alternating Block');

if ($existing_page) {
    // Update existing page
    wp_update_post(array(
        'ID' => $existing_page->ID,
        'post_content' => $test_content,
        'post_status' => 'publish'
    ));
    $page_id = $existing_page->ID;
    echo "✅ Updated existing test page ID: $page_id\n";
} else {
    // Create new page
    $page_id = wp_insert_post(array(
        'post_title' => 'Debug Text Image Alternating Block',
        'post_content' => $test_content,
        'post_status' => 'publish',
        'post_type' => 'page',
        'post_name' => 'debug-text-image-alternating'
    ));
    echo "✅ Created new test page ID: $page_id\n";
}

if ($page_id) {
    $page_url = get_permalink($page_id);
    echo "Page URL: $page_url\n";
    
    // Also set ACF fields directly (backup method)
    update_field('main_heading', 'Debug Test Heading', $page_id);
    update_field('main_subheading', 'This is a debug test subheading', $page_id);
    update_field('background_image', array(
        'url' => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop',
        'alt' => 'Space Background'
    ), $page_id);
    update_field('content_sections', array(
        array(
            'layout_type' => 'text-left',
            'text_content' => 'This is the first test section with text on the left.',
            'section_image' => array(
                'url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                'alt' => 'Technology Image'
            )
        ),
        array(
            'layout_type' => 'text-right',
            'text_content' => 'This is the second test section with text on the right.',
            'section_image' => array(
                'url' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
                'alt' => 'Business Image'
            )
        )
    ), $page_id);
    
    echo "✅ ACF fields updated directly\n";
    
    // Test the REST API response
    echo "\n=== Testing REST API ===\n";
    $rest_url = home_url('/wp-json/wp/v2/pages/' . $page_id);
    $response = wp_remote_get($rest_url);
    
    if (!is_wp_error($response)) {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['content']['rendered'])) {
            echo "✅ REST API working\n";
            $blocks = parse_blocks($data['content']['rendered']);
            echo "Blocks found: " . count($blocks) . "\n";
            
            foreach ($blocks as $block) {
                if ($block['blockName'] === 'acf/text-image-alternating-block') {
                    echo "✅ Found our block in REST response\n";
                    echo "Block data keys: " . implode(', ', array_keys($block['attrs']['data'] ?? [])) . "\n";
                }
            }
        }
    }
    
    echo "\n=== Instructions ===\n";
    echo "1. Visit the page URL above in WordPress to see the backend\n";
    echo "2. Visit your NextJS frontend with the same slug: /debug-text-image-alternating\n";
    echo "3. Check the debug output to see what data is being received\n";
    echo "4. If the debug component shows the data correctly, switch back to the main component\n";
    
} else {
    echo "❌ Failed to create/update test page\n";
}
?>