<?php
/**
 * Emergency Permalink Flusher
 * 
 * Add this to wp-config.php temporarily:
 * define('WP_DEBUG_FLUSH_PERMALINKS', true);
 * 
 * Or just access this file directly:
 * http://localhost/moreyeahs-new/wp-content/themes/twentytwentyfive-child/flush-permalinks.php
 */

// Load WordPress - try multiple paths
$wp_load_paths = [
    __DIR__ . '/../../../../../wp-load.php',
    __DIR__ . '/../../../../wp-load.php',
    dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/wp-load.php',
];

$wp_loaded = false;
foreach ($wp_load_paths as $path) {
    if (file_exists($path)) {
        require_once($path);
        $wp_loaded = true;
        break;
    }
}

if (!$wp_loaded) {
    die('Could not find wp-load.php. Please flush permalinks from WordPress admin: Settings > Permalinks > Save Changes');
}

// Check if user is logged in (optional for emergency flush)
// Uncomment next line to require admin access:
// if (!current_user_can('manage_options')) { die('You must be an administrator.'); }

// Delete rewrite rules
delete_option('rewrite_rules');

// Flush permalinks
flush_rewrite_rules(true);

// Success message
?>
<!DOCTYPE html>
<html>
<head>
    <title>Permalinks Flushed!</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 500px;
            text-align: center;
        }
        h1 {
            color: #4CAF50;
            margin: 0 0 20px 0;
            font-size: 32px;
        }
        .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: block;
            stroke-width: 3;
            stroke: #4CAF50;
            stroke-miterlimit: 10;
            margin: 20px auto;
            box-shadow: inset 0px 0px 0px #4CAF50;
            animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        .checkmark__circle {
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            stroke-width: 3;
            stroke-miterlimit: 10;
            stroke: #4CAF50;
            fill: none;
            animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark__check {
            transform-origin: 50% 50%;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
            100% {
                stroke-dashoffset: 0;
            }
        }
        @keyframes scale {
            0%, 100% {
                transform: none;
            }
            50% {
                transform: scale3d(1.1, 1.1, 1);
            }
        }
        @keyframes fill {
            100% {
                box-shadow: inset 0px 0px 0px 30px #4CAF50;
            }
        }
        .message {
            font-size: 18px;
            color: #333;
            margin: 20px 0;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #e91e63;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 10px 5px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #c2185b;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
        }
        .btn-secondary {
            background: #667eea;
        }
        .btn-secondary:hover {
            background: #5568d3;
        }
        .details {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            font-size: 14px;
            text-align: left;
        }
        .details strong {
            color: #e91e63;
        }
    </style>
</head>
<body>
    <div class="container">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        
        <h1>✅ Success!</h1>
        
        <p class="message">
            Permalinks have been flushed successfully.<br>
            Rewrite rules have been regenerated.
        </p>
        
        <div class="details">
            <strong>What was done:</strong><br>
            ✓ Deleted old rewrite rules<br>
            ✓ Flushed permalink structure<br>
            ✓ Regenerated rules with hard flush
        </div>
        
        <div style="margin-top: 30px;">
            <a href="<?php echo admin_url('edit.php?post_type=case_study'); ?>" class="btn">
                View Case Studies
            </a>
            <a href="<?php echo admin_url('post-new.php?post_type=case_study'); ?>" class="btn btn-secondary">
                Add New Case Study
            </a>
        </div>
        
        <div style="margin-top: 20px; font-size: 13px; color: #999;">
            <p>If you still have issues, try:</p>
            <ol style="text-align: left; padding-left: 40px;">
                <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                <li>Open in incognito window</li>
                <li>Deactivate/reactivate child theme</li>
            </ol>
        </div>
    </div>
</body>
</html>
