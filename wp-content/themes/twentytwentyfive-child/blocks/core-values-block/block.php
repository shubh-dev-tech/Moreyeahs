<?php
/**
 * Core Values Block
 * 
 * Displays company core values in a grid layout with a team image and center content
 */

$values = get_field('values');
$team_image = get_field('team_image');
$center_heading = get_field('center_heading') ?: 'Push Beyond Boundaries';
$center_description = get_field('center_description') ?: 'We challenge the ordinary, question limits, and pursue bold ideas with courage. By stepping out of comfort zones, we drive innovation and open new possibilities. Pushing boundaries empowers us to stay ahead of change, inspire creativity, and achieve extraordinary results.';
$background_image = get_field('background_image');
$block_id = 'core-values-block-' . $block['id'];

if (!$values || count($values) === 0) {
    return;
}

// Split values into rows: 4 + 2 + 2 = 8 total
$row1_values = array_slice($values, 0, 4); // First 4 values
$row2_left = isset($values[4]) ? $values[4] : null; // 5th value
$row2_right = isset($values[5]) ? $values[5] : null; // 6th value
$row3_left = isset($values[6]) ? $values[6] : null; // 7th value
$row3_right = isset($values[7]) ? $values[7] : null; // 8th value
?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="core-values-block"
    <?php if ($background_image): ?>
        style="background-image: url('<?php echo esc_url($background_image['url']); ?>');"
    <?php endif; ?>
>
    <div class="core-values-block__container">
        <!-- Row 1: 4 Values -->
        <div class="core-values-block__row core-values-block__row--four">
            <?php foreach ($row1_values as $value): ?>
                <?php 
                $title = $value['title'] ?? '';
                $description = $value['description'] ?? '';
                ?>
                
                <div class="core-values-block__card">
                    <h3 class="core-values-block__card-title"><?php echo esc_html($title); ?></h3>
                    <p class="core-values-block__card-description"><?php echo esc_html($description); ?></p>
                </div>
            <?php endforeach; ?>
        </div>

        <!-- Row 2: Value + Team Image + Value -->
        <div class="core-values-block__row core-values-block__row--image">
            <?php if ($row2_left): ?>
                <div class="core-values-block__card">
                    <h3 class="core-values-block__card-title"><?php echo esc_html($row2_left['title'] ?? ''); ?></h3>
                    <p class="core-values-block__card-description"><?php echo esc_html($row2_left['description'] ?? ''); ?></p>
                </div>
            <?php endif; ?>
            
            <?php if ($team_image): ?>
                <div class="core-values-block__team-image">
                    <img 
                        src="<?php echo esc_url($team_image['url']); ?>" 
                        alt="<?php echo esc_attr($team_image['alt'] ?: 'Our Team'); ?>"
                        class="core-values-block__image"
                        loading="lazy"
                    />
                </div>
            <?php endif; ?>
            
            <?php if ($row2_right): ?>
                <div class="core-values-block__card">
                    <h3 class="core-values-block__card-title"><?php echo esc_html($row2_right['title'] ?? ''); ?></h3>
                    <p class="core-values-block__card-description"><?php echo esc_html($row2_right['description'] ?? ''); ?></p>
                </div>
            <?php endif; ?>
        </div>

        <!-- Row 3: Value + Center Content + Value -->
        <div class="core-values-block__row core-values-block__row--center">
            <?php if ($row3_left): ?>
                <div class="core-values-block__card">
                    <h3 class="core-values-block__card-title"><?php echo esc_html($row3_left['title'] ?? ''); ?></h3>
                    <p class="core-values-block__card-description"><?php echo esc_html($row3_left['description'] ?? ''); ?></p>
                </div>
            <?php endif; ?>
            
            <div class="core-values-block__center-text">
                <h2 class="core-values-block__center-heading"><?php echo esc_html($center_heading); ?></h2>
                <p class="core-values-block__center-description"><?php echo esc_html($center_description); ?></p>
            </div>
            
            <?php if ($row3_right): ?>
                <div class="core-values-block__card">
                    <h3 class="core-values-block__card-title"><?php echo esc_html($row3_right['title'] ?? ''); ?></h3>
                    <p class="core-values-block__card-description"><?php echo esc_html($row3_right['description'] ?? ''); ?></p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>
