<?php
/**
 * Plugin Name: Testimonials Custom Post Type
 * Description: Adds a custom post type for testimonials with ACF fields
 * Version: 1.0
 * Author: MoreYeahs
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class TestimonialsCPT {
    
    public function __construct() {
        add_action('init', array($this, 'register_testimonials_cpt'));
        add_action('rest_api_init', array($this, 'register_rest_fields'));
        add_action('acf/init', array($this, 'register_acf_fields'));
    }
    
    /**
     * Register Testimonials Custom Post Type
     */
    public function register_testimonials_cpt() {
        $labels = array(
            'name'                  => 'Testimonials',
            'singular_name'         => 'Testimonial',
            'menu_name'             => 'Testimonials',
            'name_admin_bar'        => 'Testimonial',
            'archives'              => 'Testimonial Archives',
            'attributes'            => 'Testimonial Attributes',
            'parent_item_colon'     => 'Parent Testimonial:',
            'all_items'             => 'All Testimonials',
            'add_new_item'          => 'Add New Testimonial',
            'add_new'               => 'Add New',
            'new_item'              => 'New Testimonial',
            'edit_item'             => 'Edit Testimonial',
            'update_item'           => 'Update Testimonial',
            'view_item'             => 'View Testimonial',
            'view_items'            => 'View Testimonials',
            'search_items'          => 'Search Testimonial',
            'not_found'             => 'Not found',
            'not_found_in_trash'    => 'Not found in Trash',
            'featured_image'        => 'Featured Image',
            'set_featured_image'    => 'Set featured image',
            'remove_featured_image' => 'Remove featured image',
            'use_featured_image'    => 'Use as featured image',
            'insert_into_item'      => 'Insert into testimonial',
            'uploaded_to_this_item' => 'Uploaded to this testimonial',
            'items_list'            => 'Testimonials list',
            'items_list_navigation' => 'Testimonials list navigation',
            'filter_items_list'     => 'Filter testimonials list',
        );
        
        $args = array(
            'label'                 => 'Testimonial',
            'description'           => 'Client testimonials and reviews',
            'labels'                => $labels,
            'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'hierarchical'          => false,
            'public'                => true,
            'show_ui'               => true,
            'show_in_menu'          => true,
            'menu_position'         => 20,
            'menu_icon'             => 'dashicons-format-quote',
            'show_in_admin_bar'     => true,
            'show_in_nav_menus'     => true,
            'can_export'            => true,
            'has_archive'           => true,
            'exclude_from_search'   => false,
            'publicly_queryable'    => true,
            'capability_type'       => 'post',
            'show_in_rest'          => true,
            'rest_base'             => 'testimonials',
        );
        
        register_post_type('testimonial', $args);
    }
    
    /**
     * Register REST API fields for testimonials
     */
    public function register_rest_fields() {
        register_rest_field('testimonial', 'acf', array(
            'get_callback' => array($this, 'get_acf_fields'),
            'schema' => null,
        ));
    }
    
    /**
     * Get ACF fields for REST API
     */
    public function get_acf_fields($object) {
        if (function_exists('get_fields')) {
            return get_fields($object['id']);
        }
        return array();
    }
    
    /**
     * Register ACF Fields for Testimonials
     */
    public function register_acf_fields() {
        if (function_exists('acf_add_local_field_group')) {
            acf_add_local_field_group(array(
                'key' => 'group_testimonials',
                'title' => 'Testimonial Details',
                'fields' => array(
                    array(
                        'key' => 'field_testimonial_quote',
                        'label' => 'Quote',
                        'name' => 'quote',
                        'type' => 'textarea',
                        'instructions' => 'Enter the testimonial quote',
                        'required' => 1,
                        'rows' => 4,
                    ),
                    array(
                        'key' => 'field_client_name',
                        'label' => 'Client Name',
                        'name' => 'client_name',
                        'type' => 'text',
                        'instructions' => 'Enter the client\'s full name',
                        'required' => 1,
                    ),
                    array(
                        'key' => 'field_client_position',
                        'label' => 'Client Position',
                        'name' => 'client_position',
                        'type' => 'text',
                        'instructions' => 'Enter the client\'s job title or position',
                        'required' => 0,
                    ),
                    array(
                        'key' => 'field_client_company',
                        'label' => 'Client Company',
                        'name' => 'client_company',
                        'type' => 'text',
                        'instructions' => 'Enter the client\'s company name',
                        'required' => 0,
                    ),
                    array(
                        'key' => 'field_client_avatar',
                        'label' => 'Client Avatar',
                        'name' => 'client_avatar',
                        'type' => 'image',
                        'instructions' => 'Upload the client\'s photo or avatar',
                        'required' => 0,
                        'return_format' => 'array',
                        'preview_size' => 'thumbnail',
                        'library' => 'all',
                    ),
                    array(
                        'key' => 'field_rating',
                        'label' => 'Rating',
                        'name' => 'rating',
                        'type' => 'number',
                        'instructions' => 'Enter a rating from 1 to 5 stars',
                        'required' => 0,
                        'default_value' => 5,
                        'min' => 1,
                        'max' => 5,
                        'step' => 1,
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'testimonial',
                        ),
                    ),
                ),
                'menu_order' => 0,
                'position' => 'normal',
                'style' => 'default',
                'label_placement' => 'top',
                'instruction_placement' => 'label',
            ));
        }
    }
}

// Initialize the plugin
new TestimonialsCPT();

?>