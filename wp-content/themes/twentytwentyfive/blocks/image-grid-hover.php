<?php
/**
 * Image Grid Hover Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'image-grid-hover-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'image-grid-hover-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Get ACF fields
$section_heading = get_field('section_heading');
$section_subheading = get_field('section_subheading');
$images = array();

for ($i = 1; $i <= 5; $i++) {
    $image = get_field('image_' . $i);
    $heading = get_field('image_' . $i . '_heading');
    $subheading = get_field('image_' . $i . '_subheading');
    $text = get_field('image_' . $i . '_text');
    $url = get_field('image_' . $i . '_url');
    
    if ($image) {
        $images[] = array(
            'image' => $image,
            'heading' => $heading,
            'subheading' => $subheading,
            'text' => $text,
            'url' => $url
        );
    }
}

?>
<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <?php if ($section_heading || $section_subheading): ?>
        <div class="image-grid-header">
            <?php if ($section_heading): ?>
                <h2 class="section-heading"><?php echo esc_html($section_heading); ?></h2>
            <?php endif; ?>
            <?php if ($section_subheading): ?>
                <p class="section-subheading"><?php echo esc_html($section_subheading); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    
    <div class="image-grid-container">
        <?php foreach ($images as $index => $item): ?>
            <?php 
            $item_class = 'image-grid-item';
            if ($index === 0) {
                $item_class .= ' large-item';
            }
            ?>
            <div class="<?php echo esc_attr($item_class); ?>">
                <?php if ($item['url']): ?>
                    <a href="<?php echo esc_url($item['url']); ?>" class="image-grid-link">
                <?php endif; ?>
                
                <div class="image-wrapper">
                    <img 
                        src="<?php echo esc_url($item['image']['url']); ?>" 
                        alt="<?php echo esc_attr($item['image']['alt'] ?: $item['heading']); ?>"
                    />
                    <div class="image-overlay">
                        <?php if ($item['heading']): ?>
                            <h3 class="image-heading"><?php echo esc_html($item['heading']); ?></h3>
                        <?php endif; ?>
                        <?php if ($item['subheading']): ?>
                            <h4 class="image-subheading"><?php echo esc_html($item['subheading']); ?></h4>
                        <?php endif; ?>
                        <?php if ($item['text']): ?>
                            <p class="image-text"><?php echo esc_html($item['text']); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                
                <?php if ($item['url']): ?>
                    </a>
                <?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</section>
