<?php
/**
 * Test Case Study API Endpoints
 * 
 * This file tests the case study post type and its REST API endpoints
 * to ensure the Stories & Blog Block can fetch case study data correctly.
 * 
 * Access this file via: http://your-site.com/test-case-study-api.php
 */

// Include WordPress
require_once('wp-load.php');

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Case Study API Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 1px solid #ccc; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
    </style>
</head>
<body>

<h1>Case Study API Test</h1>

<?php
// Test 1: Check if case study post type is registered
echo "<h2>1. Post Type Registration</h2>\n";
$post_type = get_post_type_object('case_study');
if ($post_type) {
    echo "<div class='success'>✅ Case Study post type is registered</div>\n";
    echo "<ul>\n";
    echo "   <li>Label: " . $post_type->label . "</li>\n";
    echo "   <li>Public: " . ($post_type->public ? 'Yes' : 'No') . "</li>\n";
    echo "   <li>Show in REST: " . ($post_type->show_in_rest ? 'Yes' : 'No') . "</li>\n";
    echo "   <li>REST Base: " . $post_type->rest_base . "</li>\n";
    echo "</ul>\n";
} else {
    echo "<div class='error'>❌ Case Study post type is NOT registered</div>\n";
}

// Test 2: Check taxonomies
echo "<h2>2. Taxonomies</h2>\n";
$taxonomies = get_object_taxonomies('case_study', 'objects');
if (!empty($taxonomies)) {
    echo "<div class='success'>✅ Case Study has taxonomies:</div>\n";
    echo "<ul>\n";
    foreach ($taxonomies as $taxonomy) {
        echo "   <li>" . $taxonomy->label . " (" . $taxonomy->name . ")</li>\n";
    }
    echo "</ul>\n";
} else {
    echo "<div class='error'>❌ Case Study has no taxonomies</div>\n";
}

// Test 3: Check if there are any case study posts
echo "<h2>3. Case Study Posts</h2>\n";
$case_studies = get_posts([
    'post_type' => 'case_study',
    'post_status' => 'publish',
    'numberposts' => 5
]);

if (!empty($case_studies)) {
    echo "<div class='success'>✅ Found " . count($case_studies) . " case study posts:</div>\n";
    echo "<ul>\n";
    foreach ($case_studies as $post) {
        echo "   <li>" . $post->post_title . " (ID: " . $post->ID . ")</li>\n";
    }
    echo "</ul>\n";
} else {
    echo "<div class='warning'>⚠️ No case study posts found</div>\n";
    echo "<p>You may need to create some case study posts first.</p>\n";
}

// Test 4: Test REST API endpoint
echo "<h2>4. REST API Endpoint Test</h2>\n";
$rest_url = home_url('/wp-json/wp/v2/case_study');
echo "<p>Testing endpoint: <code>" . $rest_url . "</code></p>\n";

$response = wp_remote_get($rest_url);
if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (is_array($data)) {
        echo "<div class='success'>✅ REST API endpoint is working</div>\n";
        echo "<p>Found " . count($data) . " case studies via REST API</p>\n";
    } else {
        echo "<div class='error'>❌ REST API returned invalid data</div>\n";
        echo "<pre>" . htmlspecialchars(substr($body, 0, 500)) . "...</pre>\n";
    }
} else {
    echo "<div class='error'>❌ REST API endpoint failed</div>\n";
    echo "<p>Error: " . $response->get_error_message() . "</p>\n";
}

// Test 5: Test custom posts-data endpoint
echo "<h2>5. Custom Posts-Data Endpoint Test</h2>\n";
$custom_url = home_url('/wp-json/wp/v2/posts-data');
echo "<p>Testing endpoint: <code>" . $custom_url . "</code></p>\n";

$response = wp_remote_post($custom_url, [
    'headers' => ['Content-Type' => 'application/json'],
    'body' => json_encode([
        'post_type' => 'case_study',
        'per_page' => 4
    ])
]);

if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (is_array($data)) {
        echo "<div class='success'>✅ Custom posts-data endpoint is working</div>\n";
        echo "<p>Found " . count($data) . " case studies via custom endpoint</p>\n";
        if (!empty($data)) {
            echo "<p>Sample post: " . $data[0]['title']['rendered'] . "</p>\n";
        }
    } else {
        echo "<div class='error'>❌ Custom endpoint returned invalid data</div>\n";
        echo "<pre>" . htmlspecialchars(substr($body, 0, 500)) . "...</pre>\n";
    }
} else {
    echo "<div class='error'>❌ Custom endpoint failed</div>\n";
    echo "<p>Error: " . $response->get_error_message() . "</p>\n";
}

// Test 6: Check categories for case studies
echo "<h2>6. Categories Test</h2>\n";
if (!empty($case_studies)) {
    $categories = get_terms([
        'taxonomy' => 'category',
        'hide_empty' => false,
        'object_ids' => wp_list_pluck($case_studies, 'ID')
    ]);

    if (!empty($categories)) {
        echo "<div class='success'>✅ Found categories used by case studies:</div>\n";
        echo "<ul>\n";
        foreach ($categories as $category) {
            echo "   <li>" . $category->name . " (ID: " . $category->term_id . ")</li>\n";
        }
        echo "</ul>\n";
    } else {
        echo "<div class='warning'>⚠️ No categories found for case studies</div>\n";
    }
} else {
    echo "<div class='warning'>⚠️ Cannot test categories - no case studies exist</div>\n";
}

// Test 7: Check all available post types in Stories Blog Block
echo "<h2>7. Available Post Types for Stories Blog Block</h2>\n";
$post_types = get_post_types(array(
    'public' => true,
    'show_in_rest' => true,
), 'objects');

echo "<div class='success'>✅ Available post types:</div>\n";
echo "<ul>\n";
foreach ($post_types as $pt) {
    if ($pt->name === 'attachment') continue;
    echo "   <li>" . $pt->label . " (" . $pt->name . ") - REST Base: " . $pt->rest_base . "</li>\n";
}
echo "</ul>\n";

?>

<h2>Summary</h2>
<p>If all tests pass, the Stories & Blog Block should be able to:</p>
<ol>
    <li>Show 'Case Study' in the post type dropdown</li>
    <li>Show relevant categories when case study is selected</li>
    <li>Fetch and display case study posts</li>
</ol>

<h2>Next Steps</h2>
<p>If case studies are not showing in the Stories & Blog Block:</p>
<ol>
    <li>Make sure you have created some case study posts</li>
    <li>Assign categories to your case study posts</li>
    <li>Check that the post type appears in the dropdown</li>
    <li>Clear any caches (WordPress cache, browser cache)</li>
</ol>

</body>
</html>