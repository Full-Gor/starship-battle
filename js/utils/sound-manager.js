// Initialisation des sons
if (typeof window.soundEffects === 'undefined') {
    window.soundEffects = {};
    
    const audioFiles = {
        shoot: 'shoot.mp3',
        hit: 'hit.mp3',
        perfect: 'perfect.mp3',
        awesome: 'awesome.mp3',
        gameOver: 'gameOver.mp3',
        coin: 'coin.mp3',
        king: 'king.mp3'
    };

    // Fonction pour charger un fichier audio avec gestion d'erreur
    function loadAudio(name, file) {
        const audio = new Audio(`assets/audio/${file}`);
        audio.onerror = () => {
            console.warn(`Impossible de charger le son: ${file}`);
        };
        audio.oncanplaythrough = () => {
            console.log(`Son chargé: ${file}`);
        };
        return audio;
    }

    // Chargement des sons
    Object.entries(audioFiles).forEach(([key, file]) => {
        window.soundEffects[key] = loadAudio(key, file);
    });
}

function playSound(sound) {
    if (!sound) return;
    try {
        // Vérifier si le son est chargé et prêt
        if (sound.readyState >= 2) {
            sound.currentTime = 0;
            const playPromise = sound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn('Erreur lecture audio:', error);
                });
            }
        } else {
            console.warn('Son non chargé');
        }
    } catch (error) {
        console.warn('Erreur audio:', error);
    }
}