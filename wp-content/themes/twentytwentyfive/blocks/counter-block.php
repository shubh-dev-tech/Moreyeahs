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

<style>
#<?php echo esc_attr($block_id); ?> {
    padding: 100px 20px;
    background-color: #fff;
    width: 100%;
}

#<?php echo esc_attr($block_id); ?> .counter-block__container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

#<?php echo esc_attr($block_id); ?> .counter-block__header {
    text-align: center;
    margin-bottom: 80px;
    position: relative;
}

#<?php echo esc_attr($block_id); ?> .counter-block__heading {
    font-size: 56px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 24px 0;
    line-height: 1.1;
    letter-spacing: -0.02em;
    position: relative;
}

#<?php echo esc_attr($block_id); ?> .counter-block__heading::before {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #ddd 0%, #ddd 20%, transparent 20%, transparent 40%, #ddd 40%, #ddd 60%, transparent 60%, transparent 80%, #ddd 80%, #ddd 100%);
    margin: 0 auto 20px;
}

#<?php echo esc_attr($block_id); ?> .counter-block__sub-heading {
    font-size: 24px;
    color: #666;
    margin: 0 auto;
    line-height: 1.5;
    max-width: 700px;
    font-weight: 300;
}

#<?php echo esc_attr($block_id); ?> .counter-block__counters {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 60px;
    align-items: start;
    width: 100%;
}

#<?php echo esc_attr($block_id); ?> .counter-block__item {
    text-align: center;
    padding: 0;
}

#<?php echo esc_attr($block_id); ?> .counter-block__number {
    display: flex;
    align-items: baseline;
    justify-content: center;
    font-size: 80px;
    font-weight: 700;
    color: #1a1a1a;
    line-height: 1;
    margin-bottom: 16px;
    letter-spacing: -0.03em;
}

#<?php echo esc_attr($block_id); ?> .counter-block__prefix {
    font-size: 32px;
    margin-right: 4px;
    font-weight: 600;
    align-self: flex-start;
    padding-top: 8px;
}

#<?php echo esc_attr($block_id); ?> .counter-block__value {
    font-weight: 700;
}

#<?php echo esc_attr($block_id); ?> .counter-block__suffix {
    font-size: 48px;
    margin-left: 2px;
    font-weight: 600;
    align-self: flex-start;
    padding-top: 4px;
}

#<?php echo esc_attr($block_id); ?> .counter-block__label {
    font-size: 15px;
    color: #666;
    line-height: 1.6;
    margin: 0 auto;
    max-width: 280px;
    font-weight: 400;
}

@media (max-width: 992px) {
    #<?php echo esc_attr($block_id); ?> .counter-block__counters {
        grid-template-columns: repeat(2, 1fr);
        gap: 50px;
    }
}

@media (max-width: 768px) {
    #<?php echo esc_attr($block_id); ?> .counter-block__heading {
        font-size: 40px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__sub-heading {
        font-size: 18px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__counters {
        grid-template-columns: 1fr;
        gap: 60px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__number {
        font-size: 64px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__prefix {
        font-size: 26px;
        padding-top: 6px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__suffix {
        font-size: 38px;
    }
    
    #<?php echo esc_attr($block_id); ?> .counter-block__label {
        font-size: 14px;
        max-width: 250px;
    }
}
</style>

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
