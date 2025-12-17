<?php
/**
 * Test Logo Fix
 * Simple test to verify the logo fix is working
 */

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>Logo Fix Test</h1>";

// Test 1: Check current logo status
echo "<h2>1. Current Logo Status</h2>";

$theme_mod_logo = get_theme_mod('custom_logo');
$option_logo = get_option('custom_logo_id');
$active_theme = get_stylesheet();
$parent_theme = get_template();

echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
echo "<tr><th>Source</th><th>Value</th><th>Valid?</th></tr>";
echo "<tr><td>Theme Mod</td><td>" . ($theme_mod_logo ?: 'Not set') . "</td><td>" . (($theme_mod_logo && get_post($theme_mod_logo)) ? '✅ Yes' : '❌ No') . "</td></tr>";
echo "<tr><td>Option</td><td>" . ($option_logo ?: 'Not set') . "</td><td>" . (($option_logo && get_post($option_logo)) ? '✅ Yes' : '❌ No') . "</td></tr>";
echo "<tr><td>Active Theme</td><td>{$active_theme}</td><td>-</td></tr>";
echo "<tr><td>Parent Theme</td><td>{$parent_theme}</td><td>-</td></tr>";
echo "</table>";

// Test 2: API Response
echo "<h2>2. API Response Test</h2>";

$api_url = get_site_url() . '/wp-json/wp/v2/site-settings';
echo "<p><strong>Testing:</strong> <a href='{$api_url}' target='_blank'>{$api_url}</a></p>";

$response = wp_remote_get($api_url);

if (is_wp_error($response)) {
    echo "<p style='color: red;'>❌ API Error: " . $response->get_error_message() . "</p>";
} else {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    if (isset($data['logo']) && $data['logo']) {
        echo "<div style='background: #d4edda; padding: 15px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3 style='color: #155724; margin-top: 0;'>✅ SUCCESS: Logo Found!</h3>";
        echo "<p><strong>Logo URL:</strong> " . $data['logo']['url'] . "</p>";
        echo "<p><strong>Logo ID:</strong> " . $data['logo']['id'] . "</p>";
        echo "<p><strong>Dimensions:</strong> " . $data['logo']['width'] . " x " . $data['logo']['height'] . "</p>";
        echo "<img src='" . $data['logo']['url'] . "' style='max-width: 300px; max-height: 100px; border: 1px solid #ddd; padding: 5px; background: white;' />";
        echo "</div>";
    } else {
        echo "<div style='background: #f8d7da; padding: 15px; border: 1px solid #f5c6cb; border-radius: 5px; margin: 10px 0;'>";
        echo "<h3 style='color: #721c24; margin-top: 0;'>❌ ISSUE: Logo is null</h3>";
        echo "<p>The API is still returning null for the logo.</p>";
        echo "</div>";
    }
    
    // Show debug info
    if (isset($data['debug'])) {
        echo "<h3>Debug Information:</h3>";
        echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
        foreach ($data['debug'] as $key => $value) {
            echo "<tr><td><strong>{$key}</strong></td><td>" . ($value ?: 'Not set') . "</td></tr>";
        }
        echo "</table>";
    }
}

// Test 3: Manual logo sync
echo "<h2>3. Manual Logo Sync</h2>";

if ($theme_mod_logo && !$option_logo) {
    update_option('custom_logo_id', $theme_mod_logo);
    echo "<p>✅ Synced theme mod logo to option</p>";
} elseif (!$theme_mod_logo && $option_logo) {
    set_theme_mod('custom_logo', $option_logo);
    echo "<p>✅ Synced option logo to theme mod</p>";
} elseif ($theme_mod_logo && $option_logo) {
    echo "<p>✅ Both sources have logo - no sync needed</p>";
} else {
    echo "<p>⚠️ No logo found in either source</p>";
    
    // Try to find a logo in media library
    $logo_attachments = get_posts([
        'post_type' => 'attachment',
        'post_mime_type' => 'image',
        'posts_per_page' => 5,
        'meta_query' => [
            'relation' => 'OR',
            [
                'key' => '_wp_attachment_image_alt',
                'value' => 'logo',
                'compare' => 'LIKE'
            ]
        ]
    ]);
    
    if (!empty($logo_attachments)) {
        echo "<p>Found " . count($logo_attachments) . " potential logo(s) in media library:</p>";
        foreach ($logo_attachments as $logo) {
            $url = wp_get_attachment_url($logo->ID);
            echo "<div style='margin: 10px 0; padding: 10px; border: 1px solid #ddd;'>";
            echo "<p><strong>ID:</strong> {$logo->ID} | <strong>Title:</strong> {$logo->post_title}</p>";
            echo "<img src='{$url}' style='max-width: 200px; max-height: 80px;' />";
            echo "<p><a href='?set_logo={$logo->ID}' style='background: #0073aa; color: white; padding: 5px 10px; text-decoration: none;'>Use This Logo</a></p>";
            echo "</div>";
        }
    }
}

// Handle logo setting from URL parameter
if (isset($_GET['set_logo']) && is_numeric($_GET['set_logo'])) {
    $logo_id = intval($_GET['set_logo']);
    if (get_post($logo_id)) {
        set_theme_mod('custom_logo', $logo_id);
        update_option('custom_logo_id', $logo_id);
        echo "<div style='background: #d4edda; padding: 10px; border: 1px solid #c3e6cb; border-radius: 5px; margin: 10px 0;'>";
        echo "<p style='color: #155724; margin: 0;'>✅ Logo set successfully! <a href='?'>Refresh to test</a></p>";
        echo "</div>";
    }
}

// Test 4: Next.js Integration Test
echo "<h2>4. Next.js Integration</h2>";

$nextjs_env_file = 'nextjs-wordpress/.env.development';
if (file_exists($nextjs_env_file)) {
    $env_content = file_get_contents($nextjs_env_file);
    if (preg_match('/NEXT_PUBLIC_WORDPRESS_URL=(.+)/', $env_content, $matches)) {
        $wordpress_url = trim($matches[1]);
        $nextjs_api_url = $wordpress_url . '/wp-json/wp/v2/site-settings';
        
        echo "<p><strong>Next.js will call:</strong> <a href='{$nextjs_api_url}' target='_blank'>{$nextjs_api_url}</a></p>";
        
        // Test CORS
        $headers = wp_remote_retrieve_headers($response);
        if (isset($headers['access-control-allow-origin'])) {
            echo "<p>✅ CORS headers present: " . $headers['access-control-allow-origin'] . "</p>";
        } else {
            echo "<p>⚠️ No CORS headers found - may cause issues with Next.js</p>";
        }
    }
} else {
    echo "<p>⚠️ Next.js environment file not found</p>";
}

echo "<hr>";
echo "<p><strong>Actions:</strong></p>";
echo "<p><a href='?' style='background: #0073aa; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>Refresh Test</a>";
echo "<a href='{$api_url}' target='_blank' style='background: #28a745; color: white; padding: 10px 15px; text-decoration: none; margin-right: 10px;'>View API</a>";
echo "<a href='" . admin_url('admin.php?page=site-appearance-settings') . "' style='background: #6c757d; color: white; padding: 10px 15px; text-decoration: none;'>Appearance Settings</a></p>";

?>