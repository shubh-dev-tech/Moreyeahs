<?php
/**
 * Icon Text Grid Block
 * 
 * A flexible grid block with text and icon sections that are fully clickable
 * Icons rotate 360 degrees on hover
 */

$items = get_field('items');
$block_id = 'icon-text-grid-' . $block['id'];

if (!$items) {
    return;
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="icon-text-grid">
    <div class="icon-text-grid__container">
        <?php foreach ($items as $item): ?>
            <?php 
            $text = $item['text'] ?? '';
            $icon = $item['icon'] ?? null;
            $link = $item['link'] ?? '';
            ?>
            
            <a href="<?php echo esc_url($link); ?>" class="icon-text-grid__item">
                <div class="icon-text-grid__content">
                    <h3 class="icon-text-grid__text"><?php echo esc_html($text); ?></h3>
                    
                    <?php if ($icon): ?>
                        <div class="icon-text-grid__icon-wrapper">
                            <img 
                                src="<?php echo esc_url($icon['url']); ?>" 
                                alt="<?php echo esc_attr($icon['alt'] ?: $text); ?>"
                                class="icon-text-grid__icon"
                            />
                        </div>
                    <?php endif; ?>
                </div>
            </a>
        <?php endforeach; ?>
    </div>
</section>
