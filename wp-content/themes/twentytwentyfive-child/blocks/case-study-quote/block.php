<?php
/**
 * Case Study Quote Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'case-study-quote-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'case-study-quote';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}

// Load values and assign defaults.
$quote_text = get_field('quote_text') ?: 'I wanted employees to concentrate on clients, not waste time creating file structures.';
$quote_author = get_field('quote_author');
$quote_position = get_field('quote_position');
$quote_company = get_field('quote_company');
$background_color = get_field('background_color') ?: '#e91e63';
$text_color = get_field('text_color') ?: '#ffffff';
$show_quotation_marks = get_field('show_quotation_marks') !== false ? get_field('show_quotation_marks') : true;
$quote_style = get_field('quote_style') ?: 'gradient';

// Don't render if quote text is empty or just whitespace
if (empty($quote_text) || trim($quote_text) === '') {
    return;
}

// Build inline styles
$quote_styles = array();
if ($quote_style === 'solid') {
    $quote_styles[] = 'background-color: ' . $background_color;
} else {
    // Default gradient style
    $quote_styles[] = 'background: linear-gradient(135deg, ' . $background_color . ' 0%, ' . adjustBrightness($background_color, -20) . ' 100%)';
}
$quote_styles[] = 'color: ' . $text_color;

// Helper function to adjust color brightness
function adjustBrightness($hex, $percent) {
    // Remove # if present
    $hex = ltrim($hex, '#');
    
    // Convert to RGB
    $r = hexdec(substr($hex, 0, 2));
    $g = hexdec(substr($hex, 2, 2));
    $b = hexdec(substr($hex, 4, 2));
    
    // Adjust brightness
    $r = max(0, min(255, $r + ($r * $percent / 100)));
    $g = max(0, min(255, $g + ($g * $percent / 100)));
    $b = max(0, min(255, $b + ($b * $percent / 100)));
    
    // Convert back to hex
    return sprintf("#%02x%02x%02x", $r, $g, $b);
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <blockquote class="case-study-quote__content" style="<?php echo esc_attr(implode('; ', $quote_styles)); ?>">
        <?php if ($show_quotation_marks): ?>
            <div class="case-study-quote__marks">
                <span class="case-study-quote__mark case-study-quote__mark--open">"</span>
            </div>
        <?php endif; ?>
        
        <p class="case-study-quote__text"><?php echo esc_html($quote_text); ?></p>
        
        <?php if ($quote_author || $quote_position || $quote_company): ?>
            <footer class="case-study-quote__attribution">
                <?php if ($quote_author): ?>
                    <cite class="case-study-quote__author"><?php echo esc_html($quote_author); ?></cite>
                <?php endif; ?>
                <?php if ($quote_position || $quote_company): ?>
                    <div class="case-study-quote__details">
                        <?php if ($quote_position): ?>
                            <span class="case-study-quote__position"><?php echo esc_html($quote_position); ?></span>
                        <?php endif; ?>
                        <?php if ($quote_company): ?>
                            <?php if ($quote_position): ?> • <?php endif; ?>
                            <span class="case-study-quote__company"><?php echo esc_html($quote_company); ?></span>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </footer>
        <?php endif; ?>
        
        <?php if ($show_quotation_marks): ?>
            <div class="case-study-quote__marks case-study-quote__marks--close">
                <span class="case-study-quote__mark case-study-quote__mark--close">"</span>
            </div>
        <?php endif; ?>
    </blockquote>
</div>