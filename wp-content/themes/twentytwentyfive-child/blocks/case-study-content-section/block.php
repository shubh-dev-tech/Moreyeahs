<?php
/**
 * Case Study Content Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-content-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-content-section';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

// Load values and assign defaults.
$section_type = get_field('section_type') ?: 'custom';
$section_title = get_field('section_title') ?: 'Section Title';
$section_icon = get_field('section_icon');
$section_content = get_field('section_content');
$section_quote = get_field('section_quote');
$bullet_points = get_field('bullet_points');
$show_divider = get_field('show_divider') !== false ? get_field('show_divider') : true;
$icon_color = get_field('icon_color') ?: '#e91e63';
$enable_section = get_field('enable_section') !== false ? get_field('enable_section') : true;

// Predefined section configurations
$section_configs = array(
    'challenges' => array(
        'title' => 'The Challenges',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    ),
    'solution' => array(
        'title' => 'The Solution',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19V1h-2v1H7V1H5v1H4.5C3.11 2 2 3.11 2 4.5v15C2 20.89 3.11 22 4.5 22h15c1.39 0 2.5-1.11 2.5-2.5v-15C22 3.11 20.89 2 19.5 2z"/></svg>'
    ),
    'partner' => array(
        'title' => 'The Partner',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99l-2.54 3.4c-.74.99-.74 2.31 0 3.3l2.54 3.4c.47.62 1.21.99 2.01.99h2v4h2z"/></svg>'
    ),
    'approach' => array(
        'title' => 'The Approach',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'
    ),
    'technology' => array(
        'title' => 'Technology & Innovation',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>'
    ),
    'outcome' => array(
        'title' => 'The Outcome',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    ),
    'efficiency' => array(
        'title' => 'Efficiency Benefits',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>'
    ),
    'lessons' => array(
        'title' => 'Lessons Learned and Future Plans',
        'default_icon' => '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
    )
);

// Use predefined config if section type matches
if (isset($section_configs[$section_type])) {
    $config = $section_configs[$section_type];
    if (!$section_title || $section_title === 'Section Title') {
        $section_title = $config['title'];
    }
    $default_icon_svg = $config['default_icon'];
} else {
    $default_icon_svg = '<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
}

// Don't render if section is disabled
if (!$enable_section) {
    return;
}

// Build inline styles for icon
$icon_styles = array(
    'color: ' . $icon_color
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?> section-type-<?php echo esc_attr($section_type); ?>">
    <div class="content-section__header">
        <div class="content-section__icon" style="<?php echo esc_attr(implode('; ', $icon_styles)); ?>">
            <?php if ($section_icon): ?>
                <img src="<?php echo esc_url($section_icon['url']); ?>" 
                     alt="<?php echo esc_attr($section_title); ?>"
                     width="32" height="32">
            <?php else: ?>
                <?php echo $default_icon_svg; ?>
            <?php endif; ?>
        </div>
        <h2 class="content-section__title"><?php echo esc_html($section_title); ?></h2>
    </div>
    
    <div class="content-section__content">
        <?php if ($section_content): ?>
            <div class="content-section__text">
                <?php echo wp_kses_post($section_content); ?>
            </div>
        <?php endif; ?>
        
        <?php if ($bullet_points): ?>
            <ul class="content-section__bullets">
                <?php foreach ($bullet_points as $bullet): ?>
                    <li><?php echo esc_html($bullet['bullet_text']); ?></li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>
        
        <?php if ($section_quote): ?>
            <blockquote class="content-section__quote">
                <p><?php echo esc_html($section_quote); ?></p>
            </blockquote>
        <?php endif; ?>
    </div>
    
    <?php if ($show_divider): ?>
        <div class="content-section__divider"></div>
    <?php endif; ?>
</div>