<?php
/**
 * Footer Widgets REST API
 * 
 * Add this to your WordPress theme's functions.php or create as a plugin
 */

// Register footer widget areas
function register_footer_widgets() {
    for ($i = 1; $i <= 5; $i++) {
        register_sidebar(array(
            'name'          => 'Footer Column ' . $i,
            'id'            => 'footer-column-' . $i,
            'description'   => 'Footer widget area column ' . $i,
            'before_widget' => '<div class="footer-widget">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="widget-title">',
            'after_title'   => '</h4>',
        ));
    }
}
add_action('widgets_init', 'register_footer_widgets');

// Register custom options for copyright text
function register_footer_copyright_settings() {
    register_setting('general', 'footer_copyright_left', array(
        'type' => 'string',
        'sanitize_callback' => 'wp_kses_post',
        'default' => ''
    ));
    
    register_setting('general', 'footer_copyright_right', array(
        'type' => 'string',
        'sanitize_callback' => 'wp_kses_post',
        'default' => ''
    ));
}
add_action('admin_init', 'register_footer_copyright_settings');

// Add settings fields to General Settings page
function add_footer_copyright_fields() {
    add_settings_section(
        'footer_copyright_section',
        'Footer Copyright Settings',
        function() {
            echo '<p>Configure the left and right copyright text for your footer.</p>';
        },
        'general'
    );
    
    add_settings_field(
        'footer_copyright_left',
        'Copyright Left Text',
        function() {
            $value = get_option('footer_copyright_left', '');
            echo '<textarea name="footer_copyright_left" rows="3" cols="50" class="large-text">' . esc_textarea($value) . '</textarea>';
            echo '<p class="description">HTML allowed. Use {year} for current year.</p>';
        },
        'general',
        'footer_copyright_section'
    );
    
    add_settings_field(
        'footer_copyright_right',
        'Copyright Right Text',
        function() {
            $value = get_option('footer_copyright_right', '');
            echo '<textarea name="footer_copyright_right" rows="3" cols="50" class="large-text">' . esc_textarea($value) . '</textarea>';
            echo '<p class="description">HTML allowed. Use {year} for current year.</p>';
        },
        'general',
        'footer_copyright_section'
    );
}
add_action('admin_init', 'add_footer_copyright_fields');

// REST API endpoint for footer widgets
function register_footer_widgets_endpoint() {
    register_rest_route('wp/v2', '/footer-widgets', array(
        'methods'  => 'GET',
        'callback' => 'get_footer_widgets_data',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'register_footer_widgets_endpoint');

function get_footer_widgets_data() {
    $footer_data = array();
    
    // Get widget data for each column
    for ($i = 1; $i <= 5; $i++) {
        $sidebar_id = 'footer-column-' . $i;
        
        if (is_active_sidebar($sidebar_id)) {
            ob_start();
            dynamic_sidebar($sidebar_id);
            $content = ob_get_clean();
            
            // Parse the widget content
            $widget_data = parse_footer_widget_content($content, $sidebar_id);
            
            if ($widget_data) {
                $footer_data['column' . $i] = $widget_data;
            }
        }
    }
    
    // Get copyright text
    $copyright_left = get_option('footer_copyright_left', '');
    $copyright_right = get_option('footer_copyright_right', '');
    
    // Replace {year} placeholder with current year
    $current_year = date('Y');
    $copyright_left = str_replace('{year}', $current_year, $copyright_left);
    $copyright_right = str_replace('{year}', $current_year, $copyright_right);
    
    $footer_data['copyrightLeft'] = $copyright_left;
    $footer_data['copyrightRight'] = $copyright_right;
    
    return rest_ensure_response($footer_data);
}

function parse_footer_widget_content($content, $sidebar_id) {
    if (empty($content)) {
        return null;
    }
    
    // Extract title
    preg_match('/<h4[^>]*class="widget-title"[^>]*>(.*?)<\/h4>/s', $content, $title_matches);
    $title = isset($title_matches[1]) ? strip_tags($title_matches[1]) : '';
    
    // Remove title from content
    $content = preg_replace('/<h4[^>]*class="widget-title"[^>]*>.*?<\/h4>/s', '', $content);
    
    // Extract links if it's a menu widget
    $links = array();
    preg_match_all('/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/s', $content, $link_matches, PREG_SET_ORDER);
    
    if (!empty($link_matches)) {
        foreach ($link_matches as $match) {
            $links[] = array(
                'url' => $match[1],
                'label' => strip_tags($match[2])
            );
        }
        
        // If we found links, remove the entire menu/list structure from content
        // This prevents duplicate display of menu items
        $content = preg_replace('/<ul[^>]*>.*?<\/ul>/s', '', $content);
        $content = preg_replace('/<nav[^>]*>.*?<\/nav>/s', '', $content);
    }
    
    // Clean up content - keep images and preserve HTML structure
    $content = strip_tags($content, '<p><br><strong><em><a><img><ul><li><div><span>');
    $content = trim($content);
    
    // If content is empty after removing menus, set it to empty string
    if (empty($content) || $content === '<div class="footer-widget"></div>') {
        $content = '';
    }
    
    return array(
        'id' => $sidebar_id,
        'title' => $title,
        'content' => $content,
        'links' => $links
    );
}
