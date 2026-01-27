<?php
/**
 * Footer Section Block
 * 
 * @package MoreYeahs
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register Footer Section Block
 */
function register_footer_section_block() {
    // Check if ACF is active
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    // Register the block
    acf_register_block_type(array(
        'name'              => 'footer-section',
        'title'             => __('Footer Section', 'moreyeahs'),
        'description'       => __('A dynamic footer section with customizable columns and social links.', 'moreyeahs'),
        'render_template'   => get_template_directory() . '/blocks/footer-section/footer-section.php',
        'category'          => 'moreyeahs-blocks',
        'icon'              => 'admin-links',
        'keywords'          => array('footer', 'links', 'social', 'contact'),
        'supports'          => array(
            'align'         => array('wide', 'full'),
            'anchor'        => true,
            'customClassName' => true,
        ),
        'example'           => array(
            'attributes' => array(
                'mode' => 'preview',
                'data' => array(
                    'company_description' => 'We are committed to making meaningful contributions to the environment and society.',
                    'follow_us_text' => 'Follow Us',
                    'copyright_text' => '© 2025 MoreYeahs. All rights reserved.'
                )
            )
        )
    ));
}

// Hook into ACF initialization
add_action('acf/init', 'register_footer_section_block');

/**
 * Enqueue block assets
 */
function footer_section_block_assets() {
    if (has_block('acf/footer-section')) {
        wp_enqueue_style(
            'footer-section-style',
            get_template_directory_uri() . '/blocks/footer-section/style.css',
            array(),
            filemtime(get_template_directory() . '/blocks/footer-section/style.css')
        );
    }
}
add_action('wp_enqueue_scripts', 'footer_section_block_assets');

/**
 * Add block category
 */
function add_moreyeahs_block_category($categories) {
    return array_merge(
        array(
            array(
                'slug'  => 'moreyeahs-blocks',
                'title' => __('MoreYeahs Blocks', 'moreyeahs'),
                'icon'  => 'admin-customizer',
            ),
        ),
        $categories
    );
}
add_filter('block_categories_all', 'add_moreyeahs_block_category', 10, 2);