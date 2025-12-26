<?php
/**
 * Case Study Template Manager
 * Creates predefined templates for case study posts using ACF fields
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Set default template for new case study posts
 */
function set_case_study_default_template($post_id, $post, $update) {
    // Only run for new case study posts (not updates)
    if ($update || $post->post_type !== 'case_study' || $post->post_status === 'auto-draft') {
        return;
    }
    
    // Check if ACF fields are already set
    if (get_field('header_section', $post_id)) {
        return;
    }
    
    // Set default ACF field values
    set_case_study_default_fields($post_id);
}
add_action('wp_insert_post', 'set_case_study_default_template', 10, 3);

/**
 * Set default ACF field values for new case study
 */
function set_case_study_default_fields($post_id) {
    // Header Section
    update_field('header_section', array(
        'title' => 'City Dynamics',
        'subtitle' => 'Transforming Collaboration and Consultancy with SharePoint',
        'gradient_colors' => array(
            'color_1' => '#00bcd4',
            'color_2' => '#9c27b0'
        )
    ), $post_id);
    
    // Sidebar Section
    update_field('sidebar_section', array(
        'sidebar_sections' => array(
            array(
                'section_title' => 'Our Client',
                'section_items' => array(
                    array('item_text' => 'Haseet Sanghrajka'),
                    array('item_text' => 'CEO')
                )
            ),
            array(
                'section_title' => 'Profile',
                'section_items' => array(
                    array('item_text' => 'Location: London'),
                    array('item_text' => 'Size: SMB'),
                    array('item_text' => 'Sector: IT Consultancy')
                )
            ),
            array(
                'section_title' => 'Focus Areas',
                'section_items' => array(
                    array('item_text' => 'Document Management'),
                    array('item_text' => 'Intranet'),
                    array('item_text' => 'Policy Management')
                )
            )
        )
    ), $post_id);
    
    // Client Section
    update_field('client_section', array(
        'client_name' => 'Haseet Sanghrajka',
        'client_designation' => 'CEO',
        'client_company' => '',
        'client_content' => 'City Dynamics is a leading provider of Microsoft Dynamics 365 solutions for financial and professional services in London. They help businesses transform operations with tailored Microsoft business solutions.'
    ), $post_id);
    
    // Content Sections
    update_field('content_sections', array(
        array(
            'section_title' => 'The Challenges',
            'icon_color' => '#e91e63',
            'section_content' => 'City Dynamics\' approach to SharePoint was, in CEO Haseet Sanghrajka\'s words, "old-fashioned." Documents were spread across OneDrive, SharePoint, and Teams, with no centralised structure or visibility.',
            'section_quotes' => array(
                array('quote_text' => 'We were doing the work, but we had nowhere to collaborate internally before sharing it with clients on a secure external team site.')
            ),
            'section_bullet_points' => array()
        )
    ), $post_id);
    
    // Testimonial Quote
    update_field('testimonial_quote', array(
        'quote_text' => 'Working with this team was exceptional. They delivered beyond our expectations and transformed how we collaborate internally.',
        'quote_author' => 'Haseet Sanghrajka, CEO at City Dynamics'
    ), $post_id);
    
    // CTA Section
    update_field('cta_section', array(
        'cta_title' => 'Ready to Start Your Project?',
        'cta_content' => 'Let\'s discuss how we can help you achieve similar results.',
        'cta_buttons' => array(
            array(
                'button_text' => 'Get Started',
                'button_url' => '/contact',
                'button_style' => 'primary'
            ),
            array(
                'button_text' => 'View More Cases',
                'button_url' => '/case-studies',
                'button_style' => 'secondary'
            )
        )
    ), $post_id);
}

/**
 * Add template selection in admin
 */
function add_case_study_template_meta_box() {
    add_meta_box(
        'case_study_template',
        'Case Study Template',
        'case_study_template_meta_box_callback',
        'case_study',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'add_case_study_template_meta_box');

/**
 * Template meta box callback
 */
function case_study_template_meta_box_callback($post) {
    wp_nonce_field('case_study_template_nonce', 'case_study_template_nonce');
    
    echo '<p><strong>Template Information:</strong></p>';
    echo '<p>This case study uses a predefined template with all fields organized in sections. Simply fill out the fields below and they will appear in the correct layout on the frontend.</p>';
    
    echo '<p><strong>Current Template:</strong> Default Template</p>';
    
    echo '<div style="background: #f0f0f1; padding: 15px; border-radius: 5px; margin: 15px 0;">';
    echo '<h4>Template Structure:</h4>';
    echo '<ul>';
    echo '<li><strong>Header Section</strong> - Logo, title, subtitle with gradient background</li>';
    echo '<li><strong>Sidebar Section</strong> - Client information organized in sections</li>';
    echo '<li><strong>Client Section</strong> - Meet the client with photo and details</li>';
    echo '<li><strong>Content Sections</strong> - Challenges, solutions, results with icons</li>';
    echo '<li><strong>Testimonial Quote</strong> - Featured client testimonial</li>';
    echo '<li><strong>CTA Section</strong> - Call-to-action buttons</li>';
    echo '</ul>';
    echo '</div>';
    
    echo '<p><em>All fields are available in the editor below. The frontend will automatically display them in the correct layout matching your design.</em></p>';
}

/**
 * Save template selection
 */
function save_case_study_template_meta($post_id) {
    if (!isset($_POST['case_study_template_nonce']) || 
        !wp_verify_nonce($_POST['case_study_template_nonce'], 'case_study_template_nonce')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Template selection is informational only now
    update_post_meta($post_id, '_case_study_template', 'default');
}
add_action('save_post', 'save_case_study_template_meta');