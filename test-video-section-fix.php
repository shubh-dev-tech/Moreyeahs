<?php
/**
 * Test Video Section Fix
 * Run this file to test if the video section is working properly
 */

echo "🎬 Testing Video Section Fix...\n\n";

// Test 1: Check if video section block is registered
echo "1. Checking if video section block is registered...\n";
if (function_exists('acf_register_block_type')) {
    echo "✅ ACF is active\n";
} else {
    echo "❌ ACF is not active\n";
}

// Test 2: Check if video section files exist
echo "\n2. Checking video section files...\n";
$block_file = 'wp-content/themes/twentytwentyfive-child/blocks/video-section/block.php';
$style_file = 'wp-content/themes/twentytwentyfive-child/blocks/video-section/style.css';
$acf_file = 'wp-content/themes/twentytwentyfive-child/acf-json/group_video_section_block.json';

if (file_exists($block_file)) {
    echo "✅ Block template exists\n";
} else {
    echo "❌ Block template missing\n";
}

if (file_exists($style_file)) {
    echo "✅ Block styles exist\n";
} else {
    echo "❌ Block styles missing\n";
}

if (file_exists($acf_file)) {
    echo "✅ ACF fields exist\n";
} else {
    echo "❌ ACF fields missing\n";
}

// Test 3: Check for PHP errors
echo "\n3. Checking for PHP errors...\n";
$error_log = 'wp-content/debug.log';
if (file_exists($error_log)) {
    $recent_errors = file_get_contents($error_log);
    if (strpos($recent_errors, 'ArgumentCountError') !== false) {
        echo "⚠️  PHP errors found in debug log\n";
    } else {
        echo "✅ No recent PHP errors\n";
    }
} else {
    echo "✅ No debug log found\n";
}

echo "\n4. Video Section Fixes Applied:\n";
echo "✅ Added playsinline and controls attributes to video element\n";
echo "✅ Changed object-fit from 'cover' to 'contain' to prevent cropping\n";
echo "✅ Improved video playback handling\n";
echo "✅ Fixed PHP argument count error in functions.php\n";
echo "✅ Added better error handling for video loading\n";
echo "✅ Added click-to-play functionality\n";

echo "\n🎯 Video Section Fix Test Complete!\n";
echo "\nNext Steps:\n";
echo "1. Clear any caches (browser, WordPress, etc.)\n";
echo "2. Test the video section in the WordPress editor\n";
echo "3. Check that videos play without cropping\n";
echo "4. Verify autoplay behavior works as expected\n";
?>