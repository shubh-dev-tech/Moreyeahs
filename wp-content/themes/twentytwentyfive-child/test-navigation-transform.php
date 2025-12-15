<?php
/**
 * Test script for navigation-next-block transformation
 * Run this by visiting: http://localhost/moreyeahs-new/wp-content/themes/twentytwentyfive/test-navigation-transform.php
 */

// Include WordPress
require_once('../../../wp-load.php');

// Include the REST API endpoints file
require_once('inc/rest-api-endpoints.php');

// Test data
$test_data = [
    "regions_0_name" => "Europe",
    "_regions_0_name" => "field_navigation_next_region_name",
    "regions_0_link" => "#",
    "_regions_0_link" => "field_navigation_next_region_link",
    "regions_1_name" => "Asia Pacific",
    "_regions_1_name" => "field_navigation_next_region_name",
    "regions_1_link" => "#",
    "_regions_1_link" => "field_navigation_next_region_link",
    "regions_2_name" => "Americas",
    "_regions_2_name" => "field_navigation_next_region_name",
    "regions_2_link" => "#",
    "_regions_2_link" => "field_navigation_next_region_link",
    "regions_3_name" => "Middle East and Africa",
    "_regions_3_name" => "field_navigation_next_region_name",
    "regions_3_link" => "#",
    "_regions_3_link" => "field_navigation_next_region_link",
    "regions" => 4,
    "_regions" => "field_navigation_next_regions",
    "heading" => "Let's help you navigate your next 1",
    "_heading" => "field_navigation_next_heading",
    "button_text" => "CONTACT US",
    "_button_text" => "field_navigation_next_button_text",
    "button_link" => "#",
    "_button_link" => "field_navigation_next_button_link"
];

echo "<h1>Navigation Next Block Transformation Test</h1>";

echo "<h2>Original Data:</h2>";
echo "<pre>" . print_r($test_data, true) . "</pre>";

// Check if function exists
if (function_exists('transform_navigation_next_block_data')) {
    echo "<h2>Function exists: YES</h2>";
    
    // Test the transformation
    $result = transform_navigation_next_block_data($test_data);
    
    echo "<h2>Transformed Data:</h2>";
    echo "<pre>" . print_r($result, true) . "</pre>";
    
    // Check if regions are properly structured
    if (isset($result['regions']) && is_array($result['regions'])) {
        echo "<h2>✅ Transformation Successful!</h2>";
        echo "<p>Number of regions: " . count($result['regions']) . "</p>";
        foreach ($result['regions'] as $index => $region) {
            echo "<p>Region " . ($index + 1) . ": " . $region['name'] . " (" . ($region['link'] ?? 'No link') . ")</p>";
        }
    } else {
        echo "<h2>❌ Transformation Failed</h2>";
        echo "<p>Regions data is not properly structured</p>";
    }
} else {
    echo "<h2>Function exists: NO</h2>";
    echo "<p>The transform_navigation_next_block_data function is not defined.</p>";
}
?>