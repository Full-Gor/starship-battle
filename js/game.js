const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastFrameTime = Date.now();
let gameInitialized = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function startGame() {
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

    gameStarted = true;
    gameInitialized = false;
    initializeGame();
    updateScoreBoard();

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
}

function initializeGame() {
    console.log('Initialisation du jeu...');

    if (gameInitialized) return;
    gameInitialized = true;

    const midPoint = canvas.height / 2;

    gameState.players[0] = {
        x: canvas.width / 4,
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
        x: canvas.width * 3 / 4,
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
    if (!gameStarted || gameState.paused || !canvas || !ctx) return;

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