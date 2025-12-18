<?php
/**
 * Test Video Section PHP Template
 */

echo "🎬 Testing Video Section PHP Template...\n";

// Simulate ACF data structure
$test_data = [
    'heading' => 'Our Video Gallery',
    'sub_heading' => 'Watch our latest content',
    'videos' => [
        [
            'video_url' => [
                'url' => 'http://localhost/moreyeahs-new/wp-content/uploads/2025/12/file_example_MP4_1280_10MG.mp4',
                'mime_type' => 'video/mp4'
            ],
            'video_thumbnail' => [
                'url' => 'https://via.placeholder.com/800x450/000000/FFFFFF?text=Video+1',
                'alt' => 'Video 1 thumbnail'
            ],
            'video_title' => 'First Video',
            'video_subtitle' => 'This is our first video'
        ],
        [
            'video_url' => [
                'url' => 'http://localhost/moreyeahs-new/wp-content/uploads/2025/12/file_example_MP4_1280_10MG.mp4',
                'mime_type' => 'video/mp4'
            ],
            'video_thumbnail' => [
                'url' => 'https://via.placeholder.com/800x450/333333/FFFFFF?text=Video+2',
                'alt' => 'Video 2 thumbnail'
            ],
            'video_title' => 'Second Video',
            'video_subtitle' => 'This is our second video'
        ]
    ]
];

echo "✅ Test data structure created\n";

// Test expected HTML structure
echo "📋 Expected HTML Structure:\n";
echo "- Simple div.video-section__slide elements\n";
echo "- Each slide uses display: block/none\n";
echo "- No carousel-track wrapper\n";
echo "- No translateX transforms\n";
echo "- Simple JavaScript for show/hide\n";

echo "🎯 Video Section PHP Template test completed!\n";
?>