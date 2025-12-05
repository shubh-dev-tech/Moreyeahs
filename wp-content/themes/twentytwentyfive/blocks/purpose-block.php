<?php
/**
 * Purpose Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Get ACF fields
$heading = get_field('heading');
$sub_heading = get_field('sub_heading');
$button_text = get_field('button_text');
$button_link = get_field('button_link');
$border_color = get_field('border_color') ?: '#00A3E0';

// Return early if no content
if (empty($heading) && empty($sub_heading)) {
    return;
}

// Create unique ID for the block
$block_id = 'purpose-block-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}

// Create class attribute
$class_name = 'purpose-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}
?>

<section 
    id="<?php echo esc_attr($block_id); ?>" 
    class="<?php echo esc_attr($class_name); ?>"
    style="--border-color: <?php echo esc_attr($border_color); ?>;"
>
    <div class="purpose-block__container">
        <div class="purpose-block__content">
            <?php if ($heading): ?>
                <h2 class="purpose-block__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            
            <?php if ($sub_heading): ?>
                <p class="purpose-block__sub-heading"><?php echo esc_html($sub_heading); ?></p>
            <?php endif; ?>
            
            <?php if ($button_text && $button_link): ?>
                <a 
                    href="<?php echo esc_url($button_link); ?>" 
                    class="purpose-block__button"
                    aria-label="<?php echo esc_attr($button_text); ?>"
                >
                    <?php echo esc_html($button_text); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</section>

<style>
.purpose-block {
  position: relative;
  padding: 60px 20px;
  margin: 40px auto;
  max-width: 1200px;
}

.purpose-block__container {
  position: relative;
  padding: 60px 80px;
  background: #ffffff;
  
  /* Angled corner borders */
  clip-path: polygon(
    0 40px,
    40px 0,
    calc(100% - 40px) 0,
    100% 40px,
    100% calc(100% - 40px),
    calc(100% - 40px) 100%,
    40px 100%,
    0 calc(100% - 40px)
  );
}

.purpose-block__container::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background: #ffffff;
  clip-path: polygon(
    0 40px,
    40px 0,
    calc(100% - 40px) 0,
    100% 40px,
    100% calc(100% - 40px),
    calc(100% - 40px) 100%,
    40px 100%,
    0 calc(100% - 40px)
  );
  z-index: 0;
}

.purpose-block__container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--border-color, #00A3E0);
  clip-path: polygon(
    0 40px,
    40px 0,
    calc(100% - 40px) 0,
    100% 40px,
    100% calc(100% - 40px),
    calc(100% - 40px) 100%,
    40px 100%,
    0 calc(100% - 40px)
  );
  z-index: -1;
}

.purpose-block__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.purpose-block__heading {
  font-size: 3rem;
  font-weight: 700;
  color: #000000;
  line-height: 1.2;
  margin: 0 0 30px 0;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.purpose-block__sub-heading {
  font-size: 1.5rem;
  font-weight: 400;
  color: #333333;
  line-height: 1.6;
  margin: 0 0 30px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.purpose-block__button {
  display: inline-block;
  padding: 14px 32px;
  background-color: var(--border-color, #00A3E0);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.purpose-block__button:hover {
  background-color: #0082b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 163, 224, 0.3);
}

.purpose-block__button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .purpose-block {
    padding: 40px 15px;
    margin: 30px auto;
  }
  
  .purpose-block__container {
    padding: 40px 40px;
    clip-path: polygon(
      0 30px,
      30px 0,
      calc(100% - 30px) 0,
      100% 30px,
      100% calc(100% - 30px),
      calc(100% - 30px) 100%,
      30px 100%,
      0 calc(100% - 30px)
    );
  }
  
  .purpose-block__container::before,
  .purpose-block__container::after {
    clip-path: polygon(
      0 30px,
      30px 0,
      calc(100% - 30px) 0,
      100% 30px,
      100% calc(100% - 30px),
      calc(100% - 30px) 100%,
      30px 100%,
      0 calc(100% - 30px)
    );
  }
  
  .purpose-block__heading {
    font-size: 2.25rem;
  }
  
  .purpose-block__sub-heading {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .purpose-block {
    padding: 30px 10px;
    margin: 20px auto;
  }
  
  .purpose-block__container {
    padding: 30px 25px;
    clip-path: polygon(
      0 20px,
      20px 0,
      calc(100% - 20px) 0,
      100% 20px,
      100% calc(100% - 20px),
      calc(100% - 20px) 100%,
      20px 100%,
      0 calc(100% - 20px)
    );
  }
  
  .purpose-block__container::before,
  .purpose-block__container::after {
    clip-path: polygon(
      0 20px,
      20px 0,
      calc(100% - 20px) 0,
      100% 20px,
      100% calc(100% - 20px),
      calc(100% - 20px) 100%,
      20px 100%,
      0 calc(100% - 20px)
    );
  }
  
  .purpose-block__heading {
    font-size: 1.75rem;
  }
  
  .purpose-block__sub-heading {
    font-size: 1.125rem;
  }
  
  .purpose-block__button {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>
