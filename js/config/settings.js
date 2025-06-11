// settings.js - Paramètres modifiables

const SETTINGS = {
    // Volumes audio
    volumes: {
        shoot: 0.3,
        hit: 1.0,
        coin: 0.3,
        king: 0.6,
        perfect: 0.4,
        awesome: 1.0,
        gameOver: 1.0
    },
    
    // Contrôles joueur 1
    player1Controls: {
        left: 'KeyA',
        right: 'KeyD',
        up: 'KeyW',
        down: 'KeyS',
        shoot: 'KeyG'
    },
    
    // Contrôles joueur 2
    player2Controls: {
        left: 'ArrowLeft',
        right: 'ArrowRight',
        up: 'ArrowUp',
        down: 'ArrowDown',
        shoot: 'Space'
    },
    
    // Options graphiques
    graphics: {
        enableParticles: true,
        enableShieldEffects: true,
        enableLaserTraits: true
    }
};