<?php
/**
 * Stories Blog Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'stories-blog-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'stories-blog-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: '';
$subheading = get_field('subheading') ?: '';
$stories = get_field('stories') ?: array();

?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="container">
        <?php if ($heading): ?>
            <h2 class="block-heading"><?php echo esc_html($heading); ?></h2>
        <?php endif; ?>
        
        <?php if ($subheading): ?>
            <p class="block-subheading"><?php echo esc_html($subheading); ?></p>
        <?php endif; ?>
        
        <?php if ($stories): ?>
            <div class="stories-grid">
                <?php foreach ($stories as $story): ?>
                    <div class="story-item">
                        <?php if (!empty($story['image'])): ?>
                            <div class="story-image">
                                <img src="<?php echo esc_url($story['image']['url']); ?>" alt="<?php echo esc_attr($story['image']['alt']); ?>">
                            </div>
                        <?php endif; ?>
                        
                        <div class="story-content">
                            <?php if (!empty($story['title'])): ?>
                                <h3 class="story-title"><?php echo esc_html($story['title']); ?></h3>
                            <?php endif; ?>
                            
                            <?php if (!empty($story['excerpt'])): ?>
                                <p class="story-excerpt"><?php echo esc_html($story['excerpt']); ?></p>
                            <?php endif; ?>
                            
                            <?php if (!empty($story['link'])): ?>
                                <a href="<?php echo esc_url($story['link']); ?>" class="story-link">Read More</a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>