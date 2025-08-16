/**
 * Main JavaScript functionality for Sensitive Beings website
 * Interactive elements, smooth scrolling, and UI enhancements
 */

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initInteractiveElements();
    initShadowOverlay();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.main-navigation');
    let lastScrollTop = 0;
    
    // Scroll effects for navigation
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Change navigation background on scroll
        if (scrollTop > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.chapter-card, .info-block, .tea-invitation, .hero-info > *'
    );
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Interactive elements
function initInteractiveElements() {
    // CTA button ripple effect
    const ctaPrimary = document.querySelector('.cta-primary');
    if (ctaPrimary) {
        ctaPrimary.addEventListener('click', function(e) {
            const ripple = this.querySelector('.cta-ripple');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            
            // Trigger animation
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(1)';
            });
        });
    }
    
    // Chapter card hover effects
    const chapterCards = document.querySelectorAll('.chapter-card');
    chapterCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Info block interactions
    const infoBlocks = document.querySelectorAll('.info-block');
    infoBlocks.forEach(block => {
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-5px)';
            block.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.transform = 'translateY(0)';
            block.style.boxShadow = 'none';
        });
    });
}

// Shadow overlay effect (simplified version)
function initShadowOverlay() {
    const overlay = document.getElementById('shadowOverlay');
    if (!overlay) return;
    
    // Create animated background pattern
    const createAnimatedPattern = () => {
        const pattern = document.createElement('div');
        pattern.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 30% 40%, rgba(229, 110, 75, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(102, 102, 102, 0.05) 0%, transparent 50%);
            animation: float 8s ease-in-out infinite;
            z-index: 1;
        `;
        overlay.appendChild(pattern);
        
        // Add floating animation keyframes
        if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.6; }
                    50% { transform: scale(1.1) rotate(5deg); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    createAnimatedPattern();
    
    // Mouse interaction for overlay
    overlay.addEventListener('mousemove', (e) => {
        const rect = overlay.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        overlay.style.background = `
            radial-gradient(circle at ${x * 100}% ${y * 100}%, 
                rgba(229, 110, 75, 0.15) 0%, 
                rgba(229, 110, 75, 0.05) 30%, 
                transparent 60%)
        `;
    });
    
    overlay.addEventListener('mouseleave', () => {
        overlay.style.background = '';
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-section');
    
    if (heroContent && scrolled < window.innerHeight) {
        const speed = scrolled * 0.3;
        heroContent.style.transform = `translateY(${speed}px)`;
    }
});

// Mobile menu functionality (basic implementation)
function initMobileMenu() {
    const mobileBreakpoint = 768;
    
    if (window.innerWidth <= mobileBreakpoint) {
        const nav = document.querySelector('.nav-menu');
        if (nav) {
            nav.style.display = 'none';
            
            // Could add hamburger menu implementation here
            const navLogo = document.querySelector('.nav-logo');
            if (navLogo && !document.querySelector('.mobile-menu-btn')) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '☰';
                menuBtn.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--color-primary);
                    cursor: pointer;
                `;
                navLogo.appendChild(menuBtn);
                
                menuBtn.addEventListener('click', () => {
                    nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
                });
            }
        }
    }
}

// Initialize mobile menu
window.addEventListener('resize', initMobileMenu);
initMobileMenu();

// Performance optimization: reduce animations on low-power devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
}