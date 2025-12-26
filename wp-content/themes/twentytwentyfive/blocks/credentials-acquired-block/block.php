<?php
/**
 * Credentials Acquired Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param (int|string) $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'credentials-acquired-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$class_name = 'credentials-acquired-block';
if (!empty($block['className'])) {
    $class_name .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $class_name .= ' align' . $block['align'];
}

// Load values and assign defaults.
$heading = get_field('heading') ?: 'Credentials Acquired';
$background_color = get_field('background_color') ?: '#1a1a2e';
$text_color = get_field('text_color') ?: '#ffffff';
$credentials_list = get_field('credentials_list') ?: array();

// Default credentials if none are set (for preview)
if (empty($credentials_list) && $is_preview) {
    $credentials_list = array(
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
        array(
            'credential_title' => 'AWS Certified Solutions Architect – Associate',
            'dot_color' => '#FFD700'
        ),
        array(
            'credential_title' => 'AWS Certified Cloud Practitioner',
            'dot_color' => '#FFD700'
        ),
        array(
            'credential_title' => 'Azure Developer Associate',
            'dot_color' => '#00A3E0'
        ),
        array(
            'credential_title' => 'Azure AI Fundamentals AI-900',
            'dot_color' => '#00A3E0'
        ),
        array(
            'credential_title' => 'Red Hat Certified System Administrator (RHCSA)',
            'dot_color' => '#8A2BE2'
        ),
        array(
            'credential_title' => 'Red Hat Certified Engineer (RHCE)',
            'dot_color' => '#8A2BE2'
        ),
        array(
            'credential_title' => 'Microsoft 365 Certified: Teams Administrator Associate',
            'dot_color' => '#00A3E0'
        ),
        array(
            'credential_title' => 'Microsoft 365 Certified: Administrator Expert',
            'dot_color' => '#00A3E0'
        )
    );
}
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($class_name); ?>" style="background-color: <?php echo esc_attr($background_color); ?>; color: <?php echo esc_attr($text_color); ?>;">
    <div class="credentials-container">
        <h2 class="credentials-heading"><?php echo esc_html($heading); ?></h2>
        
        <?php if (!empty($credentials_list)) : ?>
            <div class="credentials-list">
                <?php foreach ($credentials_list as $credential) : 
                    $title = $credential['credential_title'] ?? '';
                    $dot_color = $credential['dot_color'] ?? '#00A3E0';
                ?>
                    <?php if (!empty($title)) : ?>
                        <div class="credential-item">
                            <span class="credential-dot" style="background-color: <?php echo esc_attr($dot_color); ?>;"></span>
                            <span class="credential-title"><?php echo esc_html($title); ?></span>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>