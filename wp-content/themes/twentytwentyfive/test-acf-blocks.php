<?php
/**
 * Test ACF Blocks Registration
 * 
 * Access this file at: http://localhost/moreyeahs-new/wp-content/themes/twentytwentyfive/test-acf-blocks.php
 */

// Load WordPress
require_once('../../../../../wp-load.php');

// Check if user is logged in and is admin
if (!is_user_logged_in() || !current_user_can('manage_options')) {
    die('Access denied. Please log in as administrator.');
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>ACF Blocks Test</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
            background: #f0f0f1;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1d2327;
            border-bottom: 3px solid #2271b1;
            padding-bottom: 10px;
        }
        .success {
            background: #00a32a;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .error {
            background: #d63638;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .info {
            background: #2271b1;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .block-list {
            list-style: none;
            padding: 0;
        }
        .block-item {
            background: #f6f7f7;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #2271b1;
            border-radius: 4px;
        }
        .block-name {
            font-weight: 600;
            color: #1d2327;
            font-size: 16px;
        }
        .block-desc {
            color: #50575e;
            margin-top: 5px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-box {
            background: #f6f7f7;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
        }
        .stat-number {
            font-size: 36px;
            font-weight: 700;
            color: #2271b1;
        }
        .stat-label {
            color: #50575e;
            margin-top: 5px;
        }
        code {
            background: #f6f7f7;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 ACF Blocks Registration Test</h1>
        
        <?php
        // Check if ACF is active
        if (!function_exists('acf_register_block_type')) {
            echo '<div class="error">❌ ACF Plugin is not active!</div>';
            exit;
        }
        
        echo '<div class="success">✅ ACF Plugin is active</div>';
        
        // Check if our registration file exists
        $acf_blocks_file = get_template_directory() . '/inc/acf-blocks.php';
        if (file_exists($acf_blocks_file)) {
            echo '<div class="success">✅ ACF Blocks file exists: <code>inc/acf-blocks.php</code></div>';
        } else {
            echo '<div class="error">❌ ACF Blocks file not found!</div>';
            exit;
        }
        
        // Get all registered block types
        $registered_blocks = WP_Block_Type_Registry::get_instance()->get_all_registered();
        
        // Filter ACF blocks
        $acf_blocks = array_filter($registered_blocks, function($block_name) {
            return strpos($block_name, 'acf/') === 0;
        }, ARRAY_FILTER_USE_KEY);
        
        $acf_block_count = count($acf_blocks);
        $total_blocks = count($registered_blocks);
        
        ?>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number"><?php echo $acf_block_count; ?></div>
                <div class="stat-label">ACF Blocks</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $total_blocks; ?></div>
                <div class="stat-label">Total Blocks</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo count(get_option('active_plugins', [])); ?></div>
                <div class="stat-label">Active Plugins</div>
            </div>
        </div>
        
        <?php if ($acf_block_count > 0): ?>
            <div class="success">✅ Found <?php echo $acf_block_count; ?> ACF block(s) registered!</div>
            
            <h2>Registered ACF Blocks:</h2>
            <ul class="block-list">
                <?php foreach ($acf_blocks as $block_name => $block): ?>
                    <li class="block-item">
                        <div class="block-name">
                            <?php echo esc_html($block->title); ?>
                            <code><?php echo esc_html($block_name); ?></code>
                        </div>
                        <div class="block-desc">
                            <?php echo esc_html($block->description); ?>
                        </div>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php else: ?>
            <div class="error">❌ No ACF blocks found! The registration might not be working.</div>
        <?php endif; ?>
        
        <div class="info">
            <strong>📝 Next Steps:</strong><br>
            1. Go to <a href="<?php echo admin_url('post-new.php?post_type=page'); ?>" style="color: white; text-decoration: underline;">Pages > Add New</a><br>
            2. Click the "+" button to add a block<br>
            3. Search for your block names (promo, icon, image grid)<br>
            4. Your ACF blocks should appear in the inserter
        </div>
        
        <h2>System Information:</h2>
        <ul>
            <li><strong>WordPress Version:</strong> <?php echo get_bloginfo('version'); ?></li>
            <li><strong>PHP Version:</strong> <?php echo PHP_VERSION; ?></li>
            <li><strong>Active Theme:</strong> <?php echo wp_get_theme()->get('Name'); ?></li>
            <li><strong>ACF Version:</strong> <?php echo defined('ACF_VERSION') ? ACF_VERSION : 'Unknown'; ?></li>
        </ul>
        
        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
            <small>Test file location: <code><?php echo __FILE__; ?></code></small>
        </p>
    </div>
</body>
</html>
