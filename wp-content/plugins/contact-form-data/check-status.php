<?php
/**
 * Quick Status Check
 * Access via: http://localhost/moreyeahs-new/wp-content/plugins/contact-form-data/check-status.php
 */

// Include WordPress
define('WP_USE_THEMES', false);
require_once(__DIR__ . '/../../../wp-load.php');

header('Content-Type: application/json');

$status = array();

// Check if plugin is active
$plugin_file = 'contact-form-data/contact-form-data.php';
$status['plugin_active'] = is_plugin_active($plugin_file);

// Check if table exists
global $wpdb;
$table_name = $wpdb->prefix . 'contact_form_submissions';
$status['table_exists'] = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;

// Count submissions
if ($status['table_exists']) {
    $status['submission_count'] = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    
    // Get latest submission
    $latest = $wpdb->get_row("SELECT * FROM $table_name ORDER BY id DESC LIMIT 1");
    $status['latest_submission'] = $latest ? array(
        'id' => $latest->id,
        'email' => $latest->email,
        'submitted_at' => $latest->submitted_at
    ) : null;
} else {
    $status['submission_count'] = 0;
    $status['latest_submission'] = null;
}

// Check API endpoint
$status['api_endpoint'] = home_url('/wp-json/contact-form/v1/submit');

// WordPress info
$status['wordpress_url'] = home_url();
$status['wp_version'] = get_bloginfo('version');

echo json_encode($status, JSON_PRETTY_PRINT);
?>