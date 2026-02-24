<?php

class CFD_API_Handler {
    
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        add_action('wp_ajax_get_submission_details', array($this, 'get_submission_details'));
        add_action('wp_ajax_nopriv_get_submission_details', array($this, 'get_submission_details'));
    }
    
    public function register_routes() {
        register_rest_route('contact-form/v1', '/submit', array(
            'methods' => array('POST', 'OPTIONS'),
            'callback' => array($this, 'handle_form_submission'),
            'permission_callback' => '__return_true',
            'args' => array(
                'name' => array(
                    'required' => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'email' => array(
                    'required' => true,
                    'sanitize_callback' => 'sanitize_email',
                ),
                'phone' => array(
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'subject' => array(
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
                'message' => array(
                    'required' => false,
                    'sanitize_callback' => 'sanitize_textarea_field',
                ),
            ),
        ));
        
        // Route to get submissions (for admin use)
        register_rest_route('contact-form/v1', '/submissions', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_submissions'),
            'permission_callback' => array($this, 'check_admin_permission'),
        ));
    }
    
    public function handle_form_submission($request) {
        // Add CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        
        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            return new WP_REST_Response(null, 200);
        }
        
        // Get parameters
        $name = $request->get_param('name');
        $email = $request->get_param('email');
        $phone = $request->get_param('phone');
        $subject = $request->get_param('subject');
        $message = $request->get_param('message');
        
        // Prepare data array
        $data = array(
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
        );
        
        // Save to database
        $result = Contact_Form_Data::save_submission($data);
        
        if (is_wp_error($result)) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => $result->get_error_message(),
            ), 400);
        }
        
        // Send email notification (optional)
        $this->send_email_notification($data);
        
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Form submitted successfully!',
            'id' => $result,
        ), 200);
    }
    
    public function get_submissions($request) {
        $page = $request->get_param('page') ?: 1;
        $per_page = $request->get_param('per_page') ?: 20;
        $offset = ($page - 1) * $per_page;
        
        $submissions = Contact_Form_Data::get_submissions($per_page, $offset);
        $total = Contact_Form_Data::get_submissions_count();
        
        return new WP_REST_Response(array(
            'success' => true,
            'data' => $submissions,
            'total' => $total,
            'page' => $page,
            'per_page' => $per_page,
        ), 200);
    }
    
    public function get_submission_details() {
        if (!wp_verify_nonce($_POST['nonce'], 'get_submission_details')) {
            wp_die('Security check failed');
        }
        
        global $wpdb;
        $table_name = $wpdb->prefix . 'contact_form_submissions';
        $id = intval($_POST['id']);
        
        $submission = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        
        if ($submission) {
            wp_send_json_success(array(
                'message' => nl2br(esc_html($submission->message)),
                'name' => esc_html($submission->name),
                'email' => esc_html($submission->email),
                'subject' => esc_html($submission->subject),
            ));
        } else {
            wp_send_json_error('Submission not found');
        }
    }
    
    public function check_admin_permission() {
        return current_user_can('manage_options');
    }
    
    private function send_email_notification($data) {
        // Get admin email
        $admin_email = get_option('admin_email');
        
        // Email subject
        $subject = 'New Contact Form Submission: ' . $data['subject'];
        
        // Email message
        $message = "New contact form submission received:\n\n";
        $message .= "Name: " . $data['name'] . "\n";
        $message .= "Email: " . $data['email'] . "\n";
        $message .= "Phone: " . $data['phone'] . "\n";
        $message .= "Subject: " . $data['subject'] . "\n";
        $message .= "Message: " . $data['message'] . "\n";
        $message .= "\nSubmitted at: " . current_time('mysql') . "\n";
        
        // Email headers
        $headers = array(
            'Content-Type: text/plain; charset=UTF-8',
            'From: ' . get_bloginfo('name') . ' <' . $admin_email . '>',
            'Reply-To: ' . $data['name'] . ' <' . $data['email'] . '>',
        );
        
        // Send email
        wp_mail($admin_email, $subject, $message, $headers);
    }
}