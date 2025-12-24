<?php
/**
 * Test Both Posts and Case Studies
 * 
 * This script tests both regular posts and case studies to ensure both work in the Stories & Blog Block
 * 
 * Access this file via: http://your-site.com/test-posts-and-case-studies.php
 */

// Include WordPress
require_once('wp-load.php');

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Posts and Case Studies</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 1px solid #ccc; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        .info { color: blue; }
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    </style>
</head>
<body>

<h1>Test Posts and Case Studies</h1>

<div class="test-section">
<h2>1. Regular Posts Test</h2>
<?php
$regular_posts = get_posts([
    'post_type' => 'post',
    'post_status' => 'publish',
    'numberposts' => 5
]);

if (!empty($regular_posts)) {
    echo "<div class='success'>✅ Found " . count($regular_posts) . " regular posts</div>\n";
    echo "<table>\n";
    echo "<tr><th>ID</th><th>Title</th><th>Date</th><th>Categories</th></tr>\n";
    foreach ($regular_posts as $post) {
        $categories = get_the_category($post->ID);
        $cat_names = array_map(function($cat) { return $cat->name; }, $categories);
        echo "<tr>";
        echo "<td>" . $post->ID . "</td>";
        echo "<td>" . $post->post_title . "</td>";
        echo "<td>" . $post->post_date . "</td>";
        echo "<td>" . implode(', ', $cat_names) . "</td>";
        echo "</tr>\n";
    }
    echo "</table>\n";
} else {
    echo "<div class='warning'>⚠️ No regular posts found</div>\n";
    echo "<p><a href='create-test-posts.php'>Create some test posts</a></p>\n";
}
?>
</div>

<div class="test-section">
<h2>2. Case Studies Test</h2>
<?php
$case_studies = get_posts([
    'post_type' => 'case_study',
    'post_status' => 'publish',
    'numberposts' => 5
]);

if (!empty($case_studies)) {
    echo "<div class='success'>✅ Found " . count($case_studies) . " case studies</div>\n";
    echo "<table>\n";
    echo "<tr><th>ID</th><th>Title</th><th>Date</th><th>Categories</th></tr>\n";
    foreach ($case_studies as $post) {
        $categories = get_the_category($post->ID);
        $cat_names = array_map(function($cat) { return $cat->name; }, $categories);
        echo "<tr>";
        echo "<td>" . $post->ID . "</td>";
        echo "<td>" . $post->post_title . "</td>";
        echo "<td>" . $post->post_date . "</td>";
        echo "<td>" . implode(', ', $cat_names) . "</td>";
        echo "</tr>\n";
    }
    echo "</table>\n";
} else {
    echo "<div class='warning'>⚠️ No case studies found</div>\n";
    echo "<p><a href='create-test-case-studies.php'>Create some test case studies</a></p>\n";
}
?>
</div>

<div class="test-section">
<h2>3. API Endpoint Tests</h2>

<h3>3.1 Regular Posts API</h3>
<?php
$posts_url = home_url('/wp-json/wp/v2/posts?per_page=4&_embed=true');
echo "<p>Testing: <code>$posts_url</code></p>\n";

$response = wp_remote_get($posts_url);
if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (is_array($data)) {
        echo "<div class='success'>✅ Regular posts API working - Found " . count($data) . " posts</div>\n";
    } else {
        echo "<div class='error'>❌ Regular posts API returned invalid data</div>\n";
    }
} else {
    echo "<div class='error'>❌ Regular posts API failed: " . $response->get_error_message() . "</div>\n";
}
?>

<h3>3.2 Case Studies API</h3>
<?php
$case_studies_url = home_url('/wp-json/wp/v2/case_study?per_page=4&_embed=true');
echo "<p>Testing: <code>$case_studies_url</code></p>\n";

$response = wp_remote_get($case_studies_url);
if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (is_array($data)) {
        echo "<div class='success'>✅ Case studies API working - Found " . count($data) . " case studies</div>\n";
    } else {
        echo "<div class='error'>❌ Case studies API returned invalid data</div>\n";
    }
} else {
    echo "<div class='error'>❌ Case studies API failed: " . $response->get_error_message() . "</div>\n";
}
?>

<h3>3.3 Custom Posts-Data Endpoint</h3>
<?php
// Test regular posts
$custom_url = home_url('/wp-json/wp/v2/posts-data');
echo "<p>Testing posts via custom endpoint: <code>$custom_url</code></p>\n";

$response = wp_remote_post($custom_url, [
    'headers' => ['Content-Type' => 'application/json'],
    'body' => json_encode([
        'post_type' => 'post',
        'per_page' => 4
    ])
]);

if (!is_wp_error($response)) {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (is_array($data)) {
        echo "<div class='success'>✅ Custom endpoint for posts working - Found " . count($data) . " posts</div>\n";
    } else {
        echo "<div class='error'>❌ Custom endpoint for posts returned invalid data</div>\n";
    }
} else {
    echo "<div class='error'>❌ Custom endpoint for posts failed: " . $response->get_error_message() . "</div>\n";
}

// Test case studies
echo "<p>Testing case studies via custom endpoint: <code>$custom_url</code></p>\n";

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
        echo "<div class='success'>✅ Custom endpoint for case studies working - Found " . count($data) . " case studies</div>\n";
    } else {
        echo "<div class='error'>❌ Custom endpoint for case studies returned invalid data</div>\n";
    }
} else {
    echo "<div class='error'>❌ Custom endpoint for case studies failed: " . $response->get_error_message() . "</div>\n";
}
?>
</div>

<div class="test-section">
<h2>4. Categories Test</h2>
<?php
$all_categories = get_terms([
    'taxonomy' => 'category',
    'hide_empty' => false
]);

if (!empty($all_categories)) {
    echo "<div class='success'>✅ Found " . count($all_categories) . " categories</div>\n";
    echo "<table>\n";
    echo "<tr><th>ID</th><th>Name</th><th>Slug</th><th>Count</th></tr>\n";
    foreach ($all_categories as $category) {
        echo "<tr>";
        echo "<td>" . $category->term_id . "</td>";
        echo "<td>" . $category->name . "</td>";
        echo "<td>" . $category->slug . "</td>";
        echo "<td>" . $category->count . "</td>";
        echo "</tr>\n";
    }
    echo "</table>\n";
} else {
    echo "<div class='warning'>⚠️ No categories found</div>\n";
}
?>
</div>

<h2>Summary</h2>
<p>Both post types should now work in the Stories & Blog Block:</p>
<ul>
    <li><strong>Posts</strong>: Uses standard WordPress REST API (<code>/wp/v2/posts</code>)</li>
    <li><strong>Case Studies</strong>: Uses custom post type REST API (<code>/wp/v2/case_study</code>)</li>
    <li><strong>Fallback</strong>: Custom posts-data endpoint for both types</li>
</ul>

<p><strong>Next Steps:</strong></p>
<ol>
    <li>If no regular posts exist, create some test posts</li>
    <li>Test the Stories & Blog Block with both post types</li>
    <li>Check browser console for any API errors</li>
</ol>

</body>
</html>