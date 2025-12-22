<?php
/**
 * Infinity Testimonial Both Side Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'infinity-testimonial-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'infinity-testimonial-both-side';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$left_testimonial = get_field('left_testimonial') ?: array();
$right_testimonial = get_field('right_testimonial') ?: array();
$background_color = get_field('background_color') ?: '#f8f9fa';

?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="background-color: <?php echo esc_attr($background_color); ?>;">
    <div class="container">
        <div class="testimonials-wrapper">
            
            <?php if (!empty($left_testimonial)): ?>
                <div class="testimonial-side left-side">
                    <?php if (!empty($left_testimonial['quote'])): ?>
                        <blockquote class="testimonial-quote">
                            "<?php echo esc_html($left_testimonial['quote']); ?>"
                        </blockquote>
                    <?php endif; ?>
                    
                    <div class="testimonial-author">
                        <?php if (!empty($left_testimonial['author_image'])): ?>
                            <div class="author-image">
                                <img src="<?php echo esc_url($left_testimonial['author_image']['url']); ?>" alt="<?php echo esc_attr($left_testimonial['author_image']['alt']); ?>">
                            </div>
                        <?php endif; ?>
                        
                        <div class="author-info">
                            <?php if (!empty($left_testimonial['author_name'])): ?>
                                <h4 class="author-name"><?php echo esc_html($left_testimonial['author_name']); ?></h4>
                            <?php endif; ?>
                            
                            <?php if (!empty($left_testimonial['author_title'])): ?>
                                <p class="author-title"><?php echo esc_html($left_testimonial['author_title']); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
            <div class="infinity-divider">
                <div class="infinity-symbol">∞</div>
            </div>
            
            <?php if (!empty($right_testimonial)): ?>
                <div class="testimonial-side right-side">
                    <?php if (!empty($right_testimonial['quote'])): ?>
                        <blockquote class="testimonial-quote">
                            "<?php echo esc_html($right_testimonial['quote']); ?>"
                        </blockquote>
                    <?php endif; ?>
                    
                    <div class="testimonial-author">
                        <?php if (!empty($right_testimonial['author_image'])): ?>
                            <div class="author-image">
                                <img src="<?php echo esc_url($right_testimonial['author_image']['url']); ?>" alt="<?php echo esc_attr($right_testimonial['author_image']['alt']); ?>">
                            </div>
                        <?php endif; ?>
                        
                        <div class="author-info">
                            <?php if (!empty($right_testimonial['author_name'])): ?>
                                <h4 class="author-name"><?php echo esc_html($right_testimonial['author_name']); ?></h4>
                            <?php endif; ?>
                            
                            <?php if (!empty($right_testimonial['author_title'])): ?>
                                <p class="author-title"><?php echo esc_html($right_testimonial['author_title']); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
            
        </div>
    </div>
</div>