// thunder.js - Effet thunder

const Thunder = {
    activate: function(player) {
        if (player.thunderActive) {
            player.thunderCount = Math.min(player.thunderCount + 1, 3);
        } else {
            player.thunderActive = true;
            player.thunderCount = 1;
            player.thunderStartTime = Date.now();
        }
        
        SoundManager.play('king');
        
        const playerIndex = GameState.players.indexOf(player);
        if (playerIndex === GameState.myPlayerIndex) {
            NetworkSync.sendThunderActivated(playerIndex);
        }
    },
    
    update: function(player) {
        if (!player.thunderActive) return;
        
        const elapsedTime = Date.now() - player.thunderStartTime;
        if (elapsedTime > CONSTANTS.THUNDER_DURATION) {
            player.thunderActive = false;
            player.thunderCount = 0;
        }
    },
    
    updateAll: function() {
        GameState.players.forEach(player => {
            this.update(player);
        });
    },
    
    draw: function(player, playerIndex) {
        if (!player.thunderActive) return;
        
        const ctx = GameState.ctx;
        const thunderFrame = Math.floor((Date.now() - player.thunderStartTime) / 1000) % 3;
        const thunderDirections = [
            { angle: 90 },
            { angle: 135 },
            { angle: 45 }
        ];
        
        for (let i = 0; i < player.thunderCount; i++) {
            const direction = thunderDirections[i % thunderDirections.length];
            ctx.save();
            
            const angleRad = (direction.angle - 90) * Math.PI / 180;
            ctx.translate(player.x, player.y);
            ctx.rotate(angleRad);
            
            const img = ImageLoader.get(`thunder${thunderFrame + 1}`);
            if (img && img.complete) {
                ctx.drawImage(
                    img,
                    -20,
                    playerIndex === 0 ? -400 : 0,
                    40,
                    400
                );
            } else {
                // Fallback avec effet électrique
                ctx.strokeStyle = playerIndex === 0 ? CONSTANTS.TEAM1_COLOR : CONSTANTS.TEAM2_COLOR;
                ctx.lineWidth = 3;
                ctx.shadowColor = ctx.strokeStyle;
                ctx.shadowBlur = 10;
                
                // Zigzag électrique
                ctx.beginPath();
                ctx.moveTo(0, 0);
                for (let j = 0; j < 10; j++) {
                    const y = j * 40;
                    const x = (Math.random() - 0.5) * 20;
                    ctx.lineTo(x, playerIndex === 0 ? -y : y);
                }
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }
};