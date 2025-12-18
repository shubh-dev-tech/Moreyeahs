<?php
/**
 * Twenty Twenty-Five Child Theme Functions
 * 
 * This file preserves all parent theme functionality while allowing customizations
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue parent and child theme styles
 */
function twentytwentyfive_child_enqueue_styles() {
    // Get parent theme version for cache busting
    $parent_style = 'twentytwentyfive-style';
    $parent_theme = wp_get_theme('twentytwentyfive');
    
    // Enqueue parent theme stylesheet
    wp_enqueue_style($parent_style, 
        get_template_directory_uri() . '/style.css',
        array(),
        $parent_theme->get('Version')
    );
    
    // Enqueue child theme stylesheet
    wp_enqueue_style('twentytwentyfive-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array($parent_style),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'twentytwentyfive_child_enqueue_styles');

/**
 * Copy all ACF field groups from parent theme
 * This ensures all your custom blocks continue to work
 */
function twentytwentyfive_child_copy_acf_fields() {
    $parent_acf_path = get_template_directory() . '/acf-json';
    $child_acf_path = get_stylesheet_directory() . '/acf-json';
    
    // Create ACF JSON directory in child theme if it doesn't exist
    if (!file_exists($child_acf_path)) {
        wp_mkdir_p($child_acf_path);
    }
    
    // Copy ACF JSON files from parent to child theme
    if (is_dir($parent_acf_path)) {
        $files = glob($parent_acf_path . '/*.json');
        foreach ($files as $file) {
            $filename = basename($file);
            $destination = $child_acf_path . '/' . $filename;
            if (!file_exists($destination)) {
                copy($file, $destination);
            }
        }
    }
}
add_action('after_setup_theme', 'twentytwentyfive_child_copy_acf_fields');

/**
 * Include parent theme's custom functionality
 * This preserves all your custom blocks and API endpoints
 */
function twentytwentyfive_child_include_parent_functions() {
    $parent_inc_path = get_template_directory() . '/inc';
    
    // Include ACF blocks functionality
    if (file_exists($parent_inc_path . '/acf-blocks.php')) {
        require_once $parent_inc_path . '/acf-blocks.php';
    }
    
    // Include REST API endpoints
    if (file_exists($parent_inc_path . '/rest-api-endpoints.php')) {
        require_once $parent_inc_path . '/rest-api-endpoints.php';
    }
}
add_action('after_setup_theme', 'twentytwentyfive_child_include_parent_functions');

/**
 * Set ACF JSON load and save paths to child theme
 * This ensures field groups are managed in the child theme
 */
function twentytwentyfive_child_acf_json_load_point($paths) {
    // Remove original path
    unset($paths[0]);
    
    // Add child theme path
    $paths[] = get_stylesheet_directory() . '/acf-json';
    
    // Add parent theme path as fallback
    $paths[] = get_template_directory() . '/acf-json';
    
    return $paths;
}
add_filter('acf/settings/load_json', 'twentytwentyfive_child_acf_json_load_point');

function twentytwentyfive_child_acf_json_save_point($path) {
    return get_stylesheet_directory() . '/acf-json';
}
add_filter('acf/settings/save_json', 'twentytwentyfive_child_acf_json_save_point');

// Add your custom functions below this line

/**
 * Register Child Theme Specific ACF Blocks
 */
function twentytwentyfive_child_register_acf_blocks() {
    // Check if ACF function exists
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    // Roadmap Block
    acf_register_block_type(array(
        'name'              => 'roadmap-block',
        'title'             => __('Roadmap Block', 'twentytwentyfive'),
        'description'       => __('Roadmap section with sticky left content and scrollable right steps with counters', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'list-view',
        'keywords'          => array('roadmap', 'timeline', 'steps', 'sticky', 'scroll', 'counter'),
        'render_template'   => 'blocks/roadmap-block/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/roadmap-block/style.css',
        'enqueue_script'    => get_stylesheet_directory_uri() . '/blocks/roadmap-block/script.js',
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
                    'heading'          => 'ROADMAP',
                    'subheading'       => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                    'background_color' => '#1a0b2e',
                    'roadmap_steps'    => array(
                        array(
                            'heading'    => 'REGISTRATION',
                            'subheading' => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                        ),
                        array(
                            'heading'    => 'START A NEW PROJECT',
                            'subheading' => 'Together, Nino and Noa awaken the ancient secrets of a forgotten underwater civilization, exploring its mysteries and restoring its lost magic.',
                        ),
                    ),
                ),
            ),
        ),
    ));

    // Infinity Testimonial Both Side Block
    acf_register_block_type(array(
        'name'              => 'infinity-testimonial-both-side',
        'title'             => __('Infinity Testimonial Both Side', 'twentytwentyfive'),
        'description'       => __('Advanced testimonial block with infinite scroll, video support, rating section, and directional control', 'twentytwentyfive'),
        'category'          => 'formatting',
        'icon'              => 'format-quote',
        'keywords'          => array('testimonial', 'infinity', 'scroll', 'video', 'rating', 'reviews', 'slider'),
        'render_template'   => 'blocks/infinity-testimonial-both-side/block.php',
        'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/infinity-testimonial-both-side/style.css',
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
                    'show_rating'      => true,
                    'rating_text'      => 'Rated 4/5 by over 1 Lakh users',
                    'rating_stars'     => 4,
                    'heading'          => 'Words of praise from others about our presence.',
                    'scroll_direction' => 'left_to_right',
                    'testimonials'     => array(
                        array(
                            'content_type'   => 'text',
                            'quote'          => 'Their ability to capture our brand essence in every project is unparalleled - an invaluable creative collaborator.',
                            'author_name'    => 'Isabella Rodriguez',
                            'author_title'   => 'CEO and Co-founder',
                            'author_company' => 'ABC Company',
                        ),
                        array(
                            'content_type'   => 'text',
                            'quote'          => 'Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.',
                            'author_name'    => 'Gabrielle Williams',
                            'author_title'   => 'CEO and Co-founder',
                            'author_company' => 'ABC Company',
                        ),
                    ),
                ),
            ),
        ),
    ));
}
add_action('acf/init', 'twentytwentyfive_child_register_acf_blocks');

/**
 * Logo Persistence Across Theme Changes
 * Fixes the issue where logo becomes null when switching between parent and child themes
 */

/**
 * Preserve logo when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get logo from the old theme
    $old_logo = get_theme_mod('custom_logo');
    
    if ($old_logo && get_post($old_logo)) {
        // Store in option for the new theme to pick up
        update_option('custom_logo_id', $old_logo);
        
        // Also set it immediately in the new theme
        set_theme_mod('custom_logo', $old_logo);
    }
}, 10, 3);

/**
 * Restore logo after theme activation
 */
add_action('after_switch_theme', function() {
    $option_logo = get_option('custom_logo_id');
    $theme_logo = get_theme_mod('custom_logo');
    
    // If theme doesn't have logo but option does, restore it
    if (!$theme_logo && $option_logo && get_post($option_logo)) {
        set_theme_mod('custom_logo', $option_logo);
    }
    
    // If theme has logo but option doesn't, sync it
    if ($theme_logo && !$option_logo && get_post($theme_logo)) {
        update_option('custom_logo_id', $theme_logo);
    }
});

/**
 * Sync logo between theme mod and option when logo is updated
 */
add_action('customize_save_after', function() {
    $logo_id = get_theme_mod('custom_logo');
    if ($logo_id) {
        update_option('custom_logo_id', $logo_id);
    }
});

/**
 * Enhanced logo handling for appearance settings page
 */
add_action('admin_init', function() {
    // Sync logo when appearance settings are saved
    if (isset($_POST['appearance_settings_nonce']) && wp_verify_nonce($_POST['appearance_settings_nonce'], 'save_appearance_settings')) {
        if (isset($_POST['custom_logo'])) {
            $logo_id = absint($_POST['custom_logo']);
            if ($logo_id && get_post($logo_id)) {
                // Save to both locations
                set_theme_mod('custom_logo', $logo_id);
                update_option('custom_logo_id', $logo_id);
            } elseif (empty($_POST['custom_logo'])) {
                // Remove from both locations
                remove_theme_mod('custom_logo');
                delete_option('custom_logo_id');
            }
        }
    }
});
/**
 * Menu Persistence Across Theme Changes
 * Fixes the issue where menu assignments become lost when switching between parent and child themes
 */

/**
 * Preserve menu assignments when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get menu assignments from the old theme
    $old_locations = get_theme_mod('nav_menu_locations', []);
    
    if (!empty($old_locations)) {
        // Store in options for the new theme to pick up
        foreach ($old_locations as $location => $menu_id) {
            if ($menu_id && wp_get_nav_menu_object($menu_id)) {
                update_option("nav_menu_location_{$location}", $menu_id);
            }
        }
        
        // Also set them immediately in the new theme
        set_theme_mod('nav_menu_locations', $old_locations);
    }
}, 10, 3);

/**
 * Restore menu assignments after theme activation
 */
add_action('after_switch_theme', function() {
    $registered_locations = get_registered_nav_menus();
    $theme_locations = get_theme_mod('nav_menu_locations', []);
    $updated = false;
    
    foreach ($registered_locations as $location => $description) {
        $option_menu_id = get_option("nav_menu_location_{$location}");
        $theme_menu_id = isset($theme_locations[$location]) ? $theme_locations[$location] : null;
        
        // If theme doesn't have assignment but option does, restore it
        if (!$theme_menu_id && $option_menu_id && wp_get_nav_menu_object($option_menu_id)) {
            $theme_locations[$location] = $option_menu_id;
            $updated = true;
        }
        
        // If theme has assignment but option doesn't, sync it
        if ($theme_menu_id && !$option_menu_id && wp_get_nav_menu_object($theme_menu_id)) {
            update_option("nav_menu_location_{$location}", $theme_menu_id);
        }
    }
    
    if ($updated) {
        set_theme_mod('nav_menu_locations', $theme_locations);
    }
});

/**
 * Sync menu assignments when they are updated
 */
add_action('wp_update_nav_menu', function($menu_id, $menu_data = null) {
    // Sync current assignments to options
    $locations = get_theme_mod('nav_menu_locations', []);
    foreach ($locations as $location => $assigned_menu_id) {
        update_option("nav_menu_location_{$location}", $assigned_menu_id);
    }
}, 10, 2);