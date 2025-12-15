<?php
/**
 * Import More Years Content Block ACF Field Group
 * 
 * Run this script once to import the ACF field group for the More Years Content Block.
 * This is a one-time setup script that should be run after theme activation.
 * 
 * Usage: Include this file in functions.php or run it manually in wp-admin
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Import More Years Content Block ACF Field Group
 */
function import_moreyeahs_content_block_acf_fields() {
    // Check if ACF is active
    if (!function_exists('acf_add_local_field_group')) {
        return false;
    }

    // Define the field group
    acf_add_local_field_group(array(
        'key' => 'group_moreyeahs_content_block',
        'title' => 'More Years Content Block',
        'fields' => array(
            array(
                'key' => 'field_moreyeahs_content_heading',
                'label' => 'Heading',
                'name' => 'heading',
                'type' => 'text',
                'instructions' => 'Enter the main heading for the content block',
                'required' => 1,
                'default_value' => 'Infosys Blockchain Technology Services for Enterprises',
                'placeholder' => 'Enter heading text',
                'maxlength' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_moreyeahs_content_description',
                'label' => 'Description',
                'name' => 'description',
                'type' => 'textarea',
                'instructions' => 'Enter the description text for the content block',
                'required' => 1,
                'default_value' => 'Infosys is helping clients create reliable, trusted and sustainable ecosystems for their businesses. We are driving enterprise wide adoption of blockchain-powered business networks across industries by building meaningful commercial/incentive models for all stakeholders in the ecosystem.',
                'placeholder' => 'Enter description text',
                'maxlength' => '',
                'rows' => 5,
                'new_lines' => 'wpautop',
            ),
            array(
                'key' => 'field_moreyeahs_content_image',
                'label' => 'Content Image',
                'name' => 'image',
                'type' => 'image',
                'instructions' => 'Upload an image for the content block (recommended size: 600x400px)',
                'required' => 1,
                'return_format' => 'array',
                'preview_size' => 'medium',
                'library' => 'all',
                'min_width' => '',
                'min_height' => '',
                'min_size' => '',
                'max_width' => '',
                'max_height' => '',
                'max_size' => '',
                'mime_types' => 'jpg,jpeg,png,webp',
            ),
            array(
                'key' => 'field_moreyeahs_content_button_text',
                'label' => 'Button Text',
                'name' => 'button_text',
                'type' => 'text',
                'instructions' => 'Enter the text for the call-to-action button',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => 'READ MORE',
                'placeholder' => 'READ MORE',
                'maxlength' => '',
                'prepend' => '',
                'append' => '',
            ),
            array(
                'key' => 'field_moreyeahs_content_button_url',
                'label' => 'Button URL',
                'name' => 'button_url',
                'type' => 'url',
                'instructions' => 'Enter the URL for the call-to-action button',
                'required' => 0,
                'conditional_logic' => 0,
                'wrapper' => array(
                    'width' => '50',
                    'class' => '',
                    'id' => '',
                ),
                'default_value' => '',
                'placeholder' => 'https://example.com',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'block',
                    'operator' => '==',
                    'value' => 'acf/moreyeahs-content-block',
                ),
            ),
        ),
        'menu_order' => 0,
        'position' => 'normal',
        'style' => 'default',
        'label_placement' => 'top',
        'instruction_placement' => 'label',
        'hide_on_screen' => '',
        'active' => true,
        'description' => 'A content block with heading, description, image, and CTA button',
    ));

    return true;
}

/**
 * Hook to run the import function
 * Uncomment the line below to run the import on theme activation
 */
// add_action('after_setup_theme', 'import_moreyeahs_content_block_acf_fields');

/**
 * Manual import function for wp-admin
 * You can call this function manually in wp-admin or through WP-CLI
 */
function manually_import_moreyeahs_content_block() {
    if (current_user_can('manage_options')) {
        $result = import_moreyeahs_content_block_acf_fields();
        
        if ($result) {
            echo '<div class="notice notice-success"><p>More Years Content Block ACF fields imported successfully!</p></div>';
        } else {
            echo '<div class="notice notice-error"><p>Failed to import More Years Content Block ACF fields. Make sure ACF Pro is active.</p></div>';
        }
    }
}

/**
 * Add admin notice with import instructions
 */
function moreyeahs_content_block_admin_notice() {
    if (current_user_can('manage_options') && !get_option('moreyeahs_content_block_imported')) {
        ?>
        <div class="notice notice-info is-dismissible">
            <p>
                <strong>More Years Content Block:</strong> 
                ACF field group needs to be imported. 
                <a href="<?php echo admin_url('themes.php?page=acf-tools&tool=import'); ?>">Import ACF Fields</a>
                or run the import function manually.
            </p>
        </div>
        <?php
    }
}
add_action('admin_notices', 'moreyeahs_content_block_admin_notice');

/**
 * Mark as imported (call this after successful import)
 */
function mark_moreyeahs_content_block_imported() {
    update_option('moreyeahs_content_block_imported', true);
}

/**
 * Reset import status (for development/testing)
 */
function reset_moreyeahs_content_block_import_status() {
    delete_option('moreyeahs_content_block_imported');
}

// Uncomment to run import immediately (for development)
// import_moreyeahs_content_block_acf_fields();
// mark_moreyeahs_content_block_imported();