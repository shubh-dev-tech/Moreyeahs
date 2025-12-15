<?php
/**
 * Mega Menu Custom Post Type and ACF Fields
 */

if (!defined('ABSPATH')) exit;

// Register Mega Menu CPT
function register_mega_menu_cpt() {
    register_post_type('mega_menu', [
        'labels' => [
            'name' => 'Mega Menus',
            'singular_name' => 'Mega Menu',
            'add_new' => 'Add New Mega Menu',
            'add_new_item' => 'Add New Mega Menu',
            'edit_item' => 'Edit Mega Menu',
            'new_item' => 'New Mega Menu',
            'view_item' => 'View Mega Menu',
            'search_items' => 'Search Mega Menus',
            'not_found' => 'No mega menus found',
            'not_found_in_trash' => 'No mega menus found in trash'
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'thumbnail'],
        'menu_icon' => 'dashicons-menu-alt',
        'has_archive' => false,
        'rewrite' => ['slug' => 'mega-menu']
    ]);
}
add_action('init', 'register_mega_menu_cpt');

// Register ACF fields for Mega Menu
function register_mega_menu_acf_fields() {
    if (!function_exists('acf_add_local_field_group')) return;

    acf_add_local_field_group([
        'key' => 'group_mega_menu',
        'title' => 'Mega Menu Configuration',
        'fields' => [
            [
                'key' => 'field_mega_menu_type',
                'label' => 'Menu Type',
                'name' => 'menu_type',
                'type' => 'select',
                'choices' => [
                    'services' => 'Services',
                    'industries' => 'Industries',
                    'platforms' => 'Platforms',
                    'custom' => 'Custom'
                ],
                'default_value' => 'services'
            ],
            [
                'key' => 'field_mega_menu_heading',
                'label' => 'Main Heading',
                'name' => 'main_heading',
                'type' => 'text',
                'default_value' => 'Services'
            ],
            [
                'key' => 'field_mega_menu_categories',
                'label' => 'Menu Categories',
                'name' => 'menu_categories',
                'type' => 'repeater',
                'layout' => 'block',
                'button_label' => 'Add Category',
                'sub_fields' => [
                    [
                        'key' => 'field_category_icon',
                        'label' => 'Icon',
                        'name' => 'icon',
                        'type' => 'text',
                        'placeholder' => 'e.g., 🎯 or icon class'
                    ],
                    [
                        'key' => 'field_category_title',
                        'label' => 'Category Title',
                        'name' => 'title',
                        'type' => 'text',
                        'required' => true
                    ],
                    [
                        'key' => 'field_category_items',
                        'label' => 'Menu Items',
                        'name' => 'items',
                        'type' => 'repeater',
                        'layout' => 'table',
                        'button_label' => 'Add Item',
                        'sub_fields' => [
                            [
                                'key' => 'field_item_title',
                                'label' => 'Title',
                                'name' => 'title',
                                'type' => 'text',
                                'required' => true
                            ],
                            [
                                'key' => 'field_item_url',
                                'label' => 'URL',
                                'name' => 'url',
                                'type' => 'url',
                                'required' => true
                            ]
                        ]
                    ]
                ]
            ],
            [
                'key' => 'field_mega_menu_featured',
                'label' => 'Featured Content',
                'name' => 'featured_content',
                'type' => 'group',
                'sub_fields' => [
                    [
                        'key' => 'field_featured_enable',
                        'label' => 'Enable Featured Section',
                        'name' => 'enable',
                        'type' => 'true_false',
                        'default_value' => false
                    ],
                    [
                        'key' => 'field_featured_image',
                        'label' => 'Featured Image',
                        'name' => 'image',
                        'type' => 'image',
                        'return_format' => 'array',
                        'conditional_logic' => [
                            [
                                [
                                    'field' => 'field_featured_enable',
                                    'operator' => '==',
                                    'value' => '1'
                                ]
                            ]
                        ]
                    ],
                    [
                        'key' => 'field_featured_title',
                        'label' => 'Title',
                        'name' => 'title',
                        'type' => 'text',
                        'conditional_logic' => [
                            [
                                [
                                    'field' => 'field_featured_enable',
                                    'operator' => '==',
                                    'value' => '1'
                                ]
                            ]
                        ]
                    ],
                    [
                        'key' => 'field_featured_description',
                        'label' => 'Description',
                        'name' => 'description',
                        'type' => 'textarea',
                        'rows' => 3,
                        'conditional_logic' => [
                            [
                                [
                                    'field' => 'field_featured_enable',
                                    'operator' => '==',
                                    'value' => '1'
                                ]
                            ]
                        ]
                    ]
                ]
            ]
        ],
        'location' => [
            [
                [
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'mega_menu'
                ]
            ]
        ]
    ]);
}
add_action('acf/init', 'register_mega_menu_acf_fields');
