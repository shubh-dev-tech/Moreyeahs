<?php
/**
 * Stepper Block Template
 */

$stepper_mode = get_field('stepper_mode') ?: 'auto';
$steps = array();

if ($stepper_mode === 'manual') {
    // Manual mode: use the steps from ACF repeater
    $steps = get_field('steps') ?: array();
} else {
    // Auto mode: detect sections with anchor IDs from all blocks on the page
    global $post;
    if ($post && has_blocks($post->post_content)) {
        $blocks = parse_blocks($post->post_content);
        foreach ($blocks as $block) {
            if (!empty($block['blockName']) && strpos($block['blockName'], 'acf/') === 0) {
                // Get the block's anchor ID from the Advanced panel
                $anchor_id = isset($block['attrs']['anchor']) ? $block['attrs']['anchor'] : '';
                
                if (!empty($anchor_id)) {
                    // Try to get heading/title from block data
                    $label = '';
                    
                    if (isset($block['attrs']['data']['heading'])) {
                        $label = $block['attrs']['data']['heading'];
                    } elseif (isset($block['attrs']['data']['title'])) {
                        $label = $block['attrs']['data']['title'];
                    } elseif (isset($block['attrs']['data']['main_title'])) {
                        $label = $block['attrs']['data']['main_title'];
                    } elseif (isset($block['attrs']['data']['section_title'])) {
                        $label = $block['attrs']['data']['section_title'];
                    }
                    
                    // If no label found, use the anchor ID as label
                    if (empty($label)) {
                        $label = ucwords(str_replace(array('-', '_'), ' ', $anchor_id));
                    }
                    
                    $steps[] = array(
                        'section_id' => $anchor_id,
                        'label' => $label
                    );
                }
            }
        }
    }
}

if (empty($steps)) {
    return;
}
?>

<nav class="stepper-block sticky-left-nav" data-mode="<?php echo esc_attr($stepper_mode); ?>">
    <ul class="stepper-block__list">
        <?php foreach ($steps as $index => $step): ?>
            <li class="stepper-block__item">
                <a href="#<?php echo esc_attr($step['section_id']); ?>">
                    <div class="stepper-block__line"></div>
                    <?php if (!empty($step['label'])): ?>
                        <div class="stepper-block__label">
                            <?php echo esc_html($step['label']); ?>
                        </div>
                    <?php endif; ?>
                </a>
            </li>
        <?php endforeach; ?>
    </ul>
</nav>

<script>
(function() {
    const nav = document.querySelector('.stepper-block');
    if (!nav) return;

    const items = nav.querySelectorAll('.stepper-block__item');
    const sections = Array.from(items).map(item => {
        const link = item.querySelector('a');
        const sectionId = link.getAttribute('href').substring(1);
        return { item, sectionId };
    });

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 200;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].sectionId);
            if (section && section.offsetTop <= scrollPosition) {
                items.forEach(item => item.classList.remove('nav-active'));
                sections[i].item.classList.add('nav-active');
                break;
            }
        }
    }

    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();

    // Smooth scroll
    items.forEach(item => {
        const link = item.querySelector('a');
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
})();
</script>
