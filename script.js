// Smooth scrolling and interactive elements for Sensitive Beings exhibition website

document.addEventListener('DOMContentLoaded', function() {
    initWaves();
    initSmoothScrolling();
    initArtistCards();
    initNavigation();
});

// Wave Animation (Simplified version inspired by the background components)
function initWaves() {
    const canvas = document.getElementById('wavesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Wave parameters
    let time = 0;
    let mouseX = -100;
    let mouseY = -100;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw multiple wave layers
        for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.strokeStyle = layer === 0 ? '#E56E4B' : '#666666';
            ctx.lineWidth = layer === 0 ? 2 : 1;
            ctx.globalAlpha = layer === 0 ? 0.3 : 0.15;
            
            // Create organic wave pattern
            for (let i = 0; i <= 360; i += 2) {
                const angle = (i * Math.PI) / 180;
                const radius = 100 + layer * 50 + 
                             Math.sin(time * 0.01 + angle * 3) * 30 +
                             Math.sin(time * 0.005 + angle * 5) * 15;
                
                // Mouse influence
                const distanceToMouse = Math.sqrt(
                    Math.pow(centerX - mouseX, 2) + Math.pow(centerY - mouseY, 2)
                );
                const mouseInfluence = Math.max(0, 1 - distanceToMouse / 200) * 20;
                
                const x = centerX + Math.cos(angle) * (radius + mouseInfluence);
                const y = centerY + Math.sin(angle) * (radius + mouseInfluence);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.closePath();
            ctx.stroke();
        }
        
        // Draw connecting lines (simplified grid)
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.1;
        
        const spacing = 30;
        for (let x = 0; x < canvas.width; x += spacing) {
            const waveOffset = Math.sin(time * 0.01 + x * 0.01) * 10;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x + waveOffset, canvas.height);
            ctx.stroke();
        }
        
        time += 1;
        animationId = requestAnimationFrame(drawWaves);
    }
    
    drawWaves();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Global scroll function for CTA button
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Artist card interactions
function initArtistCards() {
    const artistCards = document.querySelectorAll('.artist-card');
    
    artistCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click handler for potential modal or detail view
        card.addEventListener('click', () => {
            const artistName = card.getAttribute('data-artist');
            console.log(`Clicked on artist: ${artistName}`);
            // Could implement artist detail modal here
        });
    });
}

// Navigation scroll effects
function initNavigation() {
    const navigation = document.querySelector('.navigation');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background opacity based on scroll
        if (scrollTop > 50) {
            navigation.style.background = 'rgba(255, 255, 255, 0.95)';
            navigation.style.backdropFilter = 'blur(10px)';
        } else {
            navigation.style.background = 'rgba(255, 255, 255, 0.8)';
            navigation.style.backdropFilter = 'blur(5px)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.artist-card, .week-block, .info-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations after DOM load
window.addEventListener('load', () => {
    initScrollAnimations();
});

// Add subtle parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-content');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Workshop event interactions
document.addEventListener('DOMContentLoaded', () => {
    const events = document.querySelectorAll('.event');
    
    events.forEach(event => {
        event.addEventListener('mouseenter', () => {
            event.style.backgroundColor = '#f0f8ff';
            event.style.borderLeft = '4px solid #E56E4B';
            event.style.paddingLeft = '16px';
        });
        
        event.addEventListener('mouseleave', () => {
            event.style.backgroundColor = 'white';
            event.style.borderLeft = '1px solid #eee';
            event.style.paddingLeft = '1rem';
        });
    });
});

// Mobile menu toggle (basic implementation)
function initMobileMenu() {
    // This could be expanded for a full mobile menu implementation
    const mobileBreakpoint = 768;
    
    function checkMobile() {
        if (window.innerWidth <= mobileBreakpoint) {
            // Mobile layout adjustments
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.style.display = 'none'; // Simple hide for now
            }
        }
    }
    
    window.addEventListener('resize', checkMobile);
    checkMobile();
}

// Initialize mobile menu
initMobileMenu();

// Add some particle effects for extra visual interest
function createFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#E56E4B';
        particle.style.borderRadius = '50%';
        particle.style.opacity = '0.3';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${5 + Math.random() * 5}s ease-in-out infinite`;
        particle.style.zIndex = '1';
        
        hero.appendChild(particle);
    }
}

// Add floating animation keyframes via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
    }
`;
document.head.appendChild(style);

// Create floating elements after page load
window.addEventListener('load', createFloatingElements);