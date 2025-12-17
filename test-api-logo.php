<?php
/**
 * Test Site Settings API
 * Check if the logo is being returned correctly by the API
 */

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

echo "<h1>Site Settings API Test</h1>";

// Test the API endpoint directly
$api_url = get_site_url() . '/wp-json/wp/v2/site-settings';
echo "<p><strong>API URL:</strong> <a href='$api_url' target='_blank'>$api_url</a></p>";

// Get the data using the same function the API uses
$logo_id = get_theme_mod('custom_logo');
echo "<p><strong>Logo ID from theme mod:</strong> " . ($logo_id ? $logo_id : 'Not set') . "</p>";

if ($logo_id) {
    $logo_data = wp_get_attachment_image_src($logo_id, 'full');
    echo "<p><strong>Logo data:</strong></p>";
    echo "<pre>";
    print_r($logo_data);
    echo "</pre>";
    
    if ($logo_data) {
        $logo = [
            'url' => $logo_data[0],
            'width' => $logo_data[1],
            'height' => $logo_data[2],
            'alt' => get_post_meta($logo_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name')
        ];
        
        echo "<p><strong>Formatted logo object:</strong></p>";
        echo "<pre>";
        print_r($logo);
        echo "</pre>";
        
        echo "<p><strong>Logo preview:</strong></p>";
        echo '<img src="' . esc_url($logo['url']) . '" alt="' . esc_attr($logo['alt']) . '" style="max-width: 200px; height: auto; border: 1px solid #ddd; padding: 10px;">';
    }
}

// Test the actual API response
echo "<hr><h2>API Response Test</h2>";
$response = wp_remote_get($api_url);

if (is_wp_error($response)) {
    echo "<p style='color: red;'>API Error: " . $response->get_error_message() . "</p>";
} else {
    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    
    echo "<p><strong>API Response:</strong></p>";
    echo "<pre>";
    print_r($data);
    echo "</pre>";
    
    if (isset($data['logo']) && $data['logo']) {
        echo "<p style='color: green;'>✅ Logo found in API response!</p>";
        echo "<p><strong>Logo URL:</strong> " . $data['logo']['url'] . "</p>";
    } else {
        echo "<p style='color: red;'>❌ No logo in API response</p>";
    }
}

// Test CORS headers
echo "<hr><h2>CORS Test</h2>";
$headers = wp_remote_retrieve_headers($response);
if (isset($headers['access-control-allow-origin'])) {
    echo "<p style='color: green;'>✅ CORS headers present: " . $headers['access-control-allow-origin'] . "</p>";
} else {
    echo "<p style='color: orange;'>⚠️ No CORS headers found</p>";
}

echo "<hr><p><a href='" . admin_url('admin.php?page=site-appearance-settings') . "'>Back to Site Appearance Settings</a></p>";
?>