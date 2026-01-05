<?php
/**
 * ACF Blocks Registration and Management
 * 
 * Centralized file for registering and enqueuing all ACF blocks.
 * Add new blocks to the $blocks array below.
 * 
 * @package Twenty Twenty-Five
 * @since 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register all ACF blocks
 */
function twentytwentyfive_register_acf_blocks() {
    // Check if ACF function exists
    if (!function_exists('acf_register_block_type')) {
        return;
    }

    /**
     * Array of blocks to register
     * 
     * Each block should have:
     * - name: Block identifier (without 'acf/' prefix)
     * - title: Display name in editor
     * - description: Brief description
     * - category: Block category (common, formatting, layout, widgets, embed)
     * - icon: Dashicon name or custom SVG
     * - keywords: Array of search keywords
     * - render_template: Path to PHP template file (relative to theme root)
     * - enqueue_style: (optional) Path to CSS file
     * - enqueue_script: (optional) Path to JS file
     * - supports: (optional) Array of supported features
     */
    $blocks = array(
        // Promo Block
        array(
            'name'              => 'promo-block',
            'title'             => __('Promo Block', 'twentytwentyfive'),
            'description'       => __('A promotional banner with background image, heading, sub-heading, and CTA button', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('promo', 'banner', 'cta', 'promotional'),
            'render_template'   => 'blocks/promo-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/promo-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Ring the Sound of Opportunity',
                        'sub_heading' => 'Move 1,000+1,000 Lives Forward',
                        'button_text' => 'READ MORE',
                        'button_link' => '#',
                    ),
                ),
            ),
        ),
        
        // Full Width Left Text Section Block
        array(
            'name'              => 'full-width-left-text-section',
            'title'             => __('Full Width Left Text Section', 'twentytwentyfive'),
            'description'       => __('A full-width section with left-aligned text content and right image', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'align-left',
            'keywords'          => array('full', 'width', 'text', 'section', 'case', 'studies'),
            'render_template'   => 'blocks/full-width-left-text-section/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/full-width-left-text-section/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('wide', 'full'),
                'anchor' => true,
                'mode'   => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Sample Heading',
                        'sub_heading' => 'Sample subheading text',
                    ),
                ),
            ),
        ),
        
        // Image Grid Hover Block
        array(
            'name'              => 'image-grid-hover',
            'title'             => __('Image Grid Hover', 'twentytwentyfive'),
            'description'       => __('Image grid with hover effects - 1 large image + 4 smaller images in 2x2 grid', 'twentytwentyfive'),
            'category'          => 'media',
            'icon'              => 'grid-view',
            'keywords'          => array('image', 'grid', 'hover', 'gallery'),
            'render_template'   => 'blocks/image-grid-hover/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/image-grid-hover/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align' => array('wide', 'full'),
                'mode'  => true,
                'jsx'   => true,
            ),
        ),
        
        // Icon Text Grid Block
        array(
            'name'              => 'icon-text-grid',
            'title'             => __('Icon Text Grid', 'twentytwentyfive'),
            'description'       => __('Flexible grid with text and icons that rotate on hover', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'grid-view',
            'keywords'          => array('icon', 'grid', 'text', 'link', 'clickable'),
            'render_template'   => 'blocks/icon-text-grid/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/icon-text-grid/style.css',
            'enqueue_script'    => get_template_directory_uri() . '/blocks/icon-text-grid/script.js',
            'supports'          => array(
                'align'  => true,
                'anchor' => true,
                'mode'   => true,
                'jsx'    => true,
            ),
        ),
        
        // Purpose Block
        array(
            'name'              => 'purpose-block',
            'title'             => __('Purpose Block', 'twentytwentyfive'),
            'description'       => __('Display your organization\'s purpose with angled corner borders and customizable border color', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'star-filled',
            'keywords'          => array('purpose', 'mission', 'vision', 'statement', 'border'),
            'render_template'   => 'blocks/purpose-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/purpose-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'      => 'Our Purpose:',
                        'sub_heading'  => 'To amplify human potential and create the next opportunity for people, businesses and communities',
                        'border_color' => '#00A3E0',
                    ),
                ),
            ),
        ),
        
        // Counter Block
        array(
            'name'              => 'counter-block',
            'title'             => __('Counter Block', 'twentytwentyfive'),
            'description'       => __('Display statistics and counters with heading and sub-heading', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'chart-bar',
            'keywords'          => array('counter', 'stats', 'statistics', 'numbers', 'metrics'),
            'render_template'   => 'blocks/counter-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/counter-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'About us',
                        'sub_heading' => 'A global leader in next-generation digital services and consulting',
                        'counters'    => array(
                            array(
                                'number' => '59',
                                'prefix' => '',
                                'suffix' => '',
                                'label'  => 'countries where we have trusting clients',
                            ),
                            array(
                                'number' => '19.7',
                                'prefix' => 'US$',
                                'suffix' => '',
                                'label'  => 'billion total revenue (LTM)',
                            ),
                            array(
                                'number' => '24',
                                'prefix' => '',
                                'suffix' => '+',
                                'label'  => 'million training (hours) conducted for employees, globally',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // News Block
        array(
            'name'              => 'news-block',
            'title'             => __('News Block', 'twentytwentyfive'),
            'description'       => __('Display news items in a grid layout with images and links', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'megaphone',
            'keywords'          => array('news', 'articles', 'press', 'blog', 'media'),
            'render_template'   => 'blocks/news-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/news-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'section_title' => 'In the news',
                        'news_items'    => array(
                            array(
                                'title' => 'Winners of Qorus-Infosys Finacle Banking Innovation Awards 2025 Announced in Athens',
                                'link'  => '#',
                                'date'  => '',
                            ),
                            array(
                                'title' => 'Infosys Q2 FY26 Results - Archived Webcast',
                                'link'  => '#',
                                'date'  => 'October 18, 2025',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // Investor Block
        array(
            'name'              => 'investor-block',
            'title'             => __('Investor Block', 'twentytwentyfive'),
            'description'       => __('Display investor information with featured image and categorized links', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'chart-line',
            'keywords'          => array('investor', 'finance', 'shareholders', 'reports', 'annual'),
            'render_template'   => 'blocks/investor-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/investor-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'main_title'     => 'Investors',
                        'subtitle'       => 'Maximizing shareholder value with good corporate governance',
                        'featured_title' => 'Integrated Annual Report 2025',
                        'sidebar_title'  => 'Investor central',
                    ),
                ),
            ),
        ),
        
        // Testimonial Block
        array(
            'name'              => 'testimonial-block',
            'title'             => __('Testimonial Block', 'twentytwentyfive'),
            'description'       => __('Display testimonials in a slider with heading, subheading, and CTA button', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'format-quote',
            'keywords'          => array('testimonial', 'review', 'quote', 'slider', 'carousel'),
            'render_template'   => 'blocks/testimonial-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/testimonial-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'        => 'Careers',
                        'subheading'     => 'Every Infoscion is the navigator of our clients\' digital transformation',
                        'bottom_heading' => 'Find opportunities right for you',
                        'button_text'    => 'EXPLORE CAREERS',
                        'button_link'    => '#',
                    ),
                ),
            ),
        ),
        
        // Navigation Next Block
        array(
            'name'              => 'navigation-next-block',
            'title'             => __('Navigation Next Block', 'twentytwentyfive'),
            'description'       => __('Regional navigation grid with hover effects and CTA section', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'location-alt',
            'keywords'          => array('navigation', 'regions', 'locations', 'grid', 'hover'),
            'render_template'   => 'blocks/navigation-next-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/navigation-next-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Let\'s help you navigate your next',
                        'button_text' => 'CONTACT US',
                        'button_link' => '#',
                        'regions'     => array(
                            array('name' => 'Americas', 'link' => '#'),
                            array('name' => 'Asia Pacific', 'link' => '#'),
                            array('name' => 'Europe', 'link' => '#'),
                            array('name' => 'Middle East and Africa', 'link' => '#'),
                        ),
                    ),
                ),
            ),
        ),
        
        // Stepper Block
        array(
            'name'              => 'stepper-block',
            'title'             => __('Stepper Block', 'twentytwentyfive'),
            'description'       => __('Vertical stepper with automatic numbering and custom step labels', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'list-view',
            'keywords'          => array('stepper', 'steps', 'navigation', 'progress', 'vertical'),
            'render_template'   => 'blocks/stepper-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/stepper-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'background_color' => '',
                        'steps'            => array(
                            array('label' => '', 'is_active' => false),
                            array('label' => '', 'is_active' => false),
                            array('label' => 'Operating Models', 'is_active' => true),
                            array('label' => '', 'is_active' => false),
                            array('label' => '', 'is_active' => false),
                        ),
                    ),
                ),
            ),
        ),
        
        // More Years Service Block
        array(
            'name'              => 'moreyeahs-service-block',
            'title'             => __('More Years Service', 'twentytwentyfive'),
            'description'       => __('A service block with heading, subheading, and repeatable service sections with borders', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'grid-view',
            'keywords'          => array('moreyeahs', 'service', 'offerings', 'sections', 'links'),
            'render_template'   => 'blocks/moreyeahs-service-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/moreyeahs-service-block/style.css',
            'enqueue_script'    => get_template_directory_uri() . '/blocks/moreyeahs-service-block/script.js',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'         => 'Our Offerings',
                        'subheading'      => 'Enterprise Agile DevOps capabilities and solutions to help clients succeed',
                        'service_sections' => array(
                            array(
                                'service_heading'     => 'Explore Solutions',
                                'service_heading_url' => '#',
                                'services'            => array(
                                    array(
                                        'service_name' => 'Infosys DevSecOps Platform',
                                        'service_url'  => '#',
                                    ),
                                    array(
                                        'service_name' => 'Infosys Live Enterprise Application Management Platform',
                                        'service_url'  => '#',
                                    ),
                                ),
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // More Years Content Block
        array(
            'name'              => 'moreyeahs-content-block',
            'title'             => __('More Years Content', 'twentytwentyfive'),
            'description'       => __('A content block with heading, description, image, and CTA button', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'align-left',
            'keywords'          => array('moreyeahs', 'content', 'image', 'text', 'cta', 'button'),
            'render_template'   => 'blocks/moreyeahs-content-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/moreyeahs-content-block/style.css',
            'enqueue_script'    => get_template_directory_uri() . '/blocks/moreyeahs-content-block/script.js',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'Infosys Blockchain Technology Services for Enterprises',
                        'description' => 'Infosys is helping clients create reliable, trusted and sustainable ecosystems for their businesses. We are driving enterprise wide adoption of blockchain-powered business networks across industries by building meaningful commercial/incentive models for all stakeholders in the ecosystem.',
                        'button_text' => 'READ MORE',
                        'button_url'  => '#',
                    ),
                ),
            ),
        ),
        
        // Multi-Cloud Services Block
        array(
            'name'              => 'multi-cloud-services-block',
            'title'             => __('Multi-Cloud Services Block', 'twentytwentyfive'),
            'description'       => __('Comprehensive multi-cloud services showcase with platforms, categories, technologies, and testimonials', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'cloud',
            'keywords'          => array('multi-cloud', 'services', 'platforms', 'technologies', 'testimonial', 'aws', 'gcp', 'azure'),
            'render_template'   => 'blocks/multi-cloud-services-block/block.php',
            'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/multi-cloud-services-block/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'main_heading' => 'Delivering Seamless Services Across Multi-Cloud Platforms',
                        'main_description' => 'We enable enterprises to design, deploy, and manage secure, scalable, and high-performance solutions across leading cloud providers.',
                        'testimonial_quote' => 'The best service is delivered when customer success becomes your own.',
                    ),
                ),
            ),
        ),
        
        // Service Details Section Block
        array(
            'name'              => 'service-details-section',
            'title'             => __('Service Details Section', 'twentytwentyfive'),
            'description'       => __('Display services in a responsive grid with icons, titles, descriptions, and customizable background', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'grid-view',
            'keywords'          => array('service', 'details', 'grid', 'responsive', 'icons', 'solutions'),
            'render_template'   => 'blocks/service-details-section/block.php',
            'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/service-details-section/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'     => 'What We Mean by Solutions',
                        'sub_heading' => 'We bring you powerful advantages to navigate your digital transformation',
                        'background_color' => '#f8f9fa',
                        'grid_columns' => '3',
                        'services'    => array(
                            array(
                                'service_title' => 'Data Science & AI',
                                'service_description' => "• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization",
                            ),
                            array(
                                'service_title' => 'Data Engineering',
                                'service_description' => "• Cloud data pipelines\n• Modern data platforms\n• Real-time analytics",
                            ),
                            array(
                                'service_title' => 'DevOps & Cloud Engineering',
                                'service_description' => "• CI/CD\n• Cloud migration\n• Infrastructure automation",
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // Image Gallery Section Block
        array(
            'name'              => 'image-gallery-section',
            'title'             => __('Image Gallery Section', 'twentytwentyfive'),
            'description'       => __('Flexible image gallery with multiple layout options (3-6 columns) and infinite slider mode', 'twentytwentyfive'),
            'category'          => 'media',
            'icon'              => 'format-gallery',
            'keywords'          => array('image', 'gallery', 'slider', 'grid', 'columns', 'infinite', 'carousel'),
            'render_template'   => 'blocks/image-gallery-section/block.php',
            'enqueue_style'     => get_stylesheet_directory_uri() . '/blocks/image-gallery-section/style.css',
            'enqueue_script'    => '',
            'supports'          => array(
                'align'  => array('full', 'wide'),
                'mode'   => true,
                'jsx'    => true,
                'anchor' => true,
            ),
            'example'           => array(
                'attributes' => array(
                    'mode' => 'preview',
                    'data' => array(
                        'heading'         => 'Cloud & Platform Partnerships',
                        'sub_heading'     => 'Trusted partnerships with leading technology providers',
                        'gallery_layout'  => '4',
                        'enable_slider'   => false,
                        'background_color' => '#f8f9fa',
                        'text_color'      => '#333333',
                    ),
                ),
            ),
        ),
    );

    // Register each block
    foreach ($blocks as $block) {
        // Build block type arguments
        $block_args = array(
            'name'              => $block['name'],
            'title'             => $block['title'],
            'description'       => $block['description'],
            'category'          => $block['category'],
            'icon'              => $block['icon'],
            'keywords'          => $block['keywords'],
            'render_template'   => $block['render_template'],
        );

        // Add optional parameters if they exist
        if (!empty($block['enqueue_style'])) {
            $block_args['enqueue_style'] = $block['enqueue_style'];
        }

        if (!empty($block['enqueue_script'])) {
            $block_args['enqueue_script'] = $block['enqueue_script'];
        }

        if (!empty($block['supports'])) {
            $block_args['supports'] = $block['supports'];
        }

        if (!empty($block['example'])) {
            $block_args['example'] = $block['example'];
        }

        if (!empty($block['mode'])) {
            $block_args['mode'] = $block['mode'];
        }

        // Register the block
        acf_register_block_type($block_args);
    }
}
add_action('acf/init', 'twentytwentyfive_register_acf_blocks');

/**
 * Enqueue block assets globally (if needed)
 * Use this for shared styles/scripts across multiple blocks
 */
function twentytwentyfive_enqueue_block_assets() {
    // Example: Enqueue shared block styles
    // wp_enqueue_style(
    //     'acf-blocks-shared',
    //     get_template_directory_uri() . '/assets/css/blocks-shared.css',
    //     array(),
    //     wp_get_theme()->get('Version')
    // );
}
add_action('enqueue_block_assets', 'twentytwentyfive_enqueue_block_assets');

/**
 * Add custom block category for ACF blocks (optional)
 */
function twentytwentyfive_custom_block_category($categories) {
    return array_merge(
        $categories,
        array(
            array(
                'slug'  => 'custom-blocks',
                'title' => __('Custom Blocks', 'twentytwentyfive'),
                'icon'  => 'admin-customizer',
            ),
        )
    );
}
add_filter('block_categories_all', 'twentytwentyfive_custom_block_category', 10, 1);
