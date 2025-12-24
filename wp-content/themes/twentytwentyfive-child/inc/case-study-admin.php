<?php
/**
 * Case Study Admin Interface
 * Provides admin tools for managing case study templates
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add Case Study Templates admin menu
 */
function add_case_study_templates_menu() {
    add_submenu_page(
        'edit.php?post_type=case_study',
        'Case Study Templates',
        'Templates',
        'manage_options',
        'case-study-templates',
        'case_study_templates_page'
    );
}
add_action('admin_menu', 'add_case_study_templates_menu');

/**
 * Case Study Templates admin page
 */
function case_study_templates_page() {
    ?>
    <div class="wrap">
        <h1>Case Study Templates</h1>
        
        <div class="card">
            <h2>Available Templates</h2>
            <p>Choose from predefined templates for your case studies:</p>
            
            <div class="template-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 20px 0;">
                
                <!-- Default Template -->
                <div class="template-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h3>Default Template</h3>
                    <p>Complete case study template with all sections:</p>
                    <ul>
                        <li>Header with gradient background</li>
                        <li>Left sidebar with client info</li>
                        <li>Meet the Client section</li>
                        <li>Challenge, Solution, Results sections</li>
                        <li>Testimonial quote</li>
                        <li>Call-to-action</li>
                    </ul>
                    <button class="button button-primary" onclick="previewTemplate('default')">Preview Structure</button>
                </div>
                
                <!-- Minimal Template -->
                <div class="template-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h3>Minimal Template</h3>
                    <p>Simple case study template with essential sections:</p>
                    <ul>
                        <li>Header section</li>
                        <li>Project overview</li>
                        <li>Call-to-action</li>
                    </ul>
                    <button class="button button-primary" onclick="previewTemplate('minimal')">Preview Structure</button>
                </div>
                
                <!-- Custom Template -->
                <div class="template-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                    <h3>Custom Template</h3>
                    <p>Create your own template by selecting blocks:</p>
                    <div id="custom-template-builder">
                        <h4>Available Blocks:</h4>
                        <label><input type="checkbox" value="case-study-header"> Header</label><br>
                        <label><input type="checkbox" value="case-study-left-sidebar"> Left Sidebar</label><br>
                        <label><input type="checkbox" value="meet-the-client"> Meet the Client</label><br>
                        <label><input type="checkbox" value="case-study-content-section"> Content Section</label><br>
                        <label><input type="checkbox" value="case-study-quote"> Quote</label><br>
                        <label><input type="checkbox" value="case-study-cta"> Call-to-Action</label><br>
                    </div>
                    <button class="button button-secondary" onclick="buildCustomTemplate()">Build Custom</button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <h2>Template Usage</h2>
            <p>Templates are automatically applied to new case studies. You can also:</p>
            <ul>
                <li>Apply templates to existing case studies using the template meta box in the editor</li>
                <li>Customize templates by editing the template files</li>
                <li>Create new templates by modifying the template functions</li>
            </ul>
        </div>
        
        <div class="card">
            <h2>Quick Actions</h2>
            <p>
                <a href="<?php echo admin_url('post-new.php?post_type=case_study'); ?>" class="button button-primary">
                    Create New Case Study
                </a>
                <a href="<?php echo admin_url('edit.php?post_type=case_study'); ?>" class="button">
                    View All Case Studies
                </a>
            </p>
        </div>
    </div>
    
    <script>
    function previewTemplate(template) {
        let structure = '';
        
        switch(template) {
            case 'default':
                structure = `
                    <h4>Default Template Structure:</h4>
                    <ol>
                        <li><strong>Header Block</strong> - Gradient background with logo, title, subtitle</li>
                        <li><strong>Layout Container</strong>
                            <ul>
                                <li><strong>Left Sidebar</strong> - Client info, industry, services, timeline</li>
                                <li><strong>Content Area</strong>
                                    <ul>
                                        <li>Meet the Client</li>
                                        <li>The Challenge</li>
                                        <li>Our Solution</li>
                                        <li>The Results</li>
                                        <li>Testimonial Quote</li>
                                        <li>Call-to-Action</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ol>
                `;
                break;
            case 'minimal':
                structure = `
                    <h4>Minimal Template Structure:</h4>
                    <ol>
                        <li><strong>Header Block</strong> - Title and subtitle</li>
                        <li><strong>Project Overview</strong> - Basic content section</li>
                        <li><strong>Call-to-Action</strong> - Contact/next steps</li>
                    </ol>
                `;
                break;
        }
        
        alert(structure.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
    }
    
    function buildCustomTemplate() {
        const selected = [];
        document.querySelectorAll('#custom-template-builder input:checked').forEach(input => {
            selected.push(input.value);
        });
        
        if (selected.length === 0) {
            alert('Please select at least one block for your custom template.');
            return;
        }
        
        alert('Custom template would include: ' + selected.join(', ') + '\n\nThis feature can be extended to create actual custom templates.');
    }
    </script>
    
    <style>
    .template-card h3 {
        margin-top: 0;
        color: #23282d;
    }
    .template-card ul {
        margin: 15px 0;
    }
    .template-card li {
        margin: 5px 0;
    }
    #custom-template-builder label {
        display: block;
        margin: 8px 0;
    }
    #custom-template-builder input {
        margin-right: 8px;
    }
    </style>
    <?php
}

/**
 * Add template info to case study list
 */
function add_case_study_template_column($columns) {
    $columns['template'] = 'Template';
    return $columns;
}
add_filter('manage_case_study_posts_columns', 'add_case_study_template_column');

/**
 * Display template info in case study list
 */
function display_case_study_template_column($column, $post_id) {
    if ($column === 'template') {
        $template = get_post_meta($post_id, '_case_study_template', true) ?: 'default';
        $templates = array(
            'default' => 'Default',
            'minimal' => 'Minimal',
            'detailed' => 'Detailed'
        );
        echo $templates[$template] ?? ucfirst($template);
    }
}
add_action('manage_case_study_posts_custom_column', 'display_case_study_template_column', 10, 2);

/**
 * Add quick edit template selection
 */
function case_study_quick_edit_template($column_name, $post_type) {
    if ($column_name !== 'template' || $post_type !== 'case_study') {
        return;
    }
    ?>
    <fieldset class="inline-edit-col-right">
        <div class="inline-edit-col">
            <label>
                <span class="title">Template</span>
                <select name="case_study_template">
                    <option value="default">Default</option>
                    <option value="minimal">Minimal</option>
                    <option value="detailed">Detailed</option>
                </select>
            </label>
        </div>
    </fieldset>
    <?php
}
add_action('quick_edit_custom_box', 'case_study_quick_edit_template', 10, 2);

/**
 * Save quick edit template
 */
function save_case_study_quick_edit_template($post_id) {
    if (isset($_POST['case_study_template'])) {
        update_post_meta($post_id, '_case_study_template', sanitize_text_field($_POST['case_study_template']));
    }
}
add_action('save_post', 'save_case_study_quick_edit_template');

/**
 * Add template selection to new case study screen
 */
function add_case_study_template_notice() {
    global $post_type, $pagenow;
    
    if ($post_type === 'case_study' && $pagenow === 'post-new.php') {
        ?>
        <div class="notice notice-info">
            <p>
                <strong>Case Study Template:</strong> 
                This case study will be created with the default template. 
                You can change the template using the "Case Study Template" meta box on the right.
                <a href="<?php echo admin_url('edit.php?post_type=case_study&page=case-study-templates'); ?>">
                    Learn more about templates
                </a>
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'add_case_study_template_notice');