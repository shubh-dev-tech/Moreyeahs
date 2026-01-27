<?php
/**
 * Case Study Post Type Diagnostic
 * 
 * Access this file via: http://localhost/moreyeahs-new/wp-content/themes/twentytwentyfive-child/test-case-study-cpt.php
 */

// Load WordPress
require_once('../../../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('You must be an administrator to access this page.');
}

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Case Study CPT Diagnostic</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; max-width: 1000px; margin: 0 auto; }
        h1 { color: #333; border-bottom: 3px solid #e91e63; padding-bottom: 10px; }
        h2 { color: #e91e63; margin-top: 30px; }
        .success { color: #4CAF50; font-weight: bold; }
        .error { color: #f44336; font-weight: bold; }
        .info { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 15px 0; }
        .warning { background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 15px 0; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table th, table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        table th { background: #e91e63; color: white; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .badge-success { background: #4CAF50; color: white; }
        .badge-error { background: #f44336; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Case Study CPT Diagnostic Tool</h1>
        
        <div class="info">
            <strong>Purpose:</strong> This tool checks if the Case Study custom post type is properly registered and configured.
        </div>

        <h2>1. Post Type Registration Check</h2>
        <?php
        $post_type_exists = post_type_exists('case_study');
        if ($post_type_exists):
        ?>
            <p class="success">✅ Post type 'case_study' IS registered!</p>
        <?php else: ?>
            <p class="error">❌ Post type 'case_study' is NOT registered!</p>
            <div class="warning">
                <strong>Fix:</strong> Make sure functions.php contains the register_case_study_post_type() function and it's being called.
            </div>
        <?php endif; ?>

        <h2>2. Post Type Details</h2>
        <?php if ($post_type_exists):
            $post_type_obj = get_post_type_object('case_study');
        ?>
            <table>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                    <th>Status</th>
                </tr>
                <tr>
                    <td>Name</td>
                    <td><?php echo esc_html($post_type_obj->name); ?></td>
                    <td><span class="badge badge-success">OK</span></td>
                </tr>
                <tr>
                    <td>Label</td>
                    <td><?php echo esc_html($post_type_obj->label); ?></td>
                    <td><span class="badge badge-success">OK</span></td>
                </tr>
                <tr>
                    <td>Public</td>
                    <td><?php echo $post_type_obj->public ? 'Yes' : 'No'; ?></td>
                    <td><span class="badge badge-<?php echo $post_type_obj->public ? 'success' : 'error'; ?>">
                        <?php echo $post_type_obj->public ? 'OK' : 'FAIL'; ?>
                    </span></td>
                </tr>
                <tr>
                    <td>Show in REST</td>
                    <td><?php echo $post_type_obj->show_in_rest ? 'Yes' : 'No'; ?></td>
                    <td><span class="badge badge-<?php echo $post_type_obj->show_in_rest ? 'success' : 'error'; ?>">
                        <?php echo $post_type_obj->show_in_rest ? 'OK' : 'FAIL'; ?>
                    </span></td>
                </tr>
                <tr>
                    <td>REST Base</td>
                    <td><?php echo esc_html($post_type_obj->rest_base ?? 'Not set'); ?></td>
                    <td><span class="badge badge-<?php echo isset($post_type_obj->rest_base) ? 'success' : 'error'; ?>">
                        <?php echo isset($post_type_obj->rest_base) ? 'OK' : 'FAIL'; ?>
                    </span></td>
                </tr>
                <tr>
                    <td>Has Archive</td>
                    <td><?php echo $post_type_obj->has_archive ? 'Yes (' . $post_type_obj->has_archive . ')' : 'No'; ?></td>
                    <td><span class="badge badge-<?php echo $post_type_obj->has_archive ? 'success' : 'error'; ?>">
                        <?php echo $post_type_obj->has_archive ? 'OK' : 'FAIL'; ?>
                    </span></td>
                </tr>
                <tr>
                    <td>Supports</td>
                    <td><?php echo implode(', ', get_all_post_type_supports('case_study')); ?></td>
                    <td><span class="badge badge-success">OK</span></td>
                </tr>
            </table>
        <?php endif; ?>

        <h2>3. ACF Pro Status</h2>
        <?php if (class_exists('ACF')): ?>
            <p class="success">✅ ACF Pro is ACTIVE!</p>
            <p><strong>Version:</strong> <?php echo defined('ACF_VERSION') ? ACF_VERSION : 'Unknown'; ?></p>
        <?php else: ?>
            <p class="error">❌ ACF Pro is NOT active!</p>
            <div class="warning">
                <strong>Fix:</strong> Activate ACF Pro plugin from Plugins menu.
            </div>
        <?php endif; ?>

        <h2>4. Registered ACF Blocks</h2>
        <?php
        if (function_exists('acf_get_block_types')) {
            $block_types = acf_get_block_types();
            $case_study_blocks = array_filter($block_types, function($block) {
                return strpos($block['name'], 'case-study') !== false;
            });
            
            if (!empty($case_study_blocks)):
        ?>
                <p class="success">✅ Found <?php echo count($case_study_blocks); ?> Case Study blocks!</p>
                <table>
                    <tr>
                        <th>Block Name</th>
                        <th>Title</th>
                        <th>Category</th>
                    </tr>
                    <?php foreach ($case_study_blocks as $block): ?>
                    <tr>
                        <td><?php echo esc_html($block['name']); ?></td>
                        <td><?php echo esc_html($block['title']); ?></td>
                        <td><?php echo esc_html($block['category']); ?></td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            <?php else: ?>
                <p class="error">❌ No Case Study blocks registered!</p>
                <div class="warning">
                    <strong>Fix:</strong> Check that twentytwentyfive_child_register_acf_blocks() is being called on 'acf/init' action.
                </div>
            <?php endif;
        } else {
            echo '<p class="error">❌ ACF block function not available!</p>';
        }
        ?>

        <h2>5. Permalink Structure</h2>
        <?php
        $permalink_structure = get_option('permalink_structure');
        if (!empty($permalink_structure)):
        ?>
            <p class="success">✅ Permalinks are configured!</p>
            <p><strong>Structure:</strong> <?php echo esc_html($permalink_structure); ?></p>
        <?php else: ?>
            <p class="error">❌ Permalinks are using default (plain) structure!</p>
            <div class="warning">
                <strong>Fix:</strong> Go to Settings > Permalinks and choose any structure (e.g., Post name).
            </div>
        <?php endif; ?>

        <h2>6. Rewrite Rules</h2>
        <?php
        global $wp_rewrite;
        $rules = get_option('rewrite_rules');
        $case_study_rules = array_filter($rules, function($key) {
            return strpos($key, 'case') !== false;
        }, ARRAY_FILTER_USE_KEY);
        
        if (!empty($case_study_rules)):
        ?>
            <p class="success">✅ Rewrite rules exist for case studies!</p>
            <details>
                <summary>View Rules</summary>
                <pre><?php print_r($case_study_rules); ?></pre>
            </details>
        <?php else: ?>
            <p class="error">❌ No rewrite rules found!</p>
            <div class="warning">
                <strong>Fix:</strong> Go to Settings > Permalinks > Save Changes to flush rewrite rules.
            </div>
        <?php endif; ?>

        <h2>7. REST API Endpoints</h2>
        <?php
        $rest_url = rest_url('wp/v2/case-studies');
        ?>
        <p><strong>Endpoint:</strong> <a href="<?php echo esc_url($rest_url); ?>" target="_blank"><?php echo esc_url($rest_url); ?></a></p>
        <p><em>Click to test if API is accessible</em></p>

        <h2>8. Recommended Actions</h2>
        <div class="info">
            <ol>
                <li><strong>Clear browser cache:</strong> Ctrl+Shift+Delete</li>
                <li><strong>Flush permalinks:</strong> Settings > Permalinks > Save Changes</li>
                <li><strong>Deactivate/reactivate child theme:</strong> Appearance > Themes</li>
                <li><strong>Try incognito mode:</strong> Open WordPress admin in private window</li>
                <li><strong>Check browser console:</strong> F12 > Console tab for JavaScript errors</li>
            </ol>
        </div>

        <h2>9. Quick Actions</h2>
        <p>
            <a href="<?php echo admin_url('edit.php?post_type=case_study'); ?>" class="button">View Case Studies</a>
            <a href="<?php echo admin_url('post-new.php?post_type=case_study'); ?>" class="button">Add New Case Study</a>
            <a href="<?php echo admin_url('options-permalink.php'); ?>" class="button">Flush Permalinks</a>
        </p>
        
        <style>
            .button {
                display: inline-block;
                padding: 10px 20px;
                background: #e91e63;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-right: 10px;
                margin-top: 10px;
            }
            .button:hover {
                background: #c2185b;
            }
        </style>
    </div>
</body>
</html>
