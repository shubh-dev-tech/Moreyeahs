<?php
/**
 * Test WordPress Menu API
 * Place this file in your WordPress root and visit it in browser
 */

// Load WordPress
require_once('wp-load.php');

header('Content-Type: application/json');

// Get menu location
$locations = get_nav_menu_locations();
echo "Menu Locations:\n";
print_r($locations);
echo "\n\n";

if (isset($locations['primary'])) {
    $menu_id = $locations['primary'];
    echo "Primary Menu ID: $menu_id\n\n";
    
    // Get menu items
    $menu_items = wp_get_nav_menu_items($menu_id);
    echo "Menu Items Count: " . count($menu_items) . "\n\n";
    
    echo "Raw Menu Items:\n";
    foreach ($menu_items as $item) {
        echo "- ID: {$item->ID}, Title: {$item->title}, URL: {$item->url}, Parent: {$item->menu_item_parent}\n";
    }
    
    echo "\n\nFormatted Output:\n";
    echo json_encode($menu_items, JSON_PRETTY_PRINT);
} else {
    echo "No primary menu location found!";
}
