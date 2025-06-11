// laser-traits.js - Traits laser

const LaserTraits = {
    create: function() {
        if (!GameState.isHost) return;
        
        const width = 50 + Math.random() * 20;
        const isPlayerZone = Math.random() < 0.5 ? 0 : 1;
        const midPoint = GameState.canvas.height / 2;
        
        const trait = {
            x: Math.random() * (GameState.canvas.width - width),
            y: isPlayerZone === 0 ?
                Math.random() * (midPoint - 50) :
                midPoint + Math.random() * (GameState.canvas.height / 2 - 50),
            width: width,
            height: 10,
            createdAt: Date.now(),
            duration: 3000,
            color: isPlayerZone === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR,
            opacity: 1,
            id: Date.now() + Math.random()
        };
        
        GameState.laserTraits.push(trait);
        console.log(`Trait laser créé à (${trait.x}, ${trait.y})`);
        
        return trait;
    },
    
    update: function(trait, deltaTime) {
        const currentTime = Date.now();
        const elapsed = currentTime - trait.createdAt;
        
        // Effet de disparition progressive
        if (elapsed > trait.duration - 500) {
            trait.opacity = Math.max(0, 1 - ((elapsed - (trait.duration - 500)) / 500));
        }
        
        return elapsed < trait.duration;
    },
    
    updateAll: function(deltaTime) {
        GameState.laserTraits = GameState.laserTraits.filter(trait => 
            this.update(trait, deltaTime)
        );
    },
    
    draw: function(trait) {
        const ctx = GameState.ctx;
        ctx.save();
        
        ctx.globalAlpha = trait.opacity;
        ctx.fillStyle = trait.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        
        // Rectangle principal
        ctx.fillRect(trait.x, trait.y, trait.width, trait.height);
        ctx.strokeRect(trait.x, trait.y, trait.width, trait.height);
        
        // Effet de brillance
        if (trait.opacity > 0.5) {
            ctx.globalAlpha = trait.opacity * 0.3;
            ctx.shadowColor = trait.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(trait.x - 5, trait.y - 5, trait.width + 10, trait.height + 10);
        }
        
        ctx.restore();
    },
    
    drawAll: function() {
        GameState.laserTraits.forEach(trait => {
            this.draw(trait);
        });
    }
};