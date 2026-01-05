<?php
/**
 * Sync Service Details Section ACF Fields
 * 
 * This script syncs the ACF field group for the Service Details Section block.
 * Run this after creating the block to ensure fields are available in WordPress admin.
 */

// WordPress environment setup
require_once 'wp-config.php';
require_once ABSPATH . 'wp-admin/includes/admin.php';

// Check if ACF is active
if (!function_exists('acf_add_local_field_group')) {
    die('Error: Advanced Custom Fields plugin is not active or not found.');
}

echo "Starting Service Details Section ACF field sync...\n";

// Define the field group
$field_group = array(
    'key' => 'group_service_details_section',
    'title' => 'Service Details Section',
    'fields' => array(
        array(
            'key' => 'field_sds_bg_color',
            'label' => 'Background Color',
            'name' => 'background_color',
            'type' => 'color_picker',
            'instructions' => 'Choose a background color for the section',
            'required' => 0,
            'default_value' => '#f8f9fa',
        ),
        array(
            'key' => 'field_sds_bg_image',
            'label' => 'Background Image',
            'name' => 'background_image',
            'type' => 'image',
            'instructions' => 'Upload a background image (optional - will overlay on background color)',
            'required' => 0,
            'return_format' => 'array',
        ),
        array(
            'key' => 'field_sds_heading',
            'label' => 'Main Heading',
            'name' => 'heading',
            'type' => 'text',
            'instructions' => 'Enter the main heading for the section',
            'required' => 1,
            'placeholder' => 'What We Mean by Solutions',
        ),
        array(
            'key' => 'field_sds_sub_heading',
            'label' => 'Sub Heading',
            'name' => 'sub_heading',
            'type' => 'textarea',
            'instructions' => 'Enter the sub heading text below the main heading',
            'required' => 0,
            'rows' => 2,
            'placeholder' => 'We bring you powerful advantages to navigate your digital transformation',
        ),
        array(
            'key' => 'field_sds_services',
            'label' => 'Services',
            'name' => 'services',
            'type' => 'repeater',
            'instructions' => 'Add service details with icons, titles, and descriptions',
            'required' => 1,
            'layout' => 'block',
            'button_label' => 'Add Service',
            'min' => 1,
            'max' => 12,
            'sub_fields' => array(
                array(
                    'key' => 'field_service_icon',
                    'label' => 'Service Icon',
                    'name' => 'service_icon',
                    'type' => 'image',
                    'instructions' => 'Upload an icon for this service (recommended: SVG or PNG, 64x64px)',
                    'required' => 1,
                    'return_format' => 'array',
                ),
                array(
                    'key' => 'field_service_title',
                    'label' => 'Service Title',
                    'name' => 'service_title',
                    'type' => 'text',
                    'instructions' => 'Enter the service title',
                    'required' => 1,
                    'placeholder' => 'Data Science & AI',
                ),
                array(
                    'key' => 'field_service_description',
                    'label' => 'Service Description',
                    'name' => 'service_description',
                    'type' => 'textarea',
                    'instructions' => 'Enter service description or list of features',
                    'required' => 0,
                    'rows' => 4,
                    'placeholder' => "• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization",
                ),
                array(
                    'key' => 'field_service_link',
                    'label' => 'Service Link',
                    'name' => 'service_link',
                    'type' => 'url',
                    'instructions' => 'Enter a URL for this service (optional)',
                    'required' => 0,
                    'placeholder' => 'https://example.com/service',
                ),
            ),
        ),
        array(
            'key' => 'field_sds_grid_columns',
            'label' => 'Grid Columns',
            'name' => 'grid_columns',
            'type' => 'select',
            'instructions' => 'Choose how many columns to display on desktop',
            'required' => 1,
            'choices' => array(
                '2' => '2 Columns',
                '3' => '3 Columns',
                '4' => '4 Columns',
            ),
            'default_value' => '3',
        ),
    ),
    'location' => array(
        array(
            array(
                'param' => 'block',
                'operator' => '==',
                'value' => 'acf/service-details-section',
            ),
        ),
    ),
);

try {
    // Add the field group
    acf_add_local_field_group($field_group);
    echo "✓ Service Details Section field group added successfully.\n";
    
    // Force sync fields to database
    if (function_exists('acf_sync_field_groups')) {
        acf_sync_field_groups();
        echo "✓ ACF fields synced to database.\n";
    }
    
    // Clear any caches
    if (function_exists('wp_cache_flush')) {
        wp_cache_flush();
        echo "✓ Cache cleared.\n";
    }
    
    echo "\n=== Service Details Section Block Setup Complete ===\n";
    echo "The block is now available in the WordPress block editor.\n";
    echo "Block name: Service Details Section\n";
    echo "Block category: Formatting\n";
    echo "Features:\n";
    echo "- Customizable background color and image\n";
    echo "- Main heading and sub-heading\n";
    echo "- Repeatable services with icons, titles, descriptions, and links\n";
    echo "- Responsive grid layout (2, 3, or 4 columns)\n";
    echo "- Mobile-friendly design\n\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>