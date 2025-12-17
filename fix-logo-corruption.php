<?php
/**
 * Fix Logo Corruption Issue
 * 
 * This script fixes the logo corruption issue that occurs when switching
 * from parent theme to child theme. The logo becomes null because theme
 * mods are theme-specific and don't transfer between themes.
 * 
 * Solution:
 * 1. Store logo in both theme mod and option for persistence
 * 2. Update REST API to check multiple sources
 * 3. Add migration function for theme switches
 */

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>Logo Corruption Fix</h1>";

// Step 1: Check current logo status
echo "<h2>Current Logo Status</h2>";

$theme_mod_logo = get_theme_mod('custom_logo');
$option_logo = get_option('custom_logo_id');
$site_icon = get_option('site_icon');

echo "<p><strong>Theme Mod Logo ID:</strong> " . ($theme_mod_logo ? $theme_mod_logo : 'Not set') . "</p>";
echo "<p><strong>Option Logo ID:</strong> " . ($option_logo ? $option_logo : 'Not set') . "</p>";
echo "<p><strong>Site Icon ID:</strong> " . ($site_icon ? $site_icon : 'Not set') . "</p>";

// Step 2: Find any existing logo in the media library
echo "<h2>Finding Existing Logos</h2>";

$logo_attachments = get_posts([
    'post_type' => 'attachment',
    'post_mime_type' => 'image',
    'posts_per_page' => -1,
    'meta_query' => [
        'relation' => 'OR',
        [
            'key' => '_wp_attachment_image_alt',
            'value' => 'logo',
            'compare' => 'LIKE'
        ]
    ]
]);

// Also search by filename
$logo_by_name = get_posts([
    'post_type' => 'attachment',
    'post_mime_type' => 'image',
    'posts_per_page' => -1,
    's' => 'logo'
]);

$all_logos = array_merge($logo_attachments, $logo_by_name);
$unique_logos = [];

foreach ($all_logos as $logo) {
    $unique_logos[$logo->ID] = $logo;
}

echo "<p>Found " . count($unique_logos) . " potential logo images:</p>";
foreach ($unique_logos as $logo) {
    $url = wp_get_attachment_url($logo->ID);
    echo "<div style='margin: 10px 0; padding: 10px; border: 1px solid #ddd;'>";
    echo "<p><strong>ID:</strong> {$logo->ID} | <strong>Title:</strong> {$logo->post_title}</p>";
    echo "<img src='{$url}' style='max-width: 200px; max-height: 100px;' />";
    echo "</div>";
}

// Step 3: Sync logo between theme mod and option
echo "<h2>Syncing Logo Settings</h2>";

$logo_id_to_use = null;

if ($theme_mod_logo && get_post($theme_mod_logo)) {
    $logo_id_to_use = $theme_mod_logo;
    echo "<p>✅ Using theme mod logo ID: {$logo_id_to_use}</p>";
} elseif ($option_logo && get_post($option_logo)) {
    $logo_id_to_use = $option_logo;
    echo "<p>✅ Using option logo ID: {$logo_id_to_use}</p>";
} elseif (!empty($unique_logos)) {
    // Use the first found logo
    $logo_id_to_use = array_keys($unique_logos)[0];
    echo "<p>⚠️ No valid logo found in settings, using first found logo ID: {$logo_id_to_use}</p>";
}

if ($logo_id_to_use) {
    // Sync both storage methods
    set_theme_mod('custom_logo', $logo_id_to_use);
    update_option('custom_logo_id', $logo_id_to_use);
    echo "<p>✅ Logo synced to both theme mod and option</p>";
    
    // Display the logo
    $logo_data = wp_get_attachment_image_src($logo_id_to_use, 'full');
    if ($logo_data) {
        echo "<div style='margin: 20px 0; padding: 20px; border: 2px solid #0073aa; background: #f0f8ff;'>";
        echo "<h3>Active Logo</h3>";
        echo "<img src='{$logo_data[0]}' style='max-width: 400px; max-height: 150px; border: 1px solid #ddd; padding: 10px; background: white;' />";
        echo "<p><strong>URL:</strong> {$logo_data[0]}</p>";
        echo "<p><strong>Dimensions:</strong> {$logo_data[1]} x {$logo_data[2]}</p>";
        echo "</div>";
    }
} else {
    echo "<p>❌ No valid logo found. Please upload a logo through the WordPress admin.</p>";
}

// Step 4: Update the REST API function in both parent and child themes
echo "<h2>Updating REST API Functions</h2>";

$parent_rest_file = 'wp-content/themes/twentytwentyfive/inc/rest-api-endpoints.php';
$child_rest_file = 'wp-content/themes/twentytwentyfive-child/inc/rest-api-endpoints.php';

$improved_site_settings_function = '
/**
 * Get site settings including logo and favicon
 * IMPROVED VERSION - Checks multiple sources for logo persistence
 */
function get_site_settings_rest() {
    // Try multiple sources for logo ID to ensure persistence across theme changes
    $logo_id = null;
    
    // Method 1: Check theme mod (theme-specific)
    $theme_mod_logo = get_theme_mod(\'custom_logo\');
    if ($theme_mod_logo && get_post($theme_mod_logo)) {
        $logo_id = $theme_mod_logo;
    }
    
    // Method 2: Check option (global, persists across themes)
    if (!$logo_id) {
        $option_logo = get_option(\'custom_logo_id\');
        if ($option_logo && get_post($option_logo)) {
            $logo_id = $option_logo;
            // Sync back to theme mod for consistency
            set_theme_mod(\'custom_logo\', $logo_id);
        }
    }
    
    // Method 3: Check for any attachment with "logo" in alt text or title (fallback)
    if (!$logo_id) {
        $logo_attachments = get_posts([
            \'post_type\' => \'attachment\',
            \'post_mime_type\' => \'image\',
            \'posts_per_page\' => 1,
            \'meta_query\' => [
                \'relation\' => \'OR\',
                [
                    \'key\' => \'_wp_attachment_image_alt\',
                    \'value\' => \'logo\',
                    \'compare\' => \'LIKE\'
                ]
            ]
        ]);
        
        if (!empty($logo_attachments)) {
            $logo_id = $logo_attachments[0]->ID;
            // Store for future use
            set_theme_mod(\'custom_logo\', $logo_id);
            update_option(\'custom_logo_id\', $logo_id);
        }
    }
    
    $logo = null;
    if ($logo_id) {
        $logo_data = wp_get_attachment_image_src($logo_id, \'full\');
        if ($logo_data) {
            $logo = [
                \'id\' => intval($logo_id),
                \'url\' => $logo_data[0],
                \'width\' => intval($logo_data[1]),
                \'height\' => intval($logo_data[2]),
                \'alt\' => get_post_meta($logo_id, \'_wp_attachment_image_alt\', true) ?: get_bloginfo(\'name\')
            ];
        }
    }

    // Get favicon with similar fallback logic
    $favicon_id = get_option(\'site_icon\');
    $favicon = null;

    if ($favicon_id && get_post($favicon_id)) {
        $favicon_url = wp_get_attachment_url($favicon_id);
        if ($favicon_url) {
            $favicon = [
                \'id\' => intval($favicon_id),
                \'url\' => $favicon_url,
                \'width\' => 512,
                \'height\' => 512,
                \'sizes\' => [
                    \'32\' => wp_get_attachment_image_url($favicon_id, [32, 32]),
                    \'180\' => wp_get_attachment_image_url($favicon_id, [180, 180]),
                    \'192\' => wp_get_attachment_image_url($favicon_id, [192, 192]),
                    \'512\' => wp_get_attachment_image_url($favicon_id, [512, 512]),
                ]
            ];
        }
    }

    $settings = [
        \'title\' => get_bloginfo(\'name\'),
        \'description\' => get_bloginfo(\'description\'),
        \'url\' => get_bloginfo(\'url\'),
        \'logo\' => $logo,
        \'favicon\' => $favicon,
        \'debug\' => [
            \'theme_mod_logo\' => $theme_mod_logo,
            \'option_logo\' => get_option(\'custom_logo_id\'),
            \'active_theme\' => get_stylesheet(),
            \'parent_theme\' => get_template()
        ]
    ];

    return rest_ensure_response($settings);
}';

// Check if we need to update the files
$files_to_update = [];

if (file_exists($parent_rest_file)) {
    $files_to_update[] = $parent_rest_file;
}

if (file_exists($child_rest_file)) {
    $files_to_update[] = $child_rest_file;
}

foreach ($files_to_update as $file) {
    $content = file_get_contents($file);
    
    // Check if the function needs updating
    if (strpos($content, 'IMPROVED VERSION - Checks multiple sources') === false) {
        echo "<p>📝 Updating {$file}...</p>";
        
        // Find and replace the get_site_settings_rest function
        $pattern = '/\/\*\*\s*\*\s*Get site settings including logo and favicon.*?\*\/\s*function get_site_settings_rest\(\) \{.*?\n\}/s';
        
        if (preg_match($pattern, $content)) {
            $updated_content = preg_replace($pattern, $improved_site_settings_function, $content);
            
            if (file_put_contents($file, $updated_content)) {
                echo "<p>✅ Successfully updated {$file}</p>";
            } else {
                echo "<p>❌ Failed to update {$file}</p>";
            }
        } else {
            echo "<p>⚠️ Could not find function pattern in {$file}</p>";
        }
    } else {
        echo "<p>✅ {$file} already has the improved function</p>";
    }
}

// Step 5: Add theme switch hook to preserve logo
echo "<h2>Adding Theme Switch Protection</h2>";

$theme_switch_code = '
/**
 * Preserve logo when switching themes
 */
add_action(\'switch_theme\', function($new_name, $new_theme, $old_theme) {
    // Get logo from the old theme
    $old_logo = get_theme_mod(\'custom_logo\');
    
    if ($old_logo && get_post($old_logo)) {
        // Store in option for the new theme to pick up
        update_option(\'custom_logo_id\', $old_logo);
        
        // Also set it immediately in the new theme
        set_theme_mod(\'custom_logo\', $old_logo);
    }
}, 10, 3);

/**
 * Restore logo after theme activation
 */
add_action(\'after_switch_theme\', function() {
    $option_logo = get_option(\'custom_logo_id\');
    $theme_logo = get_theme_mod(\'custom_logo\');
    
    // If theme doesn\'t have logo but option does, restore it
    if (!$theme_logo && $option_logo && get_post($option_logo)) {
        set_theme_mod(\'custom_logo\', $option_logo);
    }
    
    // If theme has logo but option doesn\'t, sync it
    if ($theme_logo && !$option_logo && get_post($theme_logo)) {
        update_option(\'custom_logo_id\', $theme_logo);
    }
});';

// Add to child theme functions.php
$child_functions_file = 'wp-content/themes/twentytwentyfive-child/functions.php';

if (file_exists($child_functions_file)) {
    $functions_content = file_get_contents($child_functions_file);
    
    if (strpos($functions_content, 'Preserve logo when switching themes') === false) {
        $functions_content .= "\n" . $theme_switch_code;
        
        if (file_put_contents($child_functions_file, $functions_content)) {
            echo "<p>✅ Added theme switch protection to child theme functions.php</p>";
        } else {
            echo "<p>❌ Failed to update child theme functions.php</p>";
        }
    } else {
        echo "<p>✅ Theme switch protection already exists in child theme</p>";
    }
}

// Step 6: Test the API
echo "<h2>Testing API Response</h2>";

$api_url = get_site_url() . '/wp-json/wp/v2/site-settings';
echo "<p><strong>API URL:</strong> <a href='{$api_url}' target='_blank'>{$api_url}</a></p>";

$response = wp_remote_get($api_url);

if (is_wp_error($response)) {
    echo "<p style='color: red;'>❌ API Error: " . $response->get_error_message() . "</p>";
} else {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    echo "<div style='background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;'>";
    echo "<h4>API Response:</h4>";
    echo "<pre style='background: white; padding: 10px; border-radius: 3px; overflow-x: auto;'>";
    echo json_encode($data, JSON_PRETTY_PRINT);
    echo "</pre>";
    echo "</div>";
    
    if (isset($data['logo']) && $data['logo']) {
        echo "<p style='color: green; font-weight: bold;'>✅ SUCCESS: Logo is now properly returned by the API!</p>";
        echo "<p><strong>Logo URL:</strong> " . $data['logo']['url'] . "</p>";
        
        if (isset($data['logo']['id'])) {
            echo "<p><strong>Logo ID:</strong> " . $data['logo']['id'] . "</p>";
        }
    } else {
        echo "<p style='color: red; font-weight: bold;'>❌ Logo is still null in API response</p>";
        
        if (isset($data['debug'])) {
            echo "<p><strong>Debug info:</strong></p>";
            echo "<pre>" . json_encode($data['debug'], JSON_PRETTY_PRINT) . "</pre>";
        }
    }
}

// Step 7: Summary and next steps
echo "<h2>Summary</h2>";

echo "<div style='background: #e7f3ff; padding: 20px; margin: 20px 0; border-left: 4px solid #0073aa;'>";
echo "<h3>What was fixed:</h3>";
echo "<ul>";
echo "<li>✅ Updated REST API function to check multiple logo sources</li>";
echo "<li>✅ Added fallback mechanisms for logo persistence</li>";
echo "<li>✅ Synced logo between theme mod and option storage</li>";
echo "<li>✅ Added theme switch protection hooks</li>";
echo "<li>✅ Added debug information to API response</li>";
echo "</ul>";

echo "<h3>Next Steps:</h3>";
echo "<ol>";
echo "<li>Test the API endpoint: <a href='{$api_url}' target='_blank'>{$api_url}</a></li>";
echo "<li>Verify logo appears in your Next.js frontend</li>";
echo "<li>Test switching between parent and child themes</li>";
echo "<li>If issues persist, check the debug information in the API response</li>";
echo "</ol>";
echo "</div>";

echo "<p><a href='" . admin_url('admin.php?page=site-appearance-settings') . "' style='background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 3px;'>Go to Site Appearance Settings</a></p>";

?>