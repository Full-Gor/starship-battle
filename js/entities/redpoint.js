function generateRedPoints() {
    if (!isHost || !gameStarted) return;

    const count = 5 + Math.floor(Math.random() * 8);
    for (let i = 0; i < count; i++) {
        const redPoint = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            id: Date.now() + Math.random() + i,
            size: 3 + Math.random() * 2
        };
        gameState.redPoints.push(redPoint);
        sendMessage({ type: 'redPointGenerated', redPoint });
    }
}

function updateRedPoints() {
    gameState.redPoints = gameState.redPoints.filter(point => {
        point.x += point.vx || 0;
        point.y += point.vy || 0;

        if (point.vx) point.vx *= 0.99;
        if (point.vy) point.vy *= 0.99;

        gameState.players.forEach((player, index) => {
            if (!player.active) return;

            const dx = player.x - point.x;
            const dy = player.y - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 80) {
                const force = (80 - distance) / 80 * 2;
                point.vx += (dx / distance) * force * 0.1;
                point.vy += (dy / distance) * force * 0.1;

                if (distance < 25) {
                    if (index === myPlayerIndex) {
                        player.redPointsCollected++;
                        updateRedPointsDisplay(index);

                        sendMessage({
                            type: 'redPointCollected',
                            playerIndex: index,
                            pointId: point.id
                        });

                        if (player.redPointsCollected >= 25) {
                            activateShield(player, 4000);
                            player.redPointsCollected = 0;
                            updateRedPointsDisplay(index);

                            sendMessage({
                                type: 'shieldActivated',
                                playerIndex: index
                            });
                        }

                        playSound(soundEffects.coin);
                    }
                    return false;
                }
            }
        });

        return point.x > -10 && point.x < canvas.width + 10 &&
               point.y > -10 && point.y < canvas.height + 10;
    });
}

function updateRedPointsDisplay(playerIndex) {
    const element = document.getElementById(`p${playerIndex + 1}RedPoints`);
    if (element) {
        element.textContent = gameState.players[playerIndex].redPointsCollected;
    }
}

function handleRedPointCollection(data) {
    if (!data || data.playerIndex === myPlayerIndex) return;

    gameState.redPoints = gameState.redPoints.filter(p => p.id !== data.pointId);
    const player = gameState.players[data.playerIndex];
    
    if (player) {
        player.redPointsCollected++;
        updateRedPointsDisplay(data.playerIndex);

        if (player.redPointsCollected >= 25) {
            player.redPointsCollected = 0;
            updateRedPointsDisplay(data.playerIndex);
        }
    }
}