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
        
        // Stories Blog Block
        array(
            'name'              => 'stories-blog-block',
            'title'             => __('Stories & Blog Block', 'twentytwentyfive'),
            'description'       => __('Dynamic content block with auto-detecting post types, custom backgrounds, and latest 4 posts display', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'admin-post',
            'keywords'          => array('stories', 'blog', 'posts', 'dynamic', 'cpt', 'auto-detect', 'background', 'custom'),
            'render_template'   => 'blocks/stories-blog-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/stories-blog-block/style.css',
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
                        'heading'     => 'Success Stories',
                        'subheading'  => 'Your partner through complexities of Agile and DevOps transformation',
                        'post_type'   => 'posts',
                        'category'    => '',
                        'button_text' => 'Show More',
                        'button_url'  => '#',
                    ),
                ),
            ),
        ),
        
        // Full Image Content Block
        array(
            'name'              => 'full-img-content-block',
            'title'             => __('Full Image Content Block', 'twentytwentyfive'),
            'description'       => __('Full width image (25%) with content box and icon sections (75%)', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'align-pull-left',
            'keywords'          => array('full', 'image', 'content', 'icon', 'sections', 'layout'),
            'render_template'   => 'blocks/full-img-content-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/full-img-content-block/style.css',
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
                        'main_heading' => 'What is DevOps?',
                        'content_box'  => array(
                            'heading'    => 'Development Operations Integration',
                            'subheading' => 'DevOps bridges the gap between software development and IT operations through automation, collaboration, and continuous processes.',
                        ),
                        'icon_sections' => array(
                            array(
                                'heading'    => 'Development',
                                'subheading' => 'Continuous coding, testing, and integration of new features and improvements.',
                            ),
                            array(
                                'heading'    => 'Operations',
                                'subheading' => 'Infrastructure management, deployment, monitoring, and system maintenance.',
                            ),
                            array(
                                'heading'    => 'Collaboration',
                                'subheading' => 'Shared responsibility, communication, and unified goals across teams.',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // Service Roadmaps Block
        array(
            'name'              => 'service-roadmaps-block',
            'title'             => __('Service Roadmaps Block', 'twentytwentyfive'),
            'description'       => __('Display service roadmaps with customizable steps, icons, and right-side image', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'list-view',
            'keywords'          => array('roadmap', 'service', 'steps', 'timeline', 'process', 'strategy'),
            'render_template'   => 'blocks/service-roadmaps-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/service-roadmaps-block/style.css',
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
                        'heading'     => 'Our DevOps Strategy Roadmap',
                        'subheading'  => 'Strategic approach to digital transformation',
                        'background_color' => '#e8f5e8',
                        'roadmap_steps' => array(
                            array(
                                'step_title' => 'Assess & Analyze',
                                'step_description' => 'Evaluate current DevOps maturity using industry frameworks, identify capability gaps, and establish baseline metrics for improvement tracking',
                            ),
                            array(
                                'step_title' => 'Implement Automation',
                                'step_description' => 'Deploy CI/CD pipelines with clear milestones, automate testing and deployment processes, and establish measurable success criteria',
                            ),
                            array(
                                'step_title' => 'Build Culture',
                                'step_description' => 'Foster transparency through open communication channels, establish shared responsibility models, and create psychological safety for innovation',
                            ),
                            array(
                                'step_title' => 'Refine & Optimize',
                                'step_description' => 'Continuously enhance processes based on real-time feedback, performance metrics, and lessons learned from each iteration',
                            ),
                        ),
                    ),
                ),
            ),
        ),
        
        // Service Across Multi Block
        array(
            'name'              => 'service-across-multi-block',
            'title'             => __('Service Across Multi Block', 'twentytwentyfive'),
            'description'       => __('Multi-cloud services block with cloud platforms, service categories, technologies, and testimonial quote', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'cloud',
            'keywords'          => array('service', 'multi', 'cloud', 'platforms', 'technologies', 'testimonial'),
            'render_template'   => 'blocks/service-across-multi-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/service-across-multi-block/style.css',
            'enqueue_script'    => get_template_directory_uri() . '/blocks/service-across-multi-block/script.js',
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
        
        // Credentials Acquired Block
        array(
            'name'              => 'credentials-acquired-block',
            'title'             => __('Credentials Acquired Block', 'twentytwentyfive'),
            'description'       => __('Display credentials acquired with colored dots and titles on a dark background', 'twentytwentyfive'),
            'category'          => 'formatting',
            'icon'              => 'awards',
            'keywords'          => array('credentials', 'certifications', 'achievements', 'awards', 'qualifications'),
            'render_template'   => 'blocks/credentials-acquired-block/block.php',
            'enqueue_style'     => get_template_directory_uri() . '/blocks/credentials-acquired-block/style.css',
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
                        'heading' => 'Credentials Acquired',
                        'background_color' => '#1a1a2e',
                        'text_color' => '#ffffff',
                        'credentials_list' => array(
                            array(
                                'credential_title' => 'Azure DevOps Engineer Expert',
                                'dot_color' => '#00A3E0'
                            ),
                            array(
                                'credential_title' => 'GCP Professional Cloud DevOps Engineer',
                                'dot_color' => '#00A3E0'
                            ),
                            array(
                                'credential_title' => 'AWS Certified Solutions Architect - Professional',
                                'dot_color' => '#32CD32'
                            ),
                        ),
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

/**
 * Populate post type choices for Stories Blog Block
 * This function dynamically fetches all public post types
 */
function populate_post_type_choices($field) {
    // Reset choices
    $field['choices'] = array();
    
    // Get all public post types
    $post_types = get_post_types(array(
        'public' => true,
        'show_in_rest' => true, // Only post types available in REST API
    ), 'objects');
    
    // Add each post type as a choice
    foreach ($post_types as $post_type) {
        // Skip attachment post type
        if ($post_type->name === 'attachment') {
            continue;
        }
        
        $field['choices'][$post_type->name] = $post_type->label;
    }
    
    return $field;
}

// Apply the function to the specific field
add_filter('acf/load_field/name=post_type', 'populate_post_type_choices');

/**
 * Populate category choices for Stories Blog Block based on selected post type
 * This function dynamically fetches categories for the selected post type
 */
function populate_category_choices($field) {
    // Reset choices
    $field['choices'] = array('' => 'All Categories');
    
    // Get the current post type value
    $post_type = '';
    
    // Try to get post type from various sources
    if (isset($_POST['acf']['field_stories_post_type'])) {
        $post_type = $_POST['acf']['field_stories_post_type'];
    } elseif (isset($_GET['post_type'])) {
        $post_type = $_GET['post_type'];
    } elseif (isset($_POST['post_type'])) {
        $post_type = $_POST['post_type'];
    }
    
    // If no post type is selected, try to get it from the current post
    if (empty($post_type) && function_exists('get_field')) {
        $post_type = get_field('post_type');
    }
    
    // Default to 'post' if still empty
    if (empty($post_type)) {
        $post_type = 'post';
    }
    
    // Get taxonomies for this post type
    $taxonomies = get_object_taxonomies($post_type, 'objects');
    
    // Look for category-like taxonomies
    $category_taxonomy = null;
    foreach ($taxonomies as $taxonomy) {
        // Check for common category taxonomy names
        if (in_array($taxonomy->name, ['category', 'categories', $post_type . '_category', $post_type . '-category'])) {
            $category_taxonomy = $taxonomy->name;
            break;
        }
        // If no specific category taxonomy, use the first hierarchical taxonomy
        if ($taxonomy->hierarchical && !$category_taxonomy) {
            $category_taxonomy = $taxonomy->name;
        }
    }
    
    // If still no taxonomy found, try common patterns
    if (!$category_taxonomy) {
        $possible_taxonomies = [
            'category', // Default WordPress category
            $post_type . '_category',
            $post_type . '-category',
            $post_type . '_cat',
            $post_type . '-cat'
        ];
        
        foreach ($possible_taxonomies as $tax_name) {
            if (taxonomy_exists($tax_name)) {
                $category_taxonomy = $tax_name;
                break;
            }
        }
    }
    
    // Get terms if we found a taxonomy
    if ($category_taxonomy) {
        $terms = get_terms(array(
            'taxonomy' => $category_taxonomy,
            'hide_empty' => false,
            'orderby' => 'name',
            'order' => 'ASC'
        ));
        
        if (!is_wp_error($terms) && !empty($terms)) {
            foreach ($terms as $term) {
                $field['choices'][$term->term_id] = $term->name;
            }
        }
    }
    
    return $field;
}

// Apply the function to the category field
add_filter('acf/load_field/name=category', 'populate_category_choices');

/**
 * AJAX handler for updating categories based on post type selection
 * This allows real-time category updates when post type changes
 */
function ajax_update_categories() {
    // Check if request is valid
    if (!isset($_POST['post_type']) || !isset($_POST['nonce'])) {
        wp_send_json_error('Missing required parameters');
        return;
    }
    
    // Verify nonce for security
    if (!wp_verify_nonce($_POST['nonce'], 'stories_blog_nonce')) {
        wp_send_json_error('Security check failed');
        return;
    }
    
    $post_type = sanitize_text_field($_POST['post_type']);
    $categories = array('' => 'All Categories');
    
    // Debug logging (remove in production)
    error_log("Stories Blog AJAX: Processing post type: " . $post_type);
    
    if (!empty($post_type)) {
        // Get taxonomies for this post type
        $taxonomies = get_object_taxonomies($post_type, 'objects');
        
        // Look for category-like taxonomies
        $category_taxonomy = null;
        foreach ($taxonomies as $taxonomy) {
            if (in_array($taxonomy->name, ['category', 'categories', $post_type . '_category', $post_type . '-category'])) {
                $category_taxonomy = $taxonomy->name;
                break;
            }
            if ($taxonomy->hierarchical && !$category_taxonomy) {
                $category_taxonomy = $taxonomy->name;
            }
        }
        
        // If no taxonomy found, try common patterns
        if (!$category_taxonomy) {
            $possible_taxonomies = [
                'category',
                $post_type . '_category',
                $post_type . '-category',
                $post_type . '_cat',
                $post_type . '-cat'
            ];
            
            foreach ($possible_taxonomies as $tax_name) {
                if (taxonomy_exists($tax_name)) {
                    $category_taxonomy = $tax_name;
                    break;
                }
            }
        }
        
        // Get terms
        if ($category_taxonomy) {
            $terms = get_terms(array(
                'taxonomy' => $category_taxonomy,
                'hide_empty' => false,
                'orderby' => 'name',
                'order' => 'ASC'
            ));
            
            if (!is_wp_error($terms) && !empty($terms)) {
                foreach ($terms as $term) {
                    $categories[$term->term_id] = $term->name;
                }
            }
        }
    }
    
    wp_send_json_success($categories);
}

// Add AJAX handlers for both logged-in and non-logged-in users
add_action('wp_ajax_update_categories', 'ajax_update_categories');
add_action('wp_ajax_nopriv_update_categories', 'ajax_update_categories');

/**
 * Enqueue JavaScript for dynamic category updates in admin
 */
function enqueue_stories_blog_admin_scripts($hook) {
    // Only load on post edit screens and block editor
    if (!in_array($hook, ['post.php', 'post-new.php'])) {
        return;
    }
    
    wp_enqueue_script(
        'stories-blog-admin',
        get_template_directory_uri() . '/blocks/stories-blog-block/admin.js',
        array('jquery'),
        wp_get_theme()->get('Version'),
        true
    );
    
    wp_localize_script('stories-blog-admin', 'storiesBlogAjax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('stories_blog_nonce')
    ));
}
add_action('admin_enqueue_scripts', 'enqueue_stories_blog_admin_scripts');
