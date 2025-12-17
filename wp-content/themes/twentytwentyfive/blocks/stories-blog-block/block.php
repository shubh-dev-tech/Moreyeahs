<?php
/**
 * Stories Blog Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

$heading = get_field('heading') ?: 'Success Stories';
$subheading = get_field('subheading') ?: 'Your partner through complexities of Agile and DevOps transformation';
$card_label = get_field('card_label') ?: '';
$post_type = get_field('post_type') ?: 'post';
$category = get_field('category') ?: '';
$button_text = get_field('button_text') ?: 'Show More';
$button_url = get_field('button_url') ?: '#';
$background_color = get_field('background_color') ?: '#4a148c';
$background_image = get_field('background_image');

$block_id = 'stories-blog-block-' . uniqid();

// This block will be rendered by React on the frontend
// The PHP template is mainly for ACF field structure and admin preview
?>

<section id="<?php echo esc_attr($block_id); ?>" class="stories-blog-block-placeholder">
  <?php if ($is_preview): ?>
    <!-- Admin Preview -->
    <div class="stories-blog-block-preview">
      <h2><?php echo esc_html($heading); ?></h2>
      <p><?php echo esc_html($subheading); ?></p>
      <div class="preview-info">
        <p><strong>Post Type:</strong> <?php echo esc_html($post_type); ?></p>
        <?php if ($category): ?>
          <p><strong>Category:</strong> <?php echo esc_html($category); ?></p>
        <?php endif; ?>
        <p><strong>Background Color:</strong> <?php echo esc_html($background_color); ?></p>
        <?php if ($background_image): ?>
          <p><strong>Background Image:</strong> <?php echo esc_html($background_image['filename']); ?></p>
        <?php endif; ?>
        <p><strong>Button:</strong> <?php echo esc_html($button_text); ?> (<?php echo esc_url($button_url); ?>)</p>
        <p><em>This block will display the latest 4 posts from the configured post type and category.</em></p>
      </div>
    </div>
    
    <style>
      .stories-blog-block-preview {
        padding: 40px;
        background: <?php echo esc_attr($background_color); ?><?php if ($background_image): ?>, url('<?php echo esc_url($background_image['url']); ?>') center/cover<?php endif; ?>;
        color: white;
        border-radius: 12px;
        text-align: center;
        position: relative;
      }
      <?php if ($background_image): ?>
      .stories-blog-block-preview::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 12px;
        z-index: 1;
      }
      .stories-blog-block-preview > * {
        position: relative;
        z-index: 2;
      }
      <?php endif; ?>
      .stories-blog-block-preview h2 {
        font-size: 2rem;
        margin-bottom: 15px;
      }
      .stories-blog-block-preview p {
        margin-bottom: 10px;
      }
      .preview-info {
        background: rgba(255, 255, 255, 0.1);
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
      }
      .preview-info p {
        margin: 5px 0;
      }
    </style>
  <?php else: ?>
    <!-- Frontend - React will handle this -->
    <div 
      class="stories-blog-block-data" 
      data-heading="<?php echo esc_attr($heading); ?>"
      data-subheading="<?php echo esc_attr($subheading); ?>"
      data-card-label="<?php echo esc_attr($card_label); ?>"
      data-post-type="<?php echo esc_attr($post_type); ?>"
      data-category="<?php echo esc_attr($category); ?>"
      data-button-text="<?php echo esc_attr($button_text); ?>"
      data-button-url="<?php echo esc_url($button_url); ?>"
      data-background-color="<?php echo esc_attr($background_color); ?>"
      data-background-image="<?php echo $background_image ? esc_url($background_image['url']) : ''; ?>"
    >
      <!-- React component will render here -->
    </div>
  <?php endif; ?>
</section>