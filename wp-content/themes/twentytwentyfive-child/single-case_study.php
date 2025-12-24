<?php
/**
 * Template for displaying single case study posts
 *
 * @package Twenty Twenty-Five Child
 */

get_header(); ?>

<main id="main" class="site-main case-study-main">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class('case-study-article'); ?>>
            <?php
            // Get all blocks from the content
            $blocks = parse_blocks(get_the_content());
            
            // Render each block
            foreach ($blocks as $block) {
                echo render_block($block);
            }
            ?>
        </article>
    <?php endwhile; ?>
</main>

<?php get_footer(); ?>