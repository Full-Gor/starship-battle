// sound-manager.js - Gestionnaire de sons

const SoundManager = {
    sounds: {},
    loaded: false,
    
    init: function() {
        this.sounds = {
            shoot: new Audio("assets/audio/shoot.mp3"),
            hit: new Audio("assets/audio/hit.mp3"),
            coin: new Audio("assets/audio/coin.mp3"),
            king: new Audio("assets/audio/king.mp3"),
            perfect: new Audio("assets/audio/perfect.mp3"),
            awesome: new Audio("assets/audio/awesome.mp3"),
            gameOver: new Audio("assets/audio/gameOver.mp3")
        };
        
        // Appliquer les volumes
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].volume = SETTINGS.volumes[key] || 0.5;
        });
        
        this.loaded = true;
    },
    
    play: function(soundName) {
        if (!this.loaded || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.play().catch(() => {
                // Gestion silencieuse des erreurs audio
            });
        } catch (error) {
            // Audio optionnel
        }
    },
    
    setVolume: function(soundName, volume) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = Math.max(0, Math.min(1, volume));
            SETTINGS.volumes[soundName] = volume;
        }
    },
    
    setMasterVolume: function(volume) {
        Object.keys(this.sounds).forEach(key => {
            this.sounds[key].volume = SETTINGS.volumes[key] * volume;
        });
    }
};