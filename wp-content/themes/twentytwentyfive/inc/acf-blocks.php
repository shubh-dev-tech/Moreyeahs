<?php
/**
 * ACF Blocks Registration and Management
 * 
 * Centralized file for registering and enqueuing all ACF blocks.
 * Add new blocks to the $blocks array below.
 * 
 * @package Twenty Twenty-Five
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all ACF blocks
 */
function twentytwentyfive_register_acf_blocks() {
    // Check if ACF function exists
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    /**
     * Array of blocks to register
     * 
     * Each block should have:
     * - name: Block identifier (without 'acf/' prefix)
     * - title: Display name in editor
     * - description: Brief description
     * - category: Block category (common, formatting, layout, widgets, embed)
     * - icon: Dashicon name or custom SVG
     * - keywords: Array of search keywords
     * - render_template: Path to PHP template file (relative to theme root)
     * - enqueue_style: (optional) Path to CSS file
     * - enqueue_script: (optional) Path to JS file
     * - supports: (optional) Array of supported features
     */
    $blocks = array(
        // Promo Block
        array(
            'name'              => 'promo-block',
            'title'             => __('Promo Block', 'twentytwentyfive'),
            'description'       => __('A promotional banner with background image, heading, sub-heading, and CTA button', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('promo', 'banner', 'cta', 'promotional'),
            'render_template'   => 'blocks/promo-block.php',
            'enqueue_style'     => '', // Styles are inline in template
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Ring the Sound of Opportunity',
                        'sub_heading' => 'Move 1,000+1,000 Lives Forward',
                        'button_text' => 'READ MORE',
                        'button_link' => '#',
                    ),
                ),
            ),
        ),
        
        // Full Width Left Text Section Block
        array(
            'name'              => 'full-width-left-text-section',
            'title'             => __('Full Width Left Text Section', 'twentytwentyfive'),
            'description'       => __('A full-width section with left-aligned text content and right image', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'align-left',
            'keywords'          => array('full', 'width', 'text', 'section', 'case', 'studies'),
            'render_template'   => 'blocks/full-width-left-text-section.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/full-width-left-text-section.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('wide', 'full'),
                'anchor' => true,
                'mode'   => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Sample Heading',
                        'sub_heading' => 'Sample subheading text',
                    ),
                ),
            ),
        ),
        
        // Image Grid Hover Block
        array(
            'name'              => 'image-grid-hover',
            'title'             => __('Image Grid Hover', 'twentytwentyfive'),
            'description'       => __('Image grid with hover effects - 1 large image + 4 smaller images in 2x2 grid', 'twentytwentyfive'),
            'category'          => 'media',
            'icon'              => 'grid-view',
            'keywords'          => array('image', 'grid', 'hover', 'gallery'),
            'render_template'   => 'blocks/image-grid-hover/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/image-grid-hover/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align' => array('wide', 'full'),
                'mode'  => true,
                'jsx'   => true,
            ),
        ),
        
        // Icon Text Grid Block
        array(
            'name'              => 'icon-text-grid',
            'title'             => __('Icon Text Grid', 'twentytwentyfive'),
            'description'       => __('Flexible grid with text and icons that rotate on hover', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'grid-view',
            'keywords'          => array('icon', 'grid', 'text', 'link', 'clickable'),
            'render_template'   => 'blocks/icon-text-grid/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/icon-text-grid/style.css',
            'enqueue_script'    => get_template_directory_uri() . '/blocks/icon-text-grid/script.js',
            'supports'          => array(
                'align'  => true,
                'anchor' => true,
                'mode'   => true,
                'jsx'    => true,
            ),
        ),
        
        // Add more blocks here following the same structure
        // Example:
        // array(
        //     'name'              => 'testimonial-block',
        //     'title'             => __('Testimonial Block', 'twentytwentyfive'),
        //     'description'       => __('Display customer testimonials', 'twentytwentyfive'),
        //     'category'          => 'formatting',
        //     'icon'              => 'format-quote',
        //     'keywords'          => array('testimonial', 'review', 'quote'),
        //     'render_template'   => 'blocks/testimonial-block.php',
        //     'enqueue_style'     => get_template_directory_uri() . '/assets/css/testimonial-block.css',
        //     'enqueue_script'    => get_template_directory_uri() . '/assets/js/testimonial-block.js',
        //     'supports'          => array(
        //         'align' => true,
        //         'mode'  => true,
        //     ),
        // ),
    );

    // Register each block
    foreach ($blocks as $block) {
        // Build block type arguments
        $block_args = array(
            'name'              => $block['name'],
            'title'             => $block['title'],
            'description'       => $block['description'],
            'category'          => $block['category'],
            'icon'              => $block['icon'],
            'keywords'          => $block['keywords'],
            'render_template'   => $block['render_template'],
        );

        // Add optional parameters if they exist
        if (!empty($block['enqueue_style'])) {
            $block_args['enqueue_style'] = $block['enqueue_style'];
        }

        if (!empty($block['enqueue_script'])) {
            $block_args['enqueue_script'] = $block['enqueue_script'];
        }

        if (!empty($block['supports'])) {
            $block_args['supports'] = $block['supports'];
        }

        if (!empty($block['example'])) {
            $block_args['example'] = $block['example'];
        }

        if (!empty($block['mode'])) {
            $block_args['mode'] = $block['mode'];
        }

        // Register the block
        acf_register_block_type($block_args);
    }
}
add_action('acf/init', 'twentytwentyfive_register_acf_blocks');

/**
 * Enqueue block assets globally (if needed)
 * Use this for shared styles/scripts across multiple blocks
 */
function twentytwentyfive_enqueue_block_assets() {
    // Example: Enqueue shared block styles
    // wp_enqueue_style(
    //     'acf-blocks-shared',
    //     get_template_directory_uri() . '/assets/css/blocks-shared.css',
    //     array(),
    //     wp_get_theme()->get('Version')
    // );
}
add_action('enqueue_block_assets', 'twentytwentyfive_enqueue_block_assets');

/**
 * Add custom block category for ACF blocks (optional)
 */
function twentytwentyfive_custom_block_category($categories) {
    return array_merge(
        $categories,
        array(
            array(
                'slug'  => 'custom-blocks',
                'title' => __('Custom Blocks', 'twentytwentyfive'),
                'icon'  => 'admin-customizer',
            ),
        )
    );
}
add_filter('block_categories_all', 'twentytwentyfive_custom_block_category', 10, 1);
