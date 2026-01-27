<?php
/**
 * Promo Block Registration
 * Add this code to your theme's functions.php file
 */

// Register Promo Block
add_action('acf/init', 'register_promo_block');
function register_promo_block() {
    if (function_exists('acf_register_block_type')) {
        acf_register_block_type(array(
            'name'              => 'promo-block',
            'title'             => __('Promo Block'),
            'description'       => __('A promotional banner with background image, heading, sub-heading, and CTA button'),
            'render_template'   => 'template-parts/blocks/promo-block.php',
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('promo', 'banner', 'cta', 'promotional'),
            'supports'          => array(
                'align' => array('full', 'wide'),
                'mode' => true,
                'jsx' => true
            ),
            'example'  => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading' => 'Ring the Sound of Opportunity',
                        'sub_heading' => 'Move 1,000+1,000 Lives Forward',
                        'button_text' => 'READ MORE',
                        'button_link' => '#'
                    )
                )
            )
        ));
    }
}
