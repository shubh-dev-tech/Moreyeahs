<?php
/**
 * Inner Circle Videos Block
 * 
 * Displays team member videos in an infinite loop slider with popup functionality
 */

$heading = get_field('heading') ?: 'Inner Circle Videos';
$subheading = get_field('subheading') ?: 'Real stories and insights straight from our team.';
$videos = get_field('videos');
$background_image = get_field('background_image');
$block_id = 'inner-circle-videos-' . $block['id'];

if (!$videos || count($videos) === 0) {
    return;
}

// Helper function to parse video URL
if (!function_exists('inner_circle_parse_video_url')) {
    function inner_circle_parse_video_url($url) {
        $video_data = array(
            'type' => 'direct',
            'id' => '',
            'embed_url' => $url
        );

        // YouTube
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i', $url, $match)) {
            $video_data['type'] = 'youtube';
            $video_data['id'] = $match[1];
            $video_data['embed_url'] = 'https://www.youtube.com/embed/' . $match[1] . '?autoplay=1&rel=0';
        }
        // Vimeo
        elseif (preg_match('/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/i', $url, $match)) {
            $video_data['type'] = 'vimeo';
            $video_data['id'] = $match[3];
            $video_data['embed_url'] = 'https://player.vimeo.com/video/' . $match[3] . '?autoplay=1';
        }

        return $video_data;
    }
}
?>

<section id="<?php echo esc_attr($block_id); ?>" class="inner-circle-videos" <?php if ($background_image): ?>style="background-image: url('<?php echo esc_url($background_image['url']); ?>');"<?php endif; ?>>
    <div class="inner-circle-videos__container">
        <div class="inner-circle-videos__header">
            <h2 class="inner-circle-videos__heading">
                <?php echo esc_html($heading); ?>
                <span class="inner-circle-videos__heading-highlight">Videos</span>
            </h2>
            <p class="inner-circle-videos__subheading"><?php echo esc_html($subheading); ?></p>
        </div>

        <div class="inner-circle-videos__slider-wrapper">
            <div class="inner-circle-videos__slider" data-slider>
                <?php 
                // Duplicate videos for infinite loop effect
                $all_videos = array_merge($videos, $videos, $videos);
                foreach ($all_videos as $index => $video): 
                    $name = $video['name'] ?? '';
                    $title = $video['title'] ?? '';
                    $thumbnail = $video['thumbnail'] ?? null;
                    $video_url = $video['video_url'] ?? '';
                    $video_data = inner_circle_parse_video_url($video_url);
                ?>
                    <div class="inner-circle-videos__slide" data-video-type="<?php echo esc_attr($video_data['type']); ?>">
                        <div class="inner-circle-videos__card">
                            <?php if ($thumbnail): ?>
                                <div class="inner-circle-videos__thumbnail">
                                    <img 
                                        src="<?php echo esc_url($thumbnail['url']); ?>" 
                                        alt="<?php echo esc_attr($name); ?>"
                                        loading="lazy"
                                    />
                                    <button 
                                        class="inner-circle-videos__play-btn" 
                                        data-video-url="<?php echo esc_attr($video_data['embed_url']); ?>"
                                        data-video-type="<?php echo esc_attr($video_data['type']); ?>"
                                        aria-label="Play video of <?php echo esc_attr($name); ?>"
                                    >
                                        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="30" cy="30" r="30" fill="white" fill-opacity="0.9"/>
                                            <path d="M24 20L40 30L24 40V20Z" fill="#000"/>
                                        </svg>
                                    </button>
                                </div>
                            <?php endif; ?>
                            <div class="inner-circle-videos__info">
                                <h3 class="inner-circle-videos__name"><?php echo esc_html($name); ?></h3>
                                <p class="inner-circle-videos__title"><?php echo esc_html($title); ?></p>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <!-- Pagination dots -->
            <div class="inner-circle-videos__pagination">
                <?php foreach ($videos as $index => $video): ?>
                    <button 
                        class="inner-circle-videos__dot <?php echo $index === 0 ? 'active' : ''; ?>" 
                        data-slide="<?php echo $index; ?>"
                        aria-label="Go to slide <?php echo $index + 1; ?>"
                    ></button>
                <?php endforeach; ?>
            </div>
        </div>
    </div>

    <!-- Video Popup Modal -->
    <div class="inner-circle-videos__modal" id="video-modal-<?php echo esc_attr($block['id']); ?>">
        <div class="inner-circle-videos__modal-overlay"></div>
        <div class="inner-circle-videos__modal-content">
            <button class="inner-circle-videos__modal-close" aria-label="Close video">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
            <div class="inner-circle-videos__modal-video">
                <!-- Video iframe will be inserted here -->
            </div>
        </div>
    </div>
</section>
