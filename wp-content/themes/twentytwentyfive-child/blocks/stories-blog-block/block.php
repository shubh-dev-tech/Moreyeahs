<?php
/**
 * Stories & Blog Block
 * 
 * Dynamic content block with auto-detecting post types, custom backgrounds, and latest 4 posts display
 */

// Get ACF fields
$heading = get_field('heading') ?: 'Success Stories';
$subheading = get_field('subheading') ?: 'Your partner through complexities of Agile and DevOps transformation';
$heading_color = get_field('heading_color') ?: '#ffffff';
$subheading_color = get_field('subheading_color') ?: '#ffffff';
$card_label = get_field('card_label') ?: '';
$post_type = get_field('post_type') ?: 'post';
$category = get_field('category') ?: '';
$button_text = get_field('button_text') ?: 'Show More';
$button_url = get_field('button_url') ?: '#';
$background_color = get_field('background_color') ?: '#4a148c';
$background_image = get_field('background_image');

// Prepare background image URL
$background_image_url = '';
if ($background_image && is_array($background_image)) {
    $background_image_url = $background_image['url'] ?? '';
} elseif ($background_image && is_string($background_image)) {
    $background_image_url = $background_image;
}

// Create unique ID for this block instance
$block_id = 'stories-blog-block-' . uniqid();
?>

<div class="stories-blog-block-data" 
     data-heading="<?php echo esc_attr($heading); ?>"
     data-subheading="<?php echo esc_attr($subheading); ?>"
     data-heading-color="<?php echo esc_attr($heading_color); ?>"
     data-subheading-color="<?php echo esc_attr($subheading_color); ?>"
     data-card-label="<?php echo esc_attr($card_label); ?>"
     data-post-type="<?php echo esc_attr($post_type); ?>"
     data-category="<?php echo esc_attr($category); ?>"
     data-button-text="<?php echo esc_attr($button_text); ?>"
     data-button-url="<?php echo esc_attr($button_url); ?>"
     data-background-color="<?php echo esc_attr($background_color); ?>"
     data-background-image="<?php echo esc_attr($background_image_url); ?>"
     id="<?php echo esc_attr($block_id); ?>">
</div>

<style>
#<?php echo esc_attr($block_id); ?> + .stories-blog-block .stories-blog-block__heading {
    color: <?php echo esc_html($heading_color); ?> !important;
}

#<?php echo esc_attr($block_id); ?> + .stories-blog-block .stories-blog-block__subheading {
    color: <?php echo esc_html($subheading_color); ?> !important;
}
</style>

<?php
// Enqueue the React component script
wp_enqueue_script(
    'stories-blog-block-script',
    get_template_directory_uri() . '/blocks/stories-blog-block/script.js',
    array('wp-element', 'wp-api-fetch'),
    '1.0.0',
    true
);

// Localize script with WordPress API data
wp_localize_script('stories-blog-block-script', 'storiesBlogBlockData', array(
    'apiUrl' => home_url('/wp-json/wp/v2/'),
    'nonce' => wp_create_nonce('wp_rest'),
));
?>

<div class="stories-blog-block-wrapper">
    <!-- The React component will be mounted here -->
</div>