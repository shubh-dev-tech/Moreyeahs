<?php
/**
 * Moreyeahs Slider Block Registration
 * Add this to your theme's functions.php or include it
 */

// Register the Moreyeahs Slider block
function register_moreyeahs_slider_block() {
    // Register block
    register_block_type('moreyeahs/slider', array(
        'api_version' => 2,
        'title' => 'Moreyeahs Slider',
        'description' => 'A dynamic slider with image, heading, and CTA',
        'category' => 'media',
        'icon' => 'slides',
        'keywords' => array('slider', 'carousel', 'moreyeahs', 'hero'),
        'supports' => array(
            'align' => true,
        ),
        'attributes' => array(
            'slides' => array(
                'type' => 'array',
                'default' => array(),
            ),
        ),
        'editor_script' => 'moreyeahs-slider-block-editor',
        'editor_style' => 'moreyeahs-slider-block-editor-style',
        'render_callback' => 'render_moreyeahs_slider_block',
    ));
}
add_action('init', 'register_moreyeahs_slider_block');

// Render callback
function render_moreyeahs_slider_block($attributes, $content, $block) {
    $slides = isset($attributes['slides']) ? $attributes['slides'] : array();
    
    if (empty($slides)) {
        return '<div class="moreyeahs-slider-placeholder" style="padding: 40px; background: #f0f0f0; text-align: center; border: 2px dashed #ccc;"><p style="margin: 0; color: #666;">Add slides to your slider</p></div>';
    }
    
    $block_id = 'moreyeahs-slider-' . uniqid();
    
    ob_start();
    include get_template_directory() . '/blocks/moreyeahs-slider.php';
    return ob_get_clean();
}

// Enqueue block editor assets
function moreyeahs_slider_block_editor_assets() {
    wp_enqueue_script(
        'moreyeahs-slider-block-editor',
        get_template_directory_uri() . '/blocks/moreyeahs-slider-block.js',
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        filemtime(get_template_directory() . '/blocks/moreyeahs-slider-block.js')
    );
}
add_action('enqueue_block_editor_assets', 'moreyeahs_slider_block_editor_assets');

// Add slides data to REST API
add_action('rest_api_init', function() {
    register_rest_field(
        array('post', 'page'),
        'moreyeahs_slider_data',
        array(
            'get_callback' => function($object) {
                $post = get_post($object['id']);
                if (!$post) return array();
                
                $blocks = parse_blocks($post->post_content);
                $slider_data = array();
                
                foreach ($blocks as $block) {
                    if ($block['blockName'] === 'moreyeahs/slider') {
                        $slider_data[] = isset($block['attrs']['slides']) ? $block['attrs']['slides'] : array();
                    }
                }
                
                return $slider_data;
            },
            'schema' => array(
                'description' => 'Moreyeahs Slider data',
                'type' => 'array',
            ),
        )
    );
});

// Expose block to GraphQL
add_filter('graphql_blocks_allowed_block_types', function($allowed_blocks) {
    $allowed_blocks[] = 'moreyeahs/slider';
    return $allowed_blocks;
});
