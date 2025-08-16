/**
 * Navigation utility for active state management
 * Consistent with the nav_bar pill-style design
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigationActiveState();
    addNavigationAnimations();
});

function initNavigationActiveState() {
    // Get current page from URL
    const currentPage = getCurrentPage();
    
    // Find all navigation menus
    const navMenus = document.querySelectorAll('.nav-menu');
    
    navMenus.forEach(menu => {
        const links = menu.querySelectorAll('a');
        
        // Remove existing active classes
        links.forEach(link => link.classList.remove('active'));
        
        // Set active based on current page
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            if (shouldBeActive(href, currentPage)) {
                link.classList.add('active');
            }
        });
    });
}

function getCurrentPage() {
    const pathname = window.location.pathname;
    const filename = pathname.split('/').pop() || 'index.html';
    return filename;
}

function shouldBeActive(href, currentPage) {
    // Handle different link types
    if (href === 'index.html' && (currentPage === 'index.html' || currentPage === '')) {
        return true;
    }
    
    if (href === 'artworks.html' && currentPage === 'artworks.html') {
        return true;
    }
    
    if (href === 'workshops.html' && currentPage === 'workshops.html') {
        return true;
    }
    
    // Handle anchor links on same page
    if (href.startsWith('#') && (currentPage === 'index.html' || currentPage === '')) {
        return true;
    }
    
    // Handle links with anchor fragments
    if (href.includes('#') && href.split('#')[0] === currentPage) {
        return true;
    }
    
    return false;
}

function addNavigationAnimations() {
    // Add smooth transitions and hover effects
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        // Add ripple effect on click
        link.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
        
        // Enhanced hover effects
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-1px)';
                this.style.boxShadow = '0 4px 12px rgba(229, 110, 75, 0.15)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(229, 110, 75, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Add ripple animation styles
if (!document.getElementById('navigation-styles')) {
    const style = document.createElement('style');
    style.id = 'navigation-styles';
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        /* Enhanced navigation pill background */
        .nav-container {
            background: rgba(255, 255, 255, 0.08) !important;
            box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.12),
                inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
        }
        
        /* Lamp glow enhancement */
        .nav-menu a.active::before {
            box-shadow: 
                0 0 8px rgba(229, 110, 75, 0.6),
                0 0 16px rgba(229, 110, 75, 0.4);
        }
        
        /* Smooth transitions for all nav elements */
        .nav-container,
        .nav-menu a,
        .nav-menu a::before,
        .nav-menu a::after {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
            .nav-container {
                gap: 1rem;
                padding: 6px 8px;
            }
            
            .nav-logo h1 {
                font-size: 1.2rem;
            }
            
            .nav-menu a {
                padding: 6px 12px;
                font-size: 0.8rem;
            }
            
            .nav-menu a.active::before {
                width: 24px;
                height: 3px;
                top: -6px;
            }
            
            .nav-menu a.active::after {
                width: 36px;
                height: 18px;
                top: -9px;
            }
        }
        
        /* Dark mode compatibility */
        @media (prefers-color-scheme: dark) {
            .nav-container {
                background: rgba(0, 0, 0, 0.08) !important;
                border-color: rgba(255, 255, 255, 0.1);
            }
            
            .nav-menu a {
                color: rgba(255, 255, 255, 0.8);
            }
            
            .nav-menu a:hover {
                color: rgba(255, 255, 255, 1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Handle scroll effects for navigation
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const navigation = document.querySelector('.main-navigation, .gallery-navigation, .workshop-navigation');
    
    if (navigation) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - slightly hide navigation
            navigation.style.transform = 'translateX(-50%) translateY(-10px)';
            navigation.style.opacity = '0.9';
        } else {
            // Scrolling up - show navigation
            navigation.style.transform = 'translateX(-50%) translateY(0)';
            navigation.style.opacity = '1';
        }
    }
    
    lastScrollTop = scrollTop;
});

// Export for external use
window.NavigationUtils = {
    initNavigationActiveState,
    addNavigationAnimations,
    createRippleEffect
};