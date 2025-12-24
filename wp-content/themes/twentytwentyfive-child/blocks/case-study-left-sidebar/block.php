<?php
/**
 * Case Study Left Sidebar Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-left-sidebar-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-left-sidebar';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

// Load values and assign defaults.
$sidebar_sections = get_field('sidebar_sections');
$background_color = get_field('background_color') ?: '#e91e63';
$text_color = get_field('text_color') ?: '#ffffff';
$show_download_buttons = get_field('show_download_buttons') !== false ? get_field('show_download_buttons') : true;
$download_buttons = get_field('download_buttons');

// Build inline styles
$sidebar_styles = array(
    'background-color: ' . $background_color,
    'color: ' . $text_color
);
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="<?php echo esc_attr(implode('; ', $sidebar_styles)); ?>">
    <div class="case-study-sidebar__content">
        <?php if ($sidebar_sections): ?>
            <?php foreach ($sidebar_sections as $section): ?>
                <div class="sidebar-section">
                    <?php if ($section['section_icon']): ?>
                        <div class="sidebar-section__icon">
                            <img src="<?php echo esc_url($section['section_icon']['url']); ?>" 
                                 alt="<?php echo esc_attr($section['section_title']); ?>"
                                 width="24" height="24">
                        </div>
                    <?php endif; ?>
                    
                    <h3 class="sidebar-section__title"><?php echo esc_html($section['section_title']); ?></h3>
                    
                    <?php if ($section['section_items']): ?>
                        <div class="sidebar-section__items">
                            <?php foreach ($section['section_items'] as $item): ?>
                                <div class="sidebar-item">
                                    <?php if ($item['item_label']): ?>
                                        <div class="sidebar-item__label"><?php echo esc_html($item['item_label']); ?></div>
                                    <?php endif; ?>
                                    <?php if ($item['item_value']): ?>
                                        <div class="sidebar-item__value"><?php echo esc_html($item['item_value']); ?></div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
        
        <?php if ($show_download_buttons && $download_buttons): ?>
            <div class="sidebar-downloads">
                <?php foreach ($download_buttons as $button): ?>
                    <a href="<?php echo esc_url($button['button_url']); ?>" 
                       class="sidebar-download-btn"
                       <?php echo $button['open_in_new_tab'] ? 'target="_blank" rel="noopener"' : ''; ?>>
                        <?php if ($button['button_icon']): ?>
                            <img src="<?php echo esc_url($button['button_icon']['url']); ?>" 
                                 alt="" width="16" height="16">
                        <?php endif; ?>
                        <?php echo esc_html($button['button_text']); ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>