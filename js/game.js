// game.js - Boucle de jeu principale

const Game = {
    powerUpInterval: null,
    laserTraitInterval: null,
    
    init: function() {
        GameState.canvas = document.getElementById('gameCanvas');
        GameState.ctx = GameState.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        Input.init();
        SoundManager.init();
        ImageLoader.loadAll();
    },
    
    resizeCanvas: function() {
        GameState.canvas.width = window.innerWidth;
        GameState.canvas.height = window.innerHeight;
    },
    
    start: function() {
        document.getElementById('connectionPanel').style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        document.getElementById('scoreBoard').style.display = 'flex';
        document.getElementById('team1Points').style.display = 'flex';
        document.getElementById('team2Points').style.display = 'flex';
        document.getElementById('networkStatus').style.display = 'block';
        document.querySelector('.divider').style.display = 'block';
        document.getElementById('controlInfo').style.display = 'block';
        document.getElementById('resetButton').style.display = 'block';
        
        GameState.gameStarted = true;
        this.initializeGame();
        HUD.updateScoreBoard();
        
        // Génération d'entités (seulement l'hôte)
        if (GameState.isHost) {
            this.powerUpInterval = setInterval(() => {
                if (GameState.powerUps.length < CONSTANTS.MAX_POWERUPS) {
                    const powerUp = PowerUp.create();
                    NetworkSync.sendPowerUpGenerated(powerUp);
                }
            }, CONSTANTS.POWERUP_SPAWN_INTERVAL);
            
            this.laserTraitInterval = setInterval(() => {
                if (GameState.laserTraits.length < CONSTANTS.MAX_LASER_TRAITS) {
                    LaserTraits.create();
                }
            }, CONSTANTS.LASER_TRAIT_SPAWN_INTERVAL);
        }
        
        // Démarrer la boucle de jeu à 30 FPS
        GameState.lastFrameTime = performance.now();
        this.gameLoop();
    },
    
    initializeGame: function() {
        const midPoint = GameState.canvas.height / 2;
        
        GameState.players[0].x = GameState.canvas.width * 0.5;
        GameState.players[0].y = GameState.canvas.height * 0.25;
        
        GameState.players[1].x = GameState.canvas.width * 0.5;
        GameState.players[1].y = GameState.canvas.height * 0.75;
        
        HUD.initializeLives();
        HUD.updateScoreBoard();
    },
    
    gameLoop: function(currentTime) {
        if (!GameState.gameStarted) return;
        
        // Calcul du delta time pour 30 FPS
        if (!currentTime) currentTime = performance.now();
        const deltaTime = currentTime - GameState.lastFrameTime;
        
        GameState.frameAccumulator += deltaTime;
        
        // Mise à jour à 30 FPS (33.33ms par frame)
        while (GameState.frameAccumulator >= CONSTANTS.FRAME_TIME) {
            this.update(CONSTANTS.FRAME_TIME);
            GameState.frameAccumulator -= CONSTANTS.FRAME_TIME;
        }
        
        // Rendu (peut être à 60 FPS pour la fluidité visuelle)
        this.render();
        
        GameState.lastFrameTime = currentTime;
        requestAnimationFrame((time) => this.gameLoop(time));
    },
    
    update: function(deltaTime) {
        if (GameState.gameOver) return;
        
        // Input local
        Input.handleLocalPlayer();
        
        // Mise à jour des entités
        Bullet.updateAll(deltaTime);
        PowerUp.updateAll(deltaTime);
        RedPoint.updateAll(deltaTime);
        Thunder.updateAll(deltaTime);
        LaserTraits.updateAll(deltaTime);
        
        // Mise à jour des joueurs
        GameState.players.forEach((player, index) => {
            Player.update(player, deltaTime);
        });
        
        // Collisions
        Collision.checkAll();
        
        // Envoi du ping réseau
        if (Date.now() % 1000 < 50) {
            NetworkSync.sendPing();
        }
    },
    
    render: function() {
        const ctx = GameState.ctx;
        ctx.clearRect(0, 0, GameState.canvas.width, GameState.canvas.height);
        
        // Ordre de rendu
        LaserTraits.drawAll();
        PowerUp.drawAll();
        RedPoint.drawAll();
        Bullet.drawAll();
        
        // Joueurs et leurs effets
        GameState.players.forEach((player, index) => {
            Player.draw(player, index);
        });
    },
    
    end: function(winnerIndex) {
        GameState.gameOver = true;
        GameState.winner = winnerIndex;
        GameState.players[winnerIndex].gamesWon++;
        
        GameOver.show(winnerIndex);
        HUD.updateScoreBoard();
    },
    
    reset: function() {
        GameState.reset();
        
        document.getElementById('gameOverMessage').style.display = 'none';
        document.getElementById('gameOverMessage').innerHTML = '';
        
        HUD.resetRedPoints();
        
        if (GameState.connection && GameState.connection.open) {
            NetworkSync.sendReset();
        }
        
        this.initializeGame();
    },
    
    stop: function() {
        GameState.gameStarted = false;
        
        if (this.powerUpInterval) {
            clearInterval(this.powerUpInterval);
            this.powerUpInterval = null;
        }
        
        if (this.laserTraitInterval) {
            clearInterval(this.laserTraitInterval);
            this.laserTraitInterval = null;
        }
    }
};