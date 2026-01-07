<?php
/**
 * Footer Settings for WordPress Customizer
 * 
 * @package MoreYeahs
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add Footer Settings to WordPress Customizer
 */
function moreyeahs_footer_customizer_settings($wp_customize) {
    
    // Add Footer Section
    $wp_customize->add_section('moreyeahs_footer_settings', array(
        'title'    => __('Footer Settings', 'moreyeahs'),
        'priority' => 120,
    ));

    // Logo Setting
    $wp_customize->add_setting('footer_logo', array(
        'default'           => '',
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'footer_logo', array(
        'label'    => __('Footer Logo', 'moreyeahs'),
        'section'  => 'moreyeahs_footer_settings',
        'mime_type' => 'image',
    )));

    // Company Description
    $wp_customize->add_setting('footer_company_description', array(
        'default'           => 'We are committed to making meaningful contributions to the environment and society. As a global technology leader, MoreYeahs aims to automate digital literacy and foster sustainable, self-sufficient communities.',
        'sanitize_callback' => 'wp_kses_post',
    ));

    $wp_customize->add_control('footer_company_description', array(
        'label'   => __('Company Description', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'textarea',
    ));

    // Company Links
    for ($i = 1; $i <= 5; $i++) {
        $wp_customize->add_setting("footer_company_link_{$i}_label", array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control("footer_company_link_{$i}_label", array(
            'label'   => sprintf(__('Company Link %d - Label', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'text',
        ));

        $wp_customize->add_setting("footer_company_link_{$i}_url", array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("footer_company_link_{$i}_url", array(
            'label'   => sprintf(__('Company Link %d - URL', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'url',
        ));
    }

    // About Links
    for ($i = 1; $i <= 5; $i++) {
        $wp_customize->add_setting("footer_about_link_{$i}_label", array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control("footer_about_link_{$i}_label", array(
            'label'   => sprintf(__('About Link %d - Label', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'text',
        ));

        $wp_customize->add_setting("footer_about_link_{$i}_url", array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("footer_about_link_{$i}_url", array(
            'label'   => sprintf(__('About Link %d - URL', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'url',
        ));
    }

    // Career Links
    for ($i = 1; $i <= 5; $i++) {
        $wp_customize->add_setting("footer_career_link_{$i}_label", array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control("footer_career_link_{$i}_label", array(
            'label'   => sprintf(__('Career Link %d - Label', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'text',
        ));

        $wp_customize->add_setting("footer_career_link_{$i}_url", array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("footer_career_link_{$i}_url", array(
            'label'   => sprintf(__('Career Link %d - URL', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'url',
        ));
    }

    // Services Links
    for ($i = 1; $i <= 5; $i++) {
        $wp_customize->add_setting("footer_services_link_{$i}_label", array(
            'default'           => '',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control("footer_services_link_{$i}_label", array(
            'label'   => sprintf(__('Services Link %d - Label', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'text',
        ));

        $wp_customize->add_setting("footer_services_link_{$i}_url", array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("footer_services_link_{$i}_url", array(
            'label'   => sprintf(__('Services Link %d - URL', 'moreyeahs'), $i),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'url',
        ));
    }

    // Social Media Links
    $social_platforms = array(
        'linkedin' => 'LinkedIn',
        'twitter' => 'Twitter',
        'facebook' => 'Facebook',
        'instagram' => 'Instagram',
        'youtube' => 'YouTube'
    );

    foreach ($social_platforms as $platform => $label) {
        $wp_customize->add_setting("footer_social_{$platform}", array(
            'default'           => '',
            'sanitize_callback' => 'esc_url_raw',
        ));

        $wp_customize->add_control("footer_social_{$platform}", array(
            'label'   => sprintf(__('%s URL', 'moreyeahs'), $label),
            'section' => 'moreyeahs_footer_settings',
            'type'    => 'url',
        ));
    }

    // Follow Us Text
    $wp_customize->add_setting('footer_follow_us_text', array(
        'default'           => 'Follow Us',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('footer_follow_us_text', array(
        'label'   => __('Follow Us Text', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'text',
    ));

    // Copyright Text
    $wp_customize->add_setting('footer_copyright_text', array(
        'default'           => '© 2025 MoreYeahs. All rights reserved.',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('footer_copyright_text', array(
        'label'   => __('Copyright Text', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'text',
    ));

    // Privacy Policy Link
    $wp_customize->add_setting('footer_privacy_policy_label', array(
        'default'           => 'Privacy Policy',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('footer_privacy_policy_label', array(
        'label'   => __('Privacy Policy Label', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('footer_privacy_policy_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('footer_privacy_policy_url', array(
        'label'   => __('Privacy Policy URL', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'url',
    ));

    // Terms of Use Link
    $wp_customize->add_setting('footer_terms_of_use_label', array(
        'default'           => 'Terms of Use',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('footer_terms_of_use_label', array(
        'label'   => __('Terms of Use Label', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'text',
    ));

    $wp_customize->add_setting('footer_terms_of_use_url', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));

    $wp_customize->add_control('footer_terms_of_use_url', array(
        'label'   => __('Terms of Use URL', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
        'type'    => 'url',
    ));

    // Styling Options
    $wp_customize->add_setting('footer_background_color', array(
        'default'           => '#f8f9fa',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_background_color', array(
        'label'   => __('Background Color', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
    )));

    $wp_customize->add_setting('footer_text_color', array(
        'default'           => '#333333',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_text_color', array(
        'label'   => __('Text Color', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
    )));

    $wp_customize->add_setting('footer_link_color', array(
        'default'           => '#666666',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_link_color', array(
        'label'   => __('Link Color', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
    )));

    $wp_customize->add_setting('footer_link_hover_color', array(
        'default'           => '#000000',
        'sanitize_callback' => 'sanitize_hex_color',
    ));

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'footer_link_hover_color', array(
        'label'   => __('Link Hover Color', 'moreyeahs'),
        'section' => 'moreyeahs_footer_settings',
    )));
}
add_action('customize_register', 'moreyeahs_footer_customizer_settings');

/**
 * Get Footer Settings Data for REST API
 */
function get_footer_settings_data() {
    // Get logo data
    $logo_id = get_theme_mod('footer_logo');
    $logo_data = null;
    if ($logo_id) {
        $logo_url = wp_get_attachment_url($logo_id);
        $logo_alt = get_post_meta($logo_id, '_wp_attachment_image_alt', true);
        if ($logo_url) {
            $logo_data = array(
                'id' => intval($logo_id),
                'url' => $logo_url,
                'alt' => $logo_alt ?: get_bloginfo('name')
            );
        }
    }

    // Build company links
    $company_links = array();
    for ($i = 1; $i <= 5; $i++) {
        $label = get_theme_mod("footer_company_link_{$i}_label");
        $url = get_theme_mod("footer_company_link_{$i}_url");
        if ($label && $url) {
            $company_links[] = array(
                'label' => $label,
                'url' => $url,
                'target' => '_self'
            );
        }
    }

    // Build about links
    $about_links = array();
    for ($i = 1; $i <= 5; $i++) {
        $label = get_theme_mod("footer_about_link_{$i}_label");
        $url = get_theme_mod("footer_about_link_{$i}_url");
        if ($label && $url) {
            $about_links[] = array(
                'label' => $label,
                'url' => $url,
                'target' => '_self'
            );
        }
    }

    // Build career links
    $career_links = array();
    for ($i = 1; $i <= 5; $i++) {
        $label = get_theme_mod("footer_career_link_{$i}_label");
        $url = get_theme_mod("footer_career_link_{$i}_url");
        if ($label && $url) {
            $career_links[] = array(
                'label' => $label,
                'url' => $url,
                'target' => '_self'
            );
        }
    }

    // Build services links
    $services_links = array();
    for ($i = 1; $i <= 5; $i++) {
        $label = get_theme_mod("footer_services_link_{$i}_label");
        $url = get_theme_mod("footer_services_link_{$i}_url");
        if ($label && $url) {
            $services_links[] = array(
                'label' => $label,
                'url' => $url,
                'target' => '_self'
            );
        }
    }

    // Build social links
    $social_links = array();
    $social_platforms = array('linkedin', 'twitter', 'facebook', 'instagram', 'youtube');
    foreach ($social_platforms as $platform) {
        $url = get_theme_mod("footer_social_{$platform}");
        if ($url) {
            $social_links[] = array(
                'platform' => $platform,
                'url' => $url
            );
        }
    }

    // Build privacy policy link
    $privacy_policy_link = null;
    $privacy_label = get_theme_mod('footer_privacy_policy_label');
    $privacy_url = get_theme_mod('footer_privacy_policy_url');
    if ($privacy_label && $privacy_url) {
        $privacy_policy_link = array(
            'label' => $privacy_label,
            'url' => $privacy_url,
            'target' => '_self'
        );
    }

    // Build terms of use link
    $terms_of_use_link = null;
    $terms_label = get_theme_mod('footer_terms_of_use_label');
    $terms_url = get_theme_mod('footer_terms_of_use_url');
    if ($terms_label && $terms_url) {
        $terms_of_use_link = array(
            'label' => $terms_label,
            'url' => $terms_url,
            'target' => '_self'
        );
    }

    return array(
        'logo' => $logo_data,
        'company_description' => get_theme_mod('footer_company_description', 'We are committed to making meaningful contributions to the environment and society. As a global technology leader, MoreYeahs aims to automate digital literacy and foster sustainable, self-sufficient communities.'),
        'company_columns' => !empty($company_links) ? array(array('title' => '', 'links' => $company_links)) : array(),
        'about_columns' => !empty($about_links) ? array(array('title' => '', 'links' => $about_links)) : array(),
        'career_columns' => !empty($career_links) ? array(array('title' => '', 'links' => $career_links)) : array(),
        'services_columns' => !empty($services_links) ? array(array('title' => '', 'links' => $services_links)) : array(),
        'social_links' => $social_links,
        'follow_us_text' => get_theme_mod('footer_follow_us_text', 'Follow Us'),
        'copyright_text' => get_theme_mod('footer_copyright_text', '© ' . date('Y') . ' MoreYeahs. All rights reserved.'),
        'privacy_policy_link' => $privacy_policy_link,
        'terms_of_use_link' => $terms_of_use_link,
        'background_color' => get_theme_mod('footer_background_color', '#f8f9fa'),
        'text_color' => get_theme_mod('footer_text_color', '#333333'),
        'link_color' => get_theme_mod('footer_link_color', '#666666'),
        'link_hover_color' => get_theme_mod('footer_link_hover_color', '#000000')
    );
}