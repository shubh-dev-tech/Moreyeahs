<?php
/**
 * More Years Content Block Template
 * 
 * A content block with heading, description, image, and CTA button
 * Displays content on the left and image on the right
 */

$heading = get_field('heading');
$description = get_field('description');
$image = get_field('image');
$button_text = get_field('button_text');
$button_url = get_field('button_url');
$reverse_layout = get_field('reverse_layout');
$block_id = 'moreyeahs-content-' . $block['id'];

if (!$heading && !$description && !$image) {
    return;
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="moreyeahs-content<?php echo $reverse_layout ? ' moreyeahs-content--reversed' : ''; ?>">
    <div class="moreyeahs-content__container">
        
        <div class="moreyeahs-content__wrapper">
            
            <div class="moreyeahs-content__text-content">
                
                <?php if ($heading): ?>
                    <h2 class="moreyeahs-content__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($description): ?>
                    <div class="moreyeahs-content__description">
                        <?php echo wp_kses_post(wpautop($description)); ?>
                    </div>
                <?php endif; ?>
                
                <?php if ($button_text && $button_url): ?>
                    <div class="moreyeahs-content__cta">
                        <a href="<?php echo esc_url($button_url); ?>" class="moreyeahs-content__button">
                            <?php echo esc_html($button_text); ?>
                        </a>
                    </div>
                <?php endif; ?>
                
            </div>
            
            <?php if ($image): ?>
                <div class="moreyeahs-content__image-wrapper">
                    <div class="moreyeahs-content__image">
                        <?php 
                        $image_alt = !empty($image['alt']) ? $image['alt'] : $heading;
                        ?>
                        <img 
                            src="<?php echo esc_url($image['url']); ?>" 
                            alt="<?php echo esc_attr($image_alt); ?>"
                            loading="lazy"
                        />
                    </div>
                </div>
            <?php endif; ?>
            
        </div>
        
    </div>
</section>