<?php
/**
 * Create Test Case Study Posts
 * 
 * This script creates sample case study posts for testing the Stories & Blog Block
 * 
 * Access this file via: http://your-site.com/create-test-case-studies.php
 */

// Include WordPress
require_once('wp-load.php');

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Create Test Case Studies</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
    </style>
</head>
<body>

<h1>Create Test Case Studies</h1>

<?php
// Check if we should create posts
if (isset($_GET['create']) && $_GET['create'] === 'yes') {
    
    // Sample case study data
    $case_studies = [
        [
            'title' => 'Digital Transformation for Global Manufacturing Company',
            'content' => 'We helped a leading manufacturing company modernize their operations through comprehensive digital transformation, implementing DevOps practices and cloud migration strategies.',
            'excerpt' => 'Complete digital transformation journey for a global manufacturing leader.',
            'category' => 'Digital Transformation'
        ],
        [
            'title' => 'Cloud Migration Success Story for Financial Services',
            'content' => 'A major financial services firm successfully migrated their entire infrastructure to the cloud with zero downtime, improving scalability and reducing costs by 40%.',
            'excerpt' => 'Seamless cloud migration with significant cost savings.',
            'category' => 'Cloud Migration'
        ],
        [
            'title' => 'DevOps Implementation for E-commerce Platform',
            'content' => 'Implementation of comprehensive DevOps practices for a high-traffic e-commerce platform, resulting in 90% faster deployment cycles and improved reliability.',
            'excerpt' => 'DevOps transformation leading to faster deployments.',
            'category' => 'DevOps'
        ],
        [
            'title' => 'Agile Transformation for Healthcare Organization',
            'content' => 'Guided a healthcare organization through complete Agile transformation, improving project delivery times by 60% and enhancing team collaboration.',
            'excerpt' => 'Agile methodology adoption in healthcare sector.',
            'category' => 'Agile Transformation'
        ]
    ];
    
    $created_count = 0;
    $categories_created = [];
    
    foreach ($case_studies as $case_study) {
        // Create or get category
        $category_id = null;
        $category = get_term_by('name', $case_study['category'], 'category');
        if (!$category) {
            $result = wp_insert_term($case_study['category'], 'category');
            if (!is_wp_error($result)) {
                $category_id = $result['term_id'];
                $categories_created[] = $case_study['category'];
            }
        } else {
            $category_id = $category->term_id;
        }
        
        // Create case study post
        $post_data = [
            'post_title' => $case_study['title'],
            'post_content' => $case_study['content'],
            'post_excerpt' => $case_study['excerpt'],
            'post_status' => 'publish',
            'post_type' => 'case_study',
            'post_author' => 1
        ];
        
        $post_id = wp_insert_post($post_data);
        
        if (!is_wp_error($post_id) && $post_id > 0) {
            // Assign category
            if ($category_id) {
                wp_set_post_categories($post_id, [$category_id]);
            }
            
            $created_count++;
            echo "<div class='success'>✅ Created case study: " . $case_study['title'] . " (ID: $post_id)</div>\n";
        } else {
            echo "<div class='error'>❌ Failed to create: " . $case_study['title'] . "</div>\n";
        }
    }
    
    echo "<h2>Summary</h2>\n";
    echo "<div class='success'>Created $created_count case study posts</div>\n";
    
    if (!empty($categories_created)) {
        echo "<div class='info'>Created categories: " . implode(', ', $categories_created) . "</div>\n";
    }
    
    echo "<p><a href='test-case-study-api.php'>Run API Test</a> to verify everything is working.</p>\n";
    
} else {
    // Show form to create posts
    $existing_posts = get_posts([
        'post_type' => 'case_study',
        'post_status' => 'publish',
        'numberposts' => -1
    ]);
    
    echo "<p>Current case study posts: " . count($existing_posts) . "</p>\n";
    
    if (count($existing_posts) > 0) {
        echo "<h3>Existing Case Studies:</h3>\n";
        echo "<ul>\n";
        foreach ($existing_posts as $post) {
            echo "<li>" . $post->post_title . "</li>\n";
        }
        echo "</ul>\n";
    }
    
    echo "<p>This will create 4 sample case study posts with categories for testing.</p>\n";
    echo "<p><a href='?create=yes' style='background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;'>Create Test Case Studies</a></p>\n";
}
?>

</body>
</html>