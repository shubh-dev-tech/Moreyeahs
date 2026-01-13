<?php
/**
 * FAQ Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'faq-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'faq-section';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$background_type = get_field('background_type') ?: 'gradient';
$background_color = get_field('background_color') ?: '#e0f7fa';
$gradient_start_color = get_field('gradient_start_color') ?: '#e0f7fa';
$gradient_end_color = get_field('gradient_end_color') ?: '#b2ebf2';
$background_image = get_field('background_image');
$section_height = get_field('section_height') ?: 'auto';
$title_part1 = get_field('title_part1') ?: 'Frequently Asked';
$title_part2 = get_field('title_part2') ?: 'Questions';
$title_color = get_field('title_color') ?: '#1a365d';
$title_highlight_color = get_field('title_highlight_color') ?: '#0ea5e9';
$title_font_size = get_field('title_font_size') ?: '2.5rem';
$faq_items = get_field('faq_items') ?: [];

// Generate background style
$background_style = '';
$section_style = '';

// Set height
if ($section_height && $section_height !== 'auto') {
    $section_style .= 'height: ' . esc_attr($section_height) . '; min-height: ' . esc_attr($section_height) . '; display: flex; align-items: center;';
}

switch ($background_type) {
    case 'color':
        $background_style = 'background: ' . esc_attr($background_color) . ';';
        break;
    case 'gradient':
        $background_style = 'background: linear-gradient(135deg, ' . esc_attr($gradient_start_color) . ' 0%, ' . esc_attr($gradient_end_color) . ' 100%);';
        break;
    case 'image':
        if ($background_image && isset($background_image['url'])) {
            $background_style = 'background-image: url(' . esc_url($background_image['url']) . '); background-size: cover; background-position: center; background-repeat: no-repeat;';
        } else {
            // Fallback to gradient if no image
            $background_style = 'background: linear-gradient(135deg, ' . esc_attr($gradient_start_color) . ' 0%, ' . esc_attr($gradient_end_color) . ' 100%);';
        }
        break;
    default:
        $background_style = 'background: linear-gradient(135deg, ' . esc_attr($gradient_start_color) . ' 0%, ' . esc_attr($gradient_end_color) . ' 100%);';
        break;
}

$full_section_style = $background_style . $section_style;
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>" style="<?php echo $full_section_style; ?>">
    <div class="container">
        <div class="faq-section__content">
            <h2 class="faq-section__title" style="color: <?php echo esc_attr($title_color); ?>; font-size: <?php echo esc_attr($title_font_size); ?>;">
                <?php echo esc_html($title_part1); ?> 
                <span class="highlight" style="color: <?php echo esc_attr($title_highlight_color); ?>;"><?php echo esc_html($title_part2); ?></span>
            </h2>
            
            <?php if ($faq_items): ?>
                <div class="faq-section__items">
                    <?php foreach ($faq_items as $index => $item): ?>
                        <?php 
                        $question = $item['question'] ?? '';
                        $answer = $item['answer'] ?? '';
                        if ($question && $answer): 
                        ?>
                            <div class="faq-item" data-faq-item="<?php echo $index; ?>">
                                <button class="faq-item__question" 
                                        type="button" 
                                        aria-expanded="false" 
                                        aria-controls="faq-answer-<?php echo $index; ?>"
                                        data-faq-toggle>
                                    <span class="faq-item__question-text"><?php echo esc_html($question); ?></span>
                                    <span class="faq-item__icon" aria-hidden="true">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </span>
                                </button>
                                <div class="faq-item__answer" 
                                     id="faq-answer-<?php echo $index; ?>" 
                                     aria-hidden="true">
                                    <div class="faq-item__answer-content">
                                        <?php echo wp_kses_post($answer); ?>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const faqToggles = document.querySelectorAll('[data-faq-toggle]');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-item__answer');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    const otherItem = otherToggle.closest('.faq-item');
                    const otherAnswer = otherItem.querySelector('.faq-item__answer');
                    
                    otherToggle.setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                    otherItem.classList.remove('faq-item--open');
                }
            });
            
            // Toggle current item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.setAttribute('aria-hidden', 'true');
                faqItem.classList.remove('faq-item--open');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
                faqItem.classList.add('faq-item--open');
            }
        });
    });
});
</script>