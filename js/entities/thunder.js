function activateThunder(player) {
    if (!player) return;

    if (player.thunderActive) {
        player.thunderCount = Math.min(player.thunderCount + 1, 3);
    } else {
        player.thunderActive = true;
        player.thunderCount = 1;
        player.thunderStartTime = Date.now();
    }

    playSound(soundEffects.king);
    console.log('Thunder activated, count:', player.thunderCount);

    // Synchronisation réseau si joueur local
    const playerIndex = gameState.players.indexOf(player);
    if (playerIndex === myPlayerIndex) {
        sendMessage({
            type: 'thunderActivated',
            playerIndex: playerIndex
        });
    }
}

function updateThunder() {
    gameState.players.forEach(player => {
        if (!player.thunderActive) return;

        const elapsedTime = Date.now() - player.thunderStartTime;
        if (elapsedTime > 8000) {
            player.thunderActive = false;
            player.thunderCount = 0;
        }
    });
}

function drawThunder() {
    gameState.players.forEach((player, index) => {
        if (!player.thunderActive) return;

        const elapsed = Date.now() - player.thunderStartTime;
        const thunderFrame = Math.floor(elapsed / 200) % 3;

        for (let i = 0; i < player.thunderCount; i++) {
            const angle = (i * 120) - 60;

            ctx.save();
            ctx.translate(player.x, player.y);
            ctx.rotate((angle * Math.PI) / 180);

            if (thunderImgs[thunderFrame] && thunderImgs[thunderFrame].complete) {
                const thunderHeight = 300;
                ctx.drawImage(
                    thunderImgs[thunderFrame],
                    -15,
                    index === 0 ? -thunderHeight : 0,
                    30,
                    thunderHeight
                );
            } else {
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(-5, index === 0 ? -200 : 0, 10, 200);
            }

            ctx.restore();
        }
    });
}