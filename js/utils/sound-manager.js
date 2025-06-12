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