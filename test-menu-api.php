<?php
/**
 * Test Menu API
 * Check if menus are being returned correctly by the API
 */

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>Menu API Test</h1>";

// Test 1: Check registered menu locations
echo "<h2>1. Registered Menu Locations</h2>";

$locations = get_registered_nav_menus();
echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
echo "<tr><th>Location Key</th><th>Display Name</th><th>Assigned Menu</th></tr>";

$nav_menu_locations = get_nav_menu_locations();

foreach ($locations as $location => $description) {
    $menu_id = isset($nav_menu_locations[$location]) ? $nav_menu_locations[$location] : null;
    $menu_name = $menu_id ? wp_get_nav_menu_object($menu_id)->name : 'Not assigned';
    
    echo "<tr>";
    echo "<td><strong>{$location}</strong></td>";
    echo "<td>{$description}</td>";
    echo "<td>" . ($menu_id ? "{$menu_name} (ID: {$menu_id})" : '<span style="color: red;">Not assigned</span>') . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test 2: Check all available menus
echo "<h2>2. All Available Menus</h2>";

$all_menus = wp_get_nav_menus();
echo "<p>Found " . count($all_menus) . " menus:</p>";

if (!empty($all_menus)) {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
    echo "<tr><th>Menu ID</th><th>Menu Name</th><th>Slug</th><th>Item Count</th><th>Locations</th></tr>";
    
    foreach ($all_menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $item_count = $menu_items ? count($menu_items) : 0;
        
        // Find which locations this menu is assigned to
        $assigned_locations = [];
        foreach ($nav_menu_locations as $location => $assigned_menu_id) {
            if ($assigned_menu_id == $menu->term_id) {
                $assigned_locations[] = $location;
            }
        }
        
        echo "<tr>";
        echo "<td>{$menu->term_id}</td>";
        echo "<td><strong>{$menu->name}</strong></td>";
        echo "<td>{$menu->slug}</td>";
        echo "<td>{$item_count}</td>";
        echo "<td>" . (empty($assigned_locations) ? '<span style="color: orange;">Unassigned</span>' : implode(', ', $assigned_locations)) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p style='color: red;'>❌ No menus found! You need to create menus in WordPress admin.</p>";
}

// Test 3: Test API endpoints
echo "<h2>3. API Endpoint Tests</h2>";

$base_url = get_site_url();
$endpoints = [
    'All Menus' => '/wp-json/wp/v2/menus',
    'Primary Menu' => '/wp-json/wp/v2/menus/primary',
    'Second Menu (Burger)' => '/wp-json/wp/v2/menus/second-menu',
    'Footer Menu' => '/wp-json/wp/v2/menus/footer'
];

foreach ($endpoints as $name => $endpoint) {
    $url = $base_url . $endpoint;
    echo "<h3>{$name}</h3>";
    echo "<p><strong>URL:</strong> <a href='{$url}' target='_blank'>{$url}</a></p>";
    
    $response = wp_remote_get($url);
    
    if (is_wp_error($response)) {
        echo "<p style='color: red;'>❌ Error: " . $response->get_error_message() . "</p>";
    } else {
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);
        
        if (isset($data['code']) && $data['code'] === 'no_menu') {
            echo "<p style='color: orange;'>⚠️ No menu assigned to this location</p>";
        } elseif (is_array($data)) {
            if (isset($data['items'])) {
                // Single menu response
                echo "<p style='color: green;'>✅ Menu found with " . count($data['items']) . " items</p>";
                
                if (!empty($data['items'])) {
                    echo "<ul>";
                    foreach ($data['items'] as $item) {
                        echo "<li><strong>{$item['title']}</strong> → {$item['url']}";
                        if (!empty($item['children'])) {
                            echo " (" . count($item['children']) . " children)";
                        }
                        echo "</li>";
                    }
                    echo "</ul>";
                }
            } else {
                // All menus response
                echo "<p style='color: green;'>✅ Found " . count($data) . " menus</p>";
                foreach ($data as $menu) {
                    echo "<p>• <strong>{$menu['name']}</strong> ({$menu['id']}) - " . count($menu['items']) . " items</p>";
                }
            }
        } else {
            echo "<p style='color: red;'>❌ Unexpected response format</p>";
        }
        
        echo "<details style='margin: 10px 0;'>";
        echo "<summary>View Raw Response</summary>";
        echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 3px; overflow-x: auto; max-height: 300px;'>";
        echo htmlspecialchars(json_encode($data, JSON_PRETTY_PRINT));
        echo "</pre>";
        echo "</details>";
    }
}

// Test 4: Check theme support and menu registration
echo "<h2>4. Theme Support Check</h2>";

echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
echo "<tr><th>Feature</th><th>Status</th></tr>";

$features = [
    'Menus' => current_theme_supports('menus'),
    'Custom Logo' => current_theme_supports('custom-logo'),
    'Site Icon' => current_theme_supports('site-icon'),
    'HTML5' => current_theme_supports('html5'),
    'Post Thumbnails' => current_theme_supports('post-thumbnails')
];

foreach ($features as $feature => $supported) {
    echo "<tr>";
    echo "<td><strong>{$feature}</strong></td>";
    echo "<td>" . ($supported ? '✅ Supported' : '❌ Not supported') . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test 5: Menu creation helper
echo "<h2>5. Quick Menu Creation</h2>";

if (empty($all_menus)) {
    echo "<div style='background: #fff3cd; padding: 15px; border: 1px solid #ffeaa7; border-radius: 5px; margin: 10px 0;'>";
    echo "<h3>No Menus Found - Create Sample Menus</h3>";
    echo "<p>It looks like you don't have any menus created. Click the buttons below to create sample menus:</p>";
    
    if (isset($_GET['create_sample_menus'])) {
        // Create sample menus
        $sample_menus = [
            'primary' => [
                'name' => 'Primary Menu',
                'items' => [
                    ['title' => 'Home', 'url' => home_url('/')],
                    ['title' => 'About', 'url' => home_url('/about')],
                    ['title' => 'Services', 'url' => home_url('/services')],
                    ['title' => 'Contact', 'url' => home_url('/contact')]
                ]
            ],
            'second-menu' => [
                'name' => 'Burger Menu',
                'items' => [
                    ['title' => 'Home', 'url' => home_url('/')],
                    ['title' => 'About', 'url' => home_url('/about')],
                    ['title' => 'Services', 'url' => home_url('/services')],
                    ['title' => 'Blog', 'url' => home_url('/blog')],
                    ['title' => 'Contact', 'url' => home_url('/contact')]
                ]
            ],
            'footer' => [
                'name' => 'Footer Menu',
                'items' => [
                    ['title' => 'Privacy Policy', 'url' => home_url('/privacy')],
                    ['title' => 'Terms of Service', 'url' => home_url('/terms')],
                    ['title' => 'Sitemap', 'url' => home_url('/sitemap')]
                ]
            ]
        ];
        
        foreach ($sample_menus as $location => $menu_data) {
            // Create menu
            $menu_id = wp_create_nav_menu($menu_data['name']);
            
            if (!is_wp_error($menu_id)) {
                // Add menu items
                foreach ($menu_data['items'] as $item_data) {
                    wp_update_nav_menu_item($menu_id, 0, [
                        'menu-item-title' => $item_data['title'],
                        'menu-item-url' => $item_data['url'],
                        'menu-item-status' => 'publish',
                        'menu-item-type' => 'custom'
                    ]);
                }
                
                // Assign to location
                $locations = get_theme_mod('nav_menu_locations');
                $locations[$location] = $menu_id;
                set_theme_mod('nav_menu_locations', $locations);
                
                echo "<p style='color: green;'>✅ Created and assigned '{$menu_data['name']}' to '{$location}' location</p>";
            } else {
                echo "<p style='color: red;'>❌ Failed to create '{$menu_data['name']}': " . $menu_id->get_error_message() . "</p>";
            }
        }
        
        echo "<p><a href='?' style='background: #0073aa; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;'>Refresh Test</a></p>";
    } else {
        echo "<p><a href='?create_sample_menus=1' style='background: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;'>Create Sample Menus</a></p>";
    }
    echo "</div>";
}

echo "<hr>";
echo "<p><strong>Actions:</strong></p>";
echo "<p>";
echo "<a href='?' style='background: #0073aa; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>Refresh Test</a>";
echo "<a href='" . admin_url('nav-menus.php') . "' style='background: #6c757d; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>WordPress Menus</a>";
echo "<a href='{$base_url}/wp-json/wp/v2/menus' target='_blank' style='background: #28a745; color: white; padding: 10px 15px; text-decoration: none;'>View All Menus API</a>";
echo "</p>";

?>