/**
 * Advanced Gallery Carousel System
 * Based on gallery inspiration with 3D perspective and smooth animations
 */

class GalleryCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.totalSlides = 0;
        this.isAnimating = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.activeChapter = 'all';
        
        this.init();
    }

    init() {
        console.log('Gallery Carousel Initializing...');
        
        this.carousel = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('slideIndicators');
        
        console.log('Gallery Carousel Init:', {
            carousel: !!this.carousel,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            indicators: !!this.indicators
        });
        
        if (!this.carousel) {
            console.error('Carousel track element not found!');
            return;
        }
        
        this.slides = Array.from(document.querySelectorAll('.artwork-slide'));
        this.totalSlides = this.slides.length;
        
        console.log(`Found ${this.totalSlides} slides`);
        
        if (this.totalSlides === 0) {
            console.error('No artwork slides found!');
            return;
        }
        
        // Force button visibility and positioning
        if (this.prevBtn) {
            this.prevBtn.style.display = 'flex';
            this.prevBtn.style.zIndex = '1000';
            console.log('Previous button styled');
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.display = 'flex';
            this.nextBtn.style.zIndex = '1000';
            console.log('Next button styled');
        }
        
        this.setupCarousel();
        this.bindEvents();
        this.createIndicators();
        this.updateCarousel();
        
        // Initialize with first slide
        setTimeout(() => {
            this.goToSlide(0);
        }, 100);
        
        console.log('Gallery Carousel initialization complete');
    }

    setupCarousel() {
        // Set initial positions for all slides
        this.slides.forEach((slide, index) => {
            slide.style.transform = this.getSlideTransform(index);
            slide.dataset.index = index;
            
            // Add click handler for slide interaction
            slide.addEventListener('click', () => {
                if (!slide.classList.contains('active')) {
                    this.goToSlide(index);
                } else {
                    this.openArtworkModal(slide);
                }
            });
        });
    }

    bindEvents() {
        // Button controls with debugging
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                console.log('Previous button clicked');
                e.preventDefault();
                this.previousSlide();
            });
            console.log('Previous button listener added');
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                console.log('Next button clicked');
                e.preventDefault();
                this.nextSlide();
            });
            console.log('Next button listener added');
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                console.log('Left arrow pressed');
                this.previousSlide();
            }
            if (e.key === 'ArrowRight') {
                console.log('Right arrow pressed');
                this.nextSlide();
            }
            if (e.key === 'Escape') this.closeModal();
        });
        
        // Touch gestures
        if (this.carousel) {
            this.carousel.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                console.log('Touch start:', this.touchStartX);
            }, { passive: true });
            
            this.carousel.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                console.log('Touch end:', this.touchEndX);
                this.handleSwipe();
            }, { passive: true });
        }
        
        // Chapter filtering
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Chapter tab clicked:', btn.dataset.chapter);
                this.filterByChapter(btn.dataset.chapter);
                this.updateTabButtons(btn);
            });
        });
        
        // Auto-pause on hover
        if (this.carousel) {
            this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
        }
        
        // Intersection Observer for performance
        this.setupIntersectionObserver();
    }

    getSlideTransform(index) {
        const diff = index - this.currentSlide;
        let transform = '';
        
        if (diff === 0) {
            // Active slide
            transform = 'translateX(0) translateZ(0) rotateY(0deg) scale(1)';
        } else if (diff === -1 || (diff === this.totalSlides - 1 && this.currentSlide === 0)) {
            // Previous slide
            transform = 'translateX(-120%) translateZ(-200px) rotateY(25deg) scale(0.8)';
        } else if (diff === 1 || (diff === -(this.totalSlides - 1) && this.currentSlide === this.totalSlides - 1)) {
            // Next slide
            transform = 'translateX(120%) translateZ(-200px) rotateY(-25deg) scale(0.8)';
        } else {
            // Far slides
            transform = 'translateX(0) translateZ(-400px) scale(0.6)';
        }
        
        return transform;
    }

    updateCarousel() {
        console.log('updateCarousel called, current slide:', this.currentSlide);
        console.log('Total slides:', this.totalSlides);
        
        this.slides.forEach((slide, index) => {
            const diff = index - this.currentSlide;
            
            console.log(`Slide ${index}: diff=${diff}`);
            
            // Remove all position classes
            slide.classList.remove('active', 'prev', 'next', 'far');
            
            // Add appropriate class and transform
            if (diff === 0) {
                slide.classList.add('active');
                console.log(`Slide ${index} set to ACTIVE`);
            } else if (diff === -1 || (diff === this.totalSlides - 1 && this.currentSlide === 0)) {
                slide.classList.add('prev');
                console.log(`Slide ${index} set to PREV`);
            } else if (diff === 1 || (diff === -(this.totalSlides - 1) && this.currentSlide === this.totalSlides - 1)) {
                slide.classList.add('next');
                console.log(`Slide ${index} set to NEXT`);
            } else {
                slide.classList.add('far');
                console.log(`Slide ${index} set to FAR`);
            }
            
            // Apply smooth transform
            const transform = this.getSlideTransform(index);
            slide.style.transform = transform;
            slide.style.opacity = diff === 0 ? '1' : (Math.abs(diff) === 1 ? '0.7' : '0.3');
            slide.style.zIndex = diff === 0 ? '10' : (Math.abs(diff) === 1 ? '5' : '1');
            
            console.log(`Slide ${index} transform:`, transform);
        });
        
        this.updateIndicators();
        console.log('updateCarousel completed');
    }

    goToSlide(index) {
        console.log('goToSlide called with index:', index, 'current:', this.currentSlide);
        if (this.isAnimating) {
            console.log('Animation in progress, returning');
            return;
        }
        if (index === this.currentSlide) {
            console.log('Already at this slide, returning');
            return;
        }
        if (index < 0 || index >= this.totalSlides) {
            console.log('Invalid slide index:', index);
            return;
        }
        
        console.log('Setting isAnimating to true and updating currentSlide');
        this.isAnimating = true;
        this.currentSlide = index;
        
        console.log('Calling updateCarousel');
        this.updateCarousel();
        
        // Reset animation lock after transition
        setTimeout(() => {
            console.log('Animation complete, setting isAnimating to false');
            this.isAnimating = false;
        }, 800);
    }

    nextSlide() {
        console.log('Next slide called, current:', this.currentSlide, 'total:', this.totalSlides);
        console.log('Is animating?', this.isAnimating);
        if (this.totalSlides <= 1) return;
        if (this.isAnimating) {
            console.log('Animation in progress, skipping');
            return;
        }
        
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        console.log('Going to slide:', nextIndex);
        this.goToSlide(nextIndex);
    }

    previousSlide() {
        console.log('Previous slide called, current:', this.currentSlide, 'total:', this.totalSlides);
        console.log('Is animating?', this.isAnimating);
        if (this.totalSlides <= 1) return;
        if (this.isAnimating) {
            console.log('Animation in progress, skipping');
            return;
        }
        
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        console.log('Going to slide:', prevIndex);
        this.goToSlide(prevIndex);
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            this.previousSlide();
        } else {
            this.nextSlide();
        }
    }

    createIndicators() {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicators.appendChild(indicator);
        }
    }

    updateIndicators() {
        if (!this.indicators) return;
        
        const indicatorElements = this.indicators.querySelectorAll('.indicator');
        indicatorElements.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }

    filterByChapter(chapter) {
        console.log('Filtering by chapter:', chapter);
        this.activeChapter = chapter;
        
        if (chapter === 'all') {
            this.slides.forEach(slide => {
                slide.style.display = 'flex';
                slide.style.position = 'absolute';
            });
            this.totalSlides = this.slides.length;
        } else {
            let visibleCount = 0;
            this.slides.forEach(slide => {
                const slideChapter = slide.dataset.chapter;
                if (slideChapter === chapter) {
                    slide.style.display = 'flex';
                    slide.style.position = 'absolute';
                    visibleCount++;
                } else {
                    slide.style.display = 'none';
                }
            });
            this.totalSlides = visibleCount;
        }
        
        console.log('Total visible slides after filter:', this.totalSlides);
        
        // Update filtered slides array and reset carousel
        this.updateFilteredSlides();
        this.currentSlide = 0;
        this.updateCarousel();
    }

    updateFilteredSlides() {
        if (this.activeChapter === 'all') {
            this.totalSlides = this.slides.length;
        } else {
            this.totalSlides = this.slides.filter(slide => 
                slide.dataset.chapter === this.activeChapter
            ).length;
        }
        
        this.createIndicators();
    }

    updateTabButtons(activeBtn) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    openArtworkModal(slide) {
        const modal = document.getElementById('artistModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) return;
        
        // Extract artwork data
        const artworkTitle = slide.querySelector('.artwork-title').textContent;
        const artistName = slide.querySelector('.artist-name').textContent;
        const medium = slide.querySelector('.artwork-medium').textContent;
        const year = slide.querySelector('.artwork-year').textContent;
        const price = slide.querySelector('.artwork-price')?.textContent || '';
        const description = slide.querySelector('.artwork-description')?.textContent || '';
        const dimensions = slide.querySelector('.artwork-dimensions')?.textContent || '';
        
        // Create modal content
        modalBody.innerHTML = `
            <div class="modal-artwork">
                <div class="modal-image">
                    ${slide.querySelector('.artwork-image').innerHTML}
                </div>
                <div class="modal-info">
                    <h2>${artworkTitle}</h2>
                    <h3>${artistName}</h3>
                    <div class="modal-details">
                        <p><strong>Medium:</strong> ${medium}</p>
                        ${dimensions ? `<p><strong>Dimensions:</strong> ${dimensions}</p>` : ''}
                        <p><strong>Year:</strong> ${year}</p>
                        ${price ? `<p class="modal-price"><strong>Price:</strong> ${price}</p>` : ''}
                    </div>
                    ${description ? `<p class="modal-description">${description}</p>` : ''}
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Close modal handlers
        const closeBtn = document.getElementById('modalClose');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
    }

    closeModal() {
        const modal = document.getElementById('artistModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe slides for performance optimization
        this.slides.forEach(slide => {
            observer.observe(slide);
        });
    }

    addDebugButtons() {
        // Create debug buttons that directly call the slide methods
        const debugContainer = document.createElement('div');
        debugContainer.style.position = 'fixed';
        debugContainer.style.top = '10px';
        debugContainer.style.right = '10px';
        debugContainer.style.zIndex = '9999';
        debugContainer.style.background = 'rgba(0,0,0,0.8)';
        debugContainer.style.padding = '10px';
        debugContainer.style.borderRadius = '5px';
        debugContainer.style.color = 'white';
        
        const prevDebug = document.createElement('button');
        prevDebug.textContent = 'DEBUG PREV';
        prevDebug.style.margin = '5px';
        prevDebug.addEventListener('click', () => {
            console.log('DEBUG: Force previous slide');
            this.isAnimating = false; // Force reset
            this.previousSlide();
        });
        
        const nextDebug = document.createElement('button');
        nextDebug.textContent = 'DEBUG NEXT';
        nextDebug.style.margin = '5px';
        nextDebug.addEventListener('click', () => {
            console.log('DEBUG: Force next slide');
            this.isAnimating = false; // Force reset
            this.nextSlide();
        });
        
        const statusDiv = document.createElement('div');
        statusDiv.id = 'debug-status';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.marginTop = '10px';
        
        debugContainer.appendChild(prevDebug);
        debugContainer.appendChild(nextDebug);
        debugContainer.appendChild(statusDiv);
        document.body.appendChild(debugContainer);
        
        // Update status every second
        setInterval(() => {
            statusDiv.textContent = `Current: ${this.currentSlide}/${this.totalSlides} | Animating: ${this.isAnimating}`;
        }, 1000);
    }

    // Public methods for external control
    destroy() {
        this.pauseAutoplay();
        
        // Remove event listeners
        this.prevBtn?.removeEventListener('click', this.previousSlide);
        this.nextBtn?.removeEventListener('click', this.nextSlide);
        this.carousel?.removeEventListener('touchstart', this.handleTouchStart);
        this.carousel?.removeEventListener('touchend', this.handleTouchEnd);
        
        document.removeEventListener('keydown', this.handleKeydown);
    }

    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.galleryCarousel = new GalleryCarousel();
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.galleryCarousel) {
        if (document.hidden) {
            window.galleryCarousel.pauseAutoplay();
        } else {
            window.galleryCarousel.startAutoplay();
        }
    }
});

// Resize handler for responsive behavior
window.addEventListener('resize', () => {
    if (window.galleryCarousel) {
        // Debounce resize events
        clearTimeout(window.galleryCarousel.resizeTimeout);
        window.galleryCarousel.resizeTimeout = setTimeout(() => {
            window.galleryCarousel.updateCarousel();
        }, 250);
    }
});