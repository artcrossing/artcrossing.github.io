/**
 * Gallery utility functions and view management
 */

document.addEventListener('DOMContentLoaded', function() {
    initViewToggle();
    initModalStyles();
});

// View toggle between carousel and grid
function initViewToggle() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    const carouselView = document.querySelector('.gallery-carousel');
    const gridView = document.querySelector('.gallery-grid');
    
    if (!viewToggles.length || !carouselView || !gridView) return;
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const view = toggle.dataset.view;
            
            // Update active toggle
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            // Switch views
            if (view === 'grid') {
                carouselView.style.display = 'none';
                gridView.style.display = 'block';
                populateGrid();
            } else {
                carouselView.style.display = 'flex';
                gridView.style.display = 'none';
            }
        });
    });
}

// Populate grid view with artwork data
function populateGrid() {
    const gridContainer = document.getElementById('artworksGrid');
    const slides = document.querySelectorAll('.artwork-slide');
    
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    slides.forEach(slide => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        
        // Extract data from slide
        const artworkTitle = slide.querySelector('.artwork-title').textContent;
        const artistName = slide.querySelector('.artist-name').textContent;
        const medium = slide.querySelector('.artwork-medium').textContent;
        const year = slide.querySelector('.artwork-year').textContent;
        const price = slide.querySelector('.artwork-price')?.textContent || '';
        const image = slide.querySelector('.artwork-image').innerHTML;
        
        gridItem.innerHTML = `
            <div class="grid-image">
                ${image}
            </div>
            <div class="grid-info">
                <h3>${artworkTitle}</h3>
                <p class="grid-artist">${artistName}</p>
                <p class="grid-medium">${medium}</p>
                <div class="grid-meta">
                    <span class="grid-year">${year}</span>
                    ${price ? `<span class="grid-price">${price}</span>` : ''}
                </div>
            </div>
        `;
        
        // Add click handler to open modal
        gridItem.addEventListener('click', () => {
            if (window.galleryCarousel) {
                window.galleryCarousel.openArtworkModal(slide);
            }
        });
        
        gridContainer.appendChild(gridItem);
    });
}

// Enhanced modal styling
function initModalStyles() {
    // Create additional modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-artwork {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }
        
        .modal-image {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            border-radius: 15px;
            padding: 2rem;
            min-height: 300px;
        }
        
        .modal-info h2 {
            font-size: 2rem;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
        }
        
        .modal-info h3 {
            font-size: 1.3rem;
            color: var(--color-accent);
            margin-bottom: 2rem;
            font-weight: 600;
        }
        
        .modal-details {
            background: #f9f9f9;
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
        }
        
        .modal-details p {
            margin: 0.5rem 0;
            color: var(--color-text-light);
        }
        
        .modal-details strong {
            color: var(--color-primary);
            font-weight: 600;
        }
        
        .modal-price {
            font-size: 1.2rem;
            color: var(--color-accent) !important;
            font-weight: 700 !important;
            margin-top: 1rem;
        }
        
        .modal-description {
            font-style: italic;
            line-height: 1.6;
            color: var(--color-text);
            margin-top: 1.5rem;
            padding: 1rem;
            background: rgba(229, 110, 75, 0.05);
            border-left: 3px solid var(--color-accent);
        }
        
        @media (max-width: 768px) {
            .modal-artwork {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
            
            .modal-info h2 {
                font-size: 1.6rem;
            }
        }
        
        /* Grid item styles */
        .grid-image {
            height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
        }
        
        .grid-info {
            padding: 1.5rem;
        }
        
        .grid-info h3 {
            font-size: 1.2rem;
            color: var(--color-primary);
            margin-bottom: 0.5rem;
        }
        
        .grid-artist {
            color: var(--color-accent);
            font-weight: 600;
            margin-bottom: 0.5rem;
        }
        
        .grid-medium {
            color: var(--color-text-light);
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }
        
        .grid-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .grid-year {
            color: var(--color-text-light);
            font-size: 0.9rem;
        }
        
        .grid-price {
            color: var(--color-accent);
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);
}

// Accessibility improvements
function initAccessibility() {
    // Add ARIA labels
    const slides = document.querySelectorAll('.artwork-slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'article');
        slide.setAttribute('aria-label', `Artwork ${index + 1}`);
        slide.setAttribute('tabindex', '0');
        
        // Keyboard navigation
        slide.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                slide.click();
            }
        });
    });
    
    // Modal accessibility
    const modal = document.getElementById('artistModal');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        
        const closeBtn = document.getElementById('modalClose');
        if (closeBtn) {
            closeBtn.setAttribute('aria-label', 'Close artwork details');
        }
    }
}

// Initialize accessibility on load
document.addEventListener('DOMContentLoaded', initAccessibility);

// Performance optimization for images
function initImageLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    // Observe placeholder images for future image implementation
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// Search and filter functionality
function initSearchFilter() {
    const searchInput = document.getElementById('artworkSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const slides = document.querySelectorAll('.artwork-slide');
        
        slides.forEach(slide => {
            const title = slide.querySelector('.artwork-title').textContent.toLowerCase();
            const artist = slide.querySelector('.artist-name').textContent.toLowerCase();
            const medium = slide.querySelector('.artwork-medium').textContent.toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                          artist.includes(searchTerm) || 
                          medium.includes(searchTerm);
            
            slide.style.display = matches ? 'flex' : 'none';
        });
        
        // Update carousel if filtering affected visible slides
        if (window.galleryCarousel) {
            window.galleryCarousel.updateFilteredSlides();
        }
    });
}

// Export functions for use in other scripts
window.galleryUtils = {
    populateGrid,
    initViewToggle,
    initSearchFilter,
    initImageLazyLoading
};