// powerup.js - Gestion des power-ups

const PowerUp = {
    create: function() {
        const powerUp = {
            x: Math.random() * (GameState.canvas.width - CONSTANTS.POWERUP_WIDTH),
            y: Math.random() * (GameState.canvas.height - CONSTANTS.POWERUP_HEIGHT),
            vx: (Math.random() - 0.5) * CONSTANTS.POWERUP_SPEED,
            vy: (Math.random() - 0.5) * CONSTANTS.POWERUP_SPEED,
            width: CONSTANTS.POWERUP_WIDTH,
            height: CONSTANTS.POWERUP_HEIGHT,
            type: Math.floor(Math.random() * 3), // 0: Thunder, 1: Assistant, 2: Shield
            id: Date.now() + Math.random(),
            rotation: 0
        };
        
        GameState.powerUps.push(powerUp);
        
        // Générer des points rouges parfois
        if (Math.random() > 0.5) {
            for (let i = 0; i < 10; i++) {
                RedPoint.create();
            }
        }
        
        return powerUp;
    },
    
    update: function(powerUp, deltaTime) {
        // Mouvement
        powerUp.x += powerUp.vx * (deltaTime / 16.67);
        powerUp.y += powerUp.vy * (deltaTime / 16.67);
        
        // Rebond sur les bords
        if (powerUp.x <= 0 || powerUp.x >= GameState.canvas.width - powerUp.width) {
            powerUp.vx = -powerUp.vx;
            powerUp.x = Math.max(0, Math.min(GameState.canvas.width - powerUp.width, powerUp.x));
        }
        if (powerUp.y <= 0 || powerUp.y >= GameState.canvas.height - powerUp.height) {
            powerUp.vy = -powerUp.vy;
            powerUp.y = Math.max(0, Math.min(GameState.canvas.height - powerUp.height, powerUp.y));
        }
        
        // Rotation
        powerUp.rotation += 0.05 * (deltaTime / 16.67);
    },
    
    updateAll: function(deltaTime) {
        if (!GameState.isHost) return;
        
        GameState.powerUps.forEach(powerUp => {
            this.update(powerUp, deltaTime);
        });
    },
    
    draw: function(powerUp) {
        const ctx = GameState.ctx;
        ctx.save();
        
        ctx.translate(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2);
        ctx.rotate(powerUp.rotation);
        
        const img = ImageLoader.get(`powerUp${powerUp.type}`);
        if (img && img.complete) {
            ctx.drawImage(
                img,
                -powerUp.width / 2,
                -powerUp.height / 2,
                powerUp.width,
                powerUp.height
            );
        } else {
            // Fallback avec couleurs
            ctx.fillStyle = ['#ff0000', '#ff00ff', '#ffff00'][powerUp.type];
            ctx.fillRect(-powerUp.width / 2, -powerUp.height / 2, powerUp.width, powerUp.height);
        }
        
        ctx.restore();
        
        // Effet de brillance
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
        ctx.fillStyle = CONSTANTS.TEAM1_COLOR;
        ctx.beginPath();
        ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, powerUp.width / 2 + 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    },
    
    drawAll: function() {
        GameState.powerUps.forEach(powerUp => {
            this.draw(powerUp);
        });
    },
    
    collect: function(powerUp, player, playerIndex) {
        switch(powerUp.type) {
            case 0: // Thunder
                Thunder.activate(player);
                break;
            case 1: // Assistant
                player.powerUpLevel = Math.min(player.powerUpLevel + 1, CONSTANTS.MAX_POWER_LEVEL);
                Assistant.create(player);
                break;
            case 2: // Shield
                player.powerUpLevel = 3;
                Shield.activate(player, CONSTANTS.SHIELD_DURATION);
                break;
        }
        
        if (playerIndex === GameState.myPlayerIndex) {
            NetworkSync.sendPowerUpCollected(playerIndex, powerUp.id, powerUp.type);
        }
        
        SoundManager.play('perfect');
    },
    
    handleCollection: function(data) {
        GameState.powerUps = GameState.powerUps.filter(p => p.id !== data.powerUpId);
        
        const player = GameState.players[data.playerIndex];
        switch(data.powerUpType) {
            case 0:
                Thunder.activate(player);
                break;
            case 1:
                player.powerUpLevel = Math.min(player.powerUpLevel + 1, CONSTANTS.MAX_POWER_LEVEL);
                Assistant.createFromNetwork(player);
                break;
            case 2:
                player.powerUpLevel = 3;
                Shield.activate(player, CONSTANTS.SHIELD_DURATION);
                break;
        }
    }
};