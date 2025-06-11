// player.js - Gestion des joueurs

const Player = {
    create: function(index) {
        const player = GameState.players[index];
        const midPoint = GameState.canvas.height / 2;
        
        player.x = GameState.canvas.width * 0.5;
        player.y = index === 0 ? GameState.canvas.height * 0.25 : GameState.canvas.height * 0.75;
        player.active = true;
        player.lives = CONSTANTS.MAX_LIVES;
        player.impacts = 0;
        
        return player;
    },
    
    update: function(player, deltaTime) {
        if (!player.active) return;
        
        // Mise à jour des assistants
        player.assistantShips.forEach(assistant => {
            Assistant.update(assistant, deltaTime);
        });
        
        // Mise à jour du thunder
        if (player.thunderActive) {
            Thunder.update(player);
        }
        
        // Mise à jour du bouclier
        if (player.shield) {
            Shield.updateParticles(player);
        }
    },
    
    draw: function(player, index) {
        if (!player.active) return;
        
        const ctx = GameState.ctx;
        ctx.save();
        
        // Affichage des impacts
        if (player.impacts > 0) {
            ctx.fillStyle = '#FF0000';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `${player.impacts}/${CONSTANTS.MAX_IMPACTS}`,
                player.x,
                player.y - player.height / 2 - 10
            );
        }
        
        // Dessin du vaisseau
        const img = index === 0 ? ImageLoader.images.starship1 : ImageLoader.images.starship2;
        if (img && img.complete) {
            ctx.drawImage(
                img,
                player.x - player.width / 2,
                player.y - player.height / 2,
                player.width,
                player.height
            );
        } else {
            // Fallback si l'image n'est pas chargée
            ctx.fillStyle = index === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR;
            ctx.fillRect(
                player.x - player.width / 2,
                player.y - player.height / 2,
                player.width,
                player.height
            );
        }
        
        // Niveau de power-up
        if (player.powerUpLevel > 0) {
            ctx.fillStyle = '#ff00ff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                `LV${player.powerUpLevel}`,
                player.x,
                player.y + player.height / 2 + 15
            );
        }
        
        ctx.restore();
        
        // Dessiner les effets
        if (player.shield) {
            Shield.draw(player, index);
        }
        
        if (player.thunderActive) {
            Thunder.draw(player, index);
        }
        
        // Dessiner les assistants
        player.assistantShips.forEach(assistant => {
            Assistant.draw(assistant);
        });
    },
    
    takeDamage: function(player, amount = 1) {
        if (!player.active || player.shield) return false;
        
        if (player.powerUpLevel > 0) {
            player.powerUpLevel--;
            
            // Générer des points rouges
            for (let i = 0; i < 5; i++) {
                RedPoint.create(player.x, player.y, true);
            }
            
            return true;
        } else {
            player.impacts += amount;
            
            if (player.impacts >= CONSTANTS.MAX_IMPACTS) {
                player.active = false;
                return 'dead';
            }
            
            return true;
        }
    },
    
    collectRedPoint: function(player) {
        player.redPointsCollected++;
        
        if (player.redPointsCollected >= CONSTANTS.RED_POINTS_FOR_SHIELD) {
            Shield.activate(player);
            player.redPointsCollected -= CONSTANTS.RED_POINTS_FOR_SHIELD;
        }
        
        HUD.updateRedPoints(GameState.players.indexOf(player));
    }
};