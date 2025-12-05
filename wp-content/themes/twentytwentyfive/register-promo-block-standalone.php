<?php
/**
 * Standalone Promo Block Registration
 * Add this line to functions.php if the block still doesn't appear:
 * require_once get_template_directory() . '/register-promo-block-standalone.php';
 */

add_action('acf/init', 'standalone_register_promo_block', 5);

function standalone_register_promo_block() {
    // Check if ACF function exists
    if (!function_exists('acf_register_block_type')) {
        error_log('ACF acf_register_block_type function does not exist!');
        return;
    }

    error_log('Registering Promo Block...');

    // Register Promo Block
    $result = acf_register_block_type(array(
        'name'            => 'promo-block',
        'title'           => 'Promo Block',
        'description'     => 'A promotional banner with background image, heading, sub-heading, and CTA button',
        'render_template' => get_template_directory() . '/blocks/promo-block.php',
        'category'        => 'formatting',
        'icon'            => 'megaphone',
        'keywords'        => array('promo', 'banner', 'cta', 'promotional'),
        'supports'        => array(
            'align'  => array('full', 'wide'),
            'mode'   => true,
            'jsx'    => true,
            'anchor' => true,
        ),
        'example' => array(
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
    ));

    if ($result) {
        error_log('Promo Block registered successfully!');
    } else {
        error_log('Promo Block registration failed!');
    }
}
