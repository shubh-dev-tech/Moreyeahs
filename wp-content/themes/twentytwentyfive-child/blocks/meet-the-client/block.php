<?php
/**
 * Meet the Client Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'meet-the-client-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'meet-the-client';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

// Load values and assign defaults.
$section_title = get_field('section_title') ?: 'Meet the Client';
$client_image = get_field('client_image');
$client_name = get_field('client_name') ?: 'Haseet Sanghrajka';
$client_designation = get_field('client_designation') ?: 'CEO';
$client_company = get_field('client_company');
$client_content = get_field('client_content');
$client_quote = get_field('client_quote');
$show_icon = get_field('show_icon') !== false ? get_field('show_icon') : true;
$section_icon = get_field('section_icon');
$icon_color = get_field('icon_color') ?: '#e91e63';

// Build inline styles for icon
$icon_styles = array(
    'color: ' . $icon_color
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="meet-client__header">
        <?php if ($show_icon): ?>
            <div class="meet-client__icon" style="<?php echo esc_attr(implode('; ', $icon_styles)); ?>">
                <?php if ($section_icon): ?>
                    <img src="<?php echo esc_url($section_icon['url']); ?>" 
                         alt="<?php echo esc_attr($section_title); ?>"
                         width="32" height="32">
                <?php else: ?>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <h2 class="meet-client__title"><?php echo esc_html($section_title); ?></h2>
    </div>
    
    <div class="meet-client__content">
        <?php if ($client_content): ?>
            <div class="meet-client__description">
                <?php echo wp_kses_post($client_content); ?>
            </div>
        <?php endif; ?>
        
        <div class="meet-client__profile">
            <?php if ($client_image): ?>
                <div class="meet-client__image">
                    <img src="<?php echo esc_url($client_image['url']); ?>" 
                         alt="<?php echo esc_attr($client_name); ?>"
                         width="80" height="80">
                </div>
            <?php endif; ?>
            
            <div class="meet-client__info">
                <h3 class="meet-client__name"><?php echo esc_html($client_name); ?></h3>
                <div class="meet-client__position">
                    <?php if ($client_designation): ?>
                        <span class="meet-client__designation"><?php echo esc_html($client_designation); ?></span>
                    <?php endif; ?>
                    <?php if ($client_company): ?>
                        <?php if ($client_designation): ?> • <?php endif; ?>
                        <span class="meet-client__company"><?php echo esc_html($client_company); ?></span>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        
        <?php if ($client_quote): ?>
            <blockquote class="meet-client__quote">
                <p><?php echo esc_html($client_quote); ?></p>
            </blockquote>
        <?php endif; ?>
    </div>
</div>