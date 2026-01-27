<?php
/**
 * Template for displaying case study archive
 *
 * @package Twenty Twenty-Five Child
 */

get_header(); ?>

<main id="main" class="site-main case-study-archive">
    <div class="container">
        <header class="page-header">
            <h1 class="page-title"><?php post_type_archive_title(); ?></h1>
            <?php
            $description = get_the_archive_description();
            if ($description) :
                echo '<div class="archive-description">' . $description . '</div>';
            endif;
            ?>
        </header>

        <?php if (have_posts()) : ?>
            <div class="case-studies-grid">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('case-study-card'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="case-study-card__image">
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail('medium_large'); ?>
                                </a>
                            </div>
                        <?php endif; ?>
                        
                        <div class="case-study-card__content">
                            <h2 class="case-study-card__title">
                                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                            </h2>
                            
                            <?php if (has_excerpt()) : ?>
                                <div class="case-study-card__excerpt">
                                    <?php the_excerpt(); ?>
                                </div>
                            <?php endif; ?>
                            
                            <div class="case-study-card__meta">
                                <time datetime="<?php echo get_the_date('c'); ?>"><?php echo get_the_date(); ?></time>
                            </div>
                            
                            <a href="<?php the_permalink(); ?>" class="case-study-card__link">
                                Read Case Study
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                </svg>
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_navigation(); ?>

        <?php else : ?>
            <div class="no-posts-found">
                <h2><?php _e('No case studies found', 'twentytwentyfive'); ?></h2>
                <p><?php _e('It looks like no case studies have been published yet.', 'twentytwentyfive'); ?></p>
            </div>
        <?php endif; ?>
    </div>
</main>

<style>
.case-study-archive {
    padding: 60px 20px;
}

.case-study-archive .container {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: 60px;
}

.page-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
}

.archive-description {
    font-size: 1.2rem;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}

.case-studies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
    margin-bottom: 60px;
}

.case-study-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.case-study-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.case-study-card__image {
    position: relative;
    overflow: hidden;
}

.case-study-card__image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.case-study-card:hover .case-study-card__image img {
    transform: scale(1.05);
}

.case-study-card__content {
    padding: 30px;
}

.case-study-card__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.case-study-card__title a {
    color: #333;
    text-decoration: none;
}

.case-study-card__title a:hover {
    color: #e91e63;
}

.case-study-card__excerpt {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
}

.case-study-card__meta {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 20px;
}

.case-study-card__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #e91e63;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
}

.case-study-card__link:hover {
    color: #ad1457;
}

.no-posts-found {
    text-align: center;
    padding: 60px 20px;
}

@media (max-width: 768px) {
    .case-study-archive {
        padding: 40px 15px;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .case-studies-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .case-study-card__content {
        padding: 25px 20px;
    }
}
</style>

<?php get_footer(); ?>