<?php
/**
 * Test ACF Dynamic Field Population
 * 
 * This script tests if the dynamic post type and category population is working
 * 
 * Access this file via: http://your-site.com/test-acf-dynamic-fields.php
 */

// Include WordPress
require_once('wp-load.php');

// Set content type to HTML
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test ACF Dynamic Fields</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        h2 { color: #666; border-bottom: 1px solid #ccc; }
        .success { color: green; }
        .error { color: red; }
        .warning { color: orange; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<h1>Test ACF Dynamic Fields</h1>

<?php
// Test the populate_post_type_choices function
echo "<h2>1. Post Type Choices</h2>\n";

// Simulate the ACF field structure
$field = [
    'choices' => []
];

// Call the function that should populate post types
if (function_exists('populate_post_type_choices')) {
    $field = populate_post_type_choices($field);
    
    if (!empty($field['choices'])) {
        echo "<div class='success'>✅ Post type choices populated successfully</div>\n";
        echo "<table>\n";
        echo "<tr><th>Post Type Key</th><th>Post Type Label</th></tr>\n";
        foreach ($field['choices'] as $key => $label) {
            echo "<tr><td>$key</td><td>$label</td></tr>\n";
        }
        echo "</table>\n";
        
        // Check if case_study is included
        if (isset($field['choices']['case_study'])) {
            echo "<div class='success'>✅ Case Study post type is included</div>\n";
        } else {
            echo "<div class='error'>❌ Case Study post type is NOT included</div>\n";
        }
    } else {
        echo "<div class='error'>❌ No post type choices found</div>\n";
    }
} else {
    echo "<div class='error'>❌ populate_post_type_choices function not found</div>\n";
}

// Test the populate_category_choices function
echo "<h2>2. Category Choices for Case Study</h2>\n";

// Simulate the ACF field structure for categories
$category_field = [
    'choices' => []
];

// Simulate POST data for case_study post type
$_POST['acf']['field_stories_post_type'] = 'case_study';

if (function_exists('populate_category_choices')) {
    $category_field = populate_category_choices($category_field);
    
    if (!empty($category_field['choices'])) {
        echo "<div class='success'>✅ Category choices populated for case_study</div>\n";
        echo "<table>\n";
        echo "<tr><th>Category ID</th><th>Category Name</th></tr>\n";
        foreach ($category_field['choices'] as $key => $label) {
            echo "<tr><td>" . ($key ?: 'empty') . "</td><td>$label</td></tr>\n";
        }
        echo "</table>\n";
    } else {
        echo "<div class='warning'>⚠️ No category choices found for case_study</div>\n";
        echo "<p>This might be because:</p>\n";
        echo "<ul>\n";
        echo "<li>Case study post type has no taxonomies assigned</li>\n";
        echo "<li>No categories exist for case studies</li>\n";
        echo "</ul>\n";
    }
} else {
    echo "<div class='error'>❌ populate_category_choices function not found</div>\n";
}

// Clean up POST data
unset($_POST['acf']['field_stories_post_type']);

// Test taxonomies for case_study
echo "<h2>3. Taxonomies for Case Study Post Type</h2>\n";
$taxonomies = get_object_taxonomies('case_study', 'objects');
if (!empty($taxonomies)) {
    echo "<div class='success'>✅ Case Study has taxonomies</div>\n";
    echo "<table>\n";
    echo "<tr><th>Taxonomy Key</th><th>Taxonomy Label</th><th>Hierarchical</th></tr>\n";
    foreach ($taxonomies as $taxonomy) {
        echo "<tr><td>" . $taxonomy->name . "</td><td>" . $taxonomy->label . "</td><td>" . ($taxonomy->hierarchical ? 'Yes' : 'No') . "</td></tr>\n";
    }
    echo "</table>\n";
} else {
    echo "<div class='error'>❌ Case Study has no taxonomies</div>\n";
    echo "<p>This is the root cause of the issue. Case studies need taxonomies to have categories.</p>\n";
}

// Test if ACF filters are properly hooked
echo "<h2>4. ACF Filter Hooks</h2>\n";
global $wp_filter;

$post_type_filter = isset($wp_filter['acf/load_field/name=post_type']) ? 'Yes' : 'No';
$category_filter = isset($wp_filter['acf/load_field/name=category']) ? 'Yes' : 'No';

echo "<table>\n";
echo "<tr><th>Filter</th><th>Hooked</th></tr>\n";
echo "<tr><td>acf/load_field/name=post_type</td><td>$post_type_filter</td></tr>\n";
echo "<tr><td>acf/load_field/name=category</td><td>$category_filter</td></tr>\n";
echo "</table>\n";

if ($post_type_filter === 'Yes' && $category_filter === 'Yes') {
    echo "<div class='success'>✅ ACF filters are properly hooked</div>\n";
} else {
    echo "<div class='error'>❌ Some ACF filters are missing</div>\n";
}

?>

<h2>Summary</h2>
<p>For the Stories & Blog Block to work with case studies:</p>
<ol>
    <li>Case study post type must be registered ✓</li>
    <li>Case study must have taxonomies (categories) ✓</li>
    <li>ACF filters must be hooked ✓</li>
    <li>Dynamic population functions must work ✓</li>
</ol>

<p><a href="test-case-study-api.php">Run Full API Test</a> | <a href="create-test-case-studies.php">Create Test Posts</a></p>

</body>
</html>