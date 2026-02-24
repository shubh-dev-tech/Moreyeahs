<?php

class Contact_Form_Data {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
    }
    
    public function init() {
        // Add any initialization code here
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function enqueue_scripts() {
        // Enqueue any frontend scripts if needed
    }
    
    /**
     * Save form submission to database
     */
    public static function save_submission($data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        
        // Sanitize data
        $name = sanitize_text_field($data['name'] ?? '');
        $email = sanitize_email($data['email'] ?? '');
        $phone = sanitize_text_field($data['phone'] ?? '');
        $subject = sanitize_text_field($data['subject'] ?? '');
        $message = sanitize_textarea_field($data['message'] ?? '');
        $ip_address = self::get_client_ip();
        $user_agent = sanitize_text_field($_SERVER['HTTP_USER_AGENT'] ?? '');
        
        // Validate required fields
        if (empty($name) || empty($email)) {
            return new WP_Error('missing_fields', 'Name and email are required fields.');
        }
        
        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'Please provide a valid email address.');
        }
        
        // Insert into database
        $result = $wpdb->insert(
            $table_name,
            array(
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'subject' => $subject,
                'message' => $message,
                'ip_address' => $ip_address,
                'user_agent' => $user_agent,
                'submitted_at' => current_time('mysql')
            ),
            array(
                '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s'
            )
        );
        
        if ($result === false) {
            return new WP_Error('db_error', 'Failed to save submission to database.');
        }
        
        return $wpdb->insert_id;
    }
    
    /**
     * Get all submissions
     */
    public static function get_submissions($limit = 50, $offset = 0) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        
        $sql = $wpdb->prepare(
            "SELECT * FROM $table_name ORDER BY submitted_at DESC LIMIT %d OFFSET %d",
            $limit,
            $offset
        );
        
        return $wpdb->get_results($sql);
    }
    
    /**
     * Get total count of submissions
     */
    public static function get_submissions_count() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        
        return $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
    }
    
    /**
     * Delete submission
     */
    public static function delete_submission($id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        
        return $wpdb->delete(
            $table_name,
            array('id' => $id),
            array('%d')
        );
    }
    
    /**
     * Get client IP address
     */
    private static function get_client_ip() {
        $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR');
        
        foreach ($ip_keys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}