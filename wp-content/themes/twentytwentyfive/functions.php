<?php
/**
 * Twenty Twenty-Five functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package WordPress
 * @subpackage Twenty_Twenty_Five
 * @since Twenty Twenty-Five 1.0
 */

// Adds theme support for post formats.
if ( ! function_exists( 'twentytwentyfive_post_format_setup' ) ) :
	/**
	 * Adds theme support for post formats.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_post_format_setup() {
		add_theme_support( 'post-formats', array( 'aside', 'audio', 'chat', 'gallery', 'image', 'link', 'quote', 'status', 'video' ) );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_post_format_setup' );

// Enable WebP support for uploads and responsive images
if ( ! function_exists( 'twentytwentyfive_enable_webp_support' ) ) :
	/**
	 * Enables WebP image format support.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array $mimes Existing MIME types.
	 * @return array Modified MIME types.
	 */
	function twentytwentyfive_enable_webp_support( $mimes ) {
		$mimes['webp'] = 'image/webp';
		return $mimes;
	}
endif;
add_filter( 'upload_mimes', 'twentytwentyfive_enable_webp_support' );

// Add WebP to allowed file extensions
if ( ! function_exists( 'twentytwentyfive_webp_file_ext' ) ) :
	/**
	 * Adds WebP to allowed file extensions.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array  $data    File data.
	 * @param string $file    File path.
	 * @param string $filename File name.
	 * @param array  $mimes   MIME types.
	 * @return array Modified file data.
	 */
	function twentytwentyfive_webp_file_ext( $data, $file, $filename, $mimes ) {
		$ext = isset( $data['ext'] ) ? $data['ext'] : '';
		if ( empty( $ext ) ) {
			$exploded = explode( '.', $filename );
			$ext      = strtolower( end( $exploded ) );
		}
		if ( 'webp' === $ext ) {
			$data['ext']  = 'webp';
			$data['type'] = 'image/webp';
		}
		return $data;
	}
endif;
add_filter( 'wp_check_filetype_and_ext', 'twentytwentyfive_webp_file_ext', 10, 4 );

// Enable responsive image sizes for WebP
if ( ! function_exists( 'twentytwentyfive_webp_responsive_images' ) ) :
	/**
	 * Enables responsive image generation for WebP.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array $sizes Image sizes.
	 * @return array Modified image sizes.
	 */
	function twentytwentyfive_webp_responsive_images( $sizes ) {
		return $sizes;
	}
endif;
add_filter( 'intermediate_image_sizes_advanced', 'twentytwentyfive_webp_responsive_images' );

// Fix WebP display in media library
if ( ! function_exists( 'twentytwentyfive_webp_display' ) ) :
	/**
	 * Fixes WebP image display in media library.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param string $result  HTML img element or empty string on failure.
	 * @param int    $post_id Attachment ID.
	 * @param array  $size    Image size.
	 * @return string Modified HTML img element.
	 */
	function twentytwentyfive_webp_display( $result, $post_id, $size ) {
		$mime = get_post_mime_type( $post_id );
		if ( 'image/webp' === $mime ) {
			$image = wp_get_attachment_image_src( $post_id, $size );
			if ( $image ) {
				$result = '<img src="' . esc_url( $image[0] ) . '" alt="" />';
			}
		}
		return $result;
	}
endif;
add_filter( 'wp_get_attachment_image', 'twentytwentyfive_webp_display', 10, 3 );

// Enqueues editor-style.css in the editors.
if ( ! function_exists( 'twentytwentyfive_editor_style' ) ) :
	/**
	 * Enqueues editor-style.css in the editors.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_editor_style() {
		add_editor_style( 'assets/css/editor-style.css' );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_editor_style' );

// Enqueues style.css on the front.
if ( ! function_exists( 'twentytwentyfive_enqueue_styles' ) ) :
	/**
	 * Enqueues style.css on the front.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_styles() {
		wp_enqueue_style(
			'twentytwentyfive-style',
			get_parent_theme_file_uri( 'style.css' ),
			array(),
			wp_get_theme()->get( 'Version' )
		);
	}
endif;
add_action( 'wp_enqueue_scripts', 'twentytwentyfive_enqueue_styles' );

// Registers custom block styles.
if ( ! function_exists( 'twentytwentyfive_block_styles' ) ) :
	/**
	 * Registers custom block styles.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_block_styles() {
		register_block_style(
			'core/list',
			array(
				'name'         => 'checkmark-list',
				'label'        => __( 'Checkmark', 'twentytwentyfive' ),
				'inline_style' => '
				ul.is-style-checkmark-list {
					list-style-type: "\2713";
				}

				ul.is-style-checkmark-list li {
					padding-inline-start: 1ch;
				}',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_block_styles' );

// Registers pattern categories.
if ( ! function_exists( 'twentytwentyfive_pattern_categories' ) ) :
	/**
	 * Registers pattern categories.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_pattern_categories() {

		register_block_pattern_category(
			'twentytwentyfive_page',
			array(
				'label'       => __( 'Pages', 'twentytwentyfive' ),
				'description' => __( 'A collection of full page layouts.', 'twentytwentyfive' ),
			)
		);

		register_block_pattern_category(
			'twentytwentyfive_post-format',
			array(
				'label'       => __( 'Post formats', 'twentytwentyfive' ),
				'description' => __( 'A collection of post format patterns.', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_pattern_categories' );

// Registers block binding sources.
if ( ! function_exists( 'twentytwentyfive_register_block_bindings' ) ) :
	/**
	 * Registers the post format block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_block_bindings() {
		register_block_bindings_source(
			'twentytwentyfive/format',
			array(
				'label'              => _x( 'Post format name', 'Label for the block binding placeholder in the editor', 'twentytwentyfive' ),
				'get_value_callback' => 'twentytwentyfive_format_binding',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_block_bindings' );

// Registers block binding callback function for the post format name.
if ( ! function_exists( 'twentytwentyfive_format_binding' ) ) :
	/**
	 * Callback function for the post format name block binding source.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return string|void Post format name, or nothing if the format is 'standard'.
	 */
	function twentytwentyfive_format_binding() {
		$post_format_slug = get_post_format();

		if ( $post_format_slug && 'standard' !== $post_format_slug ) {
			return get_post_format_string( $post_format_slug );
		}
	}
endif;

// Register Navigation Menus
if ( ! function_exists( 'twentytwentyfive_register_menus' ) ) :
	/**
	 * Registers navigation menus.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_menus() {
		register_nav_menus(
			array(
				'primary'     => __( 'Primary Menu', 'twentytwentyfive' ),
				'second-menu' => __( 'Second Menu (Side Burger Menu)', 'twentytwentyfive' ),
				'footer'      => __( 'Footer Menu', 'twentytwentyfive' ),
			)
		);
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_register_menus' );

// Menu REST API routes are registered in inc/rest-api-endpoints.php

// Register Moreyeahs Slider Block (without ACF)
if ( ! function_exists( 'twentytwentyfive_register_moreyeahs_slider' ) ) :
	/**
	 * Registers the Moreyeahs Slider block.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_register_moreyeahs_slider() {
		// Register the editor script first
		$block_js_path = get_template_directory() . '/blocks/moreyeahs-slider/editor.js';
		
		if ( file_exists( $block_js_path ) ) {
			wp_register_script(
				'moreyeahs-slider-block-editor',
				get_template_directory_uri() . '/blocks/moreyeahs-slider/editor.js',
				array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-i18n', 'wp-data' ),
				filemtime( $block_js_path ),
				false
			);
		}
		
		register_block_type(
			'moreyeahs/slider',
			array(
				'api_version'     => 2,
				'title'           => __( 'Moreyeahs Slider', 'twentytwentyfive' ),
				'description'     => __( 'A dynamic slider with image, heading, and CTA', 'twentytwentyfive' ),
				'category'        => 'media',
				'icon'            => 'slides',
				'keywords'        => array( 'slider', 'carousel', 'moreyeahs', 'hero' ),
				'supports'        => array(
					'align' => true,
				),
				'attributes'      => array(
					'slides' => array(
						'type'    => 'array',
						'default' => array(),
					),
				),
				'editor_script'   => 'moreyeahs-slider-block-editor',
				'render_callback' => 'twentytwentyfive_render_moreyeahs_slider',
			)
		);
	}
endif;
add_action( 'init', 'twentytwentyfive_register_moreyeahs_slider' );

// Render Moreyeahs Slider Block
if ( ! function_exists( 'twentytwentyfive_render_moreyeahs_slider' ) ) :
	/**
	 * Renders the Moreyeahs Slider block.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 * @param object $block      Block object.
	 * @return string Block HTML.
	 */
	function twentytwentyfive_render_moreyeahs_slider( $attributes, $content, $block ) {
		$slides = isset( $attributes['slides'] ) ? $attributes['slides'] : array();

		if ( empty( $slides ) ) {
			return '<div class="moreyeahs-slider-placeholder"><p>Add slides to your slider</p></div>';
		}

		$block_id = 'moreyeahs-slider-' . uniqid();

		ob_start();
		?>
		<div id="<?php echo esc_attr( $block_id ); ?>" class="moreyeahs-slider">
			<div class="slider-container">
				<?php foreach ( $slides as $index => $slide ) : ?>
					<div class="slide <?php echo 0 === $index ? 'active' : ''; ?>">
						<?php if ( ! empty( $slide['image'] ) ) : ?>
							<img src="<?php echo esc_url( $slide['image'] ); ?>" alt="<?php echo esc_attr( $slide['heading'] ); ?>" class="slide-image" />
						<?php endif; ?>

						<div class="slide-overlay"></div>

						<div class="slide-caption">
							<div class="slide-caption-container">
								<div class="slide-content">
									<?php if ( ! empty( $slide['heading'] ) ) : ?>
										<h2 class="slide-heading"><?php echo esc_html( $slide['heading'] ); ?></h2>
									<?php endif; ?>

									<?php if ( ! empty( $slide['subheading'] ) ) : ?>
										<p class="slide-subheading"><?php echo esc_html( $slide['subheading'] ); ?></p>
									<?php endif; ?>

									<?php if ( ! empty( $slide['cta_text'] ) && ! empty( $slide['cta_url'] ) ) : ?>
										<a href="<?php echo esc_url( $slide['cta_url'] ); ?>" class="slide-cta">
											<?php echo esc_html( $slide['cta_text'] ); ?>
										</a>
									<?php endif; ?>
								</div>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>

			<div class="slider-dots">
				<?php foreach ( $slides as $index => $slide ) : ?>
					<button class="dot <?php echo 0 === $index ? 'active' : ''; ?>" data-slide="<?php echo esc_attr( $index ); ?>">
						<span></span>
					</button>
				<?php endforeach; ?>
			</div>
		</div>

		<style>
		.moreyeahs-slider {
			position: relative;
			width: 100%;
			overflow: hidden;
		}

		.slider-container {
			position: relative;
			width: 100%;
			height: 100vh;
		}

		.slide {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
			transition: opacity 0.5s ease-in-out;
		}

		.slide.active {
			opacity: 1;
		}

		.slide-image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		.slide-overlay {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.4);
		}

		.slide-caption {
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			transform: translateY(-50%);
			z-index: 10;
		}

		.slide-caption-container {
			max-width: 1200px;
			margin: 0 auto;
			padding: 0 20px;
		}

		.slide-content {
			width: 100%;
			padding: 0;
		}

		/* Desktop and Tablet: 58.33% width (7/12 columns) */
		@media (min-width: 640px) {
			.slide-content {
				width: 58.333333%;
			}
		}

		.slide-heading {
			color: white;
			font-size: 48px;
			font-weight: bold;
			margin-bottom: 15px;
			line-height: 1.2;
		}

		.slide-subheading {
			color: white;
			font-size: 18px;
			font-weight: 400;
			margin-bottom: 30px;
			text-transform: uppercase;
			letter-spacing: 2px;
			opacity: 0.9;
		}

		.slide-cta {
			display: inline-block;
			padding: 10px 40px;
			background: transparent;
			color: #fff;
			text-decoration: none;
			text-transform: uppercase;
			font-weight: 600;
			transition: transform 0.3s ease, color 0.4s ease;
			border: 1px solid white;
			position: relative;
			overflow: hidden;
			z-index: 1;
		}

		.slide-cta::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 0;
			height: 100%;
			background: #000;
			transition: width 0.4s ease;
			z-index: -1;
		}

		.slide-cta:hover {
			border:1px solid #000;
		}

		.slide-cta:hover::before {
			width: 100%;
		}

		.slider-dots {
			position: absolute;
			bottom: 30px;
			left: 50%;
			transform: translateX(-50%);
			display: flex;
			gap: 10px;
			z-index: 20;
		}

		.dot {
			width: 12px;
			height: 12px;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.5);
			border: none;
			cursor: pointer;
			padding: 0;
			transition: all 0.3s ease;
		}

		.dot.active {
			background: white;
			width: 40px;
			border-radius: 6px;
		}

		@media (max-width: 768px) {
			.slider-container {
				height: 400px;
			}

			.slide-heading {
				font-size: 22px;
				margin-bottom: 10px;
			}

			.slide-subheading {
				font-size: 10px;
				margin-bottom: 20px;
			}

			.slide-cta {
		padding: 6px 18px;
        font-size: 10px;
			}
		}
		</style>

		<script>
		(function() {
			const slider = document.getElementById('<?php echo esc_js( $block_id ); ?>');
			if (!slider) return;

			const slides = slider.querySelectorAll('.slide');
			const dots = slider.querySelectorAll('.dot');
			let currentSlide = 0;
			let autoplayInterval;

			function showSlide(index) {
				slides.forEach(s => s.classList.remove('active'));
				dots.forEach(d => d.classList.remove('active'));

				slides[index].classList.add('active');
				dots[index].classList.add('active');
				currentSlide = index;
			}

			function nextSlide() {
				const next = (currentSlide + 1) % slides.length;
				showSlide(next);
			}

			function startAutoplay() {
				autoplayInterval = setInterval(nextSlide, 5000);
			}

			function stopAutoplay() {
				clearInterval(autoplayInterval);
			}

			dots.forEach((dot, index) => {
				dot.addEventListener('click', () => {
					showSlide(index);
					stopAutoplay();
					startAutoplay();
				});
			});

			startAutoplay();

			slider.addEventListener('mouseenter', stopAutoplay);
			slider.addEventListener('mouseleave', startAutoplay);
		})();
		</script>
		<?php
		return ob_get_clean();
	}
endif;

// Script is registered in the block registration function above

// Expose Moreyeahs Slider to GraphQL
if ( ! function_exists( 'twentytwentyfive_expose_slider_to_graphql' ) ) :
	/**
	 * Exposes Moreyeahs Slider block to GraphQL.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array $allowed_blocks Array of allowed block types.
	 * @return array Modified array of allowed block types.
	 */
	function twentytwentyfive_expose_slider_to_graphql( $allowed_blocks ) {
		$allowed_blocks[] = 'moreyeahs/slider';
		$allowed_blocks[] = 'acf/moreyeahs-service-block';
		return $allowed_blocks;
	}
endif;
add_filter( 'graphql_blocks_allowed_block_types', 'twentytwentyfive_expose_slider_to_graphql' );

// Add theme support for custom logo and site icon (favicon)
if ( ! function_exists( 'twentytwentyfive_setup_appearance' ) ) :
	/**
	 * Sets up theme support for custom logo and site icon.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_setup_appearance() {
		// Add custom logo support
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 100,
				'width'       => 400,
				'flex-height' => true,
				'flex-width'  => true,
			)
		);

		// Add site icon (favicon) support
		add_theme_support( 'site-icon' );

		// Ensure Customizer is enabled
		add_theme_support( 'customize-selective-refresh-widgets' );
	}
endif;
add_action( 'after_setup_theme', 'twentytwentyfive_setup_appearance' );

// Add custom admin page for appearance settings (alternative to Customizer)
if ( ! function_exists( 'twentytwentyfive_add_appearance_menu' ) ) :
	/**
	 * Adds custom appearance settings page to admin menu.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_add_appearance_menu() {
		$page_hook = add_theme_page(
			'Site Appearance Settings',
			'Site Appearance',
			'manage_options',
			'site-appearance-settings',
			'twentytwentyfive_render_appearance_page'
		);
		
		// Enqueue media uploader scripts on this page
		add_action( 'admin_print_scripts-' . $page_hook, 'twentytwentyfive_enqueue_appearance_scripts' );
	}
endif;
add_action( 'admin_menu', 'twentytwentyfive_add_appearance_menu' );

// Enqueue scripts for appearance page
if ( ! function_exists( 'twentytwentyfive_enqueue_appearance_scripts' ) ) :
	/**
	 * Enqueues scripts for the appearance settings page.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_enqueue_appearance_scripts() {
		// Enqueue WordPress media uploader
		wp_enqueue_media();
		
		// Enqueue jQuery (should already be loaded, but just in case)
		wp_enqueue_script( 'jquery' );
	}
endif;

// Render custom appearance settings page
if ( ! function_exists( 'twentytwentyfive_render_appearance_page' ) ) :
	/**
	 * Renders the custom appearance settings page.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @return void
	 */
	function twentytwentyfive_render_appearance_page() {
		// Check user capabilities
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Handle form submission
		if ( isset( $_POST['appearance_settings_nonce'] ) && wp_verify_nonce( $_POST['appearance_settings_nonce'], 'save_appearance_settings' ) ) {
			// Handle site title
			if ( isset( $_POST['blogname'] ) ) {
				update_option( 'blogname', sanitize_text_field( $_POST['blogname'] ) );
			}

			// Handle site description
			if ( isset( $_POST['blogdescription'] ) ) {
				update_option( 'blogdescription', sanitize_text_field( $_POST['blogdescription'] ) );
			}

			// Handle logo upload
			if ( isset( $_POST['custom_logo'] ) ) {
				if ( ! empty( $_POST['custom_logo'] ) ) {
					$logo_id = absint( $_POST['custom_logo'] );
					
					// Verify the attachment exists
					$attachment = get_post( $logo_id );
					
					if ( $attachment && $attachment->post_type === 'attachment' ) {
						// Save directly to options table
						update_option( 'custom_logo_id', $logo_id );
						
						// Also set the WordPress-style theme mod for compatibility
						if ( function_exists( 'set_theme_mod' ) ) {
							set_theme_mod( 'custom_logo', $logo_id );
						}
					}
				} else {
					// Remove logo if empty
					delete_option( 'custom_logo_id' );
				}
			}

			// Handle site icon upload
			if ( isset( $_POST['site_icon'] ) ) {
				$icon_id = absint( $_POST['site_icon'] );
				if ( $icon_id > 0 ) {
					$attachment = get_post( $icon_id );
					if ( $attachment && $attachment->post_type === 'attachment' ) {
						update_option( 'site_icon', $icon_id );
					}
				} else {
					delete_option( 'site_icon' );
				}
			}

			echo '<div class="notice notice-success is-dismissible"><p>Settings saved successfully!</p></div>';
		}

		// Get current values
		$site_title       = get_option( 'blogname' );
		$site_description = get_option( 'blogdescription' );
		
		// Try to get logo from our custom option first, then fallback to theme mod
		$custom_logo_id = get_option( 'custom_logo_id' );
		if ( ! $custom_logo_id ) {
			$custom_logo_raw = get_theme_mod( 'custom_logo' );
			if ( $custom_logo_raw ) {
				if ( is_numeric( $custom_logo_raw ) ) {
					$custom_logo_id = absint( $custom_logo_raw );
				} else {
					// It's a URL, extract the ID from the attachment by URL
					$attachment = attachment_url_to_postid( $custom_logo_raw );
					$custom_logo_id = $attachment ? $attachment : 0;
				}
			}
		} else {
			$custom_logo_id = absint( $custom_logo_id );
		}
		
		$site_icon_id     = get_option( 'site_icon' );

		?>
		<div class="wrap">
			<h1>Site Appearance Settings</h1>
			<p>Manage your site's logo, favicon, title, and description. These settings will automatically sync to your Next.js frontend.</p>

			<form method="post" action="">
				<?php wp_nonce_field( 'save_appearance_settings', 'appearance_settings_nonce' ); ?>

				<table class="form-table" role="presentation">
					<tbody>
						<!-- Site Title -->
						<tr>
							<th scope="row">
								<label for="blogname">Site Title</label>
							</th>
							<td>
								<input type="text" id="blogname" name="blogname" value="<?php echo esc_attr( $site_title ); ?>" class="regular-text" />
								<p class="description">Your site name (appears in header and SEO)</p>
							</td>
						</tr>

						<!-- Site Description -->
						<tr>
							<th scope="row">
								<label for="blogdescription">Site Description</label>
							</th>
							<td>
								<input type="text" id="blogdescription" name="blogdescription" value="<?php echo esc_attr( $site_description ); ?>" class="regular-text" />
								<p class="description">Brief description (used in SEO meta tags)</p>
							</td>
						</tr>

						<!-- Logo -->
						<tr>
							<th scope="row">
								<label>Site Logo</label>
							</th>
							<td>
								<div class="logo-upload-wrapper">
									<?php if ( $custom_logo_id ) : ?>
										<?php $logo_image = wp_get_attachment_image_src( $custom_logo_id, 'full' ); ?>
										<?php if ( $logo_image && is_array( $logo_image ) && ! empty( $logo_image[0] ) ) : ?>
											<div class="logo-preview" style="margin-bottom: 10px;">
												<img src="<?php echo esc_url( $logo_image[0] ); ?>" alt="Logo" style="max-width: 400px; max-height: 100px; border: 1px solid #ddd; padding: 10px; background: #f9f9f9;" />
											</div>
										<?php endif; ?>
									<?php endif; ?>
									<input type="hidden" id="custom_logo" name="custom_logo" value="<?php echo esc_attr( $custom_logo_id ); ?>" />
									<button type="button" class="button button-secondary upload-logo-button">
										<?php echo $custom_logo_id ? 'Change Logo' : 'Upload Logo'; ?>
									</button>
									<?php if ( $custom_logo_id ) : ?>
										<button type="button" class="button button-secondary remove-logo-button">Remove Logo</button>
									<?php endif; ?>
									<p class="description">Recommended: PNG with transparent background, max 400×100px</p>
								</div>
							</td>
						</tr>

						<!-- Site Icon (Favicon) -->
						<tr>
							<th scope="row">
								<label>Site Icon (Favicon)</label>
							</th>
							<td>
								<div class="site-icon-upload-wrapper">
									<?php if ( $site_icon_id ) : ?>
										<?php $icon_image = wp_get_attachment_image_src( $site_icon_id, array( 64, 64 ) ); ?>
										<div class="icon-preview" style="margin-bottom: 10px;">
											<img src="<?php echo esc_url( $icon_image[0] ); ?>" alt="Favicon" style="width: 64px; height: 64px; border: 1px solid #ddd; padding: 5px; background: #f9f9f9;" />
										</div>
									<?php endif; ?>
									<input type="hidden" id="site_icon" name="site_icon" value="<?php echo esc_attr( $site_icon_id ); ?>" />
									<button type="button" class="button button-secondary upload-icon-button">
										<?php echo $site_icon_id ? 'Change Site Icon' : 'Upload Site Icon'; ?>
									</button>
									<?php if ( $site_icon_id ) : ?>
										<button type="button" class="button button-secondary remove-icon-button">Remove Site Icon</button>
									<?php endif; ?>
									<p class="description">Recommended: PNG, 512×512px (square)</p>
								</div>
							</td>
						</tr>

						<!-- API Test -->
						<tr>
							<th scope="row">
								<label>API Endpoint</label>
							</th>
							<td>
								<p>
									<a href="<?php echo esc_url( rest_url( 'wp/v2/site-settings' ) ); ?>" target="_blank" class="button button-secondary">
										Test API Endpoint
									</a>
								</p>
								<p class="description">Click to view your site settings in JSON format</p>
							</td>
						</tr>
					</tbody>
				</table>

				<?php submit_button( 'Save Settings' ); ?>
			</form>

			<script>
			jQuery(document).ready(function($) {
				console.log('Appearance settings page loaded');
				
				// Check if wp.media is available
				if (typeof wp === 'undefined' || typeof wp.media === 'undefined') {
					console.error('WordPress media library not loaded!');
					alert('Error: WordPress media library not loaded. Please refresh the page.');
					return;
				}
				
				console.log('WordPress media library is available');
				
				// Logo upload
				var logoUploader;
				$('.upload-logo-button').on('click', function(e) {
					e.preventDefault();
					
					if (logoUploader) {
						logoUploader.open();
						return;
					}
					
					logoUploader = wp.media({
						title: 'Choose Logo',
						button: { text: 'Use as Logo' },
						multiple: false,
						library: { type: 'image' }
					});
					
					logoUploader.on('select', function() {
						var attachment = logoUploader.state().get('selection').first().toJSON();
						
						console.log('Attachment selected:', attachment);
						console.log('Setting hidden input to:', attachment.id);
						
						$('#custom_logo').val(attachment.id);
						
						console.log('Hidden input value after set:', $('#custom_logo').val());
						console.log('Hidden input element:', $('#custom_logo'));
						
						$('.logo-preview').remove();
						$('.logo-upload-wrapper').prepend('<div class="logo-preview" style="margin-bottom: 10px;"><img src="' + attachment.url + '" alt="Logo" style="max-width: 400px; max-height: 100px; border: 1px solid #ddd; padding: 10px; background: #f9f9f9;" /></div>');
						$('.upload-logo-button').text('Change Logo');
						
						if (!$('.remove-logo-button').length) {
							$('.upload-logo-button').after(' <button type="button" class="button button-secondary remove-logo-button" style="margin-left: 5px;">Remove Logo</button>');
						}
					});
					
					logoUploader.open();
				});

				// Remove logo
				$(document).on('click', '.remove-logo-button', function(e) {
					e.preventDefault();
					$('#custom_logo').val('');
					$('.logo-preview').remove();
					$('.upload-logo-button').text('Upload Logo');
					$(this).remove();
				});

				// Site icon upload
				var iconUploader;
				$('.upload-icon-button').on('click', function(e) {
					e.preventDefault();
					console.log('Site icon upload button clicked');
					
					if (iconUploader) {
						console.log('Opening existing icon uploader');
						iconUploader.open();
						return;
					}
					
					console.log('Creating new icon uploader');
					iconUploader = wp.media({
						title: 'Choose Site Icon (Favicon)',
						button: { text: 'Use as Site Icon' },
						multiple: false,
						library: { type: 'image' }
					});
					
					iconUploader.on('select', function() {
						console.log('Site icon selected');
						var attachment = iconUploader.state().get('selection').first().toJSON();
						console.log('Icon attachment:', attachment);
						
						$('#site_icon').val(attachment.id);
						$('.icon-preview').remove();
						$('.site-icon-upload-wrapper').prepend('<div class="icon-preview" style="margin-bottom: 10px;"><img src="' + attachment.url + '" alt="Favicon" style="width: 64px; height: 64px; border: 1px solid #ddd; padding: 5px; background: #f9f9f9;" /></div>');
						$('.upload-icon-button').text('Change Site Icon');
						
						if (!$('.remove-icon-button').length) {
							$('.upload-icon-button').after(' <button type="button" class="button button-secondary remove-icon-button" style="margin-left: 5px;">Remove Site Icon</button>');
						}
						
						console.log('Site icon preview updated');
					});
					
					iconUploader.open();
				});

				// Remove site icon
				$(document).on('click', '.remove-icon-button', function(e) {
					e.preventDefault();
					console.log('Remove site icon clicked');
					$('#site_icon').val('');
					$('.icon-preview').remove();
					$('.upload-icon-button').text('Upload Site Icon');
					$(this).remove();
				});
				

				
				console.log('All event handlers attached');
			});
			</script>
		</div>
		<?php
	}
endif;

// Site settings REST API route is registered in inc/rest-api-endpoints.php


// ============================================
// FOOTER WIDGETS - Dynamic Footer System
// ============================================

// Register footer widget areas
if ( ! function_exists( 'twentytwentyfive_register_footer_widgets' ) ) :
	function twentytwentyfive_register_footer_widgets() {
		for ( $i = 1; $i <= 5; $i++ ) {
			register_sidebar(
				array(
					'name'          => 'Footer Column ' . $i,
					'id'            => 'footer-column-' . $i,
					'description'   => 'Footer widget area column ' . $i,
					'before_widget' => '<div class="footer-widget">',
					'after_widget'  => '</div>',
					'before_title'  => '<h4 class="widget-title">',
					'after_title'   => '</h4>',
				)
			);
		}
	}
endif;
add_action( 'widgets_init', 'twentytwentyfive_register_footer_widgets' );

// Register custom options for copyright text
if ( ! function_exists( 'twentytwentyfive_register_footer_copyright_settings' ) ) :
	function twentytwentyfive_register_footer_copyright_settings() {
		register_setting(
			'general',
			'footer_copyright_left',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'default'           => '',
			)
		);

		register_setting(
			'general',
			'footer_copyright_right',
			array(
				'type'              => 'string',
				'sanitize_callback' => 'wp_kses_post',
				'default'           => '',
			)
		);
	}
endif;
add_action( 'admin_init', 'twentytwentyfive_register_footer_copyright_settings' );

// Add settings fields to General Settings page
if ( ! function_exists( 'twentytwentyfive_add_footer_copyright_fields' ) ) :
	function twentytwentyfive_add_footer_copyright_fields() {
		add_settings_section(
			'footer_copyright_section',
			'Footer Copyright Settings',
			function () {
				echo '<p>Configure the left and right copyright text for your footer.</p>';
			},
			'general'
		);

		add_settings_field(
			'footer_copyright_left',
			'Copyright Left Text',
			function () {
				$value = get_option( 'footer_copyright_left', '' );
				echo '<textarea name="footer_copyright_left" rows="3" cols="50" class="large-text">' . esc_textarea( $value ) . '</textarea>';
				echo '<p class="description">HTML allowed. Use {year} for current year.</p>';
			},
			'general',
			'footer_copyright_section'
		);

		add_settings_field(
			'footer_copyright_right',
			'Copyright Right Text',
			function () {
				$value = get_option( 'footer_copyright_right', '' );
				echo '<textarea name="footer_copyright_right" rows="3" cols="50" class="large-text">' . esc_textarea( $value ) . '</textarea>';
				echo '<p class="description">HTML allowed. Use {year} for current year.</p>';
			},
			'general',
			'footer_copyright_section'
		);
	}
endif;
add_action( 'admin_init', 'twentytwentyfive_add_footer_copyright_fields' );

// Footer widgets REST API route is registered in inc/rest-api-endpoints.php
// Helper functions for footer widgets are kept here for use by the REST API

// Parse footer widget content
if ( ! function_exists( 'twentytwentyfive_parse_footer_widget_content' ) ) :
	function twentytwentyfive_parse_footer_widget_content( $content, $sidebar_id ) {
		if ( empty( $content ) ) {
			return null;
		}

		// Extract title
		preg_match( '/<h4[^>]*class="widget-title"[^>]*>(.*?)<\/h4>/s', $content, $title_matches );
		$title = isset( $title_matches[1] ) ? wp_strip_all_tags( $title_matches[1] ) : '';

		// Remove title from content
		$content = preg_replace( '/<h4[^>]*class="widget-title"[^>]*>.*?<\/h4>/s', '', $content );

		// Extract links if it's a menu widget
		$links = array();
		preg_match_all( '/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/s', $content, $link_matches, PREG_SET_ORDER );

		if ( ! empty( $link_matches ) ) {
			foreach ( $link_matches as $match ) {
				$links[] = array(
					'url'   => $match[1],
					'label' => wp_strip_all_tags( $match[2] ),
				);
			}
		}

		// Clean up content
		$content = wp_strip_all_tags( $content, '<p><br><strong><em><a><ul><li>' );
		$content = trim( $content );

		return array(
			'id'      => $sidebar_id,
			'title'   => $title,
			'content' => $content,
			'links'   => $links,
		);
	}
endif;


// Set ACF JSON save/load paths
if ( ! function_exists( 'twentytwentyfive_acf_json_save_point' ) ) :
	/**
	 * Sets the ACF JSON save point.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param string $path The default path.
	 * @return string Modified path.
	 */
	function twentytwentyfive_acf_json_save_point( $path ) {
		return get_stylesheet_directory() . '/acf-json';
	}
endif;
add_filter( 'acf/settings/save_json', 'twentytwentyfive_acf_json_save_point' );

if ( ! function_exists( 'twentytwentyfive_acf_json_load_point' ) ) :
	/**
	 * Sets the ACF JSON load point.
	 *
	 * @since Twenty Twenty-Five 1.0
	 *
	 * @param array $paths Array of paths.
	 * @return array Modified paths.
	 */
	function twentytwentyfive_acf_json_load_point( $paths ) {
		unset( $paths[0] );
		$paths[] = get_stylesheet_directory() . '/acf-json';
		return $paths;
	}
endif;
add_filter( 'acf/settings/load_json', 'twentytwentyfive_acf_json_load_point' );


// ACF JSON save/load points are already defined above


// Load centralized ACF blocks registration
require_once get_template_directory() . '/inc/acf-blocks.php';

// Load ACF section ID field helper
require_once get_template_directory() . '/inc/acf-section-id-field.php';

// Load REST API endpoints for headless WordPress
require_once get_template_directory() . '/inc/rest-api-endpoints.php';

// Load Mega Menu CPT
require_once get_template_directory() . '/inc/mega-menu-cpt.php';



/**
 * Safety check for theme mod values
 */
add_filter('theme_mod_custom_logo', function($value) {
    // Ensure the logo ID is valid
    if ($value && !get_post($value)) {
        // Logo ID exists but attachment doesn't - clear it
        remove_theme_mod('custom_logo');
        return false;
    }
    return $value;
});
/**
 * Logo Persistence Across Theme Changes
 * Fixes the issue where logo becomes null when switching between parent and child themes
 */

/**
 * Preserve logo when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get logo from the old theme
    $old_logo = get_theme_mod('custom_logo');
    
    if ($old_logo && get_post($old_logo)) {
        // Store in option for the new theme to pick up
        update_option('custom_logo_id', $old_logo);
        
        // Also set it immediately in the new theme
        set_theme_mod('custom_logo', $old_logo);
    }
}, 10, 3);

/**
 * Restore logo after theme activation
 */
add_action('after_switch_theme', function() {
    $option_logo = get_option('custom_logo_id');
    $theme_logo = get_theme_mod('custom_logo');
    
    // If theme doesn't have logo but option does, restore it
    if (!$theme_logo && $option_logo && get_post($option_logo)) {
        set_theme_mod('custom_logo', $option_logo);
    }
    
    // If theme has logo but option doesn't, sync it
    if ($theme_logo && !$option_logo && get_post($theme_logo)) {
        update_option('custom_logo_id', $theme_logo);
    }
});

/**
 * Sync logo between theme mod and option when logo is updated
 */
add_action('customize_save_after', function() {
    $logo_id = get_theme_mod('custom_logo');
    if ($logo_id) {
        update_option('custom_logo_id', $logo_id);
    }
});

/**
 * Enhanced logo handling for appearance settings page
 */
add_action('admin_init', function() {
    // Sync logo when appearance settings are saved
    if (isset($_POST['appearance_settings_nonce']) && wp_verify_nonce($_POST['appearance_settings_nonce'], 'save_appearance_settings')) {
        if (isset($_POST['custom_logo'])) {
            $logo_id = absint($_POST['custom_logo']);
            if ($logo_id && get_post($logo_id)) {
                // Save to both locations
                set_theme_mod('custom_logo', $logo_id);
                update_option('custom_logo_id', $logo_id);
            } elseif (empty($_POST['custom_logo'])) {
                // Remove from both locations
                remove_theme_mod('custom_logo');
                delete_option('custom_logo_id');
            }
        }
    }
});
/**
 * Menu Persistence Across Theme Changes
 * Fixes the issue where menu assignments become lost when switching between parent and child themes
 */

/**
 * Preserve menu assignments when switching themes
 */
add_action('switch_theme', function($new_name, $new_theme, $old_theme) {
    // Get menu assignments from the old theme
    $old_locations = get_theme_mod('nav_menu_locations', []);
    
    if (!empty($old_locations)) {
        // Store in options for the new theme to pick up
        foreach ($old_locations as $location => $menu_id) {
            if ($menu_id && wp_get_nav_menu_object($menu_id)) {
                update_option("nav_menu_location_{$location}", $menu_id);
            }
        }
        
        // Also set them immediately in the new theme
        set_theme_mod('nav_menu_locations', $old_locations);
    }
}, 10, 3);

/**
 * Restore menu assignments after theme activation
 */
add_action('after_switch_theme', function() {
    $registered_locations = get_registered_nav_menus();
    $theme_locations = get_theme_mod('nav_menu_locations', []);
    $updated = false;
    
    foreach ($registered_locations as $location => $description) {
        $option_menu_id = get_option("nav_menu_location_{$location}");
        $theme_menu_id = isset($theme_locations[$location]) ? $theme_locations[$location] : null;
        
        // If theme doesn't have assignment but option does, restore it
        if (!$theme_menu_id && $option_menu_id && wp_get_nav_menu_object($option_menu_id)) {
            $theme_locations[$location] = $option_menu_id;
            $updated = true;
        }
        
        // If theme has assignment but option doesn't, sync it
        if ($theme_menu_id && !$option_menu_id && wp_get_nav_menu_object($theme_menu_id)) {
            update_option("nav_menu_location_{$location}", $theme_menu_id);
        }
    }
    
    if ($updated) {
        set_theme_mod('nav_menu_locations', $theme_locations);
    }
});

/**
 * Sync menu assignments when they are updated
 */
add_action('wp_update_nav_menu', function($menu_id, $menu_data = null) {
    // Sync current assignments to options
    $locations = get_theme_mod('nav_menu_locations', []);
    foreach ($locations as $location => $assigned_menu_id) {
        update_option("nav_menu_location_{$location}", $assigned_menu_id);
    }
}, 10, 2);