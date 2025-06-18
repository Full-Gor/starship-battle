function generatePowerUp() {
    if (!isHost || !gameStarted) return;

    const powerUp = {
        x: 50 + Math.random() * (window.gameCanvas.canvas.width - 100),
        y: 50 + Math.random() * (window.gameCanvas.canvas.height - 100),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        width: 35,
        height: 35,
        type: Math.floor(Math.random() * 2) + 1, // Types 1 ou 2 uniquement
        id: Date.now() + Math.random(),
        rotation: 0,
        createdAt: Date.now()
    };

    gameState.powerUps.push(powerUp);
    sendMessage({ type: 'powerUpGenerated', powerUp });
    console.log('Power-up généré:', powerUp.type);
}

function updatePowerUps() {
    gameState.powerUps = gameState.powerUps.filter(powerUp => {
        powerUp.x += powerUp.vx || 0;
        powerUp.y += powerUp.vy || 0;

        if (powerUp.x <= 0 || powerUp.x >= window.gameCanvas.canvas.width - powerUp.width) {
            powerUp.vx = -(powerUp.vx || 0);
            powerUp.x = Math.max(0, Math.min(window.gameCanvas.canvas.width - powerUp.width, powerUp.x));
        }
        if (powerUp.y <= 0 || powerUp.y >= window.gameCanvas.canvas.height - powerUp.height) {
            powerUp.vy = -(powerUp.vy || 0);
            powerUp.y = Math.max(0, Math.min(window.gameCanvas.canvas.height - powerUp.height, powerUp.y));
        }

        powerUp.rotation = (powerUp.rotation || 0) + 0.03;

        const age = Date.now() - (powerUp.createdAt || 0);
        return age < 30000;
    });
}

function handlePowerUpCollectionLocal(player, powerUp, playerIndex) {
    try {
        switch (powerUp.type) {
            case 1:
                player.powerUpLevel = Math.min(player.powerUpLevel + 1, 4);
                createAssistantShip(player);
                break;
            case 2:
                player.powerUpLevel = Math.min(player.powerUpLevel + 2, 4);
                activateShield(player, 5000);
                break;
        }
        if (window.soundEffects && window.soundEffects.perfect) {
            playSound(window.soundEffects.perfect);
        }
    } catch (error) {
        console.error('Erreur lors de la collecte du power-up:', error);
    }
}

function handlePowerUpCollection(data) {
    if (!data || data.playerIndex === myPlayerIndex) return;

    try {
        gameState.powerUps = gameState.powerUps.filter(p => p.id !== data.powerUpId);
        const player = gameState.players[data.playerIndex];
        
        if (!player) return;

        switch (data.powerUpType) {
            case 1:
                player.powerUpLevel = Math.min(player.powerUpLevel + 1, 4);
                createAssistantShip(player);
                break;
            case 2:
                player.powerUpLevel = Math.min(player.powerUpLevel + 2, 4);
                activateShield(player, 5000);
                break;
        }
    } catch (error) {
        console.error('Erreur lors de la collecte du power-up:', error);
    }
}