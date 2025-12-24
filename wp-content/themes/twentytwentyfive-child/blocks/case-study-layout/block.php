<?php
/**
 * Case Study Layout Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-layout-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-layout';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$enable_sidebar = get_field('enable_sidebar') !== false ? get_field('enable_sidebar') : true;
$sidebar_width = get_field('sidebar_width') ?: '300px';
$content_gap = get_field('content_gap') ?: '40px';
$container_max_width = get_field('container_max_width') ?: '1200px';

// Build inline styles
$layout_styles = array(
    'max-width: ' . $container_max_width,
    'gap: ' . $content_gap
);

$sidebar_styles = array(
    'width: ' . $sidebar_width,
    'min-width: ' . $sidebar_width
);

// Define allowed blocks for sidebar and content
$sidebar_allowed_blocks = array('acf/case-study-left-sidebar');
$content_allowed_blocks = array(
    'acf/meet-the-client',
    'acf/case-study-content-section',
    'acf/case-study-quote',
    'acf/case-study-cta',
    'core/paragraph',
    'core/heading',
    'core/image',
    'core/separator'
);

// Define template for content area
$content_template = array(
    array('acf/meet-the-client'),
    array('acf/case-study-content-section', array('section_type' => 'challenges')),
    array('acf/case-study-quote'),
    array('acf/case-study-content-section', array('section_type' => 'solution')),
    array('acf/case-study-content-section', array('section_type' => 'partner')),
    array('acf/case-study-content-section', array('section_type' => 'approach')),
    array('acf/case-study-content-section', array('section_type' => 'technology')),
    array('acf/case-study-content-section', array('section_type' => 'outcome')),
    array('acf/case-study-content-section', array('section_type' => 'efficiency')),
    array('acf/case-study-content-section', array('section_type' => 'lessons')),
    array('acf/case-study-cta')
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="case-study-layout__container" style="<?php echo esc_attr(implode('; ', $layout_styles)); ?>">
        <?php if ($enable_sidebar): ?>
            <div class="case-study-layout__sidebar" style="<?php echo esc_attr(implode('; ', $sidebar_styles)); ?>">
                <InnerBlocks 
                    allowedBlocks="<?php echo esc_attr(wp_json_encode($sidebar_allowed_blocks)); ?>"
                    template="<?php echo esc_attr(wp_json_encode(array(array('acf/case-study-left-sidebar')))); ?>"
                    templateLock="false" />
            </div>
        <?php endif; ?>
        
        <div class="case-study-layout__content">
            <InnerBlocks 
                allowedBlocks="<?php echo esc_attr(wp_json_encode($content_allowed_blocks)); ?>"
                template="<?php echo esc_attr(wp_json_encode($content_template)); ?>"
                templateLock="false" />
        </div>
    </div>
</div>