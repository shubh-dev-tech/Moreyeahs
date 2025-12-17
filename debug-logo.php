<?php
// Simple debug script to check logo status
require_once( 'wp-load.php' );

echo "<h1>Logo Debug Info</h1>";
echo "<pre>";

$template = get_option( 'template' );
$stylesheet = get_option( 'stylesheet' );

echo "Template: $template\n";
echo "Stylesheet: $stylesheet\n\n";

// Check theme mods
$theme_mods = get_option( 'theme_mod_' . $template );
echo "All Theme Mods:\n";
print_r( $theme_mods );

echo "\n\nCustom Logo (via get_theme_mod):\n";
$logo = get_theme_mod( 'custom_logo' );
print_r( $logo );
echo "Type: " . gettype( $logo ) . "\n";

// Check if it's a valid attachment
if ( $logo ) {
	if ( is_numeric( $logo ) ) {
		$att = get_post( (int)$logo );
		echo "\nAttachment for ID $logo:\n";
		print_r( $att );
	}
}

echo "\n\nAll attachments in database:\n";
$attachments = get_posts( array(
	'post_type' => 'attachment',
	'posts_per_page' => -1,
) );
foreach ( $attachments as $att ) {
	echo "ID: {$att->ID}, Title: {$att->post_title}, URL: " . wp_get_attachment_url( $att->ID ) . "\n";
}

echo "</pre>";
?>
