<?php
/**
 * Promo Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$background_image = get_field('background_image');
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');

// Return early if no content
if (empty($heading) && empty($sub_heading)) {
    return;
}

// Get background image URL
$bg_image_url = '';
if ($background_image) {
    $bg_image_url = is_array($background_image) ? $background_image['url'] : $background_image;
}

// Create unique ID for the block
$block_id = 'promo-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Create class attribute
$class_name = 'promo-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
?>

<?php if ($bg_image_url): ?>
<style>
#<?php echo esc_attr($block_id); ?>::before {
    background-image: url('<?php echo esc_url($bg_image_url); ?>');
}
</style>
<?php endif; ?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
>
    <div class="promo-block__overlay">
        <div class="promo-block__container">
            <div class="promo-block__content">
                <?php if ($heading): ?>
                    <h2 class="promo-block__heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($sub_heading): ?>
                    <p class="promo-block__sub-heading"><?php echo esc_html($sub_heading); ?></p>
                <?php endif; ?>
                
                <?php if ($button_text && $button_link): ?>
                    <a 
                        href="<?php echo esc_url($button_link); ?>" 
                        class="promo-block__button"
                        aria-label="<?php echo esc_attr($button_text); ?>"
                    >
                        <?php echo esc_html($button_text); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<style>
.promo-block {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.promo-block::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: inherit;
  transition: transform 0.6s ease;
  z-index: 0;
}

.promo-block:hover::before {
  transform: scale(1.3);
}

.promo-block__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  z-index: 1;
}

.promo-block__container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 70px;
}

.promo-block__content {
  max-width: 600px;
}

.promo-block__heading {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  margin: 0 0 20px 0;
}

.promo-block__sub-heading {
  font-size: 1.25rem;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.5;
  margin: 0 0 30px 0;
}

.promo-block__button {
  display: inline-block;
  padding: 14px 32px;
  background-color: #ffffff;
  color: #0d1b3e;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.promo-block__button:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.promo-block__button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .promo-block {
    min-height: 350px;
  }
  
  .promo-block__container {
    padding: 40px 20px;
  }
  
  .promo-block__heading {
    font-size: 2rem;
  }
  
  .promo-block__sub-heading {
    font-size: 1.125rem;
  }
}

@media (max-width: 480px) {
  .promo-block {
    min-height: 300px;
  }
  
  .promo-block__container {
    padding: 30px 15px;
  }
  
  .promo-block__heading {
    font-size: 1.75rem;
  }
  
  .promo-block__sub-heading {
    font-size: 1rem;
  }
  
  .promo-block__button {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>
