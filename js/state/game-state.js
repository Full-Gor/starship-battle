// game-state.js - État global du jeu

const GameState = {
    // Canvas
    canvas: null,
    ctx: null,
    
    // État du jeu
    gameStarted: false,
    paused: false,
    gameOver: false,
    winner: null,
    
    // Réseau
    peer: null,
    connection: null,
    isHost: false,
    myPlayerIndex: 0,
    networkLatency: 0,
    myPseudo: '',
    opponentPseudo: 'Adversaire',
    
    // Timing 30 FPS
    lastFrameTime: 0,
    frameAccumulator: 0,
    
    // Joueurs
    players: [
        {
            x: 0,
            y: 0,
            width: CONSTANTS.PLAYER_WIDTH,
            height: CONSTANTS.PLAYER_HEIGHT,
            lives: CONSTANTS.MAX_LIVES,
            bullets: [],
            powerUpLevel: 0,
            active: true,
            shield: false,
            shieldTimeout: null,
            points: 0,
            impacts: 0,
            redPointsCollected: 0,
            thunderActive: false,
            thunderCount: 0,
            thunderStartTime: 0,
            assistantShips: [],
            gamesWon: 0
        },
        {
            x: 0,
            y: 0,
            width: CONSTANTS.PLAYER_WIDTH,
            height: CONSTANTS.PLAYER_HEIGHT,
            lives: CONSTANTS.MAX_LIVES,
            bullets: [],
            powerUpLevel: 0,
            active: true,
            shield: false,
            shieldTimeout: null,
            points: 0,
            impacts: 0,
            redPointsCollected: 0,
            thunderActive: false,
            thunderCount: 0,
            thunderStartTime: 0,
            assistantShips: [],
            gamesWon: 0
        }
    ],
    
    // Entités
    powerUps: [],
    redPoints: [],
    laserTraits: [],
    
    // Particules
    shieldParticles: {
        particles: [],
        orbitalParticles: []
    },
    
    // Fonction de réinitialisation
    reset: function() {
        this.gameOver = false;
        this.winner = null;
        
        this.players.forEach((player, index) => {
            player.lives = CONSTANTS.MAX_LIVES;
            player.impacts = 0;
            player.active = true;
            player.bullets = [];
            player.powerUpLevel = 0;
            player.shield = false;
            player.redPointsCollected = 0;
            player.thunderActive = false;
            player.thunderCount = 0;
            player.assistantShips = [];
            
            // Position initiale
            const midPoint = this.canvas.height / 2;
            player.x = this.canvas.width * 0.5;
            player.y = index === 0 ? this.canvas.height * 0.25 : this.canvas.height * 0.75;
        });
        
        this.powerUps = [];
        this.redPoints = [];
        this.laserTraits = [];
        this.shieldParticles.particles = [];
        this.shieldParticles.orbitalParticles = [];
    }
};