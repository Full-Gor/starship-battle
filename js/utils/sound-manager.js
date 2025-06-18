// Initialisation des sons
let soundEffects;
if (typeof soundEffects === 'undefined') {
    soundEffects = {
        shoot: new Audio('assets/audio/shoot.mp3'),
        hit: new Audio('assets/audio/hit.mp3'),
        perfect: new Audio('assets/audio/perfect.mp3'),
        awesome: new Audio('assets/audio/awesome.mp3'),
        gameOver: new Audio('assets/audio/gameOver.mp3'),
        coin: new Audio('assets/audio/coin.mp3'),
        king: new Audio('assets/audio/king.mp3')
    };
}

function playSound(sound) {
    if (!sound) return;
    try {
        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log('Erreur lecture audio:', error);
            });
        }
    } catch (error) {
        console.log('Audio non disponible');
    }
}