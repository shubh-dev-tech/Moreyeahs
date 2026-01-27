<?php
/**
 * New Stepper Block Template
 * A stepper navigation that shows which section is currently visible
 */

// Get steps from ACF repeater
$steps = get_field('steps') ?: array();

if (empty($steps)) {
    return;
}

// Block ID
$block_id = 'new-stepper-' . $block['id'];
if (!empty($block['anchor'])) {
    $block_id = $block['anchor'];
}
?>

<nav class="new-stepper" id="<?php echo esc_attr($block_id); ?>">
    <div class="new-stepper__title">Navigate<br>your next</div>
    <ul class="new-stepper__list">
        <?php foreach ($steps as $index => $step): ?>
            <li class="new-stepper__item" data-section="<?php echo esc_attr($step['section_id']); ?>">
                <a href="#<?php echo esc_attr($step['section_id']); ?>" class="new-stepper__link">
                    <div class="new-stepper__line"></div>
                    <?php if (!empty($step['label'])): ?>
                        <div class="new-stepper__label">
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
    const nav = document.querySelector('#<?php echo esc_js($block_id); ?>');
    if (!nav) return;

    const items = nav.querySelectorAll('.new-stepper__item');
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
                items.forEach(item => item.classList.remove('new-stepper__item--active'));
                sections[i].item.classList.add('new-stepper__item--active');
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
