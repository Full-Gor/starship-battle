// sync.js - Synchronisation réseau

const NetworkSync = {
    lastSyncTime: 0,
    
    sendMessage: function(data) {
        if (GameState.connection && GameState.connection.open) {
            try {
                GameState.connection.send(data);
            } catch (err) {
                console.error('Erreur envoi message:', err);
            }
        }
    },
    
    sendPlayerInput: function(player, playerIndex, shot) {
        // Limiter les envois à 30 fois par seconde
        const now = Date.now();
        if (now - this.lastSyncTime < CONSTANTS.NETWORK_SYNC_INTERVAL) return;
        this.lastSyncTime = now;
        
        this.sendMessage({
            type: 'playerInput',
            playerIndex: playerIndex,
            x: player.x,
            y: player.y,
            shot: shot
        });
    },
    
    sendBulletsFired: function(bullets, playerIndex) {
        this.sendMessage({
            type: 'bulletFired',
            bullets: bullets,
            playerIndex: playerIndex
        });
    },
    
    sendPowerUpGenerated: function(powerUp) {
        this.sendMessage({
            type: 'powerUpGenerated',
            powerUp: powerUp
        });
    },
    
    sendPowerUpCollected: function(playerIndex, powerUpId, powerUpType) {
        this.sendMessage({
            type: 'powerUpCollected',
            playerIndex: playerIndex,
            powerUpId: powerUpId,
            powerUpType: powerUpType
        });
    },
    
    sendRedPointCollected: function(playerIndex, pointId) {
        this.sendMessage({
            type: 'redPointCollected',
            playerIndex: playerIndex,
            pointId: pointId
        });
    },
    
    sendShieldActivated: function(playerIndex) {
        this.sendMessage({
            type: 'shieldActivated',
            playerIndex: playerIndex
        });
    },
    
    sendThunderActivated: function(playerIndex) {
        this.sendMessage({
            type: 'thunderActivated',
            playerIndex: playerIndex
        });
    },
    
    sendAssistantCreated: function(playerIndex, assistant) {
        this.sendMessage({
            type: 'assistantCreated',
            playerIndex: playerIndex,
            assistant: {
                x: assistant.x,
                y: assistant.y,
                imageIndex: assistant.imageIndex
            }
        });
    },
    
    sendPing: function() {
        this.sendMessage({
            type: 'ping',
            timestamp: Date.now()
        });
    },
    
    sendReset: function() {
        this.sendMessage({
            type: 'resetGame'
        });
    },
    
    handleMessage: function(data) {
        switch(data.type) {
            case 'init':
                GameState.opponentPseudo = data.pseudo || 'Adversaire';
                console.log('Pseudo adversaire reçu:', GameState.opponentPseudo);
                HUD.updateScoreBoard();
                break;
                
            case 'playerInput':
                this.handleRemotePlayerInput(data);
                break;
                
            case 'bulletFired':
                this.handleBulletsFired(data);
                break;
                
            case 'powerUpGenerated':
                GameState.powerUps.push(data.powerUp);
                break;
                
            case 'powerUpCollected':
                PowerUp.handleCollection(data);
                break;
                
            case 'redPointCollected':
                RedPoint.handleCollection(data);
                break;
                
            case 'shieldActivated':
                Shield.activate(GameState.players[data.playerIndex]);
                break;
                
            case 'thunderActivated':
                Thunder.activate(GameState.players[data.playerIndex]);
                break;
                
            case 'assistantCreated':
                Assistant.createFromNetwork(GameState.players[data.playerIndex], data.assistant);
                break;
                
            case 'ping':
                this.sendMessage({type: 'pong', timestamp: data.timestamp});
                break;
                
            case 'pong':
                GameState.networkLatency = Date.now() - data.timestamp;
                document.getElementById('statusText').textContent = `Connecté (${GameState.networkLatency}ms)`;
                break;
                
            case 'resetGame':
                Game.reset();
                break;
        }
    },
    
    handleRemotePlayerInput: function(data) {
        const player = GameState.players[data.playerIndex];
        player.x = data.x;
        player.y = data.y;
        
        if (data.shot) {
            Bullet.shoot(player, data.playerIndex);
        }
    },
    
    handleBulletsFired: function(data) {
        const player = GameState.players[data.playerIndex];
        data.bullets.forEach(bulletData => {
            player.bullets.push(bulletData);
        });
    }
};