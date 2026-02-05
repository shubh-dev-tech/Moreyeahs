<?php

class CFD_Admin_Menu {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'handle_actions'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'Contact Form Data',
            'Contact Forms',
            'manage_options',
            'contact-form-data',
            array($this, 'admin_page'),
            'dashicons-email-alt',
            30
        );
        
        add_submenu_page(
            'contact-form-data',
            'All Submissions',
            'All Submissions',
            'manage_options',
            'contact-form-data',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'contact-form-data',
            'Export CSV',
            'Export CSV',
            'manage_options',
            'contact-form-export',
            array($this, 'export_page')
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'contact-form-data') !== false) {
            wp_enqueue_style('cfd-admin-style', CFD_PLUGIN_URL . 'assets/admin-style.css', array(), CFD_VERSION);
        }
    }
    
    public function handle_actions() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Handle delete action
        if (isset($_GET['action']) && $_GET['action'] === 'delete' && isset($_GET['id'])) {
            $id = intval($_GET['id']);
            if (wp_verify_nonce($_GET['_wpnonce'], 'delete_submission_' . $id)) {
                Contact_Form_Data::delete_submission($id);
                wp_redirect(admin_url('admin.php?page=contact-form-data&deleted=1'));
                exit;
            }
        }
        
        // Handle CSV export
        if (isset($_GET['action']) && $_GET['action'] === 'export_csv') {
            if (wp_verify_nonce($_GET['_wpnonce'], 'export_csv')) {
                $this->export_csv();
            }
        }
    }
    
    public function admin_page() {
        $page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        $per_page = 20;
        $offset = ($page - 1) * $per_page;
        
        $submissions = Contact_Form_Data::get_submissions($per_page, $offset);
        $total_items = Contact_Form_Data::get_submissions_count();
        $total_pages = ceil($total_items / $per_page);
        
        ?>
        <div class="wrap">
            <h1>Contact Form Submissions</h1>
            
            <?php if (isset($_GET['deleted'])): ?>
                <div class="notice notice-success is-dismissible">
                    <p>Submission deleted successfully.</p>
                </div>
            <?php endif; ?>
            
            <div class="tablenav top">
                <div class="alignleft actions">
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=contact-form-data&action=export_csv'), 'export_csv'); ?>" class="button">Export All to CSV</a>
                </div>
                <?php if ($total_pages > 1): ?>
                    <div class="tablenav-pages">
                        <span class="displaying-num"><?php echo $total_items; ?> items</span>
                        <?php
                        echo paginate_links(array(
                            'base' => add_query_arg('paged', '%#%'),
                            'format' => '',
                            'prev_text' => '&laquo;',
                            'next_text' => '&raquo;',
                            'total' => $total_pages,
                            'current' => $page
                        ));
                        ?>
                    </div>
                <?php endif; ?>
            </div>
            
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Subject</th>
                        <th>Message</th>
                        <th>Submitted At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if (empty($submissions)): ?>
                        <tr>
                            <td colspan="8">No submissions found.</td>
                        </tr>
                    <?php else: ?>
                        <?php foreach ($submissions as $submission): ?>
                            <tr>
                                <td><?php echo esc_html($submission->id); ?></td>
                                <td><?php echo esc_html($submission->name); ?></td>
                                <td><a href="mailto:<?php echo esc_attr($submission->email); ?>"><?php echo esc_html($submission->email); ?></a></td>
                                <td><?php echo esc_html($submission->phone); ?></td>
                                <td><?php echo esc_html($submission->subject); ?></td>
                                <td><?php echo esc_html(wp_trim_words($submission->message, 10)); ?></td>
                                <td><?php echo esc_html(date('Y-m-d H:i:s', strtotime($submission->submitted_at))); ?></td>
                                <td>
                                    <a href="#" onclick="showMessage(<?php echo $submission->id; ?>)" class="button button-small">View</a>
                                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=contact-form-data&action=delete&id=' . $submission->id), 'delete_submission_' . $submission->id); ?>" 
                                       class="button button-small" 
                                       onclick="return confirm('Are you sure you want to delete this submission?')">Delete</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
            
            <?php if ($total_pages > 1): ?>
                <div class="tablenav bottom">
                    <div class="tablenav-pages">
                        <?php
                        echo paginate_links(array(
                            'base' => add_query_arg('paged', '%#%'),
                            'format' => '',
                            'prev_text' => '&laquo;',
                            'next_text' => '&raquo;',
                            'total' => $total_pages,
                            'current' => $page
                        ));
                        ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Modal for viewing full message -->
        <div id="message-modal" style="display: none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h3>Full Message</h3>
                <div id="modal-message-content"></div>
            </div>
        </div>
        
        <script>
        function showMessage(id) {
            // Get submission data via AJAX
            jQuery.post(ajaxurl, {
                action: 'get_submission_details',
                id: id,
                nonce: '<?php echo wp_create_nonce('get_submission_details'); ?>'
            }, function(response) {
                if (response.success) {
                    document.getElementById('modal-message-content').innerHTML = '<p><strong>Message:</strong></p><p>' + response.data.message + '</p>';
                    document.getElementById('message-modal').style.display = 'block';
                }
            });
        }
        
        // Close modal
        document.querySelector('.close').onclick = function() {
            document.getElementById('message-modal').style.display = 'none';
        }
        </script>
        <?php
    }
    
    public function export_page() {
        ?>
        <div class="wrap">
            <h1>Export Contact Form Data</h1>
            <p>Click the button below to download all contact form submissions as a CSV file.</p>
            <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=contact-form-data&action=export_csv'), 'export_csv'); ?>" class="button button-primary">Download CSV</a>
        </div>
        <?php
    }
    
    private function export_csv() {
        $submissions = Contact_Form_Data::get_submissions(999999, 0); // Get all submissions
        
        $filename = 'contact-form-submissions-' . date('Y-m-d-H-i-s') . '.csv';
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $output = fopen('php://output', 'w');
        
        // CSV headers
        fputcsv($output, array('ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted At', 'IP Address'));
        
        // CSV data
        foreach ($submissions as $submission) {
            fputcsv($output, array(
                $submission->id,
                $submission->name,
                $submission->email,
                $submission->phone,
                $submission->subject,
                $submission->message,
                $submission->submitted_at,
                $submission->ip_address
            ));
        }
        
        fclose($output);
        exit;
    }
}