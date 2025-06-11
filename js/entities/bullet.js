// bullet.js - Gestion des balles

const Bullet = {
    create: function(x, y, vx, vy, playerIndex, color = null, isAssistantBullet = false) {
        const bullet = {
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            width: CONSTANTS.BULLET_WIDTH,
            height: CONSTANTS.BULLET_HEIGHT,
            playerIndex: playerIndex,
            color: color || (playerIndex === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR),
            isAssistantBullet: isAssistantBullet
        };
        
        return bullet;
    },
    
    shoot: function(player, playerIndex) {
        if (!player.active) return [];
        
        const bullets = [];
        const bulletSpeed = CONSTANTS.BULLET_SPEED;
        const bulletColor = playerIndex === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR;
        
        // Configuration des rangées de balles selon le niveau
        const rows = [
            { offsets: [-30, -20, -10, 0, 10, 20, 30], y: player.y + (playerIndex === 0 ? player.height/2 : -player.height/2), speed: bulletSpeed - 4, color: '#FF00FF' },
            { offsets: [-20, -10, 0, 10, 20], y: player.y + (playerIndex === 0 ? player.height/2 + 4 : -player.height/2 - 4), speed: bulletSpeed - 3, color: bulletColor },
            { offsets: [-15, -5, 5, 15], y: player.y + (playerIndex === 0 ? player.height/2 + 8 : -player.height/2 - 8), speed: bulletSpeed - 2, color: '#FF00FF' },
            { offsets: [-10, 0, 10], y: player.y + (playerIndex === 0 ? player.height/2 + 12 : -player.height/2 - 12), speed: bulletSpeed - 1, color: bulletColor },
            { offsets: [0], y: player.y + (playerIndex === 0 ? player.height/2 + 16 : -player.height/2 - 16), speed: bulletSpeed, color: bulletColor }
        ];
        
        const numRows = Math.min(player.powerUpLevel + 1, rows.length);
        const rowsToUse = rows.slice(0, numRows);
        
        rowsToUse.forEach(row => {
            row.offsets.forEach(xOffset => {
                const bullet = this.create(
                    player.x + xOffset,
                    row.y,
                    0,
                    playerIndex === 0 ? row.speed : -row.speed,
                    playerIndex,
                    row.color
                );
                
                bullets.push(bullet);
                player.bullets.push(bullet);
            });
        });
        
        SoundManager.play('shoot');
        return bullets;
    },
    
    update: function(bullet, deltaTime) {
        bullet.x += bullet.vx * (deltaTime / 16.67); // Normalisation pour 30 FPS
        bullet.y += bullet.vy * (deltaTime / 16.67);
        
        // Vérifier collision avec les traits laser
        for (const trait of GameState.laserTraits) {
            if (this.checkLaserTraitCollision(bullet, trait)) {
                return false; // Bullet détruite
            }
        }
        
        // Vérifier si la balle est toujours dans l'écran
        return bullet.y > -10 && bullet.y < GameState.canvas.height + 10 &&
               bullet.x > -10 && bullet.x < GameState.canvas.width + 10;
    },
    
    updateAll: function(deltaTime) {
        GameState.players.forEach(player => {
            player.bullets = player.bullets.filter(bullet => 
                this.update(bullet, deltaTime)
            );
        });
    },
    
    draw: function(bullet) {
        const ctx = GameState.ctx;
        ctx.save();
        
        ctx.fillStyle = bullet.color;
        ctx.strokeStyle = bullet.color;
        ctx.lineWidth = 2;
        
        // Contour
        ctx.strokeRect(
            bullet.x - bullet.width/2, 
            bullet.y - bullet.height/2, 
            bullet.width, 
            bullet.height
        );
        
        // Centre lumineux
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    },
    
    drawAll: function() {
        GameState.players.forEach(player => {
            player.bullets.forEach(bullet => {
                this.draw(bullet);
            });
        });
    },
    
    checkLaserTraitCollision: function(bullet, trait) {
        return bullet.x + bullet.width/2 > trait.x &&
               bullet.x - bullet.width/2 < trait.x + trait.width &&
               bullet.y + bullet.height/2 > trait.y &&
               bullet.y - bullet.height/2 < trait.y + trait.height;
    }
};