<?php
/**
 * Test Case Study Template Setup
 * 
 * This file tests if the case study template system is working correctly.
 * Run this by visiting: http://your-site.com/test-case-study-template.php
 */

// Include WordPress
require_once('wp-load.php');

echo "<h1>Case Study Template Test</h1>";

// Test 1: Check if ACF is active
echo "<h2>1. ACF Plugin Status</h2>";
if (function_exists('get_field')) {
    echo "✅ ACF is active and working<br>";
} else {
    echo "❌ ACF is not active or not installed<br>";
}

// Test 2: Check if case study post type exists
echo "<h2>2. Case Study Post Type</h2>";
if (post_type_exists('case_study')) {
    echo "✅ Case study post type is registered<br>";
} else {
    echo "❌ Case study post type is not registered<br>";
}

// Test 3: Check if ACF field group exists
echo "<h2>3. ACF Field Group</h2>";
if (function_exists('acf_get_field_group')) {
    $field_group = acf_get_field_group('group_case_study_template');
    if ($field_group) {
        echo "✅ Case Study Template field group exists<br>";
        echo "Field group title: " . $field_group['title'] . "<br>";
    } else {
        echo "❌ Case Study Template field group not found<br>";
    }
} else {
    echo "❌ ACF function acf_get_field_group not available<br>";
}

// Test 4: Check template functions
echo "<h2>4. Template Functions</h2>";
if (function_exists('set_case_study_default_fields')) {
    echo "✅ Template functions are loaded<br>";
} else {
    echo "❌ Template functions are not loaded<br>";
}

// Test 5: List existing case studies
echo "<h2>5. Existing Case Studies</h2>";
$case_studies = get_posts(array(
    'post_type' => 'case_study',
    'post_status' => 'any',
    'numberposts' => 5
));

if ($case_studies) {
    echo "Found " . count($case_studies) . " case studies:<br>";
    foreach ($case_studies as $case_study) {
        echo "- " . $case_study->post_title . " (Status: " . $case_study->post_status . ")<br>";
        
        // Check if it has ACF fields
        $header_section = get_field('header_section', $case_study->ID);
        if ($header_section) {
            echo "  ✅ Has template fields<br>";
        } else {
            echo "  ❌ No template fields found<br>";
        }
    }
} else {
    echo "No case studies found<br>";
}

// Test 6: WordPress REST API
echo "<h2>6. REST API Test</h2>";
$rest_url = home_url('/wp-json/wp/v2/case_study');
echo "REST API URL: <a href='{$rest_url}' target='_blank'>{$rest_url}</a><br>";

// Test 7: Theme files
echo "<h2>7. Theme Files</h2>";
$template_file = get_stylesheet_directory() . '/inc/case-study-template.php';
if (file_exists($template_file)) {
    echo "✅ Template file exists: {$template_file}<br>";
} else {
    echo "❌ Template file missing: {$template_file}<br>";
}

$acf_json_file = get_stylesheet_directory() . '/acf-json/group_case_study_template.json';
if (file_exists($acf_json_file)) {
    echo "✅ ACF JSON file exists: {$acf_json_file}<br>";
} else {
    echo "❌ ACF JSON file missing: {$acf_json_file}<br>";
}

echo "<h2>Summary</h2>";
echo "<p>If all tests show ✅, your case study template system is ready to use!</p>";
echo "<p>To create a new case study:</p>";
echo "<ol>";
echo "<li>Go to WordPress Admin > Case Studies > Add New</li>";
echo "<li>Fill out the template fields</li>";
echo "<li>Publish the case study</li>";
echo "<li>View it on the frontend at /case-study/your-slug</li>";
echo "</ol>";
?>