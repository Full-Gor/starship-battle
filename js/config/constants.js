// constants.js - Constantes du jeu

const CONSTANTS = {
    // Configuration FPS
    TARGET_FPS: 30,
    FRAME_TIME: 1000 / 30, // 33.33ms par frame
    
    // Tailles des entités
    PLAYER_WIDTH: 49,
    PLAYER_HEIGHT: 49,
    BULLET_WIDTH: 4,
    BULLET_HEIGHT: 4,
    POWERUP_WIDTH: 40,
    POWERUP_HEIGHT: 40,
    ASSISTANT_WIDTH: 40,
    ASSISTANT_HEIGHT: 40,
    
    // Vitesses
    PLAYER_SPEED: 5,
    BULLET_SPEED: 10,
    POWERUP_SPEED: 2,
    ASSISTANT_SPEED: 3,
    
    // Gameplay
    MAX_LIVES: 10,
    MAX_IMPACTS: 10,
    SHIELD_DURATION: 3000,
    THUNDER_DURATION: 7000,
    SHOOT_COOLDOWN: 100,
    RED_POINTS_FOR_SHIELD: 25,
    MAX_POWER_LEVEL: 9,
    MAX_ASSISTANTS: 3,
    
    // Limites
    MAX_POWERUPS: 3,
    MAX_LASER_TRAITS: 12,
    
    // Intervalles
    POWERUP_SPAWN_INTERVAL: 5000,
    LASER_TRAIT_SPAWN_INTERVAL: 1000,
    NETWORK_SYNC_INTERVAL: 33, // Synchronisé avec 30 FPS
    PING_INTERVAL: 1000,
    
    // Couleurs
    TEAM1_COLOR: '#04fbac',
    TEAM2_COLOR: '#FF7F50',
    
    // Particules de bouclier
    SHIELD_PARTICLES: {
        particleCount: 25,
        colors: ['#04fbac', '#00ffff', '#ff4444', '#0080ff'],
        minSize: 2,
        maxSize: 5,
        minSpeed: 0.02,
        maxSpeed: 0.05,
        suspensionCount: 15
    }
};