<?php
/**
 * Test file for Counter Block
 * 
 * This file demonstrates how to use the Counter Block programmatically.
 * You can also add the block through the WordPress editor.
 * 
 * To use this test file:
 * 1. Create a new page in WordPress
 * 2. Set the page template to this file (if needed)
 * 3. Or copy the block code below into your page content
 */

get_header();
?>

<main id="main" class="site-main">
    
    <!-- Counter Block Example 1: Full Example -->
    <?php
    // Simulate ACF data structure
    $counter_data = array(
        'heading' => 'About us',
        'sub_heading' => 'A global leader in next-generation digital services and consulting',
        'counters' => array(
            array(
                'number' => '59',
                'prefix' => '',
                'suffix' => '',
                'label' => 'countries where we have trusting clients'
            ),
            array(
                'number' => '19.7',
                'prefix' => 'US$',
                'suffix' => '',
                'label' => 'billion total revenue (LTM)'
            ),
            array(
                'number' => '24',
                'prefix' => '',
                'suffix' => '+',
                'label' => 'million training (hours) conducted for employees, globally'
            )
        )
    );
    
    // Render the block
    include get_template_directory() . '/blocks/counter-block.php';
    ?>
    
    <hr style="margin: 60px 0; border: none; border-top: 1px solid #ddd;">
    
    <!-- Counter Block Example 2: Different Data -->
    <?php
    $counter_data = array(
        'heading' => 'Our Impact',
        'sub_heading' => 'Making a difference across the globe',
        'counters' => array(
            array(
                'number' => '500',
                'prefix' => '',
                'suffix' => '+',
                'label' => 'projects completed successfully'
            ),
            array(
                'number' => '98',
                'prefix' => '',
                'suffix' => '%',
                'label' => 'client satisfaction rate'
            ),
            array(
                'number' => '10',
                'prefix' => '',
                'suffix' => 'M+',
                'label' => 'users reached worldwide'
            ),
            array(
                'number' => '15',
                'prefix' => '',
                'suffix' => '',
                'label' => 'years of excellence'
            )
        )
    );
    
    // Temporarily set ACF fields for testing
    foreach ($counter_data as $key => $value) {
        update_field($key, $value, get_the_ID());
    }
    
    include get_template_directory() . '/blocks/counter-block.php';
    ?>
    
    <hr style="margin: 60px 0; border: none; border-top: 1px solid #ddd;">
    
    <!-- Counter Block Example 3: Minimal Example (No Heading) -->
    <?php
    $counter_data = array(
        'counters' => array(
            array(
                'number' => '1000',
                'prefix' => '',
                'suffix' => '+',
                'label' => 'happy customers'
            ),
            array(
                'number' => '50',
                'prefix' => '',
                'suffix' => '',
                'label' => 'team members'
            )
        )
    );
    
    foreach ($counter_data as $key => $value) {
        update_field($key, $value, get_the_ID());
    }
    
    include get_template_directory() . '/blocks/counter-block.php';
    ?>

</main>

<style>
    /* Include the counter block styles inline for testing */
    .counter-block {
        padding: 80px 20px;
        background-color: #fff;
    }

    .counter-block__container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .counter-block__header {
        text-align: center;
        margin-bottom: 60px;
    }

    .counter-block__heading {
        font-size: 48px;
        font-weight: 700;
        color: #000;
        margin: 0 0 20px 0;
        line-height: 1.2;
    }

    .counter-block__sub-heading {
        font-size: 20px;
        color: #666;
        margin: 0;
        line-height: 1.6;
        max-width: 800px;
        margin: 0 auto;
    }

    .counter-block__counters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 40px;
        align-items: start;
    }

    .counter-block__item {
        text-align: center;
        padding: 20px;
    }

    .counter-block__number {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        font-size: 72px;
        font-weight: 700;
        color: #000;
        line-height: 1;
        margin-bottom: 15px;
    }

    .counter-block__prefix {
        font-size: 36px;
        margin-right: 5px;
        margin-top: 5px;
    }

    .counter-block__value {
        font-weight: 700;
    }

    .counter-block__suffix {
        font-size: 48px;
        margin-left: 5px;
    }

    .counter-block__label {
        font-size: 16px;
        color: #666;
        line-height: 1.5;
        margin: 0;
        max-width: 300px;
        margin: 0 auto;
    }

    @media (max-width: 768px) {
        .counter-block {
            padding: 60px 20px;
        }

        .counter-block__heading {
            font-size: 36px;
        }

        .counter-block__sub-heading {
            font-size: 18px;
        }

        .counter-block__counters {
            grid-template-columns: 1fr;
            gap: 50px;
        }

        .counter-block__number {
            font-size: 56px;
        }

        .counter-block__prefix {
            font-size: 28px;
        }

        .counter-block__suffix {
            font-size: 36px;
        }

        .counter-block__label {
            font-size: 14px;
        }
    }
</style>

<?php
get_footer();
?>
