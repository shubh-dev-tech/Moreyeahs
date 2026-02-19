<?php
/**
 * Plugin Setup Page
 * Access this via: http://localhost/moreyeahs-new/wp-content/plugins/contact-form-data/setup.php
 */

// Include WordPress
define('WP_USE_THEMES', false);
require_once(__DIR__ . '/../../../wp-load.php');

// Simple authentication check
$auth_key = $_GET['key'] ?? '';
if ($auth_key !== 'setup123') {
    die('Access denied. Use: ?key=setup123');
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Contact Form Data Plugin Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .success { color: green; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .button { background: #0073aa; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 5px 10px 0; }
    </style>
</head>
<body>
    <h1>Contact Form Data Plugin Setup</h1>
    
    <?php
    // Check if action is requested
    $action = $_GET['action'] ?? '';
    
    if ($action === 'activate') {
        echo '<h2>Activating Plugin...</h2>';
        
        $plugin_file = 'contact-form-data/contact-form-data.php';
        
        if (!is_plugin_active($plugin_file)) {
            $result = activate_plugin($plugin_file);
            
            if (is_wp_error($result)) {
                echo '<div class="error">Error activating plugin: ' . $result->get_error_message() . '</div>';
            } else {
                echo '<div class="success">Plugin activated successfully!</div>';
            }
        } else {
            echo '<div class="info">Plugin is already active.</div>';
        }
    }
    
    if ($action === 'create_table') {
        echo '<h2>Creating Database Table...</h2>';
        
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
        
        echo '<div class="info">Database table creation result:</div>';
        echo '<pre>' . print_r($result, true) . '</pre>';
        
        // Test if table exists
        $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
        
        if ($table_exists) {
            echo '<div class="success">Table "' . $table_name . '" exists and is ready to use!</div>';
        } else {
            echo '<div class="error">Error: Table "' . $table_name . '" was not created.</div>';
            echo '<div class="error">Last database error: ' . $wpdb->last_error . '</div>';
        }
    }
    
    if ($action === 'test_insert') {
        echo '<h2>Testing Database Insert...</h2>';
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        
        $test_result = $wpdb->insert(
            $table_name,
            array(
                'name' => 'Test User ' . date('Y-m-d H:i:s'),
                'email' => 'test@example.com',
                'phone' => '123-456-7890',
                'subject' => 'Test Subject',
                'message' => 'This is a test message to verify the table works.',
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Setup Script',
                'submitted_at' => current_time('mysql')
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')
        );
        
        if ($test_result) {
            echo '<div class="success">Test record inserted successfully! ID: ' . $wpdb->insert_id . '</div>';
        } else {
            echo '<div class="error">Error inserting test record: ' . $wpdb->last_error . '</div>';
        }
    }
    
    if ($action === 'test_api') {
        echo '<h2>Testing API Endpoint...</h2>';
        
        $api_url = home_url('/wp-json/contact-form/v1/submit');
        $test_data = array(
            'name' => 'API Test User',
            'email' => 'apitest@example.com',
            'phone' => '123-456-7890',
            'subject' => 'API Test Subject',
            'message' => 'This is a test message from the API endpoint test.'
        );
        
        $response = wp_remote_post($api_url, array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode($test_data),
            'timeout' => 30
        ));
        
        if (is_wp_error($response)) {
            echo '<div class="error">API Error: ' . $response->get_error_message() . '</div>';
        } else {
            $body = wp_remote_retrieve_body($response);
            $code = wp_remote_retrieve_response_code($response);
            
            echo '<div class="info">API Response Code: ' . $code . '</div>';
            echo '<div class="info">API Response:</div>';
            echo '<pre>' . $body . '</pre>';
            
            $result = json_decode($body, true);
            if ($result && $result['success']) {
                echo '<div class="success">API test successful!</div>';
            } else {
                echo '<div class="error">API test failed.</div>';
            }
        }
    }
    
    // Show current status
    echo '<h2>Current Status</h2>';
    
    $plugin_file = 'contact-form-data/contact-form-data.php';
    $is_active = is_plugin_active($plugin_file);
    
    echo '<div class="' . ($is_active ? 'success' : 'error') . '">';
    echo 'Plugin Status: ' . ($is_active ? 'Active' : 'Inactive');
    echo '</div>';
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'contact_form_submissions';
    $table_exists = $wpdb->get_var("SHOW TABLES LIKE '$table_name'") == $table_name;
    
    echo '<div class="' . ($table_exists ? 'success' : 'error') . '">';
    echo 'Database Table: ' . ($table_exists ? 'Exists' : 'Missing');
    echo '</div>';
    
    if ($table_exists) {
        $count = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        echo '<div class="info">Total submissions in database: ' . $count . '</div>';
    }
    ?>
    
    <h2>Actions</h2>
    <a href="?key=setup123&action=activate" class="button">1. Activate Plugin</a>
    <a href="?key=setup123&action=create_table" class="button">2. Create Database Table</a>
    <a href="?key=setup123&action=test_insert" class="button">3. Test Database Insert</a>
    <a href="?key=setup123&action=test_api" class="button">4. Test API Endpoint</a>
    
    <h2>Manual Steps</h2>
    <div class="info">
        <p><strong>Alternative 1:</strong> Go to WordPress Admin → Plugins → Find "Contact Form Data" → Click Activate</p>
        <p><strong>Alternative 2:</strong> Run the SQL script in phpMyAdmin using the file: <code>create-table.sql</code></p>
        <p><strong>API Endpoint:</strong> <code><?php echo home_url('/wp-json/contact-form/v1/submit'); ?></code></p>
        <p><strong>Admin Interface:</strong> <a href="<?php echo admin_url('admin.php?page=contact-form-data'); ?>" target="_blank">Contact Forms Admin</a></p>
    </div>
    
</body>
</html>