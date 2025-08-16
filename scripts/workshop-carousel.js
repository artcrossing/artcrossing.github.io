/**
 * Workshop Timeline Carousel System
 * Smooth horizontal scrolling timeline for workshop weeks
 */

class WorkshopCarousel {
    constructor() {
        this.currentWeek = 0;
        this.slides = [];
        this.totalWeeks = 0;
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }

    init() {
        console.log('Workshop Carousel Initializing...');
        
        // First try to get the timeline track element
        this.track = document.querySelector('.timeline-track');
        if (!this.track) {
            this.track = document.getElementById('workshopTrack');
        }
        
        this.prevBtn = document.getElementById('timelinePrev');
        this.nextBtn = document.getElementById('timelineNext');
        this.indicators = document.getElementById('weekIndicators');
        
        console.log('Workshop Carousel Init:', {
            track: !!this.track,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            indicators: !!this.indicators
        });
        
        if (!this.track) {
            console.error('Workshop carousel track not found!');
            return;
        }
        
        this.slides = Array.from(document.querySelectorAll('.workshop-slide'));
        this.totalWeeks = this.slides.length;
        
        console.log(`Found ${this.totalWeeks} workshop weeks`);
        
        if (this.totalWeeks === 0) {
            console.error('No workshop slides found!');
            return;
        }
        
        // Force button visibility and positioning
        if (this.prevBtn) {
            this.prevBtn.style.display = 'flex';
            this.prevBtn.style.zIndex = '1000';
            this.prevBtn.style.pointerEvents = 'auto';
            console.log('Previous button styled and enabled');
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.display = 'flex';
            this.nextBtn.style.zIndex = '1000';
            this.nextBtn.style.pointerEvents = 'auto';
            console.log('Next button styled and enabled');
        }
        
        this.setupCarousel();
        this.bindEvents();
        this.createIndicators();
        this.updateCarousel();
        
        // Ensure first slide is visible on load
        if (this.slides.length > 0) {
            this.slides[0].style.opacity = '1';
            this.slides[0].style.visibility = 'visible';
            this.slides[0].style.transform = 'translateX(0%)';
        }
        
        console.log('Workshop Carousel initialization complete');
    }

    setupCarousel() {
        // Set initial slide width and positioning
        this.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
            slide.dataset.week = index + 1;
        });
        
        // Add intersection observer for animations
        this.setupScrollAnimations();
    }

    bindEvents() {
        // Button controls with debugging
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                console.log('Previous week button clicked');
                e.preventDefault();
                this.previousWeek();
            });
            console.log('Previous week button listener added');
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                console.log('Next week button clicked');
                e.preventDefault();
                this.nextWeek();
            });
            console.log('Next week button listener added');
        }
        
        // Touch gestures for mobile
        if (this.track) {
            this.track.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                console.log('Workshop touch start:', this.touchStartX);
            }, { passive: true });
            
            this.track.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                console.log('Workshop touch end:', this.touchEndX);
                this.handleSwipe();
            }, { passive: true });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.workshop-carousel')) {
                if (e.key === 'ArrowLeft') {
                    console.log('Left arrow in workshop carousel');
                    this.previousWeek();
                }
                if (e.key === 'ArrowRight') {
                    console.log('Right arrow in workshop carousel');
                    this.nextWeek();
                }
            }
        });
        
        // Auto-scroll on smaller screens
        this.setupAutoScroll();
    }

    createIndicators() {
        if (!this.indicators) return;
        
        this.indicators.innerHTML = '';
        
        for (let i = 0; i < this.totalWeeks; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('week-indicator');
            indicator.addEventListener('click', () => this.goToWeek(i));
            indicator.setAttribute('aria-label', `Go to Week ${i + 1}`);
            this.indicators.appendChild(indicator);
        }
    }

    updateCarousel() {
        if (this.isAnimating) return;
        
        // Update track position
        const translateX = -this.currentWeek * 100;
        this.track.style.transform = `translateX(calc(${translateX}% + ${this.currentWeek * 2}rem))`;
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentWeek === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentWeek === this.totalWeeks - 1;
        }
        
        // Update indicators
        this.updateIndicators();
        
        // Animate visible slide
        this.animateCurrentSlide();
    }

    updateIndicators() {
        if (!this.indicators) return;
        
        const indicatorElements = this.indicators.querySelectorAll('.week-indicator');
        indicatorElements.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentWeek);
        });
    }

    goToWeek(weekIndex) {
        if (this.isAnimating || weekIndex === this.currentWeek || 
            weekIndex < 0 || weekIndex >= this.totalWeeks) return;
        
        this.isAnimating = true;
        this.currentWeek = weekIndex;
        
        this.updateCarousel();
        
        // Reset animation lock
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }

    nextWeek() {
        console.log('Next week called, current:', this.currentWeek, 'total:', this.totalWeeks);
        if (this.currentWeek < this.totalWeeks - 1) {
            this.goToWeek(this.currentWeek + 1);
        } else {
            console.log('Already at last week');
        }
    }

    previousWeek() {
        console.log('Previous week called, current:', this.currentWeek, 'total:', this.totalWeeks);
        if (this.currentWeek > 0) {
            this.goToWeek(this.currentWeek - 1);
        } else {
            console.log('Already at first week');
        }
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) < swipeThreshold) return;
        
        if (swipeDistance > 0) {
            this.previousWeek();
        } else {
            this.nextWeek();
        }
    }

    animateCurrentSlide() {
        // Add entrance animation to current slide
        const currentSlide = this.slides[this.currentWeek];
        if (currentSlide) {
            // Remove animation class first
            currentSlide.classList.remove('fade-in-up');
            
            // Trigger reflow and add animation
            currentSlide.offsetHeight;
            currentSlide.classList.add('fade-in-up');
            
            // Animate workshop events with stagger
            const events = currentSlide.querySelectorAll('.workshop-event');
            events.forEach((event, index) => {
                event.style.opacity = '0';
                event.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    event.style.transition = 'all 0.6s ease';
                    event.style.opacity = '1';
                    event.style.transform = 'translateY(0)';
                }, 100 + (index * 150));
            });
        }
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        // Observe all workshop events for scroll animations
        const events = document.querySelectorAll('.workshop-event');
        events.forEach(event => {
            event.style.opacity = '0';
            event.style.transform = 'translateY(30px)';
            event.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(event);
        });
    }

    setupAutoScroll() {
        // Auto-advance for special events (optional)
        const featuredEvents = document.querySelectorAll('.workshop-event.featured');
        
        featuredEvents.forEach(event => {
            event.addEventListener('mouseenter', () => {
                // Highlight effect
                event.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            event.addEventListener('mouseleave', () => {
                event.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // Enhanced event interactions
    setupEventInteractions() {
        const events = document.querySelectorAll('.workshop-event');
        
        events.forEach(event => {
            // Add click handlers for potential booking/details
            event.addEventListener('click', () => {
                const eventTitle = event.querySelector('h4').textContent;
                const eventDate = event.querySelector('.date').textContent;
                
                console.log(`Event clicked: ${eventTitle} on ${eventDate}`);
                // Could trigger booking modal or details expansion
                
                // Add visual feedback
                event.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    event.style.transform = '';
                }, 150);
            });
            
            // Enhanced hover effects
            event.addEventListener('mouseenter', () => {
                const tags = event.querySelectorAll('.tag');
                tags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'translateY(-2px)';
                        tag.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)';
                    }, index * 50);
                });
            });
            
            event.addEventListener('mouseleave', () => {
                const tags = event.querySelectorAll('.tag');
                tags.forEach(tag => {
                    tag.style.transform = '';
                    tag.style.boxShadow = '';
                });
            });
        });
    }

    // Accessibility improvements
    setupAccessibility() {
        // ARIA labels
        this.track.setAttribute('role', 'tabpanel');
        this.track.setAttribute('aria-label', 'Workshop timeline');
        
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Week ${index + 1} workshops`);
            slide.setAttribute('tabindex', index === this.currentWeek ? '0' : '-1');
        });
        
        // Keyboard focus management
        this.track.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Manage focus within current slide
                const currentSlide = this.slides[this.currentWeek];
                const focusableElements = currentSlide.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length > 0) {
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load content for non-visible slides
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        const slideObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    // Could trigger content loading here
                }
            });
        }, options);
        
        this.slides.forEach(slide => slideObserver.observe(slide));
        
        // Debounced resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateCarousel();
            }, 250);
        });
    }

    // Public API methods
    getCurrentWeek() {
        return this.currentWeek;
    }

    getTotalWeeks() {
        return this.totalWeeks;
    }

    destroy() {
        // Cleanup event listeners and observers
        this.prevBtn?.removeEventListener('click', this.previousWeek);
        this.nextBtn?.removeEventListener('click', this.nextWeek);
        
        // Remove touch listeners
        this.track?.removeEventListener('touchstart', this.handleTouchStart);
        this.track?.removeEventListener('touchend', this.handleTouchEnd);
        
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Initialize workshop carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.workshopCarousel = new WorkshopCarousel();
    
    // Setup additional interactions after carousel initialization
    setTimeout(() => {
        if (window.workshopCarousel) {
            window.workshopCarousel.setupEventInteractions();
            window.workshopCarousel.setupAccessibility();
            window.workshopCarousel.setupPerformanceOptimizations();
        }
    }, 100);
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (window.workshopCarousel && document.hidden) {
        // Pause any running animations when page is not visible
        const events = document.querySelectorAll('.workshop-event');
        events.forEach(event => {
            event.style.animationPlayState = 'paused';
        });
    }
});

// Export for external use
window.WorkshopCarousel = WorkshopCarousel;