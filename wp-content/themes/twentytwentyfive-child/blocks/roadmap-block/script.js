/**
 * Roadmap Block JavaScript
 * Handles scroll-snap behavior and step state management
 */

document.addEventListener('DOMContentLoaded', function() {
    const roadmapBlocks = document.querySelectorAll('.roadmap-block');
    
    roadmapBlocks.forEach(function(block) {
        initRoadmapBlock(block);
    });
});

function initRoadmapBlock(block) {
    const steps = block.querySelectorAll('.roadmap-step');
    const rightContainer = block.querySelector('.roadmap-right');
    const leftContent = block.querySelector('.roadmap-left-sticky');
    
    if (!steps.length || !rightContainer || !leftContent) return;
    
    let currentActiveIndex = 0;
    let isScrolling = false;
    
    // Initialize first step as active
    updateStepStates(0);
    
    // Intersection Observer for detecting which step is in center
    const observerOptions = {
        root: rightContainer,
        threshold: 0.6,
        rootMargin: '-30% 0px -30% 0px' // Only trigger when step is in center 40% of viewport
    };
    
    const stepObserver = new IntersectionObserver(function(entries) {
        if (isScrolling) return;
        
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const stepIndex = Array.from(steps).indexOf(entry.target);
                if (stepIndex !== currentActiveIndex) {
                    currentActiveIndex = stepIndex;
                    updateStepStates(stepIndex);
                    updateLeftContent(entry.target, leftContent);
                }
            }
        });
    }, observerOptions);
    
    // Observe all steps
    steps.forEach(function(step) {
        stepObserver.observe(step);
    });
    
    // Handle counter clicks for smooth scrolling
    const counters = block.querySelectorAll('.step-counter');
    counters.forEach(function(counter, index) {
        counter.addEventListener('click', function() {
            scrollToStep(index);
        });
    });
    
    // Handle scroll wheel for step-by-step navigation
    rightContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        if (isScrolling) return;
        
        const direction = e.deltaY > 0 ? 1 : -1;
        const nextIndex = Math.max(0, Math.min(steps.length - 1, currentActiveIndex + direction));
        
        if (nextIndex !== currentActiveIndex) {
            scrollToStep(nextIndex);
        }
    }, { passive: false });
    
    // Handle keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!isElementInViewport(block)) return;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = Math.min(steps.length - 1, currentActiveIndex + 1);
            if (nextIndex !== currentActiveIndex) {
                scrollToStep(nextIndex);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = Math.max(0, currentActiveIndex - 1);
            if (prevIndex !== currentActiveIndex) {
                scrollToStep(prevIndex);
            }
        }
    });
    
    function scrollToStep(index) {
        if (index < 0 || index >= steps.length || isScrolling) return;
        
        isScrolling = true;
        currentActiveIndex = index;
        
        // Update states immediately for responsive feel
        updateStepStates(index);
        
        // Scroll to the step
        steps[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Reset scrolling flag after animation
        setTimeout(function() {
            isScrolling = false;
        }, 800);
        
        updateLeftContent(steps[index], leftContent);
    }
    
    function updateStepStates(activeIndex) {
        steps.forEach(function(step, index) {
            step.classList.remove('active', 'prev', 'next');
            
            if (index === activeIndex) {
                step.classList.add('active');
            } else if (index < activeIndex) {
                step.classList.add('prev');
            } else {
                step.classList.add('next');
            }
        });
    }
    
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

function updateLeftContent(activeStep, leftContent) {
    // Add a subtle animation to indicate step change
    leftContent.style.transform = 'scale(1.02)';
    setTimeout(function() {
        leftContent.style.transform = 'scale(1)';
    }, 200);
}

// Add CSS for active states
const style = document.createElement('style');
style.textContent = `
    .roadmap-step.animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .step-counter.active {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        50% {
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.8);
        }
        100% {
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
    }
    
    .roadmap-left-sticky {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);