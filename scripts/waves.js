/**
 * Sophisticated Wave Animation System
 * Based on the background_inspiration component with smooth interactive lines
 */

class WaveSystem {
    constructor() {
        this.container = null;
        this.svg = null;
        this.mouse = {
            x: -10,
            y: 0,
            lx: 0,
            ly: 0,
            sx: 0,
            sy: 0,
            v: 0,
            vs: 0,
            a: 0,
            set: false
        };
        this.paths = [];
        this.lines = [];
        this.noise = null;
        this.animationId = null;
        this.boundingRect = null;
        
        this.init();
    }

    init() {
        this.container = document.querySelector('.waves-background');
        this.svg = this.container?.querySelector('.waves-svg');
        this.pointerDot = this.container?.querySelector('.pointer-dot');
        
        if (!this.container || !this.svg) {
            console.warn('Wave elements not found');
            return;
        }

        // Initialize noise function (simplified Perlin noise)
        this.noise = this.createSimpleNoise();
        
        // Setup
        this.setSize();
        this.setLines();
        this.bindEvents();
        
        // Start animation
        this.tick(0);
    }

    createSimpleNoise() {
        // Simplified noise function for smooth wave motion
        return (x, y) => {
            const n = Math.sin(x * 0.7) * Math.cos(y * 0.5) + 
                     Math.sin(x * 1.3) * Math.cos(y * 0.8) * 0.5 +
                     Math.sin(x * 2.1) * Math.cos(y * 1.2) * 0.25;
            return n;
        };
    }

    setSize() {
        if (!this.container || !this.svg) return;
        
        this.boundingRect = this.container.getBoundingClientRect();
        const { width, height } = this.boundingRect;
        
        this.svg.style.width = `${width}px`;
        this.svg.style.height = `${height}px`;
        this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    setLines() {
        if (!this.svg || !this.boundingRect) return;
        
        const { width, height } = this.boundingRect;
        this.lines = [];
        
        // Clear existing paths
        this.paths.forEach(path => path.remove());
        this.paths = [];
        
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Create natural radio wave patterns - concentric and radial
        this.createRadioWavePatterns(centerX, centerY, width, height);
    }

    createRadioWavePatterns(centerX, centerY, width, height) {
        // Create concentric radio wave circles
        const maxRadius = Math.max(width, height) * 0.8;
        const numCircles = 8;
        
        for (let i = 0; i < numCircles; i++) {
            const radius = (maxRadius / numCircles) * (i + 1);
            const points = [];
            const numPoints = Math.max(32, Math.floor(radius / 8));
            
            for (let j = 0; j < numPoints; j++) {
                const angle = (j / numPoints) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius * 0.6; // Slightly flattened
                
                const point = {
                    x: x,
                    y: y,
                    originalX: x,
                    originalY: y,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    angle: angle,
                    radius: radius
                };
                points.push(point);
            }
            
            // Create smooth circular path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', i % 3 === 0 ? '#E56E4B' : '#666666');
            path.setAttribute('stroke-width', i % 3 === 0 ? '1.8' : '0.9');
            path.setAttribute('opacity', i % 3 === 0 ? '0.5' : '0.25');
            path.setAttribute('stroke-linecap', 'round');
            
            this.svg.appendChild(path);
            this.paths.push(path);
            this.lines.push(points);
        }
        
        // Add some flowing wave lines
        this.createFlowingWaves(centerX, centerY, width, height);
    }

    createFlowingWaves(centerX, centerY, width, height) {
        // Create horizontal flowing waves
        const numWaves = 6;
        const waveHeight = height / (numWaves + 1);
        
        for (let i = 0; i < numWaves; i++) {
            const points = [];
            const y = waveHeight * (i + 1);
            const numPoints = Math.floor(width / 8);
            
            for (let j = 0; j < numPoints; j++) {
                const x = (width / numPoints) * j;
                const point = {
                    x: x,
                    y: y,
                    originalX: x,
                    originalY: y,
                    wave: { x: 0, y: 0 },
                    cursor: { x: 0, y: 0, vx: 0, vy: 0 },
                    waveIndex: i
                };
                points.push(point);
            }
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', '#999999');
            path.setAttribute('stroke-width', '0.8');
            path.setAttribute('opacity', '0.15');
            path.setAttribute('stroke-linecap', 'round');
            
            this.svg.appendChild(path);
            this.paths.push(path);
            this.lines.push(points);
        }
    }

    bindEvents() {
        // Mouse movement
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Touch support
        this.container?.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        
        // Resize handling
        window.addEventListener('resize', this.onResize.bind(this));
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }

    onMouseMove(e) {
        this.updateMousePosition(e.clientX, e.clientY);
    }

    onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.updateMousePosition(touch.clientX, touch.clientY);
    }

    updateMousePosition(x, y) {
        if (!this.boundingRect) return;
        
        this.mouse.x = x - this.boundingRect.left;
        this.mouse.y = y - this.boundingRect.top + window.scrollY;
        
        if (!this.mouse.set) {
            this.mouse.sx = this.mouse.x;
            this.mouse.sy = this.mouse.y;
            this.mouse.lx = this.mouse.x;
            this.mouse.ly = this.mouse.y;
            this.mouse.set = true;
        }
        
        // Update pointer dot position
        if (this.pointerDot) {
            this.pointerDot.style.left = `${x}px`;
            this.pointerDot.style.top = `${y}px`;
            this.pointerDot.style.opacity = '1';
        }
    }

    onResize() {
        this.setSize();
        this.setLines();
    }

    movePoints(time) {
        if (!this.noise) return;
        
        this.lines.forEach((points, lineIndex) => {
            points.forEach(point => {
                let waveX, waveY;
                
                // Different wave patterns for different line types
                if (point.angle !== undefined) {
                    // Circular radio waves - pulse from center
                    const pulseSpeed = time * 0.008;
                    const radiusModulation = this.noise(
                        point.radius * 0.01 + pulseSpeed,
                        point.angle * 2 + pulseSpeed * 0.5
                    ) * 12;
                    
                    const newRadius = point.radius + radiusModulation;
                    const centerX = this.boundingRect.width / 2;
                    const centerY = this.boundingRect.height / 2;
                    
                    waveX = Math.cos(point.angle) * newRadius - point.originalX;
                    waveY = Math.sin(point.angle) * newRadius * 0.6 - point.originalY;
                } else if (point.waveIndex !== undefined) {
                    // Flowing waves - horizontal sine patterns
                    const wavePhase = time * 0.01 + point.waveIndex * 0.5;
                    waveX = Math.sin(point.originalX * 0.01 + wavePhase) * 15;
                    waveY = Math.cos(point.originalX * 0.008 + wavePhase) * 8;
                } else {
                    // Default organic movement
                    waveX = this.noise(
                        (point.originalX + time * 0.01) * 0.003,
                        (point.originalY + time * 0.005) * 0.002
                    ) * 15;
                    waveY = this.noise(
                        (point.originalX + time * 0.008) * 0.002,
                        (point.originalY + time * 0.012) * 0.003
                    ) * 8;
                }
                
                point.wave.x = waveX;
                point.wave.y = waveY;
                
                // Enhanced mouse interaction for radio waves
                const dx = point.originalX - this.mouse.sx;
                const dy = point.originalY - this.mouse.sy;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = Math.max(180, this.mouse.vs * 1.5);
                
                if (distance < maxDistance) {
                    const influence = Math.pow(1 - distance / maxDistance, 1.8);
                    const force = influence * this.mouse.vs * 0.001;
                    
                    // Create ripple effect for radio waves
                    if (point.angle !== undefined) {
                        const angleToMouse = Math.atan2(dy, dx);
                        const radialForce = Math.cos(angleToMouse - point.angle) * force;
                        point.cursor.vx += Math.cos(point.angle) * radialForce * 100;
                        point.cursor.vy += Math.sin(point.angle) * radialForce * 100;
                    } else {
                        point.cursor.vx += Math.cos(this.mouse.a) * force * maxDistance;
                        point.cursor.vy += Math.sin(this.mouse.a) * force * maxDistance;
                    }
                }
                
                // Spring back with radio wave characteristics
                point.cursor.vx += (0 - point.cursor.x) * 0.02;
                point.cursor.vy += (0 - point.cursor.y) * 0.02;
                
                point.cursor.vx *= 0.88;
                point.cursor.vy *= 0.88;
                
                point.cursor.x += point.cursor.vx;
                point.cursor.y += point.cursor.vy;
                
                // Limit displacement
                const maxDisplacement = point.angle !== undefined ? 30 : 60;
                point.cursor.x = Math.max(-maxDisplacement, Math.min(maxDisplacement, point.cursor.x));
                point.cursor.y = Math.max(-maxDisplacement, Math.min(maxDisplacement, point.cursor.y));
            });
        });
    }

    getPointPosition(point, includeCursor = true) {
        return {
            x: point.originalX + point.wave.x + (includeCursor ? point.cursor.x : 0),
            y: point.originalY + point.wave.y + (includeCursor ? point.cursor.y : 0)
        };
    }

    drawLines() {
        this.lines.forEach((points, lineIndex) => {
            if (points.length < 2 || !this.paths[lineIndex]) return;
            
            let pathData = '';
            
            if (points[0].angle !== undefined) {
                // Draw circular radio waves
                const firstPoint = this.getPointPosition(points[0]);
                pathData = `M ${firstPoint.x} ${firstPoint.y}`;
                
                for (let i = 1; i < points.length; i++) {
                    const currentPoint = this.getPointPosition(points[i]);
                    const prevPoint = this.getPointPosition(points[i - 1]);
                    
                    // Use smooth curves for circular paths
                    const controlX = (prevPoint.x + currentPoint.x) / 2;
                    const controlY = (prevPoint.y + currentPoint.y) / 2;
                    pathData += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
                }
                
                // Close the circle
                const lastPoint = this.getPointPosition(points[points.length - 1]);
                const firstPointAgain = this.getPointPosition(points[0]);
                const finalControlX = (lastPoint.x + firstPointAgain.x) / 2;
                const finalControlY = (lastPoint.y + firstPointAgain.y) / 2;
                pathData += ` Q ${finalControlX} ${finalControlY} ${firstPointAgain.x} ${firstPointAgain.y} Z`;
                
            } else {
                // Draw flowing waves or other line types
                const firstPoint = this.getPointPosition(points[0]);
                pathData = `M ${firstPoint.x} ${firstPoint.y}`;
                
                for (let i = 1; i < points.length - 1; i++) {
                    const currentPoint = this.getPointPosition(points[i]);
                    const nextPoint = this.getPointPosition(points[i + 1]);
                    
                    // Control point for smooth curve
                    const controlX = (currentPoint.x + nextPoint.x) / 2;
                    const controlY = (currentPoint.y + nextPoint.y) / 2;
                    
                    pathData += ` Q ${currentPoint.x} ${currentPoint.y} ${controlX} ${controlY}`;
                }
                
                // Add the last point
                if (points.length > 1) {
                    const lastPoint = this.getPointPosition(points[points.length - 1]);
                    pathData += ` T ${lastPoint.x} ${lastPoint.y}`;
                }
            }
            
            this.paths[lineIndex].setAttribute('d', pathData);
        });
    }

    tick(time) {
        // Smooth mouse movement
        this.mouse.sx += (this.mouse.x - this.mouse.sx) * 0.08;
        this.mouse.sy += (this.mouse.y - this.mouse.sy) * 0.08;
        
        // Calculate mouse velocity
        const dx = this.mouse.x - this.mouse.lx;
        const dy = this.mouse.y - this.mouse.ly;
        this.mouse.v = Math.sqrt(dx * dx + dy * dy);
        this.mouse.vs += (this.mouse.v - this.mouse.vs) * 0.08;
        this.mouse.vs = Math.min(120, this.mouse.vs);
        
        // Mouse angle
        this.mouse.a = Math.atan2(dy, dx);
        
        // Update previous position
        this.mouse.lx = this.mouse.x;
        this.mouse.ly = this.mouse.y;
        
        // Move points and draw
        this.movePoints(time);
        this.drawLines();
        
        // Fade out pointer when not moving
        if (this.pointerDot && this.mouse.v < 0.5) {
            this.pointerDot.style.opacity = '0.3';
        }
        
        this.animationId = requestAnimationFrame(this.tick.bind(this));
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('resize', this.onResize.bind(this));
        window.removeEventListener('beforeunload', this.cleanup.bind(this));
        
        if (this.container) {
            this.container.removeEventListener('touchmove', this.onTouchMove.bind(this));
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new WaveSystem();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        const pointerDot = document.querySelector('.pointer-dot');
        if (pointerDot) {
            pointerDot.style.opacity = '0';
        }
    }
});