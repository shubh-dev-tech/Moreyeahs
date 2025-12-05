<?php
/**
 * News Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

$section_title = get_field('section_title') ?: 'In the news';
$sub_headings = get_field('sub_headings') ?: [];
$featured_paragraph = get_field('featured_paragraph') ?: '';
$featured_link = get_field('featured_link') ?: '';
$background_image = get_field('background_image');
$additional_items = get_field('additional_items') ?: [];

$block_id = 'news-block-' . uniqid();
$bg_image = !empty($background_image['url']) ? $background_image['url'] : '';
$bg_color = $bg_image ? 'transparent' : '#b8860b';
?>

<section id="<?php echo esc_attr($block_id); ?>" class="news-block">
  <div class="news-block__container">
    <div class="news-block__grid">
      
      <!-- First Column - 40% with title, sub-headings, and featured paragraph -->
      <article 
        class="news-block__item" 
        style="background-image: <?php echo $bg_image ? 'url(' . esc_url($bg_image) . ')' : 'none'; ?>; background-color: <?php echo esc_attr($bg_color); ?>;"
      >
        <div class="news-block__overlay"></div>
        <div class="news-block__content">
          <div class="news-block__header">
            <?php if ($section_title): ?>
              <h2 class="news-block__title"><?php echo esc_html($section_title); ?></h2>
            <?php endif; ?>
            
            <?php if (!empty($sub_headings)): ?>
              <ul class="news-block__news-list">
                <?php foreach ($sub_headings as $item): ?>
                  <li class="news-block__news-item">
                    <?php if (!empty($item['link'])): ?>
                      <a href="<?php echo esc_url($item['link']); ?>">
                        <?php echo esc_html($item['text']); ?>
                        <span class="news-block__arrow">→</span>
                      </a>
                    <?php else: ?>
                      <span><?php echo esc_html($item['text']); ?></span>
                    <?php endif; ?>
                  </li>
                <?php endforeach; ?>
              </ul>
            <?php endif; ?>
          </div>
          
          <?php if ($featured_paragraph): ?>
            <div class="news-block__featured-box">
              <?php if ($featured_link): ?>
                <a href="<?php echo esc_url($featured_link); ?>" class="news-block__link">
                  <p class="news-block__featured-text"><?php echo esc_html($featured_paragraph); ?></p>
                </a>
              <?php else: ?>
                <p class="news-block__featured-text"><?php echo esc_html($featured_paragraph); ?></p>
              <?php endif; ?>
            </div>
          <?php endif; ?>
        </div>
      </article>

      <!-- Additional items - 30% each -->
      <?php 
      foreach ($additional_items as $index => $item): 
        $item_bg = !empty($item['image']['url']) ? $item['image']['url'] : '';
        $item_bg_color = $item_bg ? 'transparent' : ($index % 2 === 0 ? '#9932cc' : '#2c3e50');
      ?>
        <article 
          class="news-block__item"
          style="background-image: <?php echo $item_bg ? 'url(' . esc_url($item_bg) . ')' : 'none'; ?>; background-color: <?php echo esc_attr($item_bg_color); ?>;"
        >
          <div class="news-block__overlay"></div>
          <div class="news-block__content">
            <div>
              <?php if (!empty($item['title'])): ?>
                <h3 class="news-block__item-title">
                  <?php if (!empty($item['link'])): ?>
                    <a href="<?php echo esc_url($item['link']); ?>" class="news-block__link">
                      <?php echo esc_html($item['title']); ?>
                      <span class="news-block__arrow">→</span>
                    </a>
                  <?php else: ?>
                    <?php echo esc_html($item['title']); ?>
                  <?php endif; ?>
                </h3>
              <?php endif; ?>
              
              <?php if (!empty($item['date'])): ?>
                <time class="news-block__date"><?php echo esc_html($item['date']); ?></time>
              <?php endif; ?>
            </div>
          </div>
        </article>
      <?php endforeach; ?>
      
    </div>
  </div>
</section>
