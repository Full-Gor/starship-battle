// redpoint.js - Points rouges

const RedPoint = {
    create: function(x = null, y = null, explosive = false) {
        const point = {
            x: x || Math.random() * GameState.canvas.width,
            y: y || Math.random() * GameState.canvas.height,
            vx: explosive ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 2,
            vy: explosive ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 2,
            id: Date.now() + Math.random()
        };
        
        GameState.redPoints.push(point);
        
        if (GameState.isHost && !explosive) {
            NetworkSync.sendMessage({
                type: 'redPointGenerated',
                redPoint: point
            });
        }
        
        return point;
    },
    
    update: function(point, deltaTime) {
        const normalizedDelta = deltaTime / 16.67;
        
        // Mouvement avec friction
        point.x += point.vx * normalizedDelta;
        point.y += point.vy * normalizedDelta;
        
        if (point.vx) point.vx *= 0.98;
        if (point.vy) point.vy *= 0.98;
        
        // Attraction vers les joueurs
        GameState.players.forEach((player) => {
            if (!player.active) return;
            
            const dx = player.x - point.x;
            const dy = player.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100 && distance > 0) {
                const force = (100 - distance) / 100 * 3 * normalizedDelta;
                point.x += (dx / distance) * force;
                point.y += (dy / distance) * force;
            }
        });
        
        // Vérifier si toujours dans l'écran
        return point.x > 0 && point.x < GameState.canvas.width &&
               point.y > 0 && point.y < GameState.canvas.height;
    },
    
    updateAll: function(deltaTime) {
        GameState.redPoints = GameState.redPoints.filter(point => 
            this.update(point, deltaTime)
        );
    },
    
    draw: function(point) {
        const ctx = GameState.ctx;
        ctx.fillStyle = 'red';
        ctx.fillRect(point.x - 2, point.y - 2, 4, 4);
    },
    
    drawAll: function() {
        GameState.redPoints.forEach(point => {
            this.draw(point);
        });
    },
    
    handleCollection: function(data) {
        GameState.redPoints = GameState.redPoints.filter(p => p.id !== data.pointId);
        
        const player = GameState.players[data.playerIndex];
        player.redPointsCollected++;
        
        HUD.updateRedPoints(data.playerIndex);
        
        if (player.redPointsCollected >= CONSTANTS.RED_POINTS_FOR_SHIELD) {
            Shield.activate(player);
            player.redPointsCollected -= CONSTANTS.RED_POINTS_FOR_SHIELD;
            HUD.updateRedPoints(data.playerIndex);
        }
    }
};