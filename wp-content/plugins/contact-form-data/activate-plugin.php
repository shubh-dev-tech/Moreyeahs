<?php
/**
 * Plugin Activation Script
 * Run this file to manually activate the plugin and create the database table
 */

// Include WordPress
require_once(__DIR__ . '/../../../wp-config.php');
require_once(__DIR__ . '/../../../wp-load.php');

// Check if user is admin
if (!current_user_can('activate_plugins')) {
    die('You do not have permission to activate plugins.');
}

// Activate the plugin
$plugin_file = 'contact-form-data/contact-form-data.php';

if (!is_plugin_active($plugin_file)) {
    $result = activate_plugin($plugin_file);
    
    if (is_wp_error($result)) {
        echo "Error activating plugin: " . $result->get_error_message() . "\n";
    } else {
        echo "Plugin activated successfully!\n";
    }
} else {
    echo "Plugin is already active.\n";
}

// Create the database table manually
global $wpdb;

$table_name = $wpdb->prefix . 'contact_form_submissions';

$charset_collate = $wpdb->get_charset_collate();

$sql = "CREATE TABLE $table_name (
    id mediumint(9) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    phone varchar(20) DEFAULT '',
    subject varchar(255) DEFAULT '',
    message text DEFAULT '',
    submitted_at datetime DEFAULT CURRENT_TIMESTAMP,
    ip_address varchar(45) DEFAULT '',
    user_agent text DEFAULT '',
    PRIMARY KEY (id)
) $charset_collate;";

require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
$result = dbDelta($sql);

echo "Database table creation result:\n";
print_r($result);

// Test if table exists
$table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;

if ($table_exists) {
    echo "\nTable '$table_name' exists and is ready to use!\n";
    
    // Test insert
    $test_result = $wpdb->insert(
        $table_name,
        array(
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '123-456-7890',
            'subject' => 'Test Subject',
            'message' => 'This is a test message to verify the table works.',
            'ip_address' => '127.0.0.1',
            'user_agent' => 'Plugin Activation Script',
            'submitted_at' => current_time('mysql')
        ),
        array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
    );
    
    if ($test_result) {
        echo "Test record inserted successfully! ID: " . $wpdb->insert_id . "\n";
        echo "Plugin is ready to receive form submissions.\n";
    } else {
        echo "Error inserting test record: " . $wpdb->last_error . "\n";
    }
} else {
    echo "\nError: Table '$table_name' was not created.\n";
    echo "Last database error: " . $wpdb->last_error . "\n";
}

echo "\nDone!\n";
?>