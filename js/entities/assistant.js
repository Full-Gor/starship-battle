function createAssistantShip(player, assistantData) {
    if (!player || player.assistantShips.length >= 4) return;

    const playerIndex = gameState.players.indexOf(player);
    if (playerIndex === -1) return;

    const assistant = {
        x: assistantData ? assistantData.x : 50 + Math.random() * (canvas.width - 100),
        y: assistantData ? assistantData.y : (playerIndex === 0 ? canvas.height * 0.4 : canvas.height * 0.6),
        width: 30,
        height: 30,
        health: 3,
        maxHealth: 3,
        lastShootTime: 0,
        shootInterval: 800,
        speed: 2,
        direction: Math.random() < 0.5 ? 1 : -1,
        imageIndex: assistantData ? assistantData.imageIndex : player.assistantShips.length % 6,
        playerIndex: playerIndex,
        movePattern: Math.random() * Math.PI * 2,
        bullets: []
    };

    player.assistantShips.push(assistant);
    console.log(`Assistant créé pour joueur ${playerIndex + 1}, total: ${player.assistantShips.length}`);

    if (playerIndex === myPlayerIndex && !assistantData) {
        sendMessage({
            type: 'assistantCreated',
            playerIndex: playerIndex,
            assistant: { 
                x: assistant.x, 
                y: assistant.y, 
                imageIndex: assistant.imageIndex 
            }
        });
    }

    playSound(soundEffects.awesome);
}

function assistantShoot(assistant, player) {
    if (!assistant || !player) return;

    const direction = assistant.playerIndex === 0 ? 1 : -1;
    const bulletColor = getAssistantColor(assistant.imageIndex);

    const bullet = {
        x: assistant.x + assistant.width / 2,
        y: assistant.y + (direction > 0 ? assistant.height : 0),
        vx: 0,
        vy: 6 * direction,
        width: 3,
        height: 6,
        color: bulletColor,
        playerIndex: assistant.playerIndex,
        isAssistantBullet: true
    };

    player.bullets.push(bullet);
}

function updateAssistantShips() {
    gameState.players.forEach(player => {
        player.assistantShips = player.assistantShips.filter(assistant => {
            assistant.movePattern += 0.02;
            assistant.x += Math.sin(assistant.movePattern) * assistant.speed * assistant.direction;
            
            if (assistant.x < 0 || assistant.x + assistant.width > canvas.width) {
                assistant.direction *= -1;
                assistant.x = Math.max(0, Math.min(canvas.width - assistant.width, assistant.x));
            }

            const currentTime = Date.now();
            if (currentTime - assistant.lastShootTime > assistant.shootInterval) {
                assistantShoot(assistant, player);
                assistant.lastShootTime = currentTime;
            }

            return assistant.health > 0;
        });
    });
}

function drawAssistants() {
    gameState.players.forEach(player => {
        player.assistantShips.forEach(assistant => {
            ctx.save();
            
            if (assistant.health < assistant.maxHealth) {
                ctx.globalAlpha = 0.5 + (assistant.health / assistant.maxHealth) * 0.5;
            }

            ctx.translate(assistant.x + assistant.width / 2, assistant.y + assistant.height / 2);
            if (assistant.playerIndex === 1) {
                ctx.rotate(Math.PI);
            }

            if (assistantShipImgs[assistant.imageIndex] && assistantShipImgs[assistant.imageIndex].complete) {
                ctx.drawImage(
                    assistantShipImgs[assistant.imageIndex],
                    -assistant.width / 2,
                    -assistant.height / 2,
                    assistant.width,
                    assistant.height
                );
            } else {
                ctx.fillStyle = getAssistantColor(assistant.imageIndex);
                ctx.fillRect(-assistant.width / 2, -assistant.height / 2, assistant.width, assistant.height);
            }

            ctx.restore();

            const healthBarWidth = assistant.width;
            const healthRatio = assistant.health / assistant.maxHealth;
            
            ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
            ctx.fillRect(assistant.x, assistant.y - 8, healthBarWidth, 4);
            
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.fillRect(assistant.x, assistant.y - 8, healthBarWidth * healthRatio, 4);
        });
    });
}