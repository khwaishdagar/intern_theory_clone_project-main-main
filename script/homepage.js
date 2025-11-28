// Old slider code removed - slider section has been removed from the page

// Explore Learn Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const exploreSlides = document.querySelectorAll('.explore_slide_item');
    const exploreDots = document.querySelectorAll('.explore_dot');
    const explorePauseBtn = document.getElementById('explorePauseBtn');
    let currentExploreSlide = 0;
    let exploreAutoSlideInterval;
    let isPaused = false;

    // Initialize carousel
    if (exploreSlides.length > 0) {
        showExploreSlide(0);
        startExploreAutoSlide();

        // Dot click handlers
        exploreDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentExploreSlide = index;
                showExploreSlide(currentExploreSlide);
                resetExploreAutoSlide();
            });
        });

        // Pause/Play button handler
        if (explorePauseBtn) {
            explorePauseBtn.addEventListener('click', () => {
                if (isPaused) {
                    startExploreAutoSlide();
                    isPaused = false;
                    explorePauseBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    `;
                } else {
                    stopExploreAutoSlide();
                    isPaused = true;
                    explorePauseBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                }
            });
        }
    }

    function showExploreSlide(index) {
        // Hide all slides
        exploreSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                setTimeout(() => {
                    slide.classList.add('active');
                }, 50);
            }
        });

        // Update dots
        exploreDots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });

        currentExploreSlide = index;
    }

    function nextExploreSlide() {
        currentExploreSlide = (currentExploreSlide + 1) % exploreSlides.length;
        showExploreSlide(currentExploreSlide);
    }

    function startExploreAutoSlide() {
        exploreAutoSlideInterval = setInterval(nextExploreSlide, 5000); // Change slide every 5 seconds
    }

    function stopExploreAutoSlide() {
        if (exploreAutoSlideInterval) {
            clearInterval(exploreAutoSlideInterval);
        }
    }

    function resetExploreAutoSlide() {
        stopExploreAutoSlide();
        if (!isPaused) {
            startExploreAutoSlide();
        }
    }
});







