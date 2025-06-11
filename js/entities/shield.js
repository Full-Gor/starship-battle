// shield.js - Système de bouclier

const Shield = {
    activate: function(player, duration = CONSTANTS.SHIELD_DURATION) {
        if (!player || !player.active) return;
        
        player.shield = true;
        this.createParticles(player);
        
        if (player.shieldTimeout) {
            clearTimeout(player.shieldTimeout);
        }
        
        player.shieldTimeout = setTimeout(() => {
            player.shield = false;
            const playerIndex = GameState.players.indexOf(player);
            this.clearParticles(playerIndex);
        }, duration);
        
        const playerIndex = GameState.players.indexOf(player);
        if (playerIndex === GameState.myPlayerIndex) {
            NetworkSync.sendShieldActivated(playerIndex);
        }
    },
    
    createParticles: function(player) {
        const playerIndex = GameState.players.indexOf(player);
        const particleConfig = CONSTANTS.SHIELD_PARTICLES;
        
        for (let i = 0; i < particleConfig.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 10;
            
            GameState.shieldParticles.particles.push({
                angle: angle,
                distance: distance,
                size: particleConfig.minSize + Math.random() * (particleConfig.maxSize - particleConfig.minSize),
                speed: particleConfig.minSpeed + Math.random() * (particleConfig.maxSpeed - particleConfig.minSpeed),
                color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
                playerIndex: playerIndex,
                opacity: 0.5 + Math.random() * 0.5
            });
        }
    },
    
    updateParticles: function(player) {
        const playerIndex = GameState.players.indexOf(player);
        
        GameState.shieldParticles.particles
            .filter(p => p.playerIndex === playerIndex)
            .forEach(particle => {
                particle.angle += particle.speed;
                if (particle.angle > Math.PI * 2) {
                    particle.angle -= Math.PI * 2;
                }
            });
    },
    
    clearParticles: function(playerIndex) {
        GameState.shieldParticles.particles = GameState.shieldParticles.particles
            .filter(p => p.playerIndex !== playerIndex);
        GameState.shieldParticles.orbitalParticles = GameState.shieldParticles.orbitalParticles
            .filter(p => p.playerIndex !== playerIndex);
    },
    
    draw: function(player, playerIndex) {
        if (!player.shield) return;
        
        const ctx = GameState.ctx;
        const centerX = player.x;
        const centerY = player.y;
        
        // Gradient de bouclier
        ctx.save();
        const gradient = ctx.createRadialGradient(
            centerX, centerY, player.width / 2,
            centerX, centerY, player.width / 2 + 20
        );
        
        const playerColor = playerIndex === 0 ? '4, 251, 172' : '255, 127, 80';
        
        gradient.addColorStop(0, `rgba(${playerColor}, 0)`);
        gradient.addColorStop(0.7, `rgba(${playerColor}, 0.1)`);
        gradient.addColorStop(1, `rgba(${playerColor}, 0.2)`);
        
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.003) * 0.2;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, player.width / 2 + 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Particules orbitales
        GameState.shieldParticles.particles
            .filter(p => p.playerIndex === playerIndex)
            .forEach(p => {
                ctx.save();
                
                const x = centerX + Math.cos(p.angle) * p.distance;
                const y = centerY + Math.sin(p.angle) * p.distance;
                
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 5;
                
                ctx.beginPath();
                ctx.arc(x, y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            });
    }
};