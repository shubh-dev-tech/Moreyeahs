<?php
/**
 * Register Testimonials Custom Post Type
 */

function register_testimonials_cpt() {
    $labels = array(
        'name'                  => _x('Testimonials', 'Post Type General Name', 'twentytwentyfive-child'),
        'singular_name'         => _x('Testimonial', 'Post Type Singular Name', 'twentytwentyfive-child'),
        'menu_name'             => __('Testimonials', 'twentytwentyfive-child'),
        'name_admin_bar'        => __('Testimonial', 'twentytwentyfive-child'),
        'archives'              => __('Testimonial Archives', 'twentytwentyfive-child'),
        'attributes'            => __('Testimonial Attributes', 'twentytwentyfive-child'),
        'parent_item_colon'     => __('Parent Testimonial:', 'twentytwentyfive-child'),
        'all_items'             => __('All Testimonials', 'twentytwentyfive-child'),
        'add_new_item'          => __('Add New Testimonial', 'twentytwentyfive-child'),
        'add_new'               => __('Add New', 'twentytwentyfive-child'),
        'new_item'              => __('New Testimonial', 'twentytwentyfive-child'),
        'edit_item'             => __('Edit Testimonial', 'twentytwentyfive-child'),
        'update_item'           => __('Update Testimonial', 'twentytwentyfive-child'),
        'view_item'             => __('View Testimonial', 'twentytwentyfive-child'),
        'view_items'            => __('View Testimonials', 'twentytwentyfive-child'),
        'search_items'          => __('Search Testimonial', 'twentytwentyfive-child'),
        'not_found'             => __('Not found', 'twentytwentyfive-child'),
        'not_found_in_trash'    => __('Not found in Trash', 'twentytwentyfive-child'),
        'featured_image'        => __('Client Avatar', 'twentytwentyfive-child'),
        'set_featured_image'    => __('Set client avatar', 'twentytwentyfive-child'),
        'remove_featured_image' => __('Remove client avatar', 'twentytwentyfive-child'),
        'use_featured_image'    => __('Use as client avatar', 'twentytwentyfive-child'),
        'insert_into_item'      => __('Insert into testimonial', 'twentytwentyfive-child'),
        'uploaded_to_this_item' => __('Uploaded to this testimonial', 'twentytwentyfive-child'),
        'items_list'            => __('Testimonials list', 'twentytwentyfive-child'),
        'items_list_navigation' => __('Testimonials list navigation', 'twentytwentyfive-child'),
        'filter_items_list'     => __('Filter testimonials list', 'twentytwentyfive-child'),
    );

    $args = array(
        'label'                 => __('Testimonial', 'twentytwentyfive-child'),
        'description'           => __('Client testimonials and reviews', 'twentytwentyfive-child'),
        'labels'                => $labels,
        'supports'              => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'taxonomies'            => array('testimonial_category'),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-testimonial',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
        'rest_base'             => 'testimonials',
        'rest_controller_class' => 'WP_REST_Posts_Controller',
    );

    register_post_type('testimonial', $args);
}
add_action('init', 'register_testimonials_cpt', 0);

/**
 * Register Testimonial Category Taxonomy
 */
function register_testimonial_category_taxonomy() {
    $labels = array(
        'name'                       => _x('Testimonial Categories', 'Taxonomy General Name', 'twentytwentyfive-child'),
        'singular_name'              => _x('Testimonial Category', 'Taxonomy Singular Name', 'twentytwentyfive-child'),
        'menu_name'                  => __('Categories', 'twentytwentyfive-child'),
        'all_items'                  => __('All Categories', 'twentytwentyfive-child'),
        'parent_item'                => __('Parent Category', 'twentytwentyfive-child'),
        'parent_item_colon'          => __('Parent Category:', 'twentytwentyfive-child'),
        'new_item_name'              => __('New Category Name', 'twentytwentyfive-child'),
        'add_new_item'               => __('Add New Category', 'twentytwentyfive-child'),
        'edit_item'                  => __('Edit Category', 'twentytwentyfive-child'),
        'update_item'                => __('Update Category', 'twentytwentyfive-child'),
        'view_item'                  => __('View Category', 'twentytwentyfive-child'),
        'separate_items_with_commas' => __('Separate categories with commas', 'twentytwentyfive-child'),
        'add_or_remove_items'        => __('Add or remove categories', 'twentytwentyfive-child'),
        'choose_from_most_used'      => __('Choose from the most used', 'twentytwentyfive-child'),
        'popular_items'              => __('Popular Categories', 'twentytwentyfive-child'),
        'search_items'               => __('Search Categories', 'twentytwentyfive-child'),
        'not_found'                  => __('Not Found', 'twentytwentyfive-child'),
        'no_terms'                   => __('No categories', 'twentytwentyfive-child'),
        'items_list'                 => __('Categories list', 'twentytwentyfive-child'),
        'items_list_navigation'      => __('Categories list navigation', 'twentytwentyfive-child'),
    );

    $args = array(
        'labels'                     => $labels,
        'hierarchical'               => true,
        'public'                     => true,
        'show_ui'                    => true,
        'show_admin_column'          => true,
        'show_in_nav_menus'          => true,
        'show_tagcloud'              => true,
        'show_in_rest'               => true,
        'rest_base'                  => 'testimonial_categories',
        'rest_controller_class'      => 'WP_REST_Terms_Controller',
    );

    register_taxonomy('testimonial_category', array('testimonial'), $args);
}
add_action('init', 'register_testimonial_category_taxonomy', 0);

/**
 * Register ACF Fields for Testimonials CPT
 */
function register_testimonial_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_testimonial_fields',
            'title' => 'Testimonial Details',
            'fields' => array(
                array(
                    'key' => 'field_testimonial_quote',
                    'label' => 'Quote',
                    'name' => 'testimonial_quote',
                    'type' => 'textarea',
                    'instructions' => 'Enter the testimonial quote',
                    'required' => 1,
                    'rows' => 4,
                ),
                array(
                    'key' => 'field_testimonial_client_name',
                    'label' => 'Client Name',
                    'name' => 'client_name',
                    'type' => 'text',
                    'instructions' => 'Enter the client\'s full name',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_testimonial_client_position',
                    'label' => 'Client Position',
                    'name' => 'client_position',
                    'type' => 'text',
                    'instructions' => 'Enter the client\'s job title/position',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_testimonial_client_company',
                    'label' => 'Client Company',
                    'name' => 'client_company',
                    'type' => 'text',
                    'instructions' => 'Enter the client\'s company name',
                    'required' => 0,
                ),
                array(
                    'key' => 'field_testimonial_rating',
                    'label' => 'Rating',
                    'name' => 'rating',
                    'type' => 'number',
                    'instructions' => 'Enter rating from 1 to 5',
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
add_action('acf/init', 'register_testimonial_acf_fields');
