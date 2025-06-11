// collision.js - Système de collisions

const Collision = {
    checkAll: function() {
        this.checkBulletPlayerCollisions();
        this.checkBulletAssistantCollisions();
        this.checkPowerUpCollisions();
        this.checkRedPointCollisions();
    },
    
    checkBulletPlayerCollisions: function() {
        for (let i = 0; i < GameState.players.length; i++) {
            const player = GameState.players[i];
            if (!player.active) continue;
            
            for (let j = 0; j < GameState.players.length; j++) {
                if (i === j) continue;
                
                const opponent = GameState.players[j];
                
                opponent.bullets = opponent.bullets.filter(bullet => {
                    if (this.checkRectCollision(bullet, player)) {
                        if (!player.shield) {
                            const result = Player.takeDamage(player);
                            
                            if (result === 'dead') {
                                Game.end(j);
                            }
                            
                            SoundManager.play('hit');
                        }
                        
                        return false; // Détruire la balle
                    }
                    
                    return true;
                });
            }
        }
    },
    
    checkBulletAssistantCollisions: function() {
        for (let i = 0; i < GameState.players.length; i++) {
            const player = GameState.players[i];
            
            for (let j = 0; j < GameState.players.length; j++) {
                if (i === j) continue;
                
                const opponent = GameState.players[j];
                
                for (let k = player.assistantShips.length - 1; k >= 0; k--) {
                    const assistant = player.assistantShips[k];
                    
                    opponent.bullets = opponent.bullets.filter(bullet => {
                        if (this.checkRectCollision(bullet, assistant)) {
                            if (!assistant.shield) {
                                assistant.health--;
                                
                                if (assistant.health <= 0) {
                                    // Générer des points rouges
                                    for (let l = 0; l < 5; l++) {
                                        RedPoint.create(
                                            assistant.x + assistant.width / 2,
                                            assistant.y + assistant.height / 2,
                                            true
                                        );
                                    }
                                    
                                    player.assistantShips.splice(k, 1);
                                }
                            }
                            
                            SoundManager.play('hit');
                            return false;
                        }
                        
                        return true;
                    });
                }
            }
        }
    },
    
    checkPowerUpCollisions: function() {
        GameState.players.forEach((player, index) => {
            if (!player.active) return;
            
            GameState.powerUps = GameState.powerUps.filter(powerUp => {
                if (this.checkRectCollision(powerUp, player)) {
                    PowerUp.collect(powerUp, player, index);
                    return false;
                }
                
                return true;
            });
        });
    },
    
    checkRedPointCollisions: function() {
        GameState.redPoints = GameState.redPoints.filter(point => {
            for (let i = 0; i < GameState.players.length; i++) {
                const player = GameState.players[i];
                if (!player.active) continue;
                
                const dx = player.x - point.x;
                const dy = player.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 30) {
                    if (i === GameState.myPlayerIndex) {
                        Player.collectRedPoint(player);
                        NetworkSync.sendRedPointCollected(i, point.id);
                        SoundManager.play('coin');
                    }
                    return false;
                }
            }
            
            return true;
        });
    },
    
    checkRectCollision: function(obj1, obj2) {
        const dx = Math.abs(obj1.x - obj2.x);
        const dy = Math.abs(obj1.y - obj2.y);
        
        return dx < (obj1.width + obj2.width) / 2 && 
               dy < (obj1.height + obj2.height) / 2;
    }
};