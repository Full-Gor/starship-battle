function generateLaserTrait() {
    if (!isHost || !gameStarted) return;

    const width = 40 + Math.random() * 60;
    const height = 8 + Math.random() * 6;
    const midPoint = canvas.height / 2;
    
    const isTopZone = Math.random() < 0.5;
    const y = isTopZone ? 
        20 + Math.random() * (midPoint - 60) :
        midPoint + 40 + Math.random() * (canvas.height / 2 - 80);

    const trait = {
        x: Math.random() * (canvas.width - width),
        y: y,
        width: width,
        height: height,
        createdAt: Date.now(),
        duration: 4000,
        color: isTopZone ? '#04fbac' : '#FF7F50',
        opacity: 1,
        id: Date.now() + Math.random()
    };

    gameState.laserTraits.push(trait);
    console.log('Laser trait generated at y:', y);
}

function updateLaserTraits() {
    const currentTime = Date.now();
    gameState.laserTraits = gameState.laserTraits.filter(trait => {
        const elapsed = currentTime - trait.createdAt;
        
        if (elapsed > trait.duration - 1000) {
            const fadeTime = elapsed - (trait.duration - 1000);
            trait.opacity = Math.max(0, 1 - (fadeTime / 1000));
        }

        return elapsed < trait.duration;
    });
}