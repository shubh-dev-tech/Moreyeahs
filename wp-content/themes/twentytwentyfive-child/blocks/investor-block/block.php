<?php
/**
 * Investor Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'investor-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'investor-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values from ACF fields
$decorative_line = get_field('decorative_line') ?: '| | | | | | | | | |';
$main_title = get_field('main_title') ?: 'Investors';
$subtitle = get_field('subtitle');
$featured_image = get_field('featured_image');
$featured_title = get_field('featured_title');
$featured_link = get_field('featured_link');
$sidebar_title = get_field('sidebar_title') ?: 'Investor central';
$results_items = get_field('results_items');
$archived_items = get_field('archived_items');
$event_items = get_field('event_items');
$view_all_text = get_field('view_all_text') ?: 'VIEW ALL';
$view_all_link = get_field('view_all_link');
?>

<section id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="investor-block__container">
        <!-- Header Section -->
        <div class="investor-block__header">
            <?php if ($decorative_line): ?>
                <div class="investor-block__decorative-line"><?php echo esc_html($decorative_line); ?></div>
            <?php endif; ?>
            
            <h1 class="investor-block__main-title"><?php echo esc_html($main_title); ?></h1>
            
            <?php if ($subtitle): ?>
                <p class="investor-block__subtitle"><?php echo esc_html($subtitle); ?></p>
            <?php endif; ?>
        </div>

        <!-- Content Grid -->
        <div class="investor-block__grid">
            <!-- Left Column - Featured Image -->
            <div class="investor-block__featured">
                <?php if ($featured_image): ?>
                    <div class="investor-block__featured-image">
                        <img 
                            src="<?php echo esc_url($featured_image['url']); ?>" 
                            alt="<?php echo esc_attr($featured_image['alt'] ?: $featured_title ?: 'Featured image'); ?>" 
                        />
                        <div class="investor-block__featured-overlay"></div>
                        <?php if ($featured_title): ?>
                            <div class="investor-block__featured-content">
                                <?php if ($featured_link): ?>
                                    <a href="<?php echo esc_url($featured_link); ?>" class="investor-block__featured-title">
                                        <?php echo esc_html($featured_title); ?>
                                    </a>
                                <?php else: ?>
                                    <h2 class="investor-block__featured-title"><?php echo esc_html($featured_title); ?></h2>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Right Column - Investor Central -->
            <div class="investor-block__sidebar">
                <?php if ($sidebar_title): ?>
                    <h2 class="investor-block__sidebar-title"><?php echo esc_html($sidebar_title); ?></h2>
                <?php endif; ?>

                <div class="investor-block__sections">
                    <!-- Results Section -->
                    <?php if ($results_items && is_array($results_items) && count($results_items) > 0): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($results_items[0]['label'] ?: 'RESULTS'); ?>
                            </div>
                            <?php foreach ($results_items as $item): ?>
                                <div class="investor-block__item">
                                    <?php if (!empty($item['link'])): ?>
                                        <a href="<?php echo esc_url($item['link']); ?>" class="investor-block__item-link">
                                            <?php echo esc_html($item['title']); ?>
                                        </a>
                                    <?php else: ?>
                                        <span class="investor-block__item-text"><?php echo esc_html($item['title']); ?></span>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Archived Webcast Section -->
                    <?php if ($archived_items && is_array($archived_items) && count($archived_items) > 0): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($archived_items[0]['label'] ?: 'ARCHIVED WEBCAST'); ?>
                            </div>
                            <?php foreach ($archived_items as $item): ?>
                                <div class="investor-block__item">
                                    <?php if (!empty($item['link'])): ?>
                                        <a href="<?php echo esc_url($item['link']); ?>" class="investor-block__item-link">
                                            <?php echo esc_html($item['title']); ?>
                                        </a>
                                    <?php else: ?>
                                        <span class="investor-block__item-text"><?php echo esc_html($item['title']); ?></span>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Event Section -->
                    <?php if ($event_items && is_array($event_items) && count($event_items) > 0): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($event_items[0]['label'] ?: 'EVENT'); ?>
                            </div>
                            <?php foreach ($event_items as $item): ?>
                                <div class="investor-block__item">
                                    <?php if (!empty($item['link'])): ?>
                                        <a href="<?php echo esc_url($item['link']); ?>" class="investor-block__item-link">
                                            <?php echo esc_html($item['title']); ?>
                                        </a>
                                    <?php else: ?>
                                        <span class="investor-block__item-text"><?php echo esc_html($item['title']); ?></span>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>

                    <!-- View All Link -->
                    <?php if ($view_all_text && $view_all_link): ?>
                        <div class="investor-block__view-all">
                            <a href="<?php echo esc_url($view_all_link); ?>" class="investor-block__view-all-link">
                                <?php echo esc_html($view_all_text); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>
