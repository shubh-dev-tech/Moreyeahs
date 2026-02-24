<?php
/**
 * Plugin Name: Contact Form Data
 * Plugin URI: http://localhost/moreyeahs-new/
 * Description: Captures contact form submissions from Next.js frontend and allows CSV export
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL v2 or later
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('CFD_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CFD_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CFD_VERSION', '1.0.0');

// Include required files
require_once CFD_PLUGIN_PATH . 'includes/class-contact-form-data.php';
require_once CFD_PLUGIN_PATH . 'includes/class-admin-menu.php';
require_once CFD_PLUGIN_PATH . 'includes/class-api-handler.php';

// Initialize the plugin
function cfd_init() {
    new Contact_Form_Data();
    new CFD_Admin_Menu();
    new CFD_API_Handler();
}
add_action('plugins_loaded', 'cfd_init');

// Activation hook
register_activation_hook(__FILE__, 'cfd_create_table');

function cfd_create_table() {
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
    dbDelta($sql);
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'cfd_deactivate');

function cfd_deactivate() {
    // Clean up if needed
}