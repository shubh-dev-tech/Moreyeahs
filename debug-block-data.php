<?php
/**
 * Debug Block Data - Check what data is being sent to NextJS
 */

// WordPress bootstrap
require_once('wp-config.php');
require_once('wp-load.php');

echo "=== Debug Block Data ===\n\n";

// Find a page/post that uses our block
$posts = get_posts(array(
    'post_type' => array('post', 'page'),
    'post_status' => 'publish',
    'posts_per_page' => 10,
    'meta_query' => array(
        array(
            'key' => '_wp_page_template',
            'compare' => 'EXISTS'
        )
    )
));

echo "Found " . count($posts) . " posts to check\n\n";

foreach ($posts as $post) {
    echo "Checking post: " . $post->post_title . " (ID: " . $post->ID . ")\n";
    
    // Parse blocks
    $blocks = parse_blocks($post->post_content);
    
    foreach ($blocks as $block) {
        if ($block['blockName'] === 'acf/text-image-alternating-block') {
            echo "✅ Found our block!\n";
            echo "Block data:\n";
            print_r($block);
            
            // Get ACF fields for this block
            if (function_exists('get_fields')) {
                $fields = get_fields($post->ID);
                echo "\nACF Fields:\n";
                print_r($fields);
            }
            
            echo "\n" . str_repeat("=", 50) . "\n";
        }
    }
}

// Also test direct field access
echo "\n=== Testing Direct Field Access ===\n";

// Create a test post with our block
$test_post_id = wp_insert_post(array(
    'post_title' => 'Test Text Image Alternating Block',
    'post_content' => '<!-- wp:acf/text-image-alternating-block {"id":"block_123","data":{"main_heading":"Test Heading","main_subheading":"Test Subheading","content_sections":[{"layout_type":"text-left","text_content":"Test content","section_image":{"url":"https://via.placeholder.com/400x200","alt":"Test Image"}}]}} /-->',
    'post_status' => 'draft',
    'post_type' => 'page'
));

if ($test_post_id) {
    echo "Created test post ID: $test_post_id\n";
    
    // Update ACF fields manually
    update_field('main_heading', 'Test Heading', $test_post_id);
    update_field('main_subheading', 'Test Subheading', $test_post_id);
    update_field('content_sections', array(
        array(
            'layout_type' => 'text-left',
            'text_content' => 'We don\'t sell technology — we solve business problems.',
            'section_image' => array(
                'url' => 'https://via.placeholder.com/400x200/0066cc/ffffff?text=Test+Image',
                'alt' => 'Test Image'
            )
        )
    ), $test_post_id);
    
    // Test field retrieval
    $main_heading = get_field('main_heading', $test_post_id);
    $main_subheading = get_field('main_subheading', $test_post_id);
    $content_sections = get_field('content_sections', $test_post_id);
    
    echo "Retrieved fields:\n";
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
    
    // Clean up
    wp_delete_post($test_post_id, true);
    echo "Test post deleted\n";
}

echo "\n=== Debug Complete ===\n";
?>