<?php
/**
 * Case Study Header Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-header-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-header';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$logo = get_field('logo');
$title = get_field('title') ?: 'City Dynamics';
$subtitle = get_field('subtitle') ?: 'Transforming Collaboration and Consultancy with SharePoint';
$background_image = get_field('background_image');
$gradient_overlay = get_field('gradient_overlay') !== false ? get_field('gradient_overlay') : true;
$gradient_colors = get_field('gradient_colors') ?: array(
    'color_1' => '#00bcd4',
    'color_2' => '#9c27b0'
);

// Build inline styles
$styles = array();
if ($background_image) {
    $styles[] = 'background-image: url(' . esc_url($background_image['url']) . ')';
}

$gradient_style = '';
if ($gradient_overlay) {
    $color1 = $gradient_colors['color_1'] ?: '#00bcd4';
    $color2 = $gradient_colors['color_2'] ?: '#9c27b0';
    $gradient_style = "background: linear-gradient(135deg, {$color1} 0%, {$color2} 100%)";
    if ($background_image) {
        $gradient_style = "background: linear-gradient(135deg, {$color1} 0%, {$color2} 100%), url(" . esc_url($background_image['url']) . ")";
        $gradient_style .= "; background-blend-mode: overlay";
    }
}

$style_attr = !empty($styles) ? ' style="' . implode('; ', $styles) . '"' : '';
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>"<?php echo $style_attr; ?>>
    <?php if ($gradient_overlay): ?>
        <div class="case-study-header__gradient" style="<?php echo esc_attr($gradient_style); ?>"></div>
    <?php endif; ?>
    
    <div class="case-study-header__content">
        <div class="case-study-header__container">
            <?php if ($logo): ?>
                <div class="case-study-header__logo">
                    <img src="<?php echo esc_url($logo['url']); ?>" 
                         alt="<?php echo esc_attr($logo['alt'] ?: $title); ?>"
                         width="<?php echo esc_attr($logo['width']); ?>"
                         height="<?php echo esc_attr($logo['height']); ?>">
                </div>
            <?php endif; ?>
            
            <div class="case-study-header__text">
                <h1 class="case-study-header__title"><?php echo esc_html($title); ?></h1>
                <?php if ($subtitle): ?>
                    <p class="case-study-header__subtitle"><?php echo esc_html($subtitle); ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>