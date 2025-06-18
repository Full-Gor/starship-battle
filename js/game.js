// Variables globales du jeu
if (typeof window.gameCanvas === 'undefined') {
    window.gameCanvas = {
        canvas: null,
        ctx: null
    };
}

let lastFrameTime = Date.now();
let lastPingTime = Date.now();
let gameInitialized = false;
let mouseX = 0;
let mouseY = 0;

function initGame() {
    window.gameCanvas.canvas = document.getElementById('gameCanvas');
    if (!window.gameCanvas.canvas) return;
    window.gameCanvas.ctx = window.gameCanvas.canvas.getContext('2d');

    // Ajouter les écouteurs d'événements pour la souris
    window.gameCanvas.canvas.addEventListener('mousemove', (e) => {
        const rect = window.gameCanvas.canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!window.gameCanvas.canvas) return;
    window.gameCanvas.canvas.width = window.innerWidth;
    window.gameCanvas.canvas.height = window.innerHeight;
}

// Rendre startGame accessible globalement
window.startGame = function() {
    if (gameStarted) return;
    
    console.log('Démarrage du jeu...');
    document.getElementById('connectionPanel').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('scoreBoard').style.display = 'flex';
    document.getElementById('team1Points').style.display = 'flex';
    document.getElementById('team2Points').style.display = 'flex';
    document.getElementById('networkStatus').style.display = 'block';
    document.querySelector('.divider').style.display = 'block';
    document.getElementById('controlInfo').style.display = 'block';
    document.getElementById('resetButton').style.display = 'block';

    initGame();
    gameStarted = true;
    gameInitialized = false;
    initializeGame();
    updateScoreBoard();
    initCanvasEvents();

    if (isHost) {
        setInterval(() => {
            if (gameStarted && !gameState.gameOver && gameState.powerUps.length < 2) {
                generatePowerUp();
            }
        }, 8000);

        setInterval(() => {
            if (gameStarted && !gameState.gameOver && gameState.laserTraits.length < 8) {
                generateLaserTrait();
            }
        }, 5000);
    }

    gameLoop();
};

function initializeGame() {
    console.log('Initialisation du jeu...');

    if (gameInitialized) return;
    gameInitialized = true;

    const midPoint = window.gameCanvas.canvas.height / 2;

    gameState.players[0] = {
        x: window.gameCanvas.canvas.width / 4,
        y: midPoint / 2,
        width: 50,
        height: 50,
        lives: 10,
        bullets: [],
        powerUpLevel: 0,
        active: true,
        shield: false,
        shieldTimeout: null,
        points: 0,
        impacts: 0,
        redPointsCollected: 0,
        assistantShips: [],
        gamesWon: gameState.players[0].gamesWon || 0,
        lastShootTime: 0
    };

    gameState.players[1] = {
        x: window.gameCanvas.canvas.width * 3 / 4,
        y: midPoint + midPoint / 2,
        width: 50,
        height: 50,
        lives: 10,
        bullets: [],
        powerUpLevel: 0,
        active: true,
        shield: false,
        shieldTimeout: null,
        points: 0,
        impacts: 0,
        redPointsCollected: 0,
        assistantShips: [],
        gamesWon: gameState.players[1].gamesWon || 0,
        lastShootTime: 0
    };

    gameState.powerUps = [];
    gameState.redPoints = [];
    gameState.laserTraits = [];
    shieldParticles.particles = [];

    initializeLives();
}

function gameLoop() {
    if (!gameStarted || gameState.paused || !window.gameCanvas.canvas || !window.gameCanvas.ctx) return;

    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    handleLocalPlayerInput();
    updatePowerUps();
    updateBullets();
    updateRedPoints();
    updateAssistants();
    updateShieldParticles();
    updateLaserTraits();
    checkCollisions();

    render();

    if (isHost && currentTime - lastPingTime > 2000) {
        sendMessage({ type: 'ping', timestamp: Date.now() });
        lastPingTime = currentTime;
    }

    if (isHost && !gameState.gameOver) {
        sendMessage({ type: 'gameState', gameState: {
            powerUps: gameState.powerUps,
            redPoints: gameState.redPoints,
            laserTraits: gameState.laserTraits
        }});
    }

    requestAnimationFrame(gameLoop);
}

function handleLocalPlayerInput() {
    if (!gameStarted || !gameState.players[myPlayerIndex]) return;

    const player = gameState.players[myPlayerIndex];
    const targetX = mouseX;
    const targetY = mouseY;

    // Calculer la direction et la distance
    const dx = targetX - player.x;
    const dy = targetY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Vitesse de déplacement
    const speed = 5;

    if (distance > 5) {
        // Normaliser la direction
        const dirX = dx / distance;
        const dirY = dy / distance;

        // Mettre à jour la position
        player.x += dirX * speed;
        player.y += dirY * speed;

        // Envoyer la mise à jour de position
        if (isHost) {
            sendMessage({
                type: 'playerUpdate',
                playerIndex: myPlayerIndex,
                x: player.x,
                y: player.y
            });
        }
    }
}