/**
 * More Years Content Block JavaScript
 * 
 * Handles interactive functionality for the content block
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize content blocks
    initMoreyeahsContentBlocks();
});

function initMoreyeahsContentBlocks() {
    const contentBlocks = document.querySelectorAll('.moreyeahs-content');
    
    contentBlocks.forEach(function(block) {
        // Add intersection observer for animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('moreyeahs-content--visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            observer.observe(block);
        }
        
        // Handle image click for video play functionality
        const imageWrapper = block.querySelector('.moreyeahs-content__image');
        if (imageWrapper) {
            imageWrapper.addEventListener('click', function() {
                // Add your video play logic here if needed
                console.log('Content image clicked');
            });
        }
        
        // Handle button analytics tracking
        const button = block.querySelector('.moreyeahs-content__button');
        if (button) {
            button.addEventListener('click', function(e) {
                // Add analytics tracking here if needed
                const buttonText = this.textContent.trim();
                console.log('Content block button clicked:', buttonText);
            });
        }
    });
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .moreyeahs-content {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .moreyeahs-content--visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .moreyeahs-content__text-content {
        transform: translateX(-20px);
        opacity: 0;
        transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
    }
    
    .moreyeahs-content__image-wrapper {
        transform: translateX(20px);
        opacity: 0;
        transition: opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s;
    }
    
    .moreyeahs-content--visible .moreyeahs-content__text-content,
    .moreyeahs-content--visible .moreyeahs-content__image-wrapper {
        transform: translateX(0);
        opacity: 1;
    }
`;
document.head.appendChild(style);