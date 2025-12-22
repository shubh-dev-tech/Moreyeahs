<?php
/**
 * Video Section Block Template
 *
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during AJAX preview.
 * @param int|string $post_id The post ID this block is saved to.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'video-section-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$className = 'video-section-block';
if (!empty($block['className'])) {
    $className .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $className .= ' align' . $block['align'];
}

// Load values and assign defaults.
$video_type = get_field('video_type') ?: 'embed'; // embed, upload, youtube, vimeo
$video_url = get_field('video_url') ?: '';
$video_file = get_field('video_file') ?: '';
$poster_image = get_field('poster_image') ?: '';
$heading = get_field('heading') ?: '';
$description = get_field('description') ?: '';
$overlay_content = get_field('overlay_content') ?: false;

?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($className); ?>">
    <div class="video-container">
        
        <?php if ($overlay_content && ($heading || $description)): ?>
            <div class="video-overlay">
                <div class="overlay-content">
                    <?php if ($heading): ?>
                        <h2 class="video-heading"><?php echo esc_html($heading); ?></h2>
                    <?php endif; ?>
                    
                    <?php if ($description): ?>
                        <p class="video-description"><?php echo esc_html($description); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        <?php endif; ?>
        
        <div class="video-wrapper">
            <?php if ($video_type === 'embed' && $video_url): ?>
                <!-- Embedded video (YouTube, Vimeo, etc.) -->
                <div class="video-embed">
                    <?php
                    // Convert YouTube/Vimeo URLs to embed format
                    $embed_url = $video_url;
                    if (strpos($video_url, 'youtube.com/watch') !== false) {
                        $video_id = parse_url($video_url, PHP_URL_QUERY);
                        parse_str($video_id, $params);
                        $embed_url = 'https://www.youtube.com/embed/' . $params['v'];
                    } elseif (strpos($video_url, 'youtu.be/') !== false) {
                        $video_id = basename(parse_url($video_url, PHP_URL_PATH));
                        $embed_url = 'https://www.youtube.com/embed/' . $video_id;
                    } elseif (strpos($video_url, 'vimeo.com/') !== false) {
                        $video_id = basename(parse_url($video_url, PHP_URL_PATH));
                        $embed_url = 'https://player.vimeo.com/video/' . $video_id;
                    }
                    ?>
                    <iframe 
                        src="<?php echo esc_url($embed_url); ?>" 
                        frameborder="0" 
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                    </iframe>
                </div>
                
            <?php elseif ($video_type === 'upload' && $video_file): ?>
                <!-- Uploaded video file -->
                <video 
                    controls 
                    <?php if ($poster_image): ?>poster="<?php echo esc_url($poster_image['url']); ?>"<?php endif; ?>
                    class="uploaded-video">
                    <source src="<?php echo esc_url($video_file['url']); ?>" type="<?php echo esc_attr($video_file['mime_type']); ?>">
                    Your browser does not support the video tag.
                </video>
                
            <?php else: ?>
                <!-- Fallback placeholder -->
                <div class="video-placeholder">
                    <?php if ($poster_image): ?>
                        <img src="<?php echo esc_url($poster_image['url']); ?>" alt="Video placeholder">
                    <?php else: ?>
                        <div class="placeholder-content">
                            <div class="play-icon">▶</div>
                            <p>Video content will appear here</p>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
        
        <?php if (!$overlay_content && ($heading || $description)): ?>
            <div class="video-content">
                <?php if ($heading): ?>
                    <h2 class="video-heading"><?php echo esc_html($heading); ?></h2>
                <?php endif; ?>
                
                <?php if ($description): ?>
                    <p class="video-description"><?php echo esc_html($description); ?></p>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        
    </div>
</div>