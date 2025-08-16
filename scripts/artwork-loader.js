/**
 * Artwork Image Loader
 * Dynamically loads artwork images and replaces placeholders
 */

class ArtworkLoader {
    constructor() {
        this.artworkDatabase = null;
        this.imageCache = new Map();
        this.retryAttempts = 3;
        
        this.init();
    }

    async init() {
        try {
            await this.loadArtworkDatabase();
            this.replaceImagePlaceholders();
            this.setupLazyLoading();
        } catch (error) {
            console.warn('Failed to load artwork database:', error);
            this.createFallbackImages();
        }
    }

    async loadArtworkDatabase() {
        try {
            const response = await fetch('artwork_database.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            this.artworkDatabase = await response.json();
            console.log('Loaded artwork database:', this.artworkDatabase);
        } catch (error) {
            console.warn('Could not load artwork database, using fallback images');
            throw error;
        }
    }

    replaceImagePlaceholders() {
        if (!this.artworkDatabase) return;
        
        // Get all artwork slides
        const artworkSlides = document.querySelectorAll('.artwork-slide');
        
        artworkSlides.forEach(slide => {
            const artistKey = slide.dataset.artist;
            if (!artistKey) return;
            
            // Find artist in database
            let artistData = null;
            if (this.artworkDatabase.chapter1?.artists) {
                artistData = this.artworkDatabase.chapter1.artists.find(a => a.key === artistKey);
            }
            if (!artistData && this.artworkDatabase.chapter2?.artists) {
                artistData = this.artworkDatabase.chapter2.artists.find(a => a.key === artistKey);
            }
            
            if (!artistData) {
                console.warn(`Artist data not found for: ${artistKey}`);
                return;
            }
            
            // Get artwork title from slide
            const artworkTitleElement = slide.querySelector('.artwork-title');
            const artworkTitle = artworkTitleElement?.textContent;
            
            if (!artworkTitle) return;
            
            // Find matching artwork
            const artworkData = artistData.artworks.find(artwork => 
                artwork.title.toLowerCase() === artworkTitle.toLowerCase()
            );
            
            if (artworkData) {
                this.replaceSlideImage(slide, artworkData, artistData);
            }
        });
    }

    replaceSlideImage(slide, artworkData, artistData) {
        const imageContainer = slide.querySelector('.artwork-image');
        const placeholder = slide.querySelector('.image-placeholder');
        
        if (!imageContainer || !placeholder) return;
        
        // Create image element
        const img = document.createElement('img');
        img.src = artworkData.image;
        img.alt = `${artworkData.title} by ${artistData.name}`;
        img.loading = 'lazy';
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 10px;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        // Add loading handler
        img.onload = () => {
            img.style.opacity = '1';
            placeholder.style.opacity = '0';
            setTimeout(() => {
                placeholder.style.display = 'none';
            }, 500);
        };
        
        // Add error handler
        img.onerror = () => {
            console.warn(`Failed to load image: ${artworkData.image}`);
            this.createArtistAvatar(placeholder, artistData);
        };
        
        // Insert image
        imageContainer.appendChild(img);
        
        // Add hover effects
        this.addImageHoverEffects(img, slide);
    }

    addImageHoverEffects(img, slide) {
        slide.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
            img.style.filter = 'brightness(1.1) contrast(1.1)';
        });
        
        slide.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
            img.style.filter = 'brightness(1) contrast(1)';
        });
    }

    createArtistAvatar(placeholder, artistData) {
        // Enhanced placeholder with artist info
        const initials = artistData.name
            .split(' ')
            .map(word => word[0])
            .join('');
        
        placeholder.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">${initials}</div>
                <div style="font-size: 0.8rem; opacity: 0.8;">${artistData.specialty}</div>
            </div>
        `;
        
        // Add gradient background based on artist
        const hue = this.getArtistHue(artistData.key);
        placeholder.style.background = `linear-gradient(135deg, hsl(${hue}, 60%, 50%), hsl(${hue + 30}, 60%, 60%))`;
    }

    getArtistHue(artistKey) {
        // Generate consistent hue based on artist key
        let hash = 0;
        for (let i = 0; i < artistKey.length; i++) {
            hash = artistKey.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 360);
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        if (img.dataset.loaded) return;
        
        const originalSrc = img.src;
        img.dataset.loaded = 'true';
        
        // Add loading animation
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #E56E4B;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        const container = img.parentElement;
        if (container) {
            container.style.position = 'relative';
            container.appendChild(loader);
        }
        
        // Add spinning animation
        if (!document.getElementById('loader-styles')) {
            const style = document.createElement('style');
            style.id = 'loader-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: translate(-50%, -50%) rotate(0deg); }
                    100% { transform: translate(-50%, -50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        img.onload = () => {
            if (loader && loader.parentElement) {
                loader.remove();
            }
        };
        
        img.onerror = () => {
            if (loader && loader.parentElement) {
                loader.remove();
            }
        };
    }

    createFallbackImages() {
        console.log('Creating fallback images with enhanced placeholders');
        
        const slides = document.querySelectorAll('.artwork-slide');
        slides.forEach(slide => {
            const placeholder = slide.querySelector('.image-placeholder');
            const artistName = slide.querySelector('.artist-name')?.textContent || '';
            const artworkTitle = slide.querySelector('.artwork-title')?.textContent || '';
            
            if (placeholder && artistName) {
                // Create more sophisticated placeholder
                const initials = artistName.split(' ').map(word => word[0]).join('');
                const artistKey = slide.dataset.artist || artistName.toLowerCase().replace(' ', '_');
                const hue = this.getArtistHue(artistKey);
                
                placeholder.style.background = `linear-gradient(135deg, hsl(${hue}, 60%, 50%), hsl(${hue + 30}, 60%, 60%))`;
                placeholder.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 800;">${initials}</div>
                        <div style="font-size: 0.9rem; opacity: 0.9; max-width: 120px; line-height: 1.2;">${artworkTitle}</div>
                    </div>
                `;
                
                // Add subtle animation
                placeholder.style.animation = 'pulse 2s ease-in-out infinite alternate';
                
                if (!document.getElementById('placeholder-animations')) {
                    const style = document.createElement('style');
                    style.id = 'placeholder-animations';
                    style.textContent = `
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 0.9; }
                            100% { transform: scale(1.02); opacity: 1; }
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }

    // Method to preload critical images
    preloadCriticalImages() {
        const criticalSlides = document.querySelectorAll('.artwork-slide.active, .artwork-slide:first-child');
        
        criticalSlides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && img.src) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'image';
                preloadLink.href = img.src;
                document.head.appendChild(preloadLink);
            }
        });
    }

    // Public method to update images when slides change
    updateVisibleImages() {
        const visibleSlides = document.querySelectorAll('.artwork-slide.active, .artwork-slide.next, .artwork-slide.prev');
        
        visibleSlides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img && !img.dataset.loaded) {
                this.loadImage(img);
            }
        });
    }

    // Clean up method
    destroy() {
        this.imageCache.clear();
    }
}

// Initialize artwork loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.artworkLoader = new ArtworkLoader();
});

// Integrate with carousel to load images on slide change
document.addEventListener('DOMContentLoaded', () => {
    // Listen for carousel slide changes
    if (window.galleryCarousel) {
        const originalUpdateCarousel = window.galleryCarousel.updateCarousel;
        window.galleryCarousel.updateCarousel = function() {
            originalUpdateCarousel.call(this);
            if (window.artworkLoader) {
                window.artworkLoader.updateVisibleImages();
            }
        };
    }
});

// Export for external use
window.ArtworkLoader = ArtworkLoader;