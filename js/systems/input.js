// input.js - Système de contrôles

const Input = {
    keys: {},
    mouse: { x: 0, y: 0, clicking: false },
    lastShootTime: 0,
    
    init: function() {
        // Clavier
        window.addEventListener('keydown', (e) => {
            if (e.target.id !== 'joinGameInput') {
                this.keys[e.code] = true;
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            if (e.target.id !== 'joinGameInput') {
                this.keys[e.code] = false;
            }
        });
        
        // Souris
        GameState.canvas.addEventListener('mousemove', (e) => {
            const rect = GameState.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        GameState.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouse.clicking = true;
            }
        });
        
        GameState.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouse.clicking = false;
            }
        });
    },
    
    handleLocalPlayer: function() {
        if (!GameState.gameStarted || GameState.paused) return;
        
        const player = GameState.players[GameState.myPlayerIndex];
        if (!player.active) return;
        
        let moved = false;
        let shot = false;
        
        const midPoint = GameState.canvas.height / 2;
        const isInPlayerZone = GameState.myPlayerIndex === 0 ? 
            this.mouse.y < midPoint : 
            this.mouse.y > midPoint;
        
        // Contrôles souris
        if (isInPlayerZone) {
            const targetX = this.mouse.x;
            const targetY = this.mouse.y;
            
            const minY = GameState.myPlayerIndex === 0 ? 
                player.height/2 : 
                midPoint + player.height/2;
            const maxY = GameState.myPlayerIndex === 0 ? 
                midPoint - player.height/2 : 
                GameState.canvas.height - player.height/2;
            
            const clampedX = Math.max(player.width/2, Math.min(GameState.canvas.width - player.width/2, targetX));
            const clampedY = Math.max(minY, Math.min(maxY, targetY));
            
            if (Math.abs(player.x - clampedX) > 2 || Math.abs(player.y - clampedY) > 2) {
                player.x = clampedX;
                player.y = clampedY;
                moved = true;
            }
            
            if (this.mouse.clicking) shot = true;
        }
        
        // Contrôles clavier
        const controls = GameState.myPlayerIndex === 0 ? 
            SETTINGS.player1Controls : 
            SETTINGS.player2Controls;
        
        const speed = CONSTANTS.PLAYER_SPEED;
        if (this.keys[controls.left]) { player.x -= speed; moved = true; }
        if (this.keys[controls.right]) { player.x += speed; moved = true; }
        if (this.keys[controls.up]) { player.y -= speed; moved = true; }
        if (this.keys[controls.down]) { player.y += speed; moved = true; }
        if (this.keys[controls.shoot]) { shot = true; }
        
        // Limites de zone
        const midPointY = GameState.canvas.height / 2;
        const minY = GameState.myPlayerIndex === 0 ? 
            player.height/2 : 
            midPointY + player.height/2;
        const maxY = GameState.myPlayerIndex === 0 ? 
            midPointY - player.height/2 : 
            GameState.canvas.height - player.height/2;
        
        player.x = Math.max(player.width/2, Math.min(GameState.canvas.width - player.width/2, player.x));
        player.y = Math.max(minY, Math.min(maxY, player.y));
        
        // Gestion du tir
        const currentTime = Date.now();
        if (shot && currentTime - this.lastShootTime > CONSTANTS.SHOOT_COOLDOWN) {
            const bullets = Bullet.shoot(player, GameState.myPlayerIndex);
            this.lastShootTime = currentTime;
            
            // Envoyer les balles au réseau
            if (bullets.length > 0) {
                NetworkSync.sendBulletsFired(bullets, GameState.myPlayerIndex);
            }
        }
        
        // Synchronisation réseau
        if (moved || shot) {
            NetworkSync.sendPlayerInput(player, GameState.myPlayerIndex, shot);
        }
    }
};