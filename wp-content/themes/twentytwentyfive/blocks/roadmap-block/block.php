<?php
/**
 * Roadmap Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'roadmap-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'roadmap-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: '';
$subheading = get_field('subheading') ?: '';
$roadmap_items = get_field('roadmap_items') ?: array();
$layout = get_field('layout') ?: 'vertical'; // vertical or horizontal

?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?> layout-<?php echo esc_attr($layout); ?>">
    <div class="container">
        
        <?php if ($heading): ?>
            <h2 class="roadmap-heading"><?php echo esc_html($heading); ?></h2>
        <?php endif; ?>
        
        <?php if ($subheading): ?>
            <p class="roadmap-subheading"><?php echo esc_html($subheading); ?></p>
        <?php endif; ?>
        
        <?php if ($roadmap_items): ?>
            <div class="roadmap-timeline">
                <?php foreach ($roadmap_items as $index => $item): ?>
                    <div class="roadmap-item <?php echo !empty($item['is_completed']) ? 'completed' : ''; ?> <?php echo !empty($item['is_current']) ? 'current' : ''; ?>">
                        
                        <div class="roadmap-marker">
                            <div class="marker-dot">
                                <?php if (!empty($item['is_completed'])): ?>
                                    <span class="checkmark">✓</span>
                                <?php else: ?>
                                    <span class="step-number"><?php echo $index + 1; ?></span>
                                <?php endif; ?>
                            </div>
                            <?php if ($index < count($roadmap_items) - 1): ?>
                                <div class="connector-line"></div>
                            <?php endif; ?>
                        </div>
                        
                        <div class="roadmap-content">
                            <?php if (!empty($item['date'])): ?>
                                <div class="roadmap-date"><?php echo esc_html($item['date']); ?></div>
                            <?php endif; ?>
                            
                            <?php if (!empty($item['title'])): ?>
                                <h3 class="roadmap-title"><?php echo esc_html($item['title']); ?></h3>
                            <?php endif; ?>
                            
                            <?php if (!empty($item['description'])): ?>
                                <p class="roadmap-description"><?php echo esc_html($item['description']); ?></p>
                            <?php endif; ?>
                            
                            <?php if (!empty($item['link'])): ?>
                                <a href="<?php echo esc_url($item['link']); ?>" class="roadmap-link">Learn More</a>
                            <?php endif; ?>
                        </div>
                        
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
        
    </div>
</div>