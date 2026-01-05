<?php
/**
 * Text Image Alternating Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'text-image-alternating-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'text-image-alternating-block';
if (!empty($block['className'])) {
    $classes .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $classes .= ' align' . $block['align'];
}

// Get ACF fields
$background_image = get_field('background_image');
$main_heading = get_field('main_heading');
$main_subheading = get_field('main_subheading');
$content_sections = get_field('content_sections');

// Set default values for preview
if ($is_preview && empty($main_heading)) {
    $main_heading = 'What "We Mean Solution" Really Means';
    $main_subheading = 'Every solution we build is accountable to performance, scalability and business value.';
    $content_sections = array(
        array(
            'layout_type' => 'text-left',
            'text_content' => 'We don\'t sell technology — we solve business problems.',
            'section_image' => array(
                'url' => 'https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image',
                'alt' => 'Sample Image'
            )
        ),
        array(
            'layout_type' => 'text-right',
            'text_content' => 'We design for outcomes, not just delivery.',
            'section_image' => array(
                'url' => 'https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image+2',
                'alt' => 'Sample Image 2'
            )
        ),
        array(
            'layout_type' => 'text-left',
            'text_content' => 'We measure success by impact, not effort.',
            'section_image' => array(
                'url' => 'https://via.placeholder.com/400x200/0066cc/ffffff?text=Sample+Image+3',
                'alt' => 'Sample Image 3'
            )
        )
    );
}

// Build inline styles for background image
$background_style = '';
if ($background_image && !empty($background_image['url'])) {
    $background_style = 'background-image: url(' . esc_url($background_image['url']) . ');';
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($classes); ?>" style="<?php echo esc_attr($background_style); ?>">
    <div class="text-image-alternating-container">
        
        <?php if ($main_heading || $main_subheading): ?>
        <div class="text-image-alternating-header">
            <?php if ($main_heading): ?>
                <h2 class="text-image-alternating-heading"><?php echo esc_html($main_heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($main_subheading): ?>
                <p class="text-image-alternating-subheading"><?php echo esc_html($main_subheading); ?></p>
            <?php endif; ?>
        </div>
        <?php endif; ?>

        <?php if ($content_sections): ?>
        <div class="text-image-alternating-content">
            <?php foreach ($content_sections as $index => $section): ?>
                <?php 
                $layout_class = isset($section['layout_type']) ? $section['layout_type'] : 'text-left';
                $section_id = $id . '-section-' . ($index + 1);
                ?>
                
                <div class="content-section <?php echo esc_attr($layout_class); ?>" id="<?php echo esc_attr($section_id); ?>">
                    <div class="content-section-inner">
                        
                        <div class="text-content">
                            <?php if (!empty($section['text_content'])): ?>
                                <p><?php echo esc_html($section['text_content']); ?></p>
                            <?php endif; ?>
                        </div>
                        
                        <div class="image-content">
                            <?php if (!empty($section['section_image'])): ?>
                                <div class="image-wrapper">
                                    <img 
                                        src="<?php echo esc_url($section['section_image']['url']); ?>" 
                                        alt="<?php echo esc_attr($section['section_image']['alt'] ?: 'Section Image'); ?>"
                                        loading="lazy"
                                    />
                                </div>
                            <?php endif; ?>
                        </div>
                        
                    </div>
                </div>
                
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        
    </div>
</div>