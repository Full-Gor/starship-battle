// helpers.js - Fonctions utilitaires

const Helpers = {
    // Limiter une valeur entre min et max
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    // Distance entre deux points
    distance: function(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // Angle entre deux points
    angle: function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    // Nombre aléatoire entre min et max
    random: function(min, max) {
        return min + Math.random() * (max - min);
    },
    
    // Nombre entier aléatoire entre min et max (inclus)
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Interpolation linéaire
    lerp: function(start, end, progress) {
        return start + (end - start) * progress;
    },
    
    // Normaliser un vecteur
    normalize: function(x, y) {
        const length = Math.sqrt(x * x + y * y);
        if (length === 0) return { x: 0, y: 0 };
        return {
            x: x / length,
            y: y / length
        };
    },
    
    // Collision AABB (Axis-Aligned Bounding Box)
    aabbCollision: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    // Collision cercle-cercle
    circleCollision: function(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    },
    
    // Formater le temps en mm:ss
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },
    
    // Générer un ID unique
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Débounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function (pour limiter les appels à 30 FPS)
    throttle: function(func, limit = CONSTANTS.FRAME_TIME) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Convertir hex en RGB
    hexToRgb: function(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    // Effet de screenshake
    screenShake: function(duration = 300, intensity = 5) {
        const startTime = Date.now();
        const originalTransform = GameState.canvas.style.transform;
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > duration) {
                GameState.canvas.style.transform = originalTransform;
                return;
            }
            
            const progress = 1 - (elapsed / duration);
            const offsetX = (Math.random() - 0.5) * intensity * progress;
            const offsetY = (Math.random() - 0.5) * intensity * progress;
            
            GameState.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            requestAnimationFrame(shake);
        };
        
        shake();
    }
};