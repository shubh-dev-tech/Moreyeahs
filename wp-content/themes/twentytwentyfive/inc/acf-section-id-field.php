<?php
/**
 * Enable anchor support for all ACF blocks
 * This allows blocks to use the built-in "HTML Anchor" field in WordPress
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enable anchor support for all ACF blocks
 * This makes the "HTML Anchor" field appear in the Advanced panel
 */
function twentytwentyfive_enable_anchor_for_acf_blocks($args, $name) {
    // Check if this is an ACF block
    if (strpos($name, 'acf/') !== 0) {
        return $args;
    }

    // Enable anchor support
    if (!isset($args['supports'])) {
        $args['supports'] = array();
    }
    
    $args['supports']['anchor'] = true;

    return $args;
}
add_filter('register_block_type_args', 'twentytwentyfive_enable_anchor_for_acf_blocks', 10, 2);
