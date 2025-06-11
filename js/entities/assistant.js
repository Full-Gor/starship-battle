// assistant.js - Vaisseaux assistants

const Assistant = {
    create: function(player, assistantData = null) {
        if (player.assistantShips.length >= CONSTANTS.MAX_ASSISTANTS) return null;
        
        const playerIndex = GameState.players.indexOf(player);
        let imgIndex, x, y;
        
        if (assistantData) {
            imgIndex = assistantData.imageIndex;
            x = assistantData.x;
            y = assistantData.y;
        } else {
            imgIndex = player.assistantShips.length % 6;
            x = Math.random() * (GameState.canvas.width - CONSTANTS.ASSISTANT_WIDTH);
            const midPoint = GameState.canvas.height / 2;
            y = playerIndex === 0 ? midPoint - 150 : midPoint + 150;
        }
        
        const assistant = {
            x: x,
            y: y,
            targetY: playerIndex === 0 ? 
                GameState.canvas.height / 2 - 50 : 
                GameState.canvas.height / 2 + 50,
            width: CONSTANTS.ASSISTANT_WIDTH,
            height: CONSTANTS.ASSISTANT_HEIGHT,
            lastShootTime: 0,
            shootInterval: 500 + (player.assistantShips.length * 100),
            bullets: [],
            speed: CONSTANTS.ASSISTANT_SPEED,
            isEntering: true,
            moveDirection: Math.random() < 0.5 ? 1 : -1,
            moveTimer: Math.random() * Math.PI * 2,
            health: 3,
            imageIndex: imgIndex,
            playerIndex: playerIndex,
            shield: false,
            shieldTimeout: null
        };
        
        player.assistantShips.push(assistant);
        
        if (playerIndex === GameState.myPlayerIndex && !assistantData) {
            NetworkSync.sendAssistantCreated(playerIndex, assistant);
        }
        
        SoundManager.play('awesome');
        return assistant;
    },
    
    createFromNetwork: function(player, assistantData) {
        this.create(player, assistantData);
    },
    
    update: function(assistant, deltaTime) {
        const normalizedDelta = deltaTime / 16.67;
        
        if (assistant.isEntering) {
            const targetY = assistant.targetY;
            if (Math.abs(assistant.y - targetY) > assistant.speed) {
                assistant.y += (assistant.y < targetY ? assistant.speed : -assistant.speed) * normalizedDelta;
            } else {
                assistant.y = targetY;
                assistant.isEntering = false;
            }
        } else {
            // Mouvement sinusoïdal
            assistant.moveTimer += 0.01 * normalizedDelta;
            assistant.x += Math.sin(assistant.moveTimer) * 2 * assistant.moveDirection * normalizedDelta;
            
            // Rebond sur les bords
            if (assistant.x < 0 || assistant.x + assistant.width > GameState.canvas.width) {
                assistant.moveDirection *= -1;
                assistant.x = Math.max(0, Math.min(GameState.canvas.width - assistant.width, assistant.x));
            }
        }
        
        // Tir automatique
        const currentTime = Date.now();
        if (currentTime - assistant.lastShootTime > assistant.shootInterval) {
            this.shoot(assistant);
            assistant.lastShootTime = currentTime;
        }
    },
    
    shoot: function(assistant) {
        const player = GameState.players[assistant.playerIndex];
        const bullet = Bullet.create(
            assistant.x + assistant.width / 2,
            assistant.y + (assistant.playerIndex === 0 ? assistant.height / 2 : -assistant.height / 2),
            0,
            assistant.playerIndex === 0 ? 8 : -8,
            assistant.playerIndex,
            this.getColor(assistant.imageIndex),
            true
        );
        
        player.bullets.push(bullet);
    },
    
    draw: function(assistant) {
        const ctx = GameState.ctx;
        ctx.save();
        
        if (assistant.health < 3) {
            ctx.globalAlpha = 0.7 + assistant.health * 0.1;
        }
        
        ctx.translate(assistant.x + assistant.width / 2, assistant.y + assistant.height / 2);
        if (assistant.playerIndex === 1) {
            ctx.rotate(Math.PI);
        }
        ctx.translate(-assistant.width / 2, -assistant.height / 2);
        
        const img = ImageLoader.get(`assistant${assistant.imageIndex + 1}`);
        if (img && img.complete) {
            ctx.drawImage(img, 0, 0, assistant.width, assistant.height);
        } else {
            // Fallback
            ctx.fillStyle = this.getColor(assistant.imageIndex);
            ctx.fillRect(0, 0, assistant.width, assistant.height);
        }
        
        ctx.restore();
        
        // Barres de vie
        ctx.fillStyle = CONSTANTS.TEAM1_COLOR;
        for (let i = 0; i < assistant.health; i++) {
            ctx.fillRect(assistant.x + i * 12, assistant.y - 10, 10, 5);
        }
    },
    
    getColor: function(imageIndex) {
        const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'];
        return colors[imageIndex] || CONSTANTS.TEAM1_COLOR;
    }
};