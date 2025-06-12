function shootBullet(player, playerIndex) {
    if (!player || !player.active) return;

    const bulletSpeed = 8;
    const playerColor = playerIndex === 0 ? '#04fbac' : '#FF7F50';
    const direction = playerIndex === 0 ? 1 : -1;

    const bulletConfigs = [
        [{ xOffset: 0, yOffset: 25 * direction, color: playerColor }],
        [
            { xOffset: -10, yOffset: 25 * direction, color: playerColor },
            { xOffset: 0, yOffset: 25 * direction, color: playerColor },
            { xOffset: 10, yOffset: 25 * direction, color: playerColor }
        ],
        [
            { xOffset: -15, yOffset: 20 * direction, color: '#FF00FF' },
            { xOffset: -5, yOffset: 25 * direction, color: playerColor },
            { xOffset: 0, yOffset: 25 * direction, color: playerColor },
            { xOffset: 5, yOffset: 25 * direction, color: playerColor },
            { xOffset: 15, yOffset: 20 * direction, color: '#FF00FF' }
        ],
        [
            { xOffset: -20, yOffset: 15 * direction, color: '#FF00FF' },
            { xOffset: -10, yOffset: 20 * direction, color: playerColor },
            { xOffset: -5, yOffset: 25 * direction, color: playerColor },
            { xOffset: 0, yOffset: 25 * direction, color: playerColor },
            { xOffset: 5, yOffset: 25 * direction, color: playerColor },
            { xOffset: 10, yOffset: 20 * direction, color: playerColor },
            { xOffset: 20, yOffset: 15 * direction, color: '#FF00FF' }
        ],
        [
            { xOffset: -25, yOffset: 10 * direction, color: '#FFFF00' },
            { xOffset: -15, yOffset: 15 * direction, color: '#FF00FF' },
            { xOffset: -8, yOffset: 20 * direction, color: playerColor },
            { xOffset: -3, yOffset: 25 * direction, color: playerColor },
            { xOffset: 0, yOffset: 25 * direction, color: playerColor },
            { xOffset: 3, yOffset: 25 * direction, color: playerColor },
            { xOffset: 8, yOffset: 20 * direction, color: playerColor },
            { xOffset: 15, yOffset: 15 * direction, color: '#FF00FF' },
            { xOffset: 25, yOffset: 10 * direction, color: '#FFFF00' }
        ]
    ];

    const configIndex = Math.min(player.powerUpLevel, bulletConfigs.length - 1);
    const config = bulletConfigs[configIndex];

    config.forEach(bullet => {
        const newBullet = {
            x: player.x + bullet.xOffset,
            y: player.y + bullet.yOffset,
            vx: 0,
            vy: bulletSpeed * direction,
            width: 4,
            height: 8,
            color: bullet.color,
            playerIndex: playerIndex
        };
        player.bullets.push(newBullet);
    });

    if (playerIndex === myPlayerIndex) {
        sendMessage({
            type: 'bulletFired',
            bullets: player.bullets.slice(-config.length),
            playerIndex: playerIndex
        });
    }

    playSound(soundEffects.shoot);
}

function addBulletFromNetwork(data) {
    if (!data || !data.bullets || data.playerIndex === myPlayerIndex) return;
    
    const player = gameState.players[data.playerIndex];
    if (!player) return;
    
    data.bullets.forEach(bullet => {
        if (bullet && typeof bullet.x === 'number' && typeof bullet.y === 'number') {
            player.bullets.push(bullet);
        }
    });
}

function updateBullets() {
    gameState.players.forEach(player => {
        player.bullets = player.bullets.filter(bullet => {
            bullet.x += bullet.vx || 0;
            bullet.y += bullet.vy || 0;

            for (const trait of gameState.laserTraits) {
                if (bullet.x > trait.x && bullet.x < trait.x + trait.width &&
                    bullet.y > trait.y && bullet.y < trait.y + trait.height) {
                    return false;
                }
            }

            return bullet.y > -20 && bullet.y < canvas.height + 20 &&
                   bullet.x > -10 && bullet.x < canvas.width + 10;
        });
    });
}