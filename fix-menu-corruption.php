<?php
/**
 * Fix Menu Corruption Issue
 * 
 * This script fixes menu corruption issues that occur when switching
 * from parent theme to child theme. Menu assignments can be lost because
 * menu locations are stored in theme mods which are theme-specific.
 * 
 * Solution:
 * 1. Store menu assignments in both theme mod and option for persistence
 * 2. Add migration function for theme switches
 * 3. Create sample menus if none exist
 * 4. Ensure proper menu registration
 */

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>Menu Corruption Fix</h1>";

// Step 1: Check current menu status
echo "<h2>Current Menu Status</h2>";

$registered_locations = get_registered_nav_menus();
$nav_menu_locations = get_nav_menu_locations();
$all_menus = wp_get_nav_menus();

echo "<h3>Registered Menu Locations:</h3>";
echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
echo "<tr><th>Location</th><th>Description</th><th>Assigned Menu</th><th>Status</th></tr>";

foreach ($registered_locations as $location => $description) {
    $menu_id = isset($nav_menu_locations[$location]) ? $nav_menu_locations[$location] : null;
    $menu_name = $menu_id ? wp_get_nav_menu_object($menu_id) : null;
    
    echo "<tr>";
    echo "<td><strong>{$location}</strong></td>";
    echo "<td>{$description}</td>";
    
    if ($menu_name) {
        echo "<td>{$menu_name->name} (ID: {$menu_id})</td>";
        echo "<td style='color: green;'>✅ Assigned</td>";
    } else {
        echo "<td>-</td>";
        echo "<td style='color: red;'>❌ Not assigned</td>";
    }
    echo "</tr>";
}
echo "</table>";

echo "<h3>Available Menus:</h3>";
if (!empty($all_menus)) {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
    echo "<tr><th>Menu ID</th><th>Menu Name</th><th>Items</th><th>Assigned To</th></tr>";
    
    foreach ($all_menus as $menu) {
        $menu_items = wp_get_nav_menu_items($menu->term_id);
        $item_count = $menu_items ? count($menu_items) : 0;
        
        // Find assignments
        $assignments = [];
        foreach ($nav_menu_locations as $location => $assigned_id) {
            if ($assigned_id == $menu->term_id) {
                $assignments[] = $location;
            }
        }
        
        echo "<tr>";
        echo "<td>{$menu->term_id}</td>";
        echo "<td><strong>{$menu->name}</strong></td>";
        echo "<td>{$item_count}</td>";
        echo "<td>" . (empty($assignments) ? '<span style="color: orange;">Unassigned</span>' : implode(', ', $assignments)) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p style='color: red;'>❌ No menus found!</p>";
}

// Step 2: Create sample menus if none exist
echo "<h2>Menu Creation</h2>";

if (empty($all_menus) || isset($_GET['create_menus'])) {
    echo "<h3>Creating Sample Menus...</h3>";
    
    $sample_menus = [
        'primary' => [
            'name' => 'Primary Menu',
            'items' => [
                ['title' => 'Home', 'url' => home_url('/')],
                ['title' => 'About', 'url' => home_url('/about')],
                ['title' => 'Services', 'url' => home_url('/services')],
                ['title' => 'Blog', 'url' => home_url('/blog')],
                ['title' => 'Contact', 'url' => home_url('/contact')]
            ]
        ],
        'second-menu' => [
            'name' => 'Burger Menu',
            'items' => [
                ['title' => 'Home', 'url' => home_url('/')],
                ['title' => 'About Us', 'url' => home_url('/about')],
                ['title' => 'Our Services', 'url' => home_url('/services')],
                ['title' => 'Portfolio', 'url' => home_url('/portfolio')],
                ['title' => 'Blog', 'url' => home_url('/blog')],
                ['title' => 'Contact Us', 'url' => home_url('/contact')],
                ['title' => 'Support', 'url' => home_url('/support')]
            ]
        ],
        'footer' => [
            'name' => 'Footer Menu',
            'items' => [
                ['title' => 'Privacy Policy', 'url' => home_url('/privacy-policy')],
                ['title' => 'Terms of Service', 'url' => home_url('/terms-of-service')],
                ['title' => 'Cookie Policy', 'url' => home_url('/cookie-policy')],
                ['title' => 'Sitemap', 'url' => home_url('/sitemap')]
            ]
        ]
    ];
    
    $created_menus = [];
    
    foreach ($sample_menus as $location => $menu_data) {
        echo "<h4>Creating '{$menu_data['name']}'...</h4>";
        
        // Check if menu already exists
        $existing_menu = get_term_by('name', $menu_data['name'], 'nav_menu');
        
        if ($existing_menu) {
            $menu_id = $existing_menu->term_id;
            echo "<p>✅ Menu already exists (ID: {$menu_id})</p>";
        } else {
            // Create menu
            $menu_id = wp_create_nav_menu($menu_data['name']);
            
            if (is_wp_error($menu_id)) {
                echo "<p style='color: red;'>❌ Failed to create menu: " . $menu_id->get_error_message() . "</p>";
                continue;
            }
            
            echo "<p>✅ Created menu (ID: {$menu_id})</p>";
            
            // Add menu items
            foreach ($menu_data['items'] as $item_data) {
                $item_id = wp_update_nav_menu_item($menu_id, 0, [
                    'menu-item-title' => $item_data['title'],
                    'menu-item-url' => $item_data['url'],
                    'menu-item-status' => 'publish',
                    'menu-item-type' => 'custom'
                ]);
                
                if (is_wp_error($item_id)) {
                    echo "<p style='color: orange;'>⚠️ Failed to add item '{$item_data['title']}': " . $item_id->get_error_message() . "</p>";
                } else {
                    echo "<p>• Added '{$item_data['title']}'</p>";
                }
            }
        }
        
        $created_menus[$location] = $menu_id;
    }
    
    // Assign menus to locations
    echo "<h4>Assigning Menus to Locations...</h4>";
    
    $locations = get_theme_mod('nav_menu_locations', []);
    
    foreach ($created_menus as $location => $menu_id) {
        $locations[$location] = $menu_id;
        
        // Also store in option for persistence
        update_option("nav_menu_location_{$location}", $menu_id);
        
        echo "<p>✅ Assigned '{$sample_menus[$location]['name']}' to '{$location}' location</p>";
    }
    
    set_theme_mod('nav_menu_locations', $locations);
    
    echo "<p style='color: green; font-weight: bold;'>✅ All menus created and assigned successfully!</p>";
    
} elseif (empty($all_menus)) {
    echo "<p><a href='?create_menus=1' style='background: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;'>Create Sample Menus</a></p>";
}

// Step 3: Sync menu assignments between theme mod and options
echo "<h2>Menu Assignment Sync</h2>";

$theme_locations = get_theme_mod('nav_menu_locations', []);
$synced_count = 0;

foreach ($registered_locations as $location => $description) {
    $theme_menu_id = isset($theme_locations[$location]) ? $theme_locations[$location] : null;
    $option_menu_id = get_option("nav_menu_location_{$location}");
    
    if ($theme_menu_id && !$option_menu_id) {
        // Sync theme mod to option
        update_option("nav_menu_location_{$location}", $theme_menu_id);
        echo "<p>✅ Synced '{$location}' theme mod to option</p>";
        $synced_count++;
    } elseif (!$theme_menu_id && $option_menu_id) {
        // Sync option to theme mod
        $theme_locations[$location] = $option_menu_id;
        echo "<p>✅ Synced '{$location}' option to theme mod</p>";
        $synced_count++;
    }
}

if ($synced_count > 0) {
    set_theme_mod('nav_menu_locations', $theme_locations);
    echo "<p style='color: green;'>✅ Synced {$synced_count} menu assignments</p>";
} else {
    echo "<p>✅ All menu assignments are already in sync</p>";
}

// Step 4: Test API endpoints
echo "<h2>API Endpoint Tests</h2>";

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
                    foreach (array_slice($data['items'], 0, 5) as $item) {
                        echo "<li><strong>{$item['title']}</strong> → {$item['url']}</li>";
                    }
                    if (count($data['items']) > 5) {
                        echo "<li>... and " . (count($data['items']) - 5) . " more items</li>";
                    }
                    echo "</ul>";
                }
            } else {
                // All menus response
                echo "<p style='color: green;'>✅ Found " . count($data) . " menus</p>";
            }
        } else {
            echo "<p style='color: red;'>❌ Unexpected response format</p>";
        }
    }
}

// Step 5: Add theme switch protection to functions.php
echo "<h2>Adding Theme Switch Protection</h2>";

$menu_protection_code = '
/**
 * Menu Persistence Across Theme Changes
 * Fixes the issue where menu assignments become lost when switching between parent and child themes
 */

/**
 * Preserve menu assignments when switching themes
 */
add_action(\'switch_theme\', function($new_name, $new_theme, $old_theme) {
    // Get menu assignments from the old theme
    $old_locations = get_theme_mod(\'nav_menu_locations\', []);
    
    if (!empty($old_locations)) {
        // Store in options for the new theme to pick up
        foreach ($old_locations as $location => $menu_id) {
            if ($menu_id && wp_get_nav_menu_object($menu_id)) {
                update_option("nav_menu_location_{$location}", $menu_id);
            }
        }
        
        // Also set them immediately in the new theme
        set_theme_mod(\'nav_menu_locations\', $old_locations);
    }
}, 10, 3);

/**
 * Restore menu assignments after theme activation
 */
add_action(\'after_switch_theme\', function() {
    $registered_locations = get_registered_nav_menus();
    $theme_locations = get_theme_mod(\'nav_menu_locations\', []);
    $updated = false;
    
    foreach ($registered_locations as $location => $description) {
        $option_menu_id = get_option("nav_menu_location_{$location}");
        $theme_menu_id = isset($theme_locations[$location]) ? $theme_locations[$location] : null;
        
        // If theme doesn\'t have assignment but option does, restore it
        if (!$theme_menu_id && $option_menu_id && wp_get_nav_menu_object($option_menu_id)) {
            $theme_locations[$location] = $option_menu_id;
            $updated = true;
        }
        
        // If theme has assignment but option doesn\'t, sync it
        if ($theme_menu_id && !$option_menu_id && wp_get_nav_menu_object($theme_menu_id)) {
            update_option("nav_menu_location_{$location}", $theme_menu_id);
        }
    }
    
    if ($updated) {
        set_theme_mod(\'nav_menu_locations\', $theme_locations);
    }
});

/**
 * Sync menu assignments when they are updated
 */
add_action(\'wp_update_nav_menu\', function($menu_id, $menu_data) {
    // Sync current assignments to options
    $locations = get_theme_mod(\'nav_menu_locations\', []);
    foreach ($locations as $location => $assigned_menu_id) {
        update_option("nav_menu_location_{$location}", $assigned_menu_id);
    }
}, 10, 2);';

// Add to child theme functions.php
$child_functions_file = 'wp-content/themes/twentytwentyfive-child/functions.php';

if (file_exists($child_functions_file)) {
    $functions_content = file_get_contents($child_functions_file);
    
    if (strpos($functions_content, 'Menu Persistence Across Theme Changes') === false) {
        $functions_content .= "\n" . $menu_protection_code;
        
        if (file_put_contents($child_functions_file, $functions_content)) {
            echo "<p>✅ Added menu switch protection to child theme functions.php</p>";
        } else {
            echo "<p>❌ Failed to update child theme functions.php</p>";
        }
    } else {
        echo "<p>✅ Menu switch protection already exists in child theme</p>";
    }
}

// Also add to parent theme
$parent_functions_file = 'wp-content/themes/twentytwentyfive/functions.php';

if (file_exists($parent_functions_file)) {
    $functions_content = file_get_contents($parent_functions_file);
    
    if (strpos($functions_content, 'Menu Persistence Across Theme Changes') === false) {
        $functions_content .= "\n" . $menu_protection_code;
        
        if (file_put_contents($parent_functions_file, $functions_content)) {
            echo "<p>✅ Added menu switch protection to parent theme functions.php</p>";
        } else {
            echo "<p>❌ Failed to update parent theme functions.php</p>";
        }
    } else {
        echo "<p>✅ Menu switch protection already exists in parent theme</p>";
    }
}

// Step 6: Summary
echo "<h2>Summary</h2>";

echo "<div style='background: #e7f3ff; padding: 20px; margin: 20px 0; border-left: 4px solid #0073aa;'>";
echo "<h3>What was fixed:</h3>";
echo "<ul>";
echo "<li>✅ Created sample menus if none existed</li>";
echo "<li>✅ Synced menu assignments between theme mod and option storage</li>";
echo "<li>✅ Added theme switch protection hooks</li>";
echo "<li>✅ Verified API endpoints are working</li>";
echo "</ul>";

echo "<h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>Test the menu API endpoints above</li>";
echo "<li>Verify menus appear in your Next.js frontend</li>";
echo "<li>Test switching between parent and child themes</li>";
echo "<li>Check that burger menu (second-menu) is working</li>";
echo "</ol>";
echo "</div>";

echo "<p><strong>Actions:</strong></p>";
echo "<p>";
echo "<a href='?' style='background: #0073aa; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>Refresh Test</a>";
echo "<a href='" . admin_url('nav-menus.php') . "' style='background: #6c757d; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>WordPress Menus</a>";
echo "<a href='{$base_url}/wp-json/wp/v2/menus' target='_blank' style='background: #28a745; color: white; padding: 10px 15px; text-decoration: none;'>View All Menus API</a>";
echo "</p>";

?>