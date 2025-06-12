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
        }, 2000);

        setInterval(() => {
            if (gameStarted && !gameState.gameOver && gameState.redPoints.length < 15) {
                generateRedPoints();
            }
        }, 3000);
    }

    gameLoop();
}

function initializeGame() {
    if (gameInitialized) return;
    
    console.log('Initialisation du jeu...');
    const midPoint = canvas.height / 2;

    gameState.players[0].x = canvas.width * 0.5;
    gameState.players[0].y = canvas.height * 0.25;
    gameState.players[0].active = true;
    gameState.players[0].lives = 10;
    gameState.players[0].impacts = 0;
    gameState.players[0].bullets = [];
    gameState.players[0].powerUpLevel = 0;
    gameState.players[0].shield = false;
    gameState.players[0].redPointsCollected = 0;
    gameState.players[0].thunderActive = false;
    gameState.players[0].assistantShips = [];
    gameState.players[0].lastShootTime = 0;

    gameState.players[1].x = canvas.width * 0.5;
    gameState.players[1].y = canvas.height * 0.75;
    gameState.players[1].active = true;
    gameState.players[1].lives = 10;
    gameState.players[1].impacts = 0;
    gameState.players[1].bullets = [];
    gameState.players[1].powerUpLevel = 0;
    gameState.players[1].shield = false;
    gameState.players[1].redPointsCollected = 0;
    gameState.players[1].thunderActive = false;
    gameState.players[1].assistantShips = [];
    gameState.players[1].lastShootTime = 0;

    gameState.powerUps = [];
    gameState.redPoints = [];
    gameState.laserTraits = [];
    gameState.gameOver = false;
    gameState.winner = null;
    shieldParticles.particles = [];

    initializeLives();
    gameInitialized = true;
    
    console.log('Jeu initialisé avec succès');
}

function gameLoop() {
    if (!gameStarted) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    if (deltaTime < 16) {
        requestAnimationFrame(gameLoop);
        return;
    }

    try {
        handleLocalPlayerInput();
        updateBullets();
        updatePowerUps();
        updateRedPoints();
        updateThunder();
        updateAssistantShips();
        updateShieldParticles();
        updateLaserTraits();
        checkCollisions();
        render();

        if (currentTime % 2000 < 50) {
            sendMessage({ type: 'ping', timestamp: currentTime });
        }

        if (isHost && currentTime % 5000 < 50) {
            sendMessage({
                type: 'gameState',
                gameState: {
                    powerUps: gameState.powerUps,
                    redPoints: gameState.redPoints,
                    laserTraits: gameState.laserTraits
                }
            });
        }
    } catch (error) {
        console.error('Erreur dans la boucle de jeu:', error);
    }

    requestAnimationFrame(gameLoop);
}