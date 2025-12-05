<?php
/**
 * Test file for Investor Block
 * 
 * This file demonstrates how to use the Investor Block with sample data.
 * You can copy this code into a WordPress page template or use it as reference.
 * 
 * Usage: Create a new page template and include this code, or add the block
 * through the WordPress editor.
 */

// Sample data structure for testing
$sample_investor_data = array(
    'decorative_line' => '| | | | | | | | | |',
    'main_title' => 'Investors',
    'subtitle' => 'Maximizing shareholder value with good corporate governance',
    'featured_image' => array(
        'url' => 'https://via.placeholder.com/800x600/1e90ff/ffffff?text=Integrated+Annual+Report+2025',
        'alt' => 'Integrated Annual Report 2025',
    ),
    'featured_title' => 'Integrated Annual Report 2025',
    'featured_link' => '#annual-report',
    'sidebar_title' => 'Investor central',
    'results_items' => array(
        array(
            'label' => 'RESULTS',
            'title' => 'Second Quarter FY26',
            'link' => '#q2-fy26',
        ),
    ),
    'archived_items' => array(
        array(
            'label' => 'ARCHIVED WEBCAST',
            'title' => 'Q2 FY26 Press Conference',
            'link' => '#press-conference',
        ),
    ),
    'event_items' => array(
        array(
            'label' => 'EVENT',
            'title' => 'The 44th Annual General Meeting',
            'link' => '#agm',
        ),
    ),
    'view_all_text' => 'VIEW ALL',
    'view_all_link' => '#view-all',
);

/**
 * Example 1: Using ACF fields (when block is added through editor)
 * This is how the block template (blocks/investor-block.php) works
 */
function example_investor_block_with_acf() {
    // ACF fields are automatically available when block is added through editor
    $decorative_line = get_field('decorative_line');
    $main_title = get_field('main_title');
    // ... etc
}

/**
 * Example 2: Programmatically rendering the block
 * Useful for custom page templates or dynamic content
 */
function example_investor_block_programmatic() {
    global $sample_investor_data;
    
    // Set up ACF fields programmatically (for testing)
    foreach ($sample_investor_data as $key => $value) {
        update_field($key, $value, get_the_ID());
    }
    
    // Then include the block template
    include get_template_directory() . '/blocks/investor-block.php';
}

/**
 * Example 3: Using the block in a page template
 */
?>

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        /* Include the investor block styles inline for testing */
        <?php include get_template_directory() . '/blocks/investor-block-styles.css'; ?>
    </style>
</head>
<body <?php body_class(); ?>>

<?php
// Example usage with sample data
$data = $sample_investor_data;
?>

<section id="investor-block-test" class="investor-block">
    <div class="investor-block__container">
        <!-- Header Section -->
        <div class="investor-block__header">
            <?php if ($data['decorative_line']): ?>
                <div class="investor-block__decorative-line"><?php echo esc_html($data['decorative_line']); ?></div>
            <?php endif; ?>
            
            <h1 class="investor-block__main-title"><?php echo esc_html($data['main_title']); ?></h1>
            
            <?php if ($data['subtitle']): ?>
                <p class="investor-block__subtitle"><?php echo esc_html($data['subtitle']); ?></p>
            <?php endif; ?>
        </div>

        <!-- Content Grid -->
        <div class="investor-block__grid">
            <!-- Left Column - Featured Image -->
            <div class="investor-block__featured">
                <?php if ($data['featured_image']): ?>
                    <div class="investor-block__featured-image">
                        <img 
                            src="<?php echo esc_url($data['featured_image']['url']); ?>" 
                            alt="<?php echo esc_attr($data['featured_image']['alt']); ?>" 
                        />
                        <div class="investor-block__featured-overlay"></div>
                        <?php if ($data['featured_title']): ?>
                            <div class="investor-block__featured-content">
                                <?php if ($data['featured_link']): ?>
                                    <a href="<?php echo esc_url($data['featured_link']); ?>" class="investor-block__featured-title">
                                        <?php echo esc_html($data['featured_title']); ?>
                                    </a>
                                <?php else: ?>
                                    <h2 class="investor-block__featured-title"><?php echo esc_html($data['featured_title']); ?></h2>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Right Column - Investor Central -->
            <div class="investor-block__sidebar">
                <?php if ($data['sidebar_title']): ?>
                    <h2 class="investor-block__sidebar-title"><?php echo esc_html($data['sidebar_title']); ?></h2>
                <?php endif; ?>

                <div class="investor-block__sections">
                    <!-- Results Section -->
                    <?php if (!empty($data['results_items'])): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($data['results_items'][0]['label']); ?>
                            </div>
                            <?php foreach ($data['results_items'] as $item): ?>
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
                    <?php if (!empty($data['archived_items'])): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($data['archived_items'][0]['label']); ?>
                            </div>
                            <?php foreach ($data['archived_items'] as $item): ?>
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
                    <?php if (!empty($data['event_items'])): ?>
                        <div class="investor-block__section">
                            <div class="investor-block__section-label">
                                <?php echo esc_html($data['event_items'][0]['label']); ?>
                            </div>
                            <?php foreach ($data['event_items'] as $item): ?>
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
                    <?php if ($data['view_all_text'] && $data['view_all_link']): ?>
                        <div class="investor-block__view-all">
                            <a href="<?php echo esc_url($data['view_all_link']); ?>" class="investor-block__view-all-link">
                                <?php echo esc_html($data['view_all_text']); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?php wp_footer(); ?>
</body>
</html>

<?php
/**
 * TESTING INSTRUCTIONS:
 * 
 * 1. Make sure ACF Pro is installed and activated
 * 2. Import the ACF field group from acf-json/group_investor_block.json
 * 3. Create a new page in WordPress
 * 4. Add the "Investor Block" from the block inserter
 * 5. Fill in the fields with your content
 * 6. Preview or publish the page
 * 
 * OR
 * 
 * 1. Create a custom page template
 * 2. Copy the HTML structure above
 * 3. Replace $sample_investor_data with your actual data
 * 4. Apply the template to a page
 */
?>
