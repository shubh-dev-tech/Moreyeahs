<?php
/**
 * Create Test Regular Posts
 * 
 * This script creates sample regular posts for testing the Stories & Blog Block
 * 
 * Access this file via: http://your-site.com/create-test-posts.php
 */

// Include WordPress
require_once('wp-load.php');

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Create Test Posts</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>

<h1>Create Test Regular Posts</h1>

<?php
// Check if we should create posts
if (isset($_GET['create']) && $_GET['create'] === 'yes') {
    
    // Sample post data
    $posts = [
        [
            'title' => 'Getting Started with DevOps: A Comprehensive Guide',
            'content' => 'DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.',
            'excerpt' => 'Learn the fundamentals of DevOps and how to implement it in your organization.',
            'category' => 'DevOps'
        ],
        [
            'title' => 'Cloud Migration Strategies for Modern Businesses',
            'content' => 'Moving to the cloud can be challenging, but with the right strategy, it can transform your business. This guide covers the key considerations and best practices for successful cloud migration.',
            'excerpt' => 'Discover effective strategies for migrating your business to the cloud.',
            'category' => 'Cloud Computing'
        ],
        [
            'title' => 'Agile Methodology: Transforming Software Development',
            'content' => 'Agile methodology has revolutionized software development by emphasizing iterative development, team collaboration, and customer feedback. Learn how to implement Agile in your projects.',
            'excerpt' => 'Explore how Agile methodology can improve your development process.',
            'category' => 'Agile'
        ],
        [
            'title' => 'The Future of Digital Transformation',
            'content' => 'Digital transformation is no longer optional for businesses. It\'s essential for staying competitive in today\'s market. This article explores the latest trends and technologies driving digital transformation.',
            'excerpt' => 'Stay ahead with the latest digital transformation trends.',
            'category' => 'Digital Transformation'
        ],
        [
            'title' => 'Cybersecurity Best Practices for Remote Teams',
            'content' => 'With remote work becoming the norm, cybersecurity has become more important than ever. Learn the essential security practices to protect your remote team and data.',
            'excerpt' => 'Essential cybersecurity tips for remote work environments.',
            'category' => 'Cybersecurity'
        ]
    ];
    
    $created_count = 0;
    $categories_created = [];
    
    foreach ($posts as $post_data) {
        // Create or get category
        $category_id = null;
        $category = get_term_by('name', $post_data['category'], 'category');
        if (!$category) {
            $result = wp_insert_term($post_data['category'], 'category');
            if (!is_wp_error($result)) {
                $category_id = $result['term_id'];
                $categories_created[] = $post_data['category'];
            }
        } else {
            $category_id = $category->term_id;
        }
        
        // Create post
        $post_args = [
            'post_title' => $post_data['title'],
            'post_content' => $post_data['content'],
            'post_excerpt' => $post_data['excerpt'],
            'post_status' => 'publish',
            'post_type' => 'post',
            'post_author' => 1
        ];
        
        $post_id = wp_insert_post($post_args);
        
        if (!is_wp_error($post_id) && $post_id > 0) {
            // Assign category
            if ($category_id) {
                wp_set_post_categories($post_id, [$category_id]);
            }
            
            $created_count++;
            echo "<div class='success'>✅ Created post: " . $post_data['title'] . " (ID: $post_id)</div>\n";
        } else {
            echo "<div class='error'>❌ Failed to create: " . $post_data['title'] . "</div>\n";
        }
    }
    
    echo "<h2>Summary</h2>\n";
    echo "<div class='success'>Created $created_count regular posts</div>\n";
    
    if (!empty($categories_created)) {
        echo "<div class='info'>Created categories: " . implode(', ', $categories_created) . "</div>\n";
    }
    
    echo "<p><a href='test-posts-and-case-studies.php'>Run Full Test</a> to verify everything is working.</p>\n";
    
} else {
    // Show form to create posts
    $existing_posts = get_posts([
        'post_type' => 'post',
        'post_status' => 'publish',
        'numberposts' => -1
    ]);
    
    echo "<p>Current regular posts: " . count($existing_posts) . "</p>\n";
    
    if (count($existing_posts) > 0) {
        echo "<h3>Existing Posts:</h3>\n";
        echo "<ul>\n";
        foreach (array_slice($existing_posts, 0, 10) as $post) {
            echo "<li>" . $post->post_title . "</li>\n";
        }
        if (count($existing_posts) > 10) {
            echo "<li>... and " . (count($existing_posts) - 10) . " more</li>\n";
        }
        echo "</ul>\n";
    }
    
    echo "<p>This will create 5 sample regular posts with categories for testing.</p>\n";
    echo "<p><a href='?create=yes' style='background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;'>Create Test Posts</a></p>\n";
}
?>

</body>
</html>