function checkCollisions() {
    for (let i = 0; i < gameState.players.length; i++) {
        const player = gameState.players[i];
        if (!player.active) continue;

        for (let j = 0; j < gameState.players.length; j++) {
            if (i === j) continue;

            const opponent = gameState.players[j];
            opponent.bullets = opponent.bullets.filter(bullet => {
                const dx = Math.abs(bullet.x - player.x);
                const dy = Math.abs(bullet.y - player.y);

                if (dx < (player.width + bullet.width) / 2 && dy < (player.height + bullet.height) / 2) {
                    if (!player.shield) {
                        if (player.powerUpLevel > 0) {
                            player.powerUpLevel = Math.max(0, player.powerUpLevel - 1);
                        } else {
                            player.impacts++;
                            initializeLives();

                            if (player.impacts >= 10) {
                                player.active = false;
                                endGame(j);
                                return false;
                            }
                        }
                        playSound(soundEffects.hit);
                    }
                    return false;
                }
                return true;
            });
        }

        for (let j = 0; j < gameState.players.length; j++) {
            if (i === j) continue;

            const opponent = gameState.players[j];
            opponent.bullets = opponent.bullets.filter(bullet => {
                for (let k = player.assistantShips.length - 1; k >= 0; k--) {
                    const assistant = player.assistantShips[k];
                    const dx = Math.abs(bullet.x - (assistant.x + assistant.width / 2));
                    const dy = Math.abs(bullet.y - (assistant.y + assistant.height / 2));

                    if (dx < (assistant.width + bullet.width) / 2 && dy < (assistant.height + bullet.height) / 2) {
                        assistant.health--;
                        if (assistant.health <= 0) {
                            for (let l = 0; l < 3; l++) {
                                gameState.redPoints.push({
                                    x: assistant.x + assistant.width / 2,
                                    y: assistant.y + assistant.height / 2,
                                    vx: (Math.random() - 0.5) * 6,
                                    vy: (Math.random() - 0.5) * 6,
                                    id: Date.now() + Math.random() + l,
                                    size: 3
                                });
                            }
                            player.assistantShips.splice(k, 1);
                        }
                        playSound(soundEffects.hit);
                        return false;
                    }
                }
                return true;
            });
        }
    }

    gameState.players.forEach((player, index) => {
        if (!player.active) return;

        gameState.powerUps = gameState.powerUps.filter(powerUp => {
            const dx = Math.abs(powerUp.x + powerUp.width / 2 - player.x);
            const dy = Math.abs(powerUp.y + powerUp.height / 2 - player.y);

            if (dx < (player.width + powerUp.width) / 2 && dy < (player.height + powerUp.height) / 2) {
                if (index === myPlayerIndex) {
                    handlePowerUpCollectionLocal(player, powerUp, index);
                    sendMessage({
                        type: 'powerUpCollected',
                        playerIndex: index,
                        powerUpId: powerUp.id,
                        powerUpType: powerUp.type
                    });
                }
                return false;
            }
            return true;
        });
    });
}