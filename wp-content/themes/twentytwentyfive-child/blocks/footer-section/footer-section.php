<?php
/**
 * Footer Section Block Template
 * 
 * @package MoreYeahs
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get block fields
$logo = get_field('logo');
$company_description = get_field('company_description') ?: 'We are committed to making meaningful contributions to the environment and society. As a global technology leader, MoreYeahs aims to automate digital literacy and foster sustainable, self-sufficient communities.';
$company_columns = get_field('company_columns') ?: array();
$about_columns = get_field('about_columns') ?: array();
$career_columns = get_field('career_columns') ?: array();
$services_columns = get_field('services_columns') ?: array();
$social_links = get_field('social_links') ?: array();
$follow_us_text = get_field('follow_us_text') ?: 'Follow Us';
$copyright_text = get_field('copyright_text') ?: '© ' . date('Y') . ' MoreYeahs. All rights reserved.';
$privacy_policy_link = get_field('privacy_policy_link');
$terms_of_use_link = get_field('terms_of_use_link');
$background_color = get_field('background_color') ?: '#f8f9fa';
$text_color = get_field('text_color') ?: '#333333';
$link_color = get_field('link_color') ?: '#666666';
$link_hover_color = get_field('link_hover_color') ?: '#000000';

// Block attributes
$block_id = 'footer-section-' . $block['id'];
$class_name = 'footer-section-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Social icons mapping
$social_icons = array(
    'linkedin' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    'twitter' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
    'facebook' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    'instagram' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    'youtube' => '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
);

// Helper function to render column
if (!function_exists('render_footer_column')) {
    function render_footer_column($title, $columns) {
        if (empty($columns)) return;
        
        echo '<div class="footer-column">';
        echo '<h3 class="footer-column-title">' . esc_html($title) . '</h3>';
        
        foreach ($columns as $column) {
            echo '<div class="footer-column-section">';
            if (!empty($column['title'])) {
                echo '<h4 class="footer-section-title">' . esc_html($column['title']) . '</h4>';
            }
            
            if (!empty($column['links'])) {
                echo '<ul class="footer-links">';
                foreach ($column['links'] as $link) {
                    if (!empty($link['label']) && !empty($link['url'])) {
                        $target = !empty($link['target']) ? $link['target'] : '_self';
                        echo '<li><a href="' . esc_url($link['url']) . '" target="' . esc_attr($target) . '" class="footer-link">' . esc_html($link['label']) . '</a></li>';
                    }
                }
                echo '</ul>';
            }
            echo '</div>';
        }
        echo '</div>';
    }
}
?>

<footer 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>; --link-color: <?php echo esc_attr($link_color); ?>; --link-hover-color: <?php echo esc_attr($link_hover_color); ?>;"
>
    <div class="container">
        <div class="footer-content">
            <!-- Logo and Description Column -->
            <div class="footer-brand">
                <?php if ($logo): ?>
                    <div class="footer-logo">
                        <img src="<?php echo esc_url($logo['url']); ?>" alt="<?php echo esc_attr($logo['alt'] ?: 'Company Logo'); ?>" />
                    </div>
                <?php endif; ?>
                
                <?php if ($company_description): ?>
                    <p class="footer-description"><?php echo esc_html($company_description); ?></p>
                <?php endif; ?>
            </div>

            <!-- Navigation Columns -->
            <div class="footer-navigation">
                <?php 
                render_footer_column('Company', $company_columns);
                render_footer_column('About', $about_columns);
                render_footer_column('Career', $career_columns);
                render_footer_column('Services', $services_columns);
                ?>
            </div>

            <!-- Social Links Column -->
            <?php if (!empty($social_links)): ?>
                <div class="footer-social">
                    <h3 class="footer-column-title"><?php echo esc_html($follow_us_text); ?></h3>
                    <div class="social-links">
                        <?php foreach ($social_links as $social): ?>
                            <?php if (!empty($social['platform']) && !empty($social['url'])): ?>
                                <a 
                                    href="<?php echo esc_url($social['url']); ?>" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    class="social-link"
                                    aria-label="Follow us on <?php echo esc_attr($social['platform']); ?>"
                                >
                                    <?php echo $social_icons[$social['platform']] ?? ''; ?>
                                </a>
                            <?php endif; ?>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="footer-copyright">
                <span><?php echo esc_html($copyright_text); ?></span>
            </div>
            <div class="footer-legal">
                <?php if (!empty($privacy_policy_link['url']) && !empty($privacy_policy_link['label'])): ?>
                    <a 
                        href="<?php echo esc_url($privacy_policy_link['url']); ?>" 
                        target="<?php echo esc_attr($privacy_policy_link['target'] ?: '_self'); ?>"
                        class="footer-legal-link"
                    >
                        <?php echo esc_html($privacy_policy_link['label']); ?>
                    </a>
                <?php endif; ?>
                
                <?php if (!empty($terms_of_use_link['url']) && !empty($terms_of_use_link['label'])): ?>
                    <a 
                        href="<?php echo esc_url($terms_of_use_link['url']); ?>" 
                        target="<?php echo esc_attr($terms_of_use_link['target'] ?: '_self'); ?>"
                        class="footer-legal-link"
                    >
                        <?php echo esc_html($terms_of_use_link['label']); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</footer>