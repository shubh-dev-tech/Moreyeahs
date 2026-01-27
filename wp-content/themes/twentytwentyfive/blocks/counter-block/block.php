<?php
/**
 * Counter Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Get block fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$counters = get_field('counters');

// Generate unique block ID
$block_id = 'counter-block-' . uniqid();

// Check if block has content
if (empty($heading) && empty($sub_heading) && empty($counters)) {
    return;
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="counter-block">
    <div class="counter-block__container">
        <?php if (!empty($heading) || !empty($sub_heading)) : ?>
            <div class="counter-block__header">
                <?php if (!empty($heading)) : ?>
                    <h2 class="counter-block__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if (!empty($sub_heading)) : ?>
                    <p class="counter-block__sub-heading"><?php echo esc_html($sub_heading); ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        
        <?php if (!empty($counters) && is_array($counters)) : ?>
            <div class="counter-block__counters">
                <?php foreach ($counters as $counter) : ?>
                    <div class="counter-block__item">
                        <div class="counter-block__number">
                            <?php if (!empty($counter['prefix'])) : ?>
                                <span class="counter-block__prefix"><?php echo esc_html($counter['prefix']); ?></span>
                            <?php endif; ?>
                            
                            <span class="counter-block__value"><?php echo esc_html($counter['number']); ?></span>
                            
                            <?php if (!empty($counter['suffix'])) : ?>
                                <span class="counter-block__suffix"><?php echo esc_html($counter['suffix']); ?></span>
                            <?php endif; ?>
                        </div>
                        
                        <?php if (!empty($counter['label'])) : ?>
                            <p class="counter-block__label"><?php echo esc_html($counter['label']); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</section>
